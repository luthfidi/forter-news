// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IForter.sol";
import "./ReputationNFT.sol";
import "./StakingPool.sol";
import "./Governance.sol";

contract Forter is IForter, Ownable2Step, ReentrancyGuard {
    // Contract dependencies
    ReputationNFT public reputationNFT;
    StakingPool public stakingPool;
    Governance public governance;
    IERC20 public stakingToken;
    
    // News and Pools
    struct News {
        address creator;
        string content;
        uint256 resolveTime;
        bool isResolved;
        bool outcome;
        uint256 totalPools;
        mapping(uint256 => Pool) pools;
    }

    struct Pool {
        address creator;
        string reasoning;
        string evidenceLink;
        string imageUrl;
        bool position; // true for YES, false for NO
        uint256 totalStakers;
    }

    // State variables
    uint256 public newsCount;
    
    // Mappings
    mapping(uint256 => News) public newsItems;
    mapping(address => uint256) public userNewsCount;

    // Events (inherited from IForter)

    constructor(
        address _stakingToken,
        address _reputationNFT,
        address _governance
    ) Ownable(msg.sender) {
        require(
            _stakingToken != address(0) && 
            _reputationNFT != address(0) && 
            _governance != address(0),
            "Invalid address"
        );
        
        stakingToken = IERC20(_stakingToken);
        reputationNFT = ReputationNFT(_reputationNFT);
        governance = Governance(_governance);
        
        // Create staking pool
        stakingPool = new StakingPool(address(this), _stakingToken);
    }

    // Modifiers
    modifier validNews(uint256 newsId) {
        require(newsId < newsCount, "Invalid news ID");
        _;
    }

    modifier onlyBeforeResolve(uint256 newsId) {
        require(!newsItems[newsId].isResolved, "News already resolved");
        require(block.timestamp < newsItems[newsId].resolveTime, "Resolution time passed");
        _;
    }

    // Core Functions
    function createNews(string memory _content, uint256 _resolveTime) external override {
        require(bytes(_content).length > 0, "Content cannot be empty");
        
        // Get governance parameters
        (,, uint256 minNewsDuration, uint256 maxNewsDuration,,) = getGovernanceParameters();
        
        require(
            _resolveTime > block.timestamp + minNewsDuration && 
            _resolveTime <= block.timestamp + maxNewsDuration,
            "Invalid resolve time"
        );

        uint256 newsId = newsCount++;
        News storage news = newsItems[newsId];
        
        news.creator = msg.sender;
        news.content = _content;
        news.resolveTime = _resolveTime;
        news.isResolved = false;
        
        userNewsCount[msg.sender]++;
        
        emit NewsCreated(newsId, msg.sender, _content, _resolveTime);
    }

    function createPool(
        uint256 newsId,
        string memory _reasoning,
        string memory _evidenceLink,
        string memory _imageUrl,
        bool _position
    ) external override validNews(newsId) onlyBeforeResolve(newsId) {
        require(bytes(_reasoning).length >= 100, "Reasoning too short");
        
        // Check if user has minimum reputation to create a pool
        // (Implementation depends on your reputation system)
        
        News storage news = newsItems[newsId];
        uint256 poolId = news.totalPools++;
        
        Pool storage pool = news.pools[poolId];
        pool.creator = msg.sender;
        pool.reasoning = _reasoning;
        pool.evidenceLink = _evidenceLink;
        pool.imageUrl = _imageUrl;
        pool.position = _position;
        
        emit PoolCreated(newsId, poolId, msg.sender, _reasoning, _position);
    }

    function stake(
        uint256 newsId,
        uint256 poolId,
        uint256 amount,
        bool position
    ) external override validNews(newsId) onlyBeforeResolve(newsId) nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        
        // Get minimum stake amount from governance
        (uint256 minStake,,,,) = getGovernanceParameters();
        require(amount >= minStake, "Stake below minimum");
        
        News storage news = newsItems[newsId];
        require(poolId < news.totalPools, "Invalid pool ID");
        
        Pool storage pool = news.pools[poolId];
        require(pool.position == position, "Position mismatch with pool");
        
        // Delegate to staking pool
        stakingPool.stake(newsId, poolId, amount, position);
        
        emit Staked(newsId, poolId, msg.sender, amount, position);
    }

    function resolveNews(uint256 newsId, bool outcome) external override onlyOwner validNews(newsId) {
        News storage news = newsItems[newsId];
        require(!news.isResolved, "Already resolved");
        require(block.timestamp >= news.resolveTime, "Too early to resolve");
        
        news.isResolved = true;
        news.outcome = outcome;
        
        // Update reputations based on pool outcomes
        _updateReputations(newsId, outcome);
        
        emit Resolved(newsId, outcome);
    }
    
    function _updateReputations(uint256 newsId, bool outcome) internal {
        News storage news = newsItems[newsId];
        
        // Iterate through all pools and update reputations
        for (uint256 i = 0; i < news.totalPools; i++) {
            Pool storage pool = news.pools[i];
            
            // If pool's position matches the outcome, update creator's reputation
            if (pool.position == outcome) {
                // This is a simplified example - in practice, you'd want a more sophisticated
                // reputation update mechanism based on stake amounts, pool performance, etc.
                reputationNFT.increaseReputation(pool.creator, 10);
            }
        }
    }

    // View functions
    function getNewsCount() external view override returns (uint256) {
        return newsCount;
    }
    
    function getPoolCount(uint256 newsId) external view override returns (uint256) {
        return newsItems[newsId].totalPools;
    }
    
    function getPoolInfo(uint256 newsId, uint256 poolId) 
        external 
        view 
        validNews(newsId) 
        returns (
            address creator,
            string memory reasoning,
            string memory evidenceLink,
            string memory imageUrl,
            bool position,
            uint256 totalStakers
        ) 
    {
        Pool storage pool = newsItems[newsId].pools[poolId];
        return (
            pool.creator,
            pool.reasoning,
            pool.evidenceLink,
            pool.imageUrl,
            pool.position,
            pool.totalStakers
        );
    }
    
    function getGovernanceParameters() public view returns (
        uint256 minStakeAmount,
        uint256 maxNewsDuration,
        uint256 minNewsDuration,
        uint256 protocolFee,
        address feeRecipient
    ) {
        return (
            governance.minStakeAmount(),
            governance.maxNewsDuration(),
            governance.minNewsDuration(),
            governance.protocolFee(),
            governance.feeRecipient()
        );
    }
    
    // Fallback function to receive ETH
    receive() external payable {}
    
    // Emergency withdraw any ERC20 tokens (onlyOwner)
    function withdrawToken(address token, uint256 amount) external onlyOwner {
        IERC20(token).transfer(owner(), amount);
    }
    
    // Emergency withdraw ETH (onlyOwner)
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

}
