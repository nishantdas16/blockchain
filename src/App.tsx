import { useState } from "react";
import Mnemonic from "./components/Mnemonic";
import SolanaWallet from "./components/SolanaWallet";
import EthWallet from "./components/EthWallet";
import "./index.css";
import "./App.css";

function App() {
  const [mnemonic, setMnemonic] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <Mnemonic setMnemonic={setMnemonic} />
        <div className="mt-8">
          <SolanaWallet mnemonic={mnemonic} />
        </div>
        <div className="mt-8">
          <EthWallet mnemonic={mnemonic} />
        </div>
      </div>
    </div>
  );
}

export default App;
