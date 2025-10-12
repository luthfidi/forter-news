'use client';

import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';

export default function CustomConnectButton() {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const { address, isConnected, chain } = useAccount();

  // Not connected state
  if (!isConnected) {
    return (
      <Button 
        onClick={openConnectModal}
        variant="outline"
        className="bg-transparent border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Connect Wallet
      </Button>
    );
  }

  // Wrong network state
  if (chain?.unsupported) {
    return (
      <Button 
        onClick={openChainModal}
        variant="destructive"
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        Wrong Network
      </Button>
    );
  }

  // Connected state
  return (
    <div className="flex items-center gap-2">
      {/* Chain Selector */}
      {chain && (
        <Button
          onClick={openChainModal}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground p-2"
        >
          {/* Base chain icon placeholder */}
          <div className="w-4 h-4 rounded-full bg-primary" />
          <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      )}

      {/* Account Button */}
      <Button
        onClick={openAccountModal}
        variant="outline"
        className="bg-card border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <div className="flex items-center gap-2">
          {/* Avatar placeholder */}
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xs text-primary-foreground font-medium">
              {address?.slice(2, 4).toUpperCase()}
            </span>
          </div>
          
          {/* Address */}
          <span className="font-mono text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          
          {/* Dropdown indicator */}
          <svg className="w-3 h-3 ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </Button>
    </div>
  );
}