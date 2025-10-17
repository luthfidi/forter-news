import ForterABI from '../abis/Forter.json';
import ReputationNFTABI from '../abis/ReputationNFT.json';
import StakingPoolABI from '../abis/StakingPool.json';
import ForterGovernanceABI from '../abis/ForterGovernance.json';
import MockTokenABI from '../abis/MockToken.json';

/**
 * Alamat kontrak yang di-deploy di jaringan Base Sepolia.
 */
export const contractAddresses = {
  forter: '0xAf1C459cB7fc9fD6e7e6F39f34b79412A1c6e859',
  reputationNFT: '0x4ad56DFD89125a0f5Ae28677F10D0f4FFC62cbDe',
  stakingPool: '0x6Ba309b354c4E406D631f3ef9A0cDB5410D52753',
  governance: '0xFEbF0B00a87F253709b9DDda6A8C8DD1B28EEE20',
  token: '0x6DaAB123d209cb36673Fc50ce54C959Ed5567F6D',
} as const;

/**
 * Konfigurasi lengkap (alamat + ABI) untuk setiap kontrak.
 * Ini memudahkan penggunaan dengan library seperti wagmi atau ethers.
 */
export const contracts = {
  forter: {
    address: contractAddresses.forter,
    abi: ForterABI as const,
  },
  reputationNFT: {
    address: contractAddresses.reputationNFT,
    abi: ReputationNFTABI as const,
  },
  stakingPool: {
    address: contractAddresses.stakingPool,
    abi: StakingPoolABI as const,
  },
  governance: {
    address: contractAddresses.governance,
    abi: ForterGovernanceABI as const,
  },
  token: {
    address: contractAddresses.token,
    abi: MockTokenABI as const,
  },
} as const;
