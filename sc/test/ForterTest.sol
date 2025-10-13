// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ForterTestSetup.sol";

contract ForterTest is ForterTestSetup {
    function testCreateNews() public {
        uint256 initialCount = forter.getNewsCount();
        uint256 resolveTime = block.timestamp + 7 days;
        
        vm.prank(user1);
        forter.createNews("Test News", resolveTime);
        
        assertEq(forter.getNewsCount(), initialCount + 1);
        
        (
            address creator,
            string memory content,
            uint256 newsResolveTime,
            bool isResolved,
            bool outcome,
            uint256 totalPools
        ) = forter.getNewsInfo(initialCount);
        
        assertEq(creator, user1);
        assertEq(content, "Test News");
        assertEq(newsResolveTime, resolveTime);
        assertFalse(isResolved);
        assertFalse(outcome);
        assertEq(totalPools, 0);
    }
    
    function testCreatePool() public {
        uint256 newsId = _createNews();
        
        vm.prank(user2);
        forter.createPool(
            newsId,
            "This is a test reasoning with more than 100 characters to satisfy the minimum length requirement for the reasoning field.",
            "https://example.com/evidence",
            "https://example.com/image.jpg",
            true
        );
        
        assertEq(forter.getPoolCount(newsId), 1);
        
        (
            address creator,
            string memory reasoning,
            , , ,
            uint256 totalStakers
        ) = forter.getPoolInfo(newsId, 0);
        
        assertEq(creator, user2);
        assertTrue(bytes(reasoning).length >= 100);
        assertEq(totalStakers, 0);
    }
    
    function testStakeTokens() public {
        uint256 newsId = _createNews();
        uint256 poolId = _createPool(newsId, user2);
        
        uint256 stakeAmount = 1000 * 10**18;
        
        vm.prank(user1);
        forter.stake(newsId, poolId, stakeAmount, true);
        
        uint256 userStake = forter.getUserStake(newsId, poolId, user1);
        assertEq(userStake, stakeAmount);
    }
    
    function testResolveNews() public {
        uint256 newsId = _createNews();
        uint256 poolId = _createPool(newsId, user2);
        
        // Stake on the pool
        uint256 stakeAmount = 1000 * 10**18;
        vm.prank(user1);
        forter.stake(newsId, poolId, stakeAmount, true);
        
        // Fast forward time to after resolution
        vm.warp(block.timestamp + 8 days);
        
        // Resolve the news
        vm.prank(owner);
        forter.resolveNews(newsId, true);
        
        // Check if news is resolved
        (,,,, bool isResolved, bool outcome, ) = forter.getNewsInfo(newsId);
        assertTrue(isResolved);
        assertTrue(outcome);
    }
}
