import { useGlobalStore } from '@/store/useGlobalStore';
import { PoolStake, Pool } from '@/types';
import { stakingService } from '@/lib/services';
import { useAccount } from 'wagmi';

export function usePoolStaking() {
  const { poolStakes, setPoolStakes, pools, setPools, loading, setLoading } = useGlobalStore();
  const { address } = useAccount();

  const stakeOnPool = async (
    poolId: string,
    position: 'agree' | 'disagree',
    amount: number,
    newsId?: string
  ): Promise<PoolStake | null> => {
    try {
      setLoading('stakes', true);

      // Validate amount with minimum stake ($10 from contract)
      if (amount < 10) {
        throw new Error('Minimum stake is $10 USDC');
      }

      if (!address) {
        throw new Error('Please connect your wallet first');
      }

      // Use stakingService which handles both contract and mock data
      const newStake = await stakingService.stake({
        newsId: newsId || '',
        poolId,
        position,
        amount,
        userAddress: address as `0x${string}`
      }, newsId);

      // Update pool stakes in local state
      const poolIndex = pools.findIndex(p => p.id === poolId);
      if (poolIndex !== -1) {
        // Calculate if user's position aligns with pool's position (Support Stakers)
        const pool = pools[poolIndex];
        const poolPositionBool = pool.position === 'YES';
        const userPositionBool = position === 'agree';
        const isSupporting = userPositionBool === poolPositionBool;

        const updatedPool = {
          ...pool,
          agreeStakes: isSupporting
            ? pool.agreeStakes + amount  // User position aligns with pool = Support Stakers
            : pool.agreeStakes,
          disagreeStakes: !isSupporting
            ? pool.disagreeStakes + amount  // User position opposes pool = Oppose Stakers
            : pool.disagreeStakes,
          totalStaked: pool.totalStaked + amount
        };

        console.log('[usePoolStaking] 🎯 Updated pool stakes:', {
          poolId,
          poolPosition: pool.position,
          userChoice: position,
          isSupporting,
          amount,
          oldAgree: pool.agreeStakes,
          oldDisagree: pool.disagreeStakes,
          newAgree: updatedPool.agreeStakes,
          newDisagree: updatedPool.disagreeStakes,
          calculation: `Pool ${pool.position} + User ${position} = ${isSupporting ? 'Support Stakers' : 'Oppose Stakers'}`
        });

        // Update pools list with new array reference to force re-render
        const newPools = [...pools];
        newPools[poolIndex] = updatedPool;
        setPools(newPools);
      } else {
        console.warn('[usePoolStaking] Pool not found for ID:', poolId);
      }

      // Add to user stakes
      setPoolStakes([...poolStakes, newStake]);

      console.log('Stake successful:', newStake);
      return newStake;
    } catch (err) {
      console.error('Failed to stake:', err instanceof Error ? err.message : 'Failed to stake');
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
    stakeOnPool,
    getUserStakes,
    getUserTotalStaked,
    calculatePotentialReward,
    getStakesByPool,
    getStakeStats
  };
}
