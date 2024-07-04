// components/CopyToClipboardButton.tsx
import { useState } from 'react';
import copy from 'clipboard-copy';

const CopyToClipboardButton = ({ text }: { text: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await copy(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000); // Reset copy status after 3 seconds
    } catch (error) {
      console.error('Failed to copy text to clipboard', error);
    }
  };

  return (
    <div>
      <button
        onClick={handleCopyClick}
        className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isCopied ? 'Copied!' : 'Copy to Clipboard'}
      </button>
    </div>
  );
};

export default CopyToClipboardButton;
