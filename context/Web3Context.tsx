"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { HashConnect, HashConnectTypes } from 'hashconnect';
import { WagmiProvider, createConfig, http, useAccount, useConnect, useDisconnect } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

interface Web3ContextType {
  address: string | undefined;
  isConnected: boolean;
  walletType: 'metamask' | 'hashpack' | null;
  connectMetaMask: () => void;
  connectHashPack: () => void;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const appMetadata: HashConnectTypes.AppMetadata = {
  name: "CREDO Hedera DeFi",
  description: "Stability through Reputation. Developed by Viqtorhvayx.",
  icons: ["https://www.hashpack.app/img/logo.svg"],
  url: typeof window !== 'undefined' ? window.location.origin : '',
};

const Web3ProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletType, setWalletType] = useState<'metamask' | 'hashpack' | null>(null);
  const [hashConnect, setHashConnect] = useState<HashConnect | null>(null);
  const [hpData, setHpData] = useState<any>(null);

  // Wagmi (MetaMask)
  const { address: mmAddress, isConnected: isMMConnected } = useAccount();
  const { connect: connectMM, connectors } = useConnect();
  const { disconnect: disconnectMM } = useDisconnect();

  useEffect(() => {
    const initHashConnect = async () => {
      try {
        const hc = new HashConnect(true);
        await hc.init(appMetadata, "testnet", false);
        setHashConnect(hc);

        hc.pairingEvent.on((data) => {
          setHpData(data);
          setWalletType('hashpack');
        });
      } catch (e) {
        console.error("HashConnect init error", e);
      }
    };

    initHashConnect();
  }, []);

  const connectMetaMask = () => {
    const connector = connectors.find(c => c.name === 'MetaMask' || c.name === 'Injected');
    if (connector) {
      connectMM({ connector });
      setWalletType('metamask');
    }
  };

  const connectHashPack = async () => {
    if (hashConnect) {
      hashConnect.connectToLocalWallet();
    }
  };

  const disconnect = () => {
    if (walletType === 'metamask') {
      disconnectMM();
    } else if (walletType === 'hashpack' && hashConnect) {
      hashConnect.clearConnectionsAndData();
      setHpData(null);
    }
    setWalletType(null);
  };

  const address = walletType === 'metamask' ? mmAddress : hpData?.accountIds?.[0];
  const isConnected = walletType === 'metamask' ? isMMConnected : !!hpData;

  return (
    <Web3Context.Provider value={{ address, isConnected, walletType, connectMetaMask, connectHashPack, disconnect }}>
      {children}
    </Web3Context.Provider>
  );
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3ProviderInner>{children}</Web3ProviderInner>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3ProviderInner');
  }
  return context;
};
