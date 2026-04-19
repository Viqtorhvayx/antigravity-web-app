// SPDX-License-Identifier: MIT
// Author: Viqtorhvayx
// Repository: Hedera DeFi DApp

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title HederaVault
 * @dev Manages saving and locking for HBAR and HTS Stablecoins (USDT/USDC).
 * Includes early withdrawal penalties and HBAR staking bonuses.
 */
contract HederaVault is ReentrancyGuard, Ownable {
    
    struct LockEntry {
        uint256 amount;
        uint256 unlockTimestamp;
        uint256 startTimestamp;
        bool isHbar;
        address tokenAddress; // Address(0) for HBAR
        bool claimed;
    }

    address public treasury;
    uint256 public constant PENALTY_BPS = 500; // 5%
    uint256 public constant HBAR_BONUS_BPS = 30; // 0.3%
    uint256 public constant BONUS_PERIOD = 3 weeks;

    mapping(address => LockEntry[]) public userLocks;

    event Locked(address indexed user, uint256 amount, uint256 unlockTimestamp, bool isHbar);
    event Withdrawn(address indexed user, uint256 amount, uint256 penalty, bool early);

    constructor(address _treasury) {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
    }

    /**
     * @dev Lock HBAR in the vault.
     * @param _duration Duration in seconds for the lock.
     */
    function lockHbar(uint256 _duration) external payable nonReentrant {
        require(msg.value > 0, "Amount must be > 0");
        
        userLocks[msg.sender].push(LockEntry({
            amount: msg.value,
            unlockTimestamp: block.timestamp + _duration,
            startTimestamp: block.timestamp,
            isHbar: true,
            tokenAddress: address(0),
            claimed: false
        }));

        emit Locked(msg.sender, msg.value, block.timestamp + _duration, true);
    }

    /**
     * @dev Lock HTS tokens (USDT/USDC).
     * @param _token Token address.
     * @param _amount Amount to lock.
     * @param _duration Duration in seconds.
     */
    function lockToken(address _token, uint256 _amount, uint256 _duration) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(IERC20(_token).transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        userLocks[msg.sender].push(LockEntry({
            amount: _amount,
            unlockTimestamp: block.timestamp + _duration,
            startTimestamp: block.timestamp,
            isHbar: false,
            tokenAddress: _token,
            claimed: false
        }));

        emit Locked(msg.sender, _amount, block.timestamp + _duration, false);
    }

    /**
     * @dev Withdraw locked funds.
     * @param _lockIndex Index of the lock in userLocks.
     */
    function withdraw(uint256 _lockIndex) external nonReentrant {
        LockEntry storage entry = userLocks[msg.sender][_lockIndex];
        require(!entry.claimed, "Already claimed");
        
        uint256 amountToTransfer = entry.amount;
        uint256 penalty = 0;
        bool isEarly = block.timestamp < entry.unlockTimestamp;

        if (isEarly) {
            penalty = (amountToTransfer * PENALTY_BPS) / 10000;
            amountToTransfer -= penalty;
            _transferAssets(treasury, penalty, entry.isHbar, entry.tokenAddress);
        } else if (entry.isHbar) {
            // Calculate staking bonus for HBAR
            uint256 periods = (block.timestamp - entry.startTimestamp) / BONUS_PERIOD;
            if (periods > 0) {
                uint256 bonus = (entry.amount * HBAR_BONUS_BPS * periods) / 10000;
                // Note: Bonus would need to be funded or minted. 
                // For this logic, we'll assume the vault has rewards.
                amountToTransfer += bonus;
            }
        }

        entry.claimed = true;
        _transferAssets(msg.sender, amountToTransfer, entry.isHbar, entry.tokenAddress);

        emit Withdrawn(msg.sender, amountToTransfer, penalty, isEarly);
    }

    function _transferAssets(address _to, uint256 _amount, bool _isHbar, address _token) internal {
        if (_isHbar) {
            (bool success, ) = payable(_to).call{value: _amount}("");
            require(success, "HBAR transfer failed");
        } else {
            require(IERC20(_token).transfer(_to, _amount), "Token transfer failed");
        }
    }

    function setTreasury(address _newTreasury) external onlyOwner {
        treasury = _newTreasury;
    }

    receive() external payable {}
}
