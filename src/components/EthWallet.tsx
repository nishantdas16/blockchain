import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet, JsonRpcProvider, formatEther } from "ethers";

interface EthWalletProps {
  mnemonic: string;
}

function EthWallet({ mnemonic }: EthWalletProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [publicKeys, setPublicKeys] = useState<string[]>([]);
  const [balances, setBalances] = useState<number[]>([]);

  const addWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);
      const address = wallet.address;
      const balanceInEth = await fetchBalance(address);
      setPublicKeys((prevPublicKeys) => [...prevPublicKeys, address]);
      setBalances((prevBalances) => [...prevBalances, balanceInEth]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error("Error adding ETH wallet");
    }
  };

  const fetchBalance = async (address: string) => {
    try {
      const provider = new JsonRpcProvider(
        "https://mainnet.infura.io/v3/53c82badb1604bae83491fc748bebd42"
      );
      const ethBalance = await provider.getBalance(address);
      return parseFloat(formatEther(ethBalance));
    } catch (error) {
      console.error("Error fetching balance");
      return 0;
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <button
        onClick={addWallet}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add ETH Wallet
      </button>
      {publicKeys.map((publicKey, index) => (
        <div key={index} className="mt-2 p-2 border-b border-gray-200">
          Eth - {publicKey} - Balance: {balances[index]} ETH
        </div>
      ))}
    </div>
  );
}

export default EthWallet;
