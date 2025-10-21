import { useState } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { PoolStake, Pool } from '@/types';
import { stakingService } from '@/lib/services';

export function usePoolStaking() {
  const { poolStakes, setPoolStakes, pools, setPools, loading, setLoading } = useGlobalStore();
  const [error, setError] = useState<string | null>(null);

  const stakeOnPool = async (
    poolId: string,
    position: 'agree' | 'disagree',
    amount: number,
    newsId?: string
  ): Promise<PoolStake | null> => {
    try {
      setLoading('stakes', true);
      setError(null);

      // Validate amount
      if (amount < 1) {
        throw new Error('Minimum stake is $1 USDC');
      }

      // Use stakingService which handles both contract and mock data
      const newStake = await stakingService.stake({
        poolId,
        position,
        amount
      }, newsId);

      // Update pool stakes in local state
      const pool = pools.find(p => p.id === poolId);
      if (pool) {
        const updatedPool = {
          ...pool,
          agreeStakes: position === 'agree'
            ? pool.agreeStakes + amount
            : pool.agreeStakes,
          disagreeStakes: position === 'disagree'
            ? pool.disagreeStakes + amount
            : pool.disagreeStakes,
          totalStaked: pool.totalStaked + amount
        };

        // Update pools list
        setPools(pools.map(p => p.id === poolId ? updatedPool : p));
      }

      // Add to user stakes
      setPoolStakes([...poolStakes, newStake]);

      console.log('Stake successful:', newStake);
      return newStake;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stake');
      console.error('Error staking:', err);
      return null;
    } finally {
      setLoading('stakes', false);
    }
  };

  const getUserStakes = (poolId?: string): PoolStake[] => {
    if (poolId) {
      return poolStakes.filter(stake => stake.poolId === poolId);
    }
    return poolStakes;
  };

  const getUserTotalStaked = (): number => {
    return poolStakes.reduce((sum, stake) => sum + stake.amount, 0);
  };

  const calculatePotentialReward = (
    pool: Pool,
    stakeAmount: number,
    position: 'agree' | 'disagree'
  ): { minReward: number; maxReward: number; breakEven: number } => {
    const { agreeStakes, disagreeStakes, totalStaked, creatorStake } = pool;

    // Total pool after user stake
    const newTotalPool = totalStaked + stakeAmount;
    const platformFee = newTotalPool * 0.02; // 2% protocol fee

    // FIXED: Smart contract implements 20/80 SPLIT with auto-distribute
    // - Creator gets 20% of remaining pool (after 2% fee) IF pool correct
    // - Winning stakers get 80% of remaining pool
    // - Creator stake is EXCLUDED from winning staker pool (no double-dipping)
    // - Rewards are auto-distributed on resolution (no manual claim)

    // NEW 20/80 SPLIT LOGIC
    const remaining = newTotalPool - platformFee; // 98% remaining after platform fee
    // const creatorReward = remaining * 0.20; // 20% to creator (only if pool correct)
    const stakersPool = remaining * 0.80;   // 80% to stakers

    // Determine winning pool based on position
    // CRITICAL FIX: EXCLUDE creator stake from winning pool calculation
    let winningPoolTotal: number;
    let userPotentialReward: number;

    if (position === 'agree') {
      // User agrees with pool creator's position
      // If pool is CORRECT:
      // - Creator gets 20% (creatorReward)
      // - Agree stakers get 80%, BUT creator stake is excluded from distribution
      const newAgreeTotal = agreeStakes + stakeAmount;
      const agreePoolExcludingCreator = newAgreeTotal - creatorStake;

      winningPoolTotal = agreePoolExcludingCreator;

      // User's proportional share of 80% stakers pool
      const userShare = winningPoolTotal > 0 ? stakeAmount / winningPoolTotal : 0;
      userPotentialReward = stakersPool * userShare;
    } else {
      // User disagrees with pool creator's position
      // If pool is WRONG:
      // - Creator gets 0%
      // - Disagree stakers get 98% (all remaining after platform fee)
      const newDisagreeTotal = disagreeStakes + stakeAmount;

      winningPoolTotal = newDisagreeTotal;

      // User's proportional share of full remaining pool (98%)
      const userShare = winningPoolTotal > 0 ? stakeAmount / winningPoolTotal : 0;
      userPotentialReward = remaining * userShare; // Full 98% pool for disagree winners
    }

    // Calculate both scenarios
    const maxReward = userPotentialReward; // If user's position wins
    const minReward = 0; // If user's position loses (loses entire stake)

    return {
      minReward,
      maxReward,
      breakEven: stakeAmount
    };
  };

  const getStakesByPool = (poolId: string): PoolStake[] => {
    return poolStakes.filter(stake => stake.poolId === poolId);
  };

  const getStakeStats = (poolId: string) => {
    const stakes = getStakesByPool(poolId);
    const agreeStakes = stakes.filter(s => s.position === 'agree');
    const disagreeStakes = stakes.filter(s => s.position === 'disagree');

    return {
      totalStakers: stakes.length,
      agreeStakers: agreeStakes.length,
      disagreeStakers: disagreeStakes.length,
      totalStaked: stakes.reduce((sum, s) => sum + s.amount, 0),
      agreeTotal: agreeStakes.reduce((sum, s) => sum + s.amount, 0),
      disagreeTotal: disagreeStakes.reduce((sum, s) => sum + s.amount, 0)
    };
  };

  return {
    poolStakes,
    loading: loading.stakes,
    error,
    stakeOnPool,
    getUserStakes,
    getUserTotalStaked,
    calculatePotentialReward,
    getStakesByPool,
    getStakeStats
  };
}
