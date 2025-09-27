import React from 'react';
import { useWallet } from '../context/WalletContext';

const WalletConnect: React.FC = () => {
  const { connected, publicKey, balance, connect, disconnect, refreshBalance, loading } = useWallet();

  return (
    <div className="wallet-connect">
      {!connected ? (
        <button 
          onClick={connect}
          className="connect-button"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <div className="wallet-details">
            <p><strong>Public Key:</strong> {publicKey}</p>
            <p><strong>Balance:</strong> {
              loading ? 'Loading...' : 
              balance !== null ? `${balance.toFixed(6)} SOL` : 
              'Unable to fetch balance'
            }</p>
          </div>
          <div className="wallet-actions">
            <button 
              onClick={refreshBalance} 
              className="refresh-button"
              disabled={loading}
            >
              {loading ? 'Refreshing...' : 'Refresh Balance'}
            </button>
            <button onClick={disconnect} className="disconnect-button">
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
