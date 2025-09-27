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
	const walletKeys = Keypair.fromSecretKey(new Uint8Array(bs58.decode(privateKey)));
	return walletKeys;
}
const conn = new Connection(
	'https://solana-mainnet.core.chainstack.com/30293c317804abfceffade57fd480b56',
	{ wsEndpoint: 'wss://solana-mainnet.core.chainstack.com/30293c317804abfceffade57fd480b56' }
);

export async function main() {}

export async function balance(address: string): Promise<number> {
	let balance: number = await conn.getBalance(new PublicKey(address));
	return balance / LAMPORTS_PER_SOL;
}

export function makeWalletKeys(): Keypair {
	return Keypair.generate();
}

export async function sendSolana(fromPriv: string, toPub: string, amt: number) {
	const senderKeys = getKeyPair(fromPriv);
	const transaction = new Transaction().add(
		SystemProgram.transfer({
			fromPubkey: senderKeys.publicKey,
			toPubkey: new PublicKey(toPub),
			lamports: LAMPORTS_PER_SOL * amt
		})
	);

	const signature = await sendAndConfirmTransaction(conn, transaction, [senderKeys]);
}
