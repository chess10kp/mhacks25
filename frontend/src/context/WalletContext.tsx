import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface WalletContextType {
  connected: boolean;
  publicKey: string | null;
  balance: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  loading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    try {
      // For demo purposes, we'll use a simple prompt
      // In a real app, you'd integrate with wallet adapters
      const input = prompt('Enter your wallet public key:');
      if (input) {
        setPublicKey(input);
        setConnected(true);
        setLoading(true);
        await refreshBalance();
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setLoading(false);
    }
  };

  const disconnect = () => {
    setConnected(false);
    setPublicKey(null);
    setBalance(null);
    setLoading(false);
  };

  const refreshBalance = async () => {
    if (publicKey) {
      try {
        console.log('Fetching balance for:', publicKey);
        const response = await api.getBalance(publicKey);
        console.log('Balance response:', response);
        setBalance(response.balance);
      } catch (error) {
        console.error('Failed to get balance:', error);
        setBalance(0);
      }
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      refreshBalance();
    }
  }, [connected, publicKey]);

  return (
    <WalletContext.Provider
      value={{
        connected,
        publicKey,
        balance,
        connect,
        disconnect,
        refreshBalance,
        loading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
