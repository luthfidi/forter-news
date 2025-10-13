// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Forter} from "../src/Forter.sol";
import {ReputationNFT} from "../src/ReputationNFT.sol";
import {StakingPool} from "../src/StakingPool.sol";
import {Governance} from "../src/Governance.sol";
import {MockToken} from "../test/ForterTestSetup.sol";

contract DeployScript is Script {
    // Contract instances
    MockToken public token;
    ReputationNFT public reputationNFT;
    Governance public governance;
    Forter public forter;
    
    // Deployment parameters
    uint256 public constant MIN_STAKE = 100 * 10**18;
    uint256 public constant MAX_NEWS_DURATION = 30 days;
    uint256 public constant MIN_NEWS_DURATION = 1 days;
    uint256 public constant PROTOCOL_FEE = 50; // 0.5%
    
    function run() external {
        // Get deployer address
        address deployer = msg.sender;
        
        // Start broadcasting transactions
        vm.startBroadcast(deployer);
        
        // 1. Deploy mock token (replace with real token in production)
        token = new MockToken();
        
        // 2. Deploy Reputation NFT
        reputationNFT = new ReputationNFT();
        
        // 3. Deploy Governance
        governance = new Governance(
            ERC20Votes(address(token)),
            MIN_STAKE,
            MAX_NEWS_DURATION,
            MIN_NEWS_DURATION,
            PROTOCOL_FEE,
            deployer // fee recipient
        );
        
        // 4. Deploy Forter
        forter = new Forter(
            address(token),
            address(reputationNFT),
            address(governance)
        );
        
        // 5. Set up governance with contract addresses
        governance.setDependencies(
            address(forter.stakingPool()),
            address(reputationNFT)
        );
        
        // 6. Initialize reputation tiers
        reputationNFT.addTier(0, "Novice", 0, "ipfs://novice");
        reputationNFT.addTier(1, "Analyst", 1000, "ipfs://analyst");
        reputationNFT.addTier(2, "Expert", 5000, "ipfs://expert");
        reputationNFT.addTier(3, "Master", 20000, "ipfs://master");
        
        // Transfer ownership if needed
        // reputationNFT.transferOwnership(address(governance));
        
        vm.stopBroadcast();
        
        // Log deployed addresses
        console.log("Token deployed at:", address(token));
        console.log("ReputationNFT deployed at:", address(reputationNFT));
        console.log("Governance deployed at:", address(governance));
        console.log("Forter deployed at:", address(forter));
        console.log("StakingPool deployed at:", address(forter.stakingPool()));
    }
}
