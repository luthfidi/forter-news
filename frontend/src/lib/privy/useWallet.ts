'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useAccount, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { useCallback, useEffect } from 'react';
import { baseSepolia } from 'viem/chains';

// Get USDC contract address from environment
const USDC_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS as `0x${string}`;

export function useWallet() {
  const { authenticated, user, logout } = usePrivy();
  const { wallets } = useWallets();
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Get the active wallet address - either from embedded wallet or connected wallet
  const walletAddress = address || wallets[0]?.address;
  const isConnected = authenticated && !!walletAddress;
  const isCorrectNetwork = chainId === baseSepolia.id;

  // Auto-switch to Base Sepolia when wallet is connected but on wrong network
  useEffect(() => {
    if (isConnected && !isCorrectNetwork && switchChain) {
      switchChain({ chainId: baseSepolia.id });
    }
  }, [isConnected, isCorrectNetwork, switchChain]);

  const switchToBaseSepoliaChain = useCallback(async () => {
    if (switchChain) {
      try {
        await switchChain({ chainId: baseSepolia.id });
        return true;
      } catch (error) {
        console.error('Failed to switch network:', error);
        return false;
      }
    }
    return false;
  }, [switchChain]);

  const { data: usdcBalance } = useBalance({
    address: walletAddress as `0x${string}`,
    token: USDC_ADDRESS,
  });

  const { data: ethBalance } = useBalance({
    address: walletAddress as `0x${string}`,
  });

  const getBalance = useCallback(async (assetSymbol: string): Promise<number> => {
    if (!walletAddress) return 0;

    if (assetSymbol === 'USDC' && usdcBalance) {
      return Number(usdcBalance.value) / Math.pow(10, usdcBalance.decimals);
    }

    if (assetSymbol === 'ETH' && ethBalance) {
      return Number(ethBalance.value) / Math.pow(10, ethBalance.decimals);
    }

    // Mock balances for other tokens
    const mockBalances: Record<string, number> = {
      'cbBTC': 0.5,
      'cbETH': 2.5,
    };

    return mockBalances[assetSymbol] || 0;
  }, [walletAddress, usdcBalance, ethBalance]);

  return {
    address: walletAddress,
    isConnected,
    isCorrectNetwork,
    chainId,
    disconnect: logout,
    getBalance,
    usdcBalance: usdcBalance ? Number(usdcBalance.value) / Math.pow(10, usdcBalance.decimals) : 0,
    ethBalance: ethBalance ? Number(ethBalance.value) / Math.pow(10, ethBalance.decimals) : 0,
    user,
    authenticated,
    switchToBaseSepoliaChain
  };
}
