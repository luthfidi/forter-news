'use client'

import { useConnectModal, useAccountModal, useChainModal } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Lucide icons
import {
  Wallet,
  AlertTriangle,
  ChevronDown,
  Network,
} from 'lucide-react'

export default function CustomConnectButton() {
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()
  const { openChainModal } = useChainModal()
  const { address, isConnected, chain } = useAccount()

  // --- Not Connected ---
  if (!isConnected) {
    return (
      <Button
        onClick={openConnectModal}
        className="bg-gradient-to-r from-primary/70 to-secondary/70 text-white font-medium border border-border/40 
                   hover:from-primary hover:to-secondary shadow-sm transition-colors"
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>
    )
  }

  // --- Wrong Network ---
  if (chain?.unsupported) {
    return (
      <Button
        onClick={openChainModal}
        variant="destructive"
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium"
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        Wrong Network
      </Button>
    )
  }

  // --- Connected ---
  return (
    <div className="flex items-center gap-2">
      {/* Chain Selector */}
      {chain && (
        <Button
          onClick={openChainModal}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-sm bg-card border-border/40 hover:bg-accent/10"
        >
          <div
            className={cn(
              'w-3.5 h-3.5 rounded-full',
              chain.name?.toLowerCase().includes('base') && 'bg-blue-500',
              chain.name?.toLowerCase().includes('polygon') && 'bg-purple-500',
              chain.name?.toLowerCase().includes('ethereum') && 'bg-gray-400',
              !chain.name && 'bg-muted'
            )}
          />
          <span className="capitalize">{chain.name ?? 'Unknown'}</span>
          <ChevronDown className="w-3 h-3 opacity-60 ml-1" />
        </Button>
      )}

      {/* Account Button */}
      <Button
        onClick={openAccountModal}
        variant="outline"
        className="bg-card border-border/40 text-foreground hover:bg-accent/10 transition-colors rounded-xl"
      >
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
            {address?.slice(2, 4).toUpperCase()}
          </div>

          {/* Address */}
          <span className="font-mono text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>

          {/* Dropdown Icon */}
          <ChevronDown className="w-3 h-3 opacity-60" />
        </div>
      </Button>
    </div>
  )
}
