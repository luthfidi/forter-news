/**
 * REPUTATION NFT CONTRACT - READ FUNCTIONS
 *
 * All read-only contract calls for ReputationNFT.sol
 */

import { readContract } from 'wagmi/actions';
import { config as wagmiConfig } from '@/lib/wagmi';
import { contracts } from '@/config/contracts';
import type { Address } from '@/types/contracts';
import type { ReputationData } from '@/types';
import type { ReputationContractData } from '../types.shared';
import { mapContractToReputation } from './mappers';

/**
 * Get user reputation
 */
export async function getUserReputation(address: Address): Promise<ReputationData | null> {
  try {
    const data = await readContract(wagmiConfig, {
      address: contracts.reputationNFT.address,
      abi: contracts.reputationNFT.abi,
      functionName: 'getUserReputation',
      args: [address],
    }) as ReputationContractData;

    return mapContractToReputation(data, address);
  } catch (error) {
    console.error('[ReputationNFT/read] getUserReputation failed:', error);
    return null;
  }
}
