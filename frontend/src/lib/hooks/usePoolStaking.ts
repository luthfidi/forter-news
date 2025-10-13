import { useState } from 'react';
import { useGlobalStore } from '@/store/useGlobalStore';
import { PoolStake, Pool } from '@/types';
import { getPoolById } from '@/lib/mock-data';

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
    const { agreeStakes, disagreeStakes, creatorStake, totalStaked } = pool;

    // Total pool after user stake
    const newTotalPool = totalStaked + stakeAmount;
    const platformFee = newTotalPool * 0.02; // 2%
    const rewardPool = newTotalPool - platformFee;

    if (position === 'agree') {
      // If pool creator correct, user gets share of 30% distributed among agree stakers
      const creatorReward = rewardPool * 0.7; // Creator gets 70%
      const stakersReward = rewardPool * 0.3; // Stakers get 30%

      const newAgreeTotal = agreeStakes + stakeAmount;
      const userShare = (stakeAmount / newAgreeTotal) * stakersReward;

      return {
        minReward: 0, // If pool wrong, lose everything
        maxReward: stakeAmount + userShare,
        breakEven: stakeAmount
      };
    } else {
      // If pool creator wrong, disagree stakers take 98% of total pool
      const newDisagreeTotal = disagreeStakes + stakeAmount;
      const userShare = (stakeAmount / newDisagreeTotal) * rewardPool;

      return {
        minReward: 0, // If pool correct, lose everything
        maxReward: userShare,
        breakEven: stakeAmount
      };
    }
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
