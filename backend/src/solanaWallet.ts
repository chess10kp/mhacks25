import {
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
	Transaction,
	SystemProgram,
	sendAndConfirmTransaction
} from '@solana/web3.js';
import bs58 from 'bs58';

export function getKeyPair(privateKey: string): Keypair {
	try {
		// Try base58 format first
		const walletKeys = Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKey)));
		return walletKeys;
	} catch (error) {
		try {
			// Try base64 format
			const decoded = Buffer.from(privateKey, 'base64');
			const walletKeys = Keypair.fromSecretKey(new Uint8Array(decoded));
			return walletKeys;
		} catch (error2) {
			try {
				// Try JSON array format
				const keyArray = JSON.parse(privateKey);
				const walletKeys = Keypair.fromSecretKey(new Uint8Array(keyArray));
				return walletKeys;
			} catch (error3) {
				throw new Error('Invalid private key format. Please use base58, base64, or JSON array format.');
			}
		}
	}
}

// Use public Solana RPC endpoint
const conn = new Connection('https://api.mainnet-beta.solana.com');

export async function main() {}

export async function balance(address: string): Promise<number> {
	try {
		console.log('Getting balance for address:', address);
		const balance = await conn.getBalance(new PublicKey(address));
		console.log('Raw balance (lamports):', balance);
		const solBalance = balance / LAMPORTS_PER_SOL;
		console.log('SOL balance:', solBalance);
		return solBalance;
	} catch (error) {
		console.error('Error getting balance:', error);
		throw error;
	}
}

export function makeWalletKeys(): Keypair {
	return Keypair.generate();
}

export async function sendSolana(fromPriv: string, toPub: string, amt: number) {
	try {
		console.log('Sending SOL transaction...');
		console.log('From private key (first 10 chars):', fromPriv.substring(0, 10) + '...');
		console.log('To public key:', toPub);
		console.log('Amount:', amt, 'SOL');
		
		const senderKeys = getKeyPair(fromPriv);
		const recipientPubkey = new PublicKey(toPub);
		
		// Check sender's balance first
		const senderBalance = await conn.getBalance(senderKeys.publicKey);
		console.log('Sender balance (lamports):', senderBalance);
		
		// Check if recipient account exists
		const recipientInfo = await conn.getAccountInfo(recipientPubkey);
		const recipientExists = recipientInfo !== null;
		console.log('Recipient account exists:', recipientExists);
		
		// Convert SOL to lamports with proper integer conversion
		const lamportsToSend = Math.floor(amt * LAMPORTS_PER_SOL);
		console.log('Lamports to send:', lamportsToSend);
		
		// Calculate minimum balance for rent exemption (0.00089088 SOL)
		const rentExemption = await conn.getMinimumBalanceForRentExemption(0);
		console.log('Rent exemption required:', rentExemption, 'lamports');
		
		// Estimate transaction fee (typically 5000 lamports = 0.000005 SOL)
		const estimatedFee = 5000;
		
		// If recipient doesn't exist, we need to send enough for rent exemption
		const totalRequired = recipientExists ? 
			lamportsToSend + estimatedFee : 
			lamportsToSend + rentExemption + estimatedFee;
		
		console.log('Total required (including fee and rent):', totalRequired, 'lamports');
		console.log('Available balance:', senderBalance, 'lamports');
		
		if (senderBalance < totalRequired) {
			const availableSOL = senderBalance / LAMPORTS_PER_SOL;
			const requiredSOL = totalRequired / LAMPORTS_PER_SOL;
			throw new Error(`Insufficient balance. Available: ${availableSOL.toFixed(6)} SOL, Required: ${requiredSOL.toFixed(6)} SOL (including transaction fee${!recipientExists ? ' and rent exemption' : ''})`);
		}
		
		// Create the transfer transaction
		const transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: senderKeys.publicKey,
				toPubkey: recipientPubkey,
				lamports: lamportsToSend
			})
		);

		const signature = await sendAndConfirmTransaction(conn, transaction, [senderKeys]);
		console.log('Transaction successful:', signature);
		return signature;
	} catch (error) {
		console.error('Error sending SOL:', error);
		throw error;
	}
}
