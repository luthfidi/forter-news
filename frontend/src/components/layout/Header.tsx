'use client';

import CustomConnectButton from '@/components/wallet/CustomConnectButton';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex items-center justify-between backdrop-blur-md bg-background/90 border-b border-border/30 shadow-sm">
      <div className="flex items-center gap-3">
        <div aria-hidden className="size-8 rounded-lg bg-gradient-to-br from-primary to-accent shadow-md"></div>
        <span className="font-mono text-lg md:text-xl font-bold tracking-wide bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          FORTER
        </span>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#pillars" className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform">
          Pillars
        </a>
        <a href="#dual-staking" className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform">
          Dual Staking
        </a>
        <a href="#reputation" className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform">
          Reputation
        </a>
        <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform">
          How it Works
        </a>
      </nav>
      <div className="flex items-center gap-3">
        <CustomConnectButton />
      </div>
    </header>
  );
}