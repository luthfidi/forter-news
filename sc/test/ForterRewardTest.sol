// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ForterTestSetup.sol";

contract ForterRewardTest is ForterTestSetup {

    // ========== REWARD DISTRIBUTION TESTS ==========

    function testSingleStakerPoolCorrect() public {
        // Test Case: Creator-only pool with correct prediction
        // Expected: Creator gets 100% of remaining pool (98% after 2% fee)

        uint256 newsId = _createNews();
        uint256 poolId = _createPool(newsId, user1); // Pool YES

        // Fast forward time
        vm.warp(block.timestamp + 8 days);

        // Record initial balances
        uint256 creatorInitialBalance = token.balanceOf(user1);
        uint256 feeRecipientBalance = token.balanceOf(owner);

        // Emergency resolve to YES (correct)
        vm.prank(owner);
        forter.emergencyResolve(
            newsId,
            Forter.Outcome.YES,
            "https://test.com",
            "Single staker test - correct prediction"
        );

        // Check final balances
        uint256 creatorFinalBalance = token.balanceOf(user1);
        uint256 feeRecipientFinalBalance = token.balanceOf(owner);

        // Verify pool outcome
        (,,,,,,,,,,, bool isResolved, bool isCorrect) = forter.getPoolInfo(newsId, poolId);
        assertTrue(isResolved);
        assertTrue(isCorrect); // Pool YES + Outcome YES = Correct

        // Calculate expected rewards
        uint256 totalPool = MIN_STAKE; // Only creator stake
        uint256 protocolFee = (totalPool * 200) / 10000; // 2%
        uint256 expectedCreatorReward = totalPool - protocolFee; // 98%
        uint256 expectedFeeReward = protocolFee;

        // Verify reward distribution
        assertEq(creatorFinalBalance - creatorInitialBalance, expectedCreatorReward);
        assertEq(feeRecipientFinalBalance - feeRecipientBalance, expectedFeeReward);
    }

    function testSingleStakerPoolWrong() public {
        // Test Case: Creator-only pool with wrong prediction
        // Expected: Creator gets 0, no stakers to distribute to

        uint256 newsId = _createNews();
        uint256 poolId = _createPool(newsId, user1); // Pool YES

        // Fast forward time
        vm.warp(block.timestamp + 8 days);

        // Record initial balances
        uint256 creatorInitialBalance = token.balanceOf(user1);
        uint256 feeRecipientBalance = token.balanceOf(owner);

        // Emergency resolve to NO (wrong for Pool YES)
        vm.prank(owner);
        forter.emergencyResolve(
            newsId,
            Forter.Outcome.NO,
            "https://test.com",
            "Single staker test - wrong prediction"
        );

        // Check final balances
        uint256 creatorFinalBalance = token.balanceOf(user1);
        uint256 feeRecipientFinalBalance = token.balanceOf(owner);

        // Verify pool outcome
        (,,,,,,,,,,, bool isResolved, bool isCorrect) = forter.getPoolInfo(newsId, poolId);
        assertTrue(isResolved);
        assertFalse(isCorrect); // Pool YES + Outcome NO = Wrong

        // Calculate expected rewards
        uint256 totalPool = MIN_STAKE;
        uint256 expectedProtocolFee = (totalPool * 200) / 10000; // 2%
        uint256 expectedCreatorReward = 0; // Wrong prediction = 0

        // Verify reward distribution
        assertEq(creatorFinalBalance - creatorInitialBalance, expectedCreatorReward);
        assertEq(feeRecipientFinalBalance - feeRecipientBalance, expectedProtocolFee);
    }

    function testMultiStakerPoolCorrect() public {
        // Test Case: Multiple stakers with correct pool prediction
        // Expected: Creator 20%, winning stakers 80% proportional

        uint256 newsId = _createNews();
        uint256 poolId = _createPool(newsId, user1); // Pool YES

        // Additional stakes
        uint256 user2Stake = 500 * 10**18;
        uint256 user3Stake = 300 * 10**18;

        // User2 agrees with pool (YES)
        vm.prank(user2);
        forter.stake(newsId, poolId, user2Stake, true);

        // User3 disagrees with pool (NO) - should get nothing
        vm.prank(user3);
        forter.stake(newsId, poolId, user3Stake, false);

        // Record initial balances
        uint256 creatorInitialBalance = token.balanceOf(user1);
        uint256 user2InitialBalance = token.balanceOf(user2);
        uint256 user3InitialBalance = token.balanceOf(user3);
        uint256 feeRecipientBalance = token.balanceOf(owner);

        // Fast forward time
        vm.warp(block.timestamp + 8 days);

        // Emergency resolve to YES (correct)
        vm.prank(owner);
        forter.emergencyResolve(
            newsId,
            Forter.Outcome.YES,
            "https://test.com",
            "Multi-staker test - correct prediction"
        );

        // Check final balances
        uint256 creatorFinalBalance = token.balanceOf(user1);
        uint256 user2FinalBalance = token.balanceOf(user2);
        uint256 user3FinalBalance = token.balanceOf(user3);
        uint256 feeRecipientFinalBalance = token.balanceOf(owner);

        // Verify pool outcome
        (,,,,,,,,,,, bool isResolved, bool isCorrect) = forter.getPoolInfo(newsId, poolId);
        assertTrue(isResolved);
        assertTrue(isCorrect);

        // Calculate expected rewards
        uint256 totalPool = MIN_STAKE + user2Stake + user3Stake;
        uint256 protocolFee = (totalPool * 200) / 10000; // 2%
        uint256 remaining = totalPool - protocolFee;
        uint256 expectedCreatorReward = (remaining * 2000) / 10000; // 20%
        uint256 stakersPool = remaining - expectedCreatorReward; // 80%

        // User2 gets 100% of stakersPool (only winning staker)
        uint256 expectedUser2Reward = stakersPool;
        uint256 expectedUser3Reward = 0; // Wrong prediction

        // Verify reward distribution
        assertEq(creatorFinalBalance - creatorInitialBalance, expectedCreatorReward);
        assertEq(user2FinalBalance - user2InitialBalance, expectedUser2Reward);
        assertEq(user3FinalBalance - user3InitialBalance, expectedUser3Reward);
        assertEq(feeRecipientFinalBalance - feeRecipientBalance, protocolFee);
    }

    function testMultiStakerPoolWrong() public {
        // Test Case: Multiple stakers with wrong pool prediction
        // Expected: Creator 0%, disagree stakers 100% proportional

        uint256 newsId = _createNews();
        uint256 poolId = _createPool(newsId, user1); // Pool YES

        // Additional stakes
        uint256 user2Stake = 500 * 10**18;
        uint256 user3Stake = 300 * 10**18;

        // User2 agrees with pool (YES) - should get nothing
        vm.prank(user2);
        forter.stake(newsId, poolId, user2Stake, true);

        // User3 disagrees with pool (NO) - should get everything
        vm.prank(user3);
        forter.stake(newsId, poolId, user3Stake, false);

        // Record initial balances
        uint256 creatorInitialBalance = token.balanceOf(user1);
        uint256 user2InitialBalance = token.balanceOf(user2);
        uint256 user3InitialBalance = token.balanceOf(user3);
        uint256 feeRecipientBalance = token.balanceOf(owner);

        // Fast forward time
        vm.warp(block.timestamp + 8 days);

        // Emergency resolve to NO (wrong for Pool YES)
        vm.prank(owner);
        forter.emergencyResolve(
            newsId,
            Forter.Outcome.NO,
            "https://test.com",
            "Multi-staker test - wrong prediction"
        );

        // Check final balances
        uint256 creatorFinalBalance = token.balanceOf(user1);
        uint256 user2FinalBalance = token.balanceOf(user2);
        uint256 user3FinalBalance = token.balanceOf(user3);
        uint256 feeRecipientFinalBalance = token.balanceOf(owner);

        // Verify pool outcome
        (,,,,,,,,,,, bool isResolved, bool isCorrect) = forter.getPoolInfo(newsId, poolId);
        assertTrue(isResolved);
        assertFalse(isCorrect);

        // Calculate expected rewards
        uint256 totalPool = MIN_STAKE + user2Stake + user3Stake;
        uint256 protocolFee = (totalPool * 200) / 10000; // 2%
        uint256 remaining = totalPool - protocolFee;

        // Creator gets nothing
        uint256 expectedCreatorReward = 0;
        // All remaining goes to disagree stakers (User3)
        uint256 expectedUser3Reward = remaining;
        uint256 expectedUser2Reward = 0; // Wrong prediction

        // Verify reward distribution
        assertEq(creatorFinalBalance - creatorInitialBalance, expectedCreatorReward);
        assertEq(user2FinalBalance - user2InitialBalance, expectedUser2Reward);
        assertEq(user3FinalBalance - user3InitialBalance, expectedUser3Reward);
        assertEq(feeRecipientFinalBalance - feeRecipientBalance, protocolFee);
    }

    function testPoolOutcomeCalculation() public {
        // Test: Verify Position enum + 1 = Outcome enum calculation

        uint256 newsId = _createNews();

        // Create both YES and NO pools
        uint256 yesPoolId = _createPool(newsId, user1); // Pool YES
        uint256 noPoolId = _createNoPool(newsId, user2); // Pool NO

        // Fast forward time
        vm.warp(block.timestamp + 8 days);

        // Resolve to YES
        vm.prank(owner);
        forter.emergencyResolve(newsId, Forter.Outcome.YES, "https://test.com", "Testing outcome calculation");

        // Check pool outcomes
        (,,,,,,,,,,, bool yesPoolResolved, bool yesPoolCorrect) = forter.getPoolInfo(newsId, yesPoolId);
        (,,,,,,,,,,, bool noPoolResolved, bool noPoolCorrect) = forter.getPoolInfo(newsId, noPoolId);

        assertTrue(yesPoolResolved);
        assertTrue(yesPoolCorrect);  // Position.YES (0) + 1 = Outcome.YES (1) = Correct

        assertTrue(noPoolResolved);
        assertFalse(noPoolCorrect);  // Position.NO (1) + 1 = 2 != Outcome.YES (1) = Wrong
    }

    function testEmergencyResolve() public {
        // Test emergency resolve functionality

        uint256 newsId = _createNews();
        uint256 poolId = _createPool(newsId, user1);

        // Record initial state
        (,,,,,,, Forter.NewsStatus status, Forter.Outcome outcome,,) = forter.getNewsInfo(newsId);
        assertTrue(status == Forter.NewsStatus.Active);
        assertTrue(outcome == Forter.Outcome.None);

        (,,,,,,,,,,, bool poolResolved, bool poolCorrect) = forter.getPoolInfo(newsId, poolId);
        assertFalse(poolResolved);
        assertFalse(poolCorrect);

        // Emergency resolve
        vm.prank(owner);
        forter.emergencyResolve(newsId, Forter.Outcome.NO, "https://emergency.com", "Emergency test");

        // Check final state
        (,,,,,,, Forter.NewsStatus finalStatus, Forter.Outcome finalOutcome,,) = forter.getNewsInfo(newsId);
        assertTrue(finalStatus == Forter.NewsStatus.Resolved);
        assertTrue(finalOutcome == Forter.Outcome.NO);

        (,,,,,,,,,,, bool finalPoolResolved, bool finalPoolCorrect) = forter.getPoolInfo(newsId, poolId);
        assertTrue(finalPoolResolved);
        assertFalse(finalPoolCorrect); // Pool YES + Outcome NO = Wrong

        // Check resolution info
        (uint256 resolvedAt, address resolvedBy, string memory source, string memory notes) =
            forter.getNewsResolutionInfo(newsId);
        assertTrue(resolvedAt > 0);
        assertEq(resolvedBy, owner);
        assertEq(source, "https://emergency.com");
        assertEq(notes, "Emergency test");
    }
}