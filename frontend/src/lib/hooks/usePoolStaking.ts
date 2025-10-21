import { useState } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { PoolStake, Pool } from '@/types';

export function usePoolStaking() {
  const { poolStakes, setPoolStakes, pools, setPools, loading, setLoading } = useGlobalStore();
  const [error, setError] = useState<string | null>(null);

  const stakeOnPool = async (
    poolId: string,
    position: 'agree' | 'disagree',
    amount: number
  ): Promise<PoolStake | null> => {
    try {
      setLoading('stakes', true);
      setError(null);

      // Validate amount
      if (amount < 1) {
        throw new Error('Minimum stake is $1 USDC');
      }

      // Simulate wallet interaction & transaction
      console.log('Initiating wallet transaction:', { poolId, position, amount });
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock: Create stake record
      const newStake: PoolStake = {
        id: `stake-${Date.now()}`,
        poolId,
        userAddress: '0xuser...mock', // TODO: Get from wallet
        position,
        amount,
        createdAt: new Date()
      };

      // Update pool stakes
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
    const { agreeStakes, disagreeStakes, totalStaked } = pool;

    // Total pool after user stake
    const newTotalPool = totalStaked + stakeAmount;
    const platformFee = newTotalPool * 0.02; // 2% protocol fee

    // NOTE: Smart contract NOW implements 20/80 SPLIT with auto-distribute
    // - Creator gets 20% of remaining pool (after 2% fee)
    // - Winning stakers get 80% of remaining pool
    // - Creator is EXCLUDED from winning staker pool (no double-dipping)
    // - Rewards are auto-distributed on resolution (no manual claim)

    // NEW 20/80 SPLIT LOGIC
    const remaining = newTotalPool - platformFee; // 98% remaining
    // const creatorReward = remaining * 0.20; // 20% to creator (not used in calculation)
    const stakersPool = remaining * 0.80;   // 80% to stakers

    // Determine winning pool (EXCLUDE creator stake from agree pool)
    let winningPool: number;
    let userWins: boolean;

    if (position === 'agree') {
      // User agrees with pool creator's position
      const newAgreeTotal = agreeStakes + stakeAmount;
      // EXCLUDE creator stake from winning pool calculation
      winningPool = newAgreeTotal; // Note: creator stake should be excluded in real implementation
      userWins = true; // Assuming pool correct for max reward
    } else {
      // User disagrees with pool creator's position
      const newDisagreeTotal = disagreeStakes + stakeAmount;
      winningPool = newDisagreeTotal;
      userWins = true; // Assuming pool wrong for max reward
    }

    if (!userWins) {
      return {
        minReward: 0,
        maxReward: 0,
        breakEven: stakeAmount
      };
    }

    // User gets proportional share of 80% stakers pool
    const userShare = stakeAmount / winningPool;
    const userReward = stakersPool * userShare;

    return {
      minReward: 0, // If pool wrong, lose everything
      maxReward: userReward, // Proportional share of 80% (stake not returned, just profit)
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
