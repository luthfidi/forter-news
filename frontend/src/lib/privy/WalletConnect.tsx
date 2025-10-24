'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { User, AlertCircle } from 'lucide-react';
import { useWallet } from '@/lib/hooks/useWallet';

interface WalletConnectProps {
  className?: string;
}

export function WalletConnect({ className }: WalletConnectProps) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const { isConnected, isCorrectNetwork, switchToBaseSepoliaChain } = useWallet();
  const [hasMounted, setHasMounted] = useState(false);

  // ClientOnly - prevent hydration mismatch
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  // Loading state
  if (!ready) {
    return (
      <Button disabled className={className}>
        Loading...
      </Button>
    );
  }

  // Not connected
  if (!authenticated) {
    return (
      <Button
        onClick={login}
        className={`bg-gradient-to-r from-primary/70 to-accent/70 hover:from-primary hover:to-accent shadow-sm ${className}`}
      >
        Connect Wallet
      </Button>
    );
  }

  // Get wallet address for display
  const walletAddress = user?.wallet?.address;
  const displayName = user?.email?.address ||
    user?.google?.email ||
    (walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'User');

  // Connected state
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Network Indicator - only show when on wrong network */}
      {isConnected && !isCorrectNetwork && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-600 dark:text-yellow-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-xs font-medium">Wrong Network</span>
          <Button
            onClick={switchToBaseSepoliaChain}
            size="sm"
            variant="outline"
            className="ml-auto h-7 text-xs border-yellow-500/50 hover:bg-yellow-500/20"
          >
            Switch to Base Sepolia
          </Button>
        </div>
      )}

      {/* Wallet Button */}
      <Button
        onClick={logout}
        variant="outline"
        className="bg-card border-border/40 hover:bg-card/80 transition-colors"
      >
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-accent mr-2" />
        <span className="font-mono text-sm font-medium truncate max-w-[120px]">
          {displayName}
        </span>
        <User className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
