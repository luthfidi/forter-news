'use client';

import CustomConnectButton from '@/components/wallet/CustomConnectButton';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Header() {
  const { address, isConnected } = useAccount();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex items-center justify-between backdrop-blur-md bg-background/90 border-b border-border/30 shadow-sm">
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
        <Image src="/forter.webp" alt="FORTER" width={32} height={32} className="w-8 h-8 rounded-lg" />
        <span className="font-mono text-lg md:text-xl font-bold tracking-wide bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          FORTER
        </span>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/news" className="text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105 transform font-medium">
          News
        </Link>
        {isConnected && address && (
          <Link href={`/profile/${address}`}>
            <Button variant="ghost" size="sm" className="font-medium">
              My Profile
            </Button>
          </Link>
        )}
      </nav>
      <div className="flex items-center gap-3">
        <CustomConnectButton />
      </div>
    </header>
  );
}