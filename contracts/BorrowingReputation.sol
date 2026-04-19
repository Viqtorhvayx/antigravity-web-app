// SPDX-License-Identifier: MIT
// Author: Viqtorhvayx
// Repository: Hedera DeFi DApp

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title BorrowingReputation
 * @dev Manages collateralized HBAR borrowing with an XP reputation system.
 */
contract BorrowingReputation is ReentrancyGuard, Ownable {
    
    struct Loan {
        uint256 collateralAmount;
        address collateralToken;
        uint256 borrowedAmount;
        uint256 startTimestamp;
        bool repaid;
    }

    mapping(address => uint8) public userXP;
    mapping(address => Loan[]) public userLoans;
    mapping(address => uint256) public cooldownEnd;

    uint8 public constant MIN_XP_THRESHOLD = 15;
    uint256 public constant COOLDOWN_PERIOD = 1 days;

    event Borrowed(address indexed user, uint256 amount, uint256 collateral);
    event Repaid(address indexed user, uint256 amount);
    event XPUpdated(address indexed user, uint8 newXP);

    constructor() {
        // Initial XP for all users can be set or start at a healthy 50
    }

    function initializeXP() external {
        if (userXP[msg.sender] == 0) {
            userXP[msg.sender] = 50;
        }
    }

    /**
     * @dev Borrow HBAR using stablecoins as collateral.
     */
    function borrowHbar(address _collateralToken, uint256 _collateralAmount) external nonReentrant {
        require(userXP[msg.sender] >= MIN_XP_THRESHOLD, "Blacklisted: Low XP");
        require(block.timestamp >= cooldownEnd[msg.sender], "Cooldown active");
        require(_collateralAmount > 0, "Collateral must be > 0");

        uint256 ltv = _getLTV(userXP[msg.sender]);
        // Mocking price 1:1 for HBAR/USD for simplicity in this Testnet demo
        uint256 borrowAmount = (_collateralAmount * ltv) / 100;

        require(IERC20(_collateralToken).transferFrom(msg.sender, address(this), _collateralAmount), "Collateral transfer failed");
        
        (bool success, ) = payable(msg.sender).call{value: borrowAmount}("");
        require(success, "HBAR transfer failed");

        userLoans[msg.sender].push(Loan({
            collateralAmount: _collateralAmount,
            collateralToken: _collateralToken,
            borrowedAmount: borrowAmount,
            startTimestamp: block.timestamp,
            repaid: false
        }));

        emit Borrowed(msg.sender, borrowAmount, _collateralAmount);
    }

    /**
     * @dev Repay HBAR loan to reclaim collateral.
     */
    function repayHbar(uint256 _loanIndex) external payable nonReentrant {
        Loan storage loan = userLoans[msg.sender][_loanIndex];
        require(!loan.repaid, "Already repaid");
        require(msg.value >= loan.borrowedAmount, "Insufficient repayment");

        loan.repaid = true;
        cooldownEnd[msg.sender] = block.timestamp + COOLDOWN_PERIOD;

        require(IERC20(loan.collateralToken).transfer(msg.sender, loan.collateralAmount), "Collateral return failed");

        // Increase XP slightly on successful repayment
        if (userXP[msg.sender] < 100) {
            userXP[msg.sender] += 2;
            if (userXP[msg.sender] > 100) userXP[msg.sender] = 100;
        }

        emit Repaid(msg.sender, loan.borrowedAmount);
        emit XPUpdated(msg.sender, userXP[msg.sender]);
    }

    function _getLTV(uint8 _xp) internal pure returns (uint256) {
        if (_xp >= 80) return 85;
        if (_xp >= 50) return 70;
        return 50;
    }

    function setXP(address _user, uint8 _xp) external onlyOwner {
        require(_xp <= 100, "Max XP is 100");
        userXP[_user] = _xp;
        emit XPUpdated(_user, _xp);
    }

    receive() external payable {}
}
