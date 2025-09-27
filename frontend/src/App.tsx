import React from 'react';
import { WalletProvider } from './context/WalletContext';
import WalletConnect from './components/WalletConnect';
import TransactionForm from './components/TransactionForm';
import WalletGenerator from './components/WalletGenerator';
import WalletManager from './components/WalletManager';
import './App.css';

function App() {
  return (
    <WalletProvider>
      <div className="App">
        <header className="App-header">
          <h1>Solana Wallet Manager</h1>
          <p>Connect, manage, and send SOL transactions</p>
        </header>

        <main className="App-main">
          <div className="container">
            <section className="wallet-section">
              <WalletConnect />
            </section>

            <section className="transaction-section">
              <TransactionForm />
            </section>

            <section className="manager-section">
              <WalletManager />
            </section>

            <section className="generator-section">
              <WalletGenerator />
            </section>
          </div>
        </main>

        <footer className="App-footer">
          <p>Built with React, Node.js, and Solana Web3.js</p>
        </footer>
      </div>
    </WalletProvider>
  );
}

export default App;
