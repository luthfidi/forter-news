'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';
import { baseSepolia } from 'viem/chains';

import { config } from '@/lib/wagmi';
import '@coinbase/onchainkit/styles.css';

const queryClient = new QueryClient();

function MiniAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize MiniApp SDK when app is ready (optional)
    const initializeMiniApp = async () => {
      try {
        // Dynamic import to make it optional
        const { sdk } = await import('@farcaster/miniapp-sdk');

        // Wait for the app to be fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));

        // Signal that the app is ready to be displayed
        await sdk.actions.ready();

        console.log('🎯 Forter MiniApp ready!');
      } catch (error) {
        console.warn('MiniApp SDK not available or initialization failed:', error);
        // App will still work normally if not in MiniApp context
      }
    };

    initializeMiniApp();
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
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
          <MiniAppProvider>
            {children}
          </MiniAppProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}