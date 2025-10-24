'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { NetworkIndicator } from './NetworkIndicator';

interface WalletConnectProps {
  className?: string;
}

export function WalletConnect({ className }: WalletConnectProps) {
  const { ready, authenticated, user, login, logout } = usePrivy();

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
      <NetworkIndicator />
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
