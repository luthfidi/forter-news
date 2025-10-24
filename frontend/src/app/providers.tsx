'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { baseSepolia } from 'viem/chains';

import { config } from '@/lib/wagmi';
import { FarcasterProvider } from '@/contexts/FarcasterProvider';
import '@coinbase/onchainkit/styles.css';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FarcasterProvider>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          loginMethods: ['email', 'wallet', 'sms'],
          appearance: {
            theme: 'dark',
            accentColor: '#676FFF',
          },
          defaultChain: baseSepolia,
          supportedChains: [baseSepolia],
        }}
      >
        <QueryClientProvider client={queryClient}>
          <WagmiProvider config={config}>
            {children}
          </WagmiProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </FarcasterProvider>
  );
}