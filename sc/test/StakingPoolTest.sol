// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ForterTestSetup.sol";

contract StakingPoolTest is ForterTestSetup {
    function testStakeTokens() public {
        uint256 newsId = _createNews();
        uint256 poolId = _createPool(newsId, user2);
        
        uint256 stakeAmount = 1000 * 10**18;
        
        // User1 stakes tokens
        vm.prank(user1);
        forter.stake(newsId, poolId, stakeAmount, true);
        
        // Check staking pool state
        assertEq(stakingPool.getUserStake(newsId, poolId, user1), stakeAmount);
        assertEq(stakingPool.getTotalStaked(newsId, poolId), stakeAmount);
        
        // Check token balances
        assertEq(token.balanceOf(user1), 9000 * 10**18); // 10000 - 1000
        assertEq(token.balanceOf(address(stakingPool)), stakeAmount);
    }
    
    function testWithdrawStake() public {
        uint256 newsId = _createNews();
        uint256 poolId = _createPool(newsId, user2);
        
        // Stake first
        uint256 stakeAmount = 1000 * 10**18;
        vm.prank(user1);
        forter.stake(newsId, poolId, stakeAmount, true);
        
        // Resolve the news
        vm.warp(block.timestamp + 8 days);
        vm.prank(owner);
        forter.resolveNews(newsId, true);
        
        // Withdraw stake
        vm.prank(user1);
        stakingPool.withdraw(newsId, poolId);
        
        // Check balances
        assertEq(stakingPool.getUserStake(newsId, poolId, user1), 0);
        assertEq(token.balanceOf(user1), 10000 * 10**18); // Should get back the staked amount
    }
    
    function testEmergencyWithdraw() public {
        uint256 newsId = _createNews();
        uint256 poolId = _createPool(newsId, user2);
        
        // Stake first
        uint256 stakeAmount = 1000 * 10**18;
        vm.prank(user1);
        forter.stake(newsId, poolId, stakeAmount, true);
        
        // Emergency withdraw
        vm.prank(user1);
        stakingPool.emergencyWithdraw(newsId, poolId);
        
        // Check balances
        assertEq(stakingPool.getUserStake(newsId, poolId, user1), 0);
        assertEq(token.balanceOf(user1), 10000 * 10**18); // Should get back the staked amount
    }
}
