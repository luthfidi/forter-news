'use client';

import { useWallet } from '@/lib/hooks/useWallet';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NetworkIndicator() {
  const { isConnected, isCorrectNetwork, switchToBaseSepoliaChain } = useWallet();

  if (!isConnected || isCorrectNetwork) {
    return null;
  }

  return (
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
  );
}
