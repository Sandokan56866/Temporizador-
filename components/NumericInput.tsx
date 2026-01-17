
import React from 'react';

interface NumericInputProps {
  value: number;
  onChange: (val: number) => void;
  max: number;
  label: string;
  disabled: boolean;
}

const NumericInput: React.FC<NumericInputProps> = ({ value, onChange, max, label, disabled }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      onChange(0);
    } else {
      onChange(Math.min(Math.max(val, 0), max));
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        type="number"
        value={value === 0 ? "" : value}
        onChange={handleChange}
        placeholder="00"
        disabled={disabled}
        className={`
          w-24 h-24 text-center text-4xl font-bold bg-black border-4 rounded-xl outline-none
          ${disabled 
            ? 'border-gray-800 text-gray-800' 
            : 'border-yellow-400 text-yellow-400 focus:shadow-[0_0_20px_rgba(250,204,21,0.5)]'}
        `}
      />
      <span className={`text-xs font-bold uppercase ${disabled ? 'text-gray-800' : 'text-yellow-400'}`}>
        {label}
      </span>
    </div>
  );
};

export default NumericInput;
