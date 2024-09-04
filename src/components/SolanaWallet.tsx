import { useState } from "react";
import nacl from "tweetnacl";
import { derivePath } from "ed25519-hd-key";
import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  TransactionConfirmationStrategy,
  Commitment,
} from "@solana/web3.js";
import { mnemonicToSeed } from "bip39";

interface SolanaWalletProps {
  mnemonic: string;
}

function SolanaWallet({ mnemonic }: SolanaWalletProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const [balances, setBalances] = useState<number[]>([]);

  const fetchBalance = async (publicKey: PublicKey) => {
    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const airdropSignature = await connection.requestAirdrop(
        publicKey,
        1 * LAMPORTS_PER_SOL
      );
      const strategy: TransactionConfirmationStrategy = {
        signature: airdropSignature,
        blockhash: await connection
          .getLatestBlockhash()
          .then((bh) => bh.blockhash),
        lastValidBlockHeight: await connection
          .getLatestBlockhash()
          .then((bh) => bh.lastValidBlockHeight),
      };

      const confirmation = await connection.confirmTransaction(
        strategy,
        "finalized" as Commitment
      );
      const balance = await connection.getBalance(publicKey);
      return balance / 1e9;
    } catch (error) {
      console.error("Failed to fetch balance");
      return 0;
    }
  };

  const handleAddWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);

      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
      const keypair = Keypair.fromSecretKey(keyPair.secretKey);
      const balance = await fetchBalance(keypair.publicKey);
      setPublicKeys([...publicKeys, keypair.publicKey.toBase58()]);
      setCurrentIndex(currentIndex + 1);
      setBalances([...balances, balance || 0]);
    } catch (error) {
      console.error("Error while generating wallet");
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <button
        onClick={handleAddWallet}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Add SOL Wallet
      </button>
      {publicKeys.map((key, index) => (
        <div key={index} className="mt-2 p-2 border-b border-gray-200">
          Sol - {key} - Balance: {balances[index]} SOL
        </div>
      ))}
    </div>
  );
}

export default SolanaWallet;
