import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bs58 from 'bs58';
import { balance, sendSolana, makeWalletKeys } from './solanaWallet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Solana Wallet API is running' });
});

// Get wallet balance
app.post('/api/balance', async (req, res) => {
  try {
    const { address } = req.body;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }
    
    const walletBalance = await balance(address);
    res.json({ balance: walletBalance, address });
  } catch (error) {
    console.error('Error getting balance:', error);
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

// Send SOL
app.post('/api/send', async (req, res) => {
  try {
    const { fromPrivateKey, toPublicKey, amount } = req.body;
    
    if (!fromPrivateKey || !toPublicKey || !amount) {
      return res.status(400).json({ 
        error: 'fromPrivateKey, toPublicKey, and amount are required' 
      });
    }
    
    const signature = await sendSolana(fromPrivateKey, toPublicKey, amount);
    res.json({ 
      success: true, 
      message: 'Transaction sent successfully',
      signature,
      from: fromPrivateKey.substring(0, 10) + '...',
      to: toPublicKey,
      amount 
    });
  } catch (error) {
    console.error('Error sending SOL:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to send SOL: ${errorMessage}` });
  }
});

// Generate new wallet
app.get('/api/generate-wallet', (req, res) => {
  try {
    const newWallet = makeWalletKeys();
    res.json({
      publicKey: newWallet.publicKey.toString(),
      privateKey: bs58.encode(newWallet.secretKey) // Return in base58 format
    });
  } catch (error) {
    console.error('Error generating wallet:', error);
    res.status(500).json({ error: 'Failed to generate wallet' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
