// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IForter {
    // Events
    event NewsCreated(uint256 indexed newsId, address indexed creator, string content, uint256 resolveTime);
    event PoolCreated(uint256 indexed newsId, uint256 indexed poolId, address indexed creator, string reasoning, bool position);
    event Staked(uint256 indexed newsId, uint256 indexed poolId, address staker, uint256 amount, bool position);
    event Resolved(uint256 indexed newsId, bool outcome);
    
    // Core functions
    function createNews(string memory _content, uint256 _resolveTime) external;
    function createPool(uint256 newsId, string memory _reasoning, string memory _evidenceLink, string memory _imageUrl, bool _position) external;
    function stake(uint256 newsId, uint256 poolId, uint256 amount, bool position) external;
    function resolveNews(uint256 newsId, bool outcome) external;
    
    // View functions
    function getNewsCount() external view returns (uint256);
    function getPoolCount(uint256 newsId) external view returns (uint256);
    function getUserStake(uint256 newsId, uint256 poolId, address user) external view returns (uint256);
}
