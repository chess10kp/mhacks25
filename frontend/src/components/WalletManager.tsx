import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';

const WalletManager: React.FC = () => {
  const { 
    myWallets, 
    recipients, 
    saveMyWallet, 
    saveRecipient, 
    deleteWallet,
    connectMyWallet 
  } = useWallet();
  
  const [activeTab, setActiveTab] = useState<'my-wallets' | 'recipients'>('my-wallets');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    publicKey: '',
    privateKey: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'my-wallets') {
      if (!formData.name || !formData.publicKey || !formData.privateKey) {
        alert('Please fill in all fields');
        return;
      }
      saveMyWallet(formData.name, formData.publicKey, formData.privateKey);
    } else {
      if (!formData.name || !formData.publicKey) {
        alert('Please fill in name and public key');
        return;
      }
      saveRecipient(formData.name, formData.publicKey);
    }
    
    setFormData({ name: '', publicKey: '', privateKey: '' });
    setShowAddForm(false);
  };

  const handleConnectWallet = (publicKey: string) => {
    connectMyWallet(publicKey);
  };

  const handleDeleteWallet = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteWallet(id);
    }
  };

  return (
    <div className="wallet-manager">
      <h3>Wallet Manager</h3>
      
      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'my-wallets' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-wallets')}
        >
          My Wallets ({myWallets.length})
        </button>
        <button 
          className={`tab ${activeTab === 'recipients' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipients')}
        >
          Recipients ({recipients.length})
        </button>
      </div>

      {/* Add Button */}
      <button 
        className="add-button"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? 'Cancel' : `Add ${activeTab === 'my-wallets' ? 'My Wallet' : 'Recipient'}`}
      </button>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., My Main Wallet"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Public Key:</label>
            <input
              type="text"
              value={formData.publicKey}
              onChange={(e) => setFormData({...formData, publicKey: e.target.value})}
              placeholder="Enter public key"
              required
            />
          </div>
          
          {activeTab === 'my-wallets' && (
            <div className="form-group">
              <label>Private Key:</label>
              <input
                type="password"
                value={formData.privateKey}
                onChange={(e) => setFormData({...formData, privateKey: e.target.value})}
                placeholder="Enter private key"
                required
              />
            </div>
          )}
          
          <button type="submit" className="save-button">
            Save {activeTab === 'my-wallets' ? 'Wallet' : 'Recipient'}
          </button>
        </form>
      )}

      {/* Wallet Lists */}
      <div className="wallet-lists">
        {activeTab === 'my-wallets' && (
          <div className="wallet-list">
            {myWallets.length === 0 ? (
              <p className="empty-state">No wallets saved yet</p>
            ) : (
              myWallets.map((wallet) => (
                <div key={wallet.id} className="wallet-item">
                  <div className="wallet-info">
                    <div className="wallet-name">{wallet.name}</div>
                    <div className="wallet-address">
                      {wallet.publicKey.substring(0, 8)}...{wallet.publicKey.substring(-8)}
                    </div>
                  </div>
                  <div className="wallet-actions">
                    <button 
                      className="connect-btn"
                      onClick={() => handleConnectWallet(wallet.publicKey)}
                    >
                      Connect
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteWallet(wallet.id, wallet.name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'recipients' && (
          <div className="wallet-list">
            {recipients.length === 0 ? (
              <p className="empty-state">No recipients saved yet</p>
            ) : (
              recipients.map((recipient) => (
                <div key={recipient.id} className="wallet-item">
                  <div className="wallet-info">
                    <div className="wallet-name">{recipient.name}</div>
                    <div className="wallet-address">
                      {recipient.publicKey.substring(0, 8)}...{recipient.publicKey.substring(-8)}
                    </div>
                  </div>
                  <div className="wallet-actions">
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteWallet(recipient.id, recipient.name)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletManager;
