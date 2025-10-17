// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ReputationNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    
    // Token ID counter
    Counters.Counter private _tokenIdCounter;
    
    // Reputation levels with corresponding token URIs
    struct ReputationTier {
        string name;
        string tokenURI;
        uint256 minScore;
    }
    
    // User reputation data
    struct UserReputation {
        uint256 score;
        uint256 lastUpdated;
        uint256 totalPredictions;
        uint256 correctPredictions;
    }
    
    // Mappings
    mapping(address => UserReputation) public userReputations;
    mapping(uint256 => ReputationTier) public reputationTiers;
    mapping(address => uint256) public userToTokenId;
    mapping(uint256 => address) public tokenIdToUser;
    
    // Events
    event ReputationUpdated(address indexed user, uint256 newScore, uint256 tokenId);
    event TierAdded(uint256 tierId, string name, uint256 minScore);
    
    constructor() ERC721("ForterReputation", "FRTREP") Ownable(msg.sender) {
        // Initialize with default tiers
        _addTier(0, "Novice", 0, "ipfs://Qm.../novice.json");
        _addTier(1, 
