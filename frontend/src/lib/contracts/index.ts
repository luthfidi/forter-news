/**
 * CONTRACTS - MAIN EXPORT POINT
 *
 * Centralized exports for all contract operations
 * Organized by contract type for better maintainability
 */

// ==========================================
// SHARED UTILITIES & TYPES
// ==========================================
export {
  parseUSDC,
  formatUSDC,
  timestampToDate,
  dateToTimestamp,
  positionToString,
  stringToPosition,
  handleContractError,
} from './utils.shared';

export type {
  TransactionResult,
  NewsContractData,
  PoolContractData,
  ReputationContractData,
  StakeContractData,
  PoolStakeStatsContractData,
  NewsResolutionContractData,
} from './types.shared';

// ==========================================
// FORTER CONTRACT
// ==========================================
export {
  // Read
  getNewsCount,
  getNewsById,
  getPoolsByNewsId,
  getPoolById,
  getPoolsByCreator,
  getUserStake,
  getNewsResolutionInfo,
  // Write
  createNews,
  createPool,
  stakeOnPool,
  resolveNews,
  // Mappers
  mapContractToNews,
  mapContractToPool,
} from './Forter';

// ==========================================
// REPUTATION NFT CONTRACT
// ==========================================
export {
  // Read
  getUserReputation,
  // Write
  mintReputationNFT,
  updateReputation,
  // Mappers
  mapContractToReputation,
} from './ReputationNFT';

// ==========================================
// STAKING POOL CONTRACT
// ==========================================
export {
  // Read
  getPoolStakeStats,
  // Write
  withdrawStake,
  emergencyWithdraw,
} from './StakingPool';

// ==========================================
// TOKEN (USDC) CONTRACT
// ==========================================
export {
  // Read
  getUSDCBalance,
  getUSDCAllowance,
  // Write
  approveUSDC,
  transferUSDC,
} from './Token';

// ==========================================
// BACKWARD COMPATIBILITY ALIASES
// ==========================================

// Legacy function names for backward compatibility during migration
export { getNewsById as getNewsContractById } from './Forter';
export { getPoolsByNewsId as getPoolsByNewsIdContract } from './Forter';
export { getPoolById as getPoolByIdContract } from './Forter';
export { createNews as createNewsContract } from './Forter';
export { createPool as createPoolContract } from './Forter';
export { stakeOnPool as stakeOnPoolContract } from './Forter';
export { resolveNews as resolveNewsContract } from './Forter';
export { withdrawStake as withdrawStakeContract } from './StakingPool';
export { emergencyWithdraw as emergencyWithdrawContract } from './StakingPool';
export { getUserStake as getUserStakeContract } from './Forter';
export { getPoolStakeStats as getPoolStakeStatsContract } from './StakingPool';
export { getNewsResolutionInfo as getNewsResolutionInfoContract } from './Forter';
