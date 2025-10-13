// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Forter.sol";
import "../src/ReputationNFT.sol";
import "../src/StakingPool.sol";
import "../src/Governance.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock ERC20 token for testing
contract MockToken is ERC20 {
    constructor() ERC20("Mock Token", "MOCK") {
        _mint(msg.sender, 1000000 * 10**18);
    }
    
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract ForterTestSetup is Test {
    // Contracts
    MockToken public token;
    ReputationNFT public reputationNFT;
    Governance public governance;
    Forter public forter;
    
    // Test addresses
    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public user3 = address(0x4);
    
    // Test parameters
    uint256 public constant MIN_STAKE = 100 * 10**18;
    uint256 public constant MAX_NEWS_DURATION = 30 days;
    uint256 public constant MIN_NEWS_DURATION = 1 days;
    uint256 public constant PROTOCOL_FEE = 50; // 0.5%
    
    function setUp() public virtual {
        // Set up test environment
        vm.startPrank(owner);
        
        // Deploy mock token
        token = new MockToken();
        
        // Deploy governance
        governance = new Governance(
            ERC20Votes(address(token)),
            MIN_STAKE,
            MAX_NEWS_DURATION,
            MIN_NEWS_DURATION,
            PROTOCOL_FEE,
            owner
        );
        
        // Deploy ReputationNFT
        reputationNFT = new ReputationNFT();
        
        // Deploy Forter
        forter = new Forter(
            address(token),
            address(reputationNFT),
            address(governance)
        );
        
        // Set up governance with contract addresses
        governance.setDependencies(
            address(forter.stakingPool()),
            address(reputationNFT)
        );
        
        // Transfer tokens to test users
        token.transfer(user1, 10000 * 10**18);
        token.transfer(user2, 10000 * 10**18);
        token.transfer(user3, 10000 * 10**18);
        
        // Approve Forter contract to spend tokens
        vm.startPrank(user1);
        token.approve(address(forter), type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(user2);
        token.approve(address(forter), type(uint256).max);
        vm.stopPrank();
        
        vm.startPrank(user3);
        token.approve(address(forter), type(uint256).max);
        vm.stopPrank();
        
        vm.stopPrank();
    }
    
    // Helper function to create a news item
    function _createNews() internal returns (uint256) {
        uint256 resolveTime = block.timestamp + 7 days;
        forter.createNews("Test News", resolveTime);
        return forter.getNewsCount() - 1;
    }
    
    // Helper function to create a pool
    function _createPool(uint256 newsId, address creator) internal returns (uint256) {
        vm.startPrank(creator);
        forter.createPool(
            newsId,
            "This is a test reasoning with more than 100 characters to satisfy the minimum length requirement for the reasoning field.",
            "https://example.com/evidence",
            "https://example.com/image.jpg",
            true
        );
        vm.stopPrank();
        return forter.getPoolCount(newsId) - 1;
    }
}
