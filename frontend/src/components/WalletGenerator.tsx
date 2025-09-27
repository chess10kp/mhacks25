import React, { useState } from 'react';
import { api } from '../services/api';

const WalletGenerator: React.FC = () => {
  const [generatedWallet, setGeneratedWallet] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const generateWallet = async () => {
    setLoading(true);
    try {
      const wallet = await api.generateWallet();
      setGeneratedWallet(wallet);
    } catch (error) {
      console.error('Failed to generate wallet:', error);
      alert('Failed to generate wallet');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="wallet-generator">
      <h3>Generate New Wallet</h3>
      <button onClick={generateWallet} disabled={loading} className="generate-button">
        {loading ? 'Generating...' : 'Generate Wallet'}
      </button>

      {generatedWallet && (
        <div className="generated-wallet">
          <div className="wallet-field">
            <label>Public Key:</label>
            <div className="field-container">
              <input
                type="text"
                value={generatedWallet.publicKey}
                readOnly
                className="wallet-input"
              />
              <button
                onClick={() => copyToClipboard(generatedWallet.publicKey, 'public')}
                className="copy-button"
              >
                {copied === 'public' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="wallet-field">
            <label>Private Key:</label>
            <div className="field-container">
              <input
                type="password"
                value={generatedWallet.privateKey}
                readOnly
                className="wallet-input"
              />
              <button
                onClick={() => copyToClipboard(generatedWallet.privateKey, 'private')}
                className="copy-button"
              >
                {copied === 'private' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="warning">
            <strong>⚠️ Important:</strong> Save your private key securely. Anyone with access to your private key can control your wallet.
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletGenerator;
