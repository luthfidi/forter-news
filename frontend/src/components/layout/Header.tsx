"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from 'next/navigation'
import { useAccount } from 'wagmi'
import { Wallet } from '@coinbase/onchainkit/wallet'

export default function Header() {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()

  const isNewsActive = pathname?.startsWith('/news')
  const isAnalystsActive = pathname?.startsWith('/analysts')
  const isMyProfile = isConnected && address && pathname === `/profile/${address}`

  const navigation = [
    { name: "News", href: "/news", active: isNewsActive },
    { name: "Analysts", href: "/analysts", active: isAnalystsActive },
  ]

  if (isConnected && address) {
    navigation.push({
      name: "My Profile",
      href: `/profile/${address}`,
      active: isMyProfile || false
    })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <nav className="bg-background/20 backdrop-blur-xl border border-border/30 rounded-2xl px-4 py-2 shadow-lg">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image
                src="/forter.webp"
                alt="FORTER"
                width={32}
                height={32}
                className="w-12 h-12 rounded-lg"
              />
              <span className="font-mono text-xl font-bold tracking-wide text-foreground">
                FORTER
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${item.active
                    ? 'text-foreground bg-primary/10'
                    : 'text-foreground/70 hover:text-foreground hover:bg-background/20'
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Connect Wallet - Desktop */}
            <div className="hidden md:block">
              <Wallet />
            </div>

            {/* Connect Wallet - Mobile */}
            <div className="md:hidden">
              <Wallet />
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}