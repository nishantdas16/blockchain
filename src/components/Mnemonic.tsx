import { useState } from "react";
import { generateMnemonic } from "bip39";

interface MnemonicProps {
  setMnemonic: React.Dispatch<React.SetStateAction<string>>;
}

function Mnemonic({ setMnemonic }: MnemonicProps) {
  const [mnemonic, setLocalMnemonic] = useState<string>("");

  const handleGenerateMnemonic = async () => {
    const mnem = await generateMnemonic();
    setMnemonic(mnem);
    setLocalMnemonic(mnem);
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <Button onClick={handleGenerateMnemonic}>Generate Seed Phrase</Button>
      <input
        type="text"
        value={mnemonic}
        readOnly
        className="mt-2 w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  );
}

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

function Button({ onClick, children }: ButtonProps) {
  return (
    <div>
      <button
        onClick={onClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {children}
      </button>
    </div>
  );
}

export default Mnemonic;
