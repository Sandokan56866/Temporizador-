
import React from 'react';

interface QuickButtonProps {
  label: string;
  seconds: number;
  onClick: (s: number) => void;
  disabled?: boolean;
}

const QuickButton: React.FC<QuickButtonProps> = ({ label, seconds, onClick, disabled }) => {
  return (
    <button
      onClick={() => onClick(seconds)}
      disabled={disabled}
      className={`
        flex-1 py-6 px-4 text-2xl font-black uppercase transition-all active:scale-95
        border-4 rounded-2xl
        ${disabled 
          ? 'border-gray-800 text-gray-800 cursor-not-allowed' 
          : 'border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]'}
      `}
    >
      {label}
    </button>
  );
};

export default QuickButton;
