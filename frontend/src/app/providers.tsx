'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { sdk } from '@farcaster/miniapp-sdk';

import { config } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

function MiniAppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize MiniApp SDK when app is ready
    const initializeMiniApp = async () => {
      try {
        // Wait for the app to be fully loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Signal that the app is ready to be displayed
        await sdk.actions.ready();
        
        console.log('🎯 Forter MiniApp ready!');
      } catch (error) {
        console.warn('MiniApp SDK initialization failed:', error);
        // App will still work normally if not in MiniApp context
      }
    };

    initializeMiniApp();
  }, []);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MiniAppProvider>
            {children}
          </MiniAppProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}