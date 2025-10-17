// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IForter.sol";

contract StakingPool is ReentrancyGuard, Ownable {
    IForter public forter;
    IERC20 public stakingToken;
    
    // Staking data structures
    struct Stake {
        uint256 amount;
        uint256 timestamp;
        bool isWithdrawn;
    }
    
    // Mappings
    mapping(uint256 => mapping(uint256 => mapping(address => Stake))) public stakes; // newsId => poolId => user => Stake
    mapping(uint256 => mapping(uint256 => uint256)) public totalStaked; // newsId => poolId => amount
    mapping(address => uint256) public userTotalStaked;
    
    // Events
    event Staked(uint256 indexed newsId, uint256 indexed poolId, address indexed user, uint256 amount);
    event Withdrawn(uint256 indexed newsId, uint256 indexed poolId, address indexed user, uint256 amount);
    
    constructor(address _forter, address _stakingToken) Ownable(msg.sender) {
        require(_forter != address(0) && _stakingToken != address(0), "Invalid addresses");
        forter = IForter(_forter);
        stakingToken = IERC20(_stakingToken);
    }
    
    // Stake tokens on a pool
    function stake(uint256 newsId, uint256 poolId, uint256 amount, bool position) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        
        // Transfer tokens from user to this contract
        require(
            stakingToken.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        
        // Update stake records
        Stake storage userStake = stakes[newsId][poolId][msg.sender];
        userStake.amount += amount;
        userStake.timestamp = block.timestamp;
        
        totalStaked[newsId][poolId] += amount;
        userTotalStaked[msg.sender] += amount;
        
        emit Staked(newsId, poolId, msg.sender, amount);
    }
    
    // Withdraw staked tokens
    function withdraw(uint256 newsId, uint256 poolId) external nonReentrant {
        Stake storage userStake = stakes[newsId][poolId][msg.sender];
        require(userStake.amount > 0, "No stake found");
        require(!userStake.isWithdrawn, "Already withdrawn");
        
        uint256 amount = userStake.amount;
        userStake.isWithdrawn = true;
        
        // Update totals
        totalStaked[newsId][poolId] -= amount;
        userTotalStaked[msg.sender] -= amount;
        
        // Transfer tokens back to user
        require(
            stakingToken.transfer(msg.sender, amount),
            "Withdrawal failed"
        );
        
        emit Withdrawn(newsId, poolId, msg.sender, amount);
    }
    
    // Emergency withdraw without rewards (in case of issues)
    function emergencyWithdraw(uint256 newsId, uint256 poolId) external nonReentrant {
        Stake storage userStake = stakes[newsId][poolId][msg.sender];
        uint256 amount = userStake.amount;
        require(amount > 0, "No stake found");
        
        // Reset stake
        userStake.amount = 0;
        userStake.isWithdrawn = true;
        
        // Update totals
        totalStaked[newsId][poolId] -= amount;
        userTotalStaked[msg.sender] -= amount;
        
        // Transfer tokens back to user
        require(
            stakingToken.transfer(msg.sender, amount),
            "Withdrawal failed"
        );
        
        emit Withdrawn(newsId, poolId, msg.sender, amount);
    }
    
    // View functions
    function getUserStake(uint256 newsId, uint256 poolId, address user) external view returns (uint256) {
        return stakes[newsId][poolId][user].amount;
    }
    
    function getTotalStaked(uint256 newsId, uint256 poolId) external view returns (uint256) {
        return totalStaked[newsId][poolId];
    }
}
