// SPDX-License-Identifier: MIT
// Author: Viqtorhvayx
// Repository: Hedera DeFi DApp

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LendingPool
 * @dev Manages liquidity provision with a points-based reputation system.
 */
contract LendingPool is ReentrancyGuard, Ownable {
    
    struct Deposit {
        uint256 amount;
        uint256 startTimestamp;
        address token;
        bool active;
    }

    mapping(address => Deposit[]) public userDeposits;
    mapping(address => uint256) public userPoints;

    event Deposited(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(address indexed user, address indexed token, uint256 amount, uint256 pointsEarned);

    constructor() {}

    /**
     * @dev Deposit tokens to provide liquidity.
     */
    function deposit(address _token, uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(IERC20(_token).transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        userDeposits[msg.sender].push(Deposit({
            amount: _amount,
            startTimestamp: block.timestamp,
            token: _token,
            active: true
        }));

        emit Deposited(msg.sender, _token, _amount);
    }

    /**
     * @dev Withdraw tokens and calculate earned points.
     */
    function withdraw(uint256 _index) external nonReentrant {
        Deposit storage dep = userDeposits[msg.sender][_index];
        require(dep.active, "Already withdrawn");

        uint256 duration = block.timestamp - dep.startTimestamp;
        // Points = Amount * Duration (simplified)
        uint256 points = (dep.amount * duration) / 1 days;
        
        userPoints[msg.sender] += points;
        dep.active = false;

        require(IERC20(dep.token).transfer(msg.sender, dep.amount), "Transfer failed");

        emit Withdrawn(msg.sender, dep.token, dep.amount, points);
    }

    /**
     * @dev Admin function to convert points to yield (mock logic).
     */
    function convertPointsToYield(address _user, uint256 _points) external onlyOwner {
        require(userPoints[_user] >= _points, "Insufficient points");
        userPoints[_user] -= _points;
        // Logic for yield distribution would go here
    }

    function getUserPoints(address _user) external view returns (uint256) {
        return userPoints[_user];
    }
}
