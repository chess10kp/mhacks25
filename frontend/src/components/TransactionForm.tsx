import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { api } from '../services/api';

const TransactionForm: React.FC = () => {
  const { 
    connected, 
    publicKey, 
    balance, 
    refreshBalance, 
    recipients, 
    getWalletPrivateKey 
  } = useWallet();
  
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showRecipients, setShowRecipients] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      setMessage('Please connect your wallet first');
      return;
    }

    if (!toAddress || !amount) {
      setMessage('Please fill in all fields');
      return;
    }

    // Get private key from connected wallet
    const privateKey = getWalletPrivateKey(publicKey!);
    if (!privateKey) {
      setMessage('Private key not found for connected wallet');
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
      
      // Auto-refresh balance after successful transaction
      await refreshBalance();
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePercentageClick = (percentage: number) => {
    if (balance !== null) {
      const calculatedAmount = (balance * percentage / 100).toFixed(6);
      setAmount(calculatedAmount);
    }
  };

  const handleMaxClick = () => {
    if (balance !== null) {
      // Leave a small amount for transaction fees (0.00001 SOL)
      const maxAmount = Math.max(0, balance - 0.00001);
      setAmount(maxAmount.toFixed(6));
    }
  };

  const handleRecipientSelect = (publicKey: string) => {
    setToAddress(publicKey);
    setShowRecipients(false);
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
          <div className="address-input-group">
            <input
              type="text"
              id="toAddress"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="Enter recipient's public key"
              required
            />
            {recipients.length > 0 && (
              <button 
                type="button"
                onClick={() => setShowRecipients(!showRecipients)}
                className="recipients-button"
              >
                Recipients ({recipients.length})
              </button>
            )}
          </div>
          
          {showRecipients && recipients.length > 0 && (
            <div className="recipients-dropdown">
              {recipients.map((recipient) => (
                <div 
                  key={recipient.id}
                  className="recipient-item"
                  onClick={() => handleRecipientSelect(recipient.publicKey)}
                >
                  <div className="recipient-name">{recipient.name}</div>
                  <div className="recipient-address">
                    {recipient.publicKey.substring(0, 8)}...{recipient.publicKey.substring(-8)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (SOL):</label>
          <div className="amount-input-group">
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
            <button 
              type="button" 
              onClick={handleMaxClick}
              className="max-button"
            >
              MAX
            </button>
          </div>
          
          {/* Percentage buttons */}
          <div className="percentage-buttons">
            <button type="button" onClick={() => handlePercentageClick(25)} className="percentage-btn">25%</button>
            <button type="button" onClick={() => handlePercentageClick(50)} className="percentage-btn">50%</button>
            <button type="button" onClick={() => handlePercentageClick(75)} className="percentage-btn">75%</button>
            <button type="button" onClick={() => handlePercentageClick(100)} className="percentage-btn">100%</button>
          </div>
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
