import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { api } from '../services/api';

const TransactionForm: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      setMessage('Please connect your wallet first');
      return;
    }

    if (!toAddress || !amount || !privateKey) {
      setMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const result = await api.sendTransaction({
        fromPrivateKey: privateKey,
        toPublicKey: toAddress,
        amount: parseFloat(amount),
      });

      setMessage(`Transaction successful! ${result.message}`);
      setToAddress('');
      setAmount('');
      setPrivateKey('');
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="transaction-form">
        <h3>Send SOL</h3>
        <p>Please connect your wallet to send transactions</p>
      </div>
    );
  }

  return (
    <div className="transaction-form">
      <h3>Send SOL</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="toAddress">To Address:</label>
          <input
            type="text"
            id="toAddress"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
            placeholder="Enter recipient's public key"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (SOL):</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            step="0.000000001"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="privateKey">Private Key:</label>
          <input
            type="password"
            id="privateKey"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Enter your private key"
            required
          />
        </div>

        <button type="submit" disabled={loading} className="send-button">
          {loading ? 'Sending...' : 'Send SOL'}
        </button>

        {message && (
          <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default TransactionForm;
