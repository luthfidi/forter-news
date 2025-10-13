// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ForterTestSetup.sol";

contract ReputationNFTTest is ForterTestSetup {
    function testMintReputationNFT() public {
        uint256 initialBalance = reputationNFT.balanceOf(user1);
        
        // Mint a reputation NFT to user1
        vm.prank(owner);
        reputationNFT.mint(user1, 100); // 100 reputation points
        
        assertEq(reputationNFT.balanceOf(user1), initialBalance + 1);
        assertEq(reputationNFT.getReputationScore(user1), 100);
    }
    
    function testIncreaseReputation() public {
        // First mint an NFT
        vm.prank(owner);
        reputationNFT.mint(user1, 100);
        
        // Increase reputation
        vm.prank(owner);
        reputationNFT.increaseReputation(user1, 50);
        
        assertEq(reputationNFT.getReputationScore(user1), 150);
    }
    
    function testReputationTiers() public {
        // Add reputation tiers
        vm.startPrank(owner);
        reputationNFT.addTier(0, "Novice", 0, "ipfs://novice");
        reputationNFT.addTier(1, "Expert", 1000, "ipfs://expert");
        reputationNFT.addTier(2, "Master", 5000, "ipfs://master");
        
        // Mint initial reputation
        reputationNFT.mint(user1, 100);
        assertEq(reputationNFT.getTierName(user1), "Novice");
        
        // Increase to Expert
        reputationNFT.increaseReputation(user1, 1000);
        assertEq(reputationNFT.getTierName(user1), "Expert");
        
        // Increase to Master
        reputationNFT.increaseReputation(user1, 4000);
        assertEq(reputationNFT.getTierName(user1), "Master");
        
        vm.stopPrank();
    }
    
    function testOnlyOwnerCanAddTiers() public {
        // Non-owner should not be able to add tiers
        vm.prank(user1);
        vm.expectRevert("Ownable: caller is not the owner");
        reputationNFT.addTier(0, "Novice", 0, "ipfs://novice");
    }
}
