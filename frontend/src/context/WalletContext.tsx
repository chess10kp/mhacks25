import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface SavedWallet {
  id: string;
  name: string;
  publicKey: string;
  privateKey: string;
  type: 'my-wallet' | 'recipient';
  createdAt: string;
}

interface WalletContextType {
  connected: boolean;
  publicKey: string | null;
  balance: number | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  loading: boolean;
  myWallets: SavedWallet[];
  recipients: SavedWallet[];
  saveMyWallet: (name: string, publicKey: string, privateKey: string) => void;
  saveRecipient: (name: string, publicKey: string) => void;
  deleteWallet: (id: string) => void;
  connectMyWallet: (publicKey: string) => Promise<void>;
  getWalletPrivateKey: (publicKey: string) => string | null;
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
  const [myWallets, setMyWallets] = useState<SavedWallet[]>([]);
  const [recipients, setRecipients] = useState<SavedWallet[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load saved wallets and connected wallet from localStorage on mount
  useEffect(() => {
    console.log('Loading wallets from localStorage...');
    
    try {
      const savedMyWallets = localStorage.getItem('myWallets');
      const savedRecipients = localStorage.getItem('recipients');
      const savedConnectedWallet = localStorage.getItem('connectedWallet');
      
      if (savedMyWallets) {
        const parsed = JSON.parse(savedMyWallets);
        console.log('Loaded my wallets:', parsed);
        setMyWallets(parsed);
      }
      
      if (savedRecipients) {
        const parsed = JSON.parse(savedRecipients);
        console.log('Loaded recipients:', parsed);
        setRecipients(parsed);
      }

      // Auto-reconnect to last connected wallet
      if (savedConnectedWallet) {
        console.log('Auto-reconnecting to saved wallet:', savedConnectedWallet);
        setPublicKey(savedConnectedWallet);
        setConnected(true);
      }
    } catch (error) {
      console.error('Failed to load wallets from localStorage:', error);
    } finally {
      setInitialized(true);
    }
  }, []);

  // Save connected wallet to localStorage
  useEffect(() => {
    if (publicKey) {
      localStorage.setItem('connectedWallet', publicKey);
    } else {
      localStorage.removeItem('connectedWallet');
    }
  }, [publicKey]);

  // Save wallets to localStorage whenever they change
  useEffect(() => {
    if (initialized) {
      console.log('Saving my wallets to localStorage:', myWallets);
      localStorage.setItem('myWallets', JSON.stringify(myWallets));
    }
  }, [myWallets, initialized]);

  useEffect(() => {
    if (initialized) {
      console.log('Saving recipients to localStorage:', recipients);
      localStorage.setItem('recipients', JSON.stringify(recipients));
    }
  }, [recipients, initialized]);

  const connect = async () => {
    try {
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

  const connectMyWallet = async (publicKey: string) => {
    try {
      console.log('Connecting to saved wallet:', publicKey);
      setPublicKey(publicKey);
      setConnected(true);
      setLoading(true);
      await refreshBalance();
      setLoading(false);
    } catch (error) {
      console.error('Failed to connect saved wallet:', error);
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
        // Don't set balance to 0 on error, keep previous value
        console.log('Balance fetch failed, keeping previous balance');
      }
    }
  };

  const saveMyWallet = (name: string, publicKey: string, privateKey: string) => {
    const newWallet: SavedWallet = { 
      id: Date.now().toString(),
      name, 
      publicKey, 
      privateKey, 
      type: 'my-wallet',
      createdAt: new Date().toISOString()
    };
    console.log('Saving my wallet:', newWallet);
    setMyWallets(prev => {
      const updated = [...prev, newWallet];
      console.log('Updated my wallets:', updated);
      return updated;
    });
  };

  const saveRecipient = (name: string, publicKey: string) => {
    const newRecipient: SavedWallet = { 
      id: Date.now().toString(),
      name, 
      publicKey, 
      privateKey: '', // Recipients don't have private keys
      type: 'recipient',
      createdAt: new Date().toISOString()
    };
    console.log('Saving recipient:', newRecipient);
    setRecipients(prev => {
      const updated = [...prev, newRecipient];
      console.log('Updated recipients:', updated);
      return updated;
    });
  };

  const deleteWallet = (id: string) => {
    console.log('Deleting wallet with id:', id);
    setMyWallets(prev => {
      const updated = prev.filter(wallet => wallet.id !== id);
      console.log('Updated my wallets after delete:', updated);
      return updated;
    });
    setRecipients(prev => {
      const updated = prev.filter(wallet => wallet.id !== id);
      console.log('Updated recipients after delete:', updated);
      return updated;
    });
  };

  const getWalletPrivateKey = (publicKey: string): string | null => {
    const wallet = myWallets.find(w => w.publicKey === publicKey);
    return wallet ? wallet.privateKey : null;
  };

  useEffect(() => {
    if (connected && publicKey) {
      console.log('Wallet connected, refreshing balance...');
      refreshBalance();
    }
  }, [connected, publicKey]);

  // Don't render until initialized to prevent flash
  if (!initialized) {
    return (
      <WalletContext.Provider
        value={{
          connected: false,
          publicKey: null,
          balance: null,
          connect: async () => {},
          disconnect: () => {},
          refreshBalance: async () => {},
          loading: true,
          myWallets: [],
          recipients: [],
          saveMyWallet: () => {},
          saveRecipient: () => {},
          deleteWallet: () => {},
          connectMyWallet: async () => {},
          getWalletPrivateKey: () => null,
        }}
      >
        {children}
      </WalletContext.Provider>
    );
  }

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
        myWallets,
        recipients,
        saveMyWallet,
        saveRecipient,
        deleteWallet,
        connectMyWallet,
        getWalletPrivateKey,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
