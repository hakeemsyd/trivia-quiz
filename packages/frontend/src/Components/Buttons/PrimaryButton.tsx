import { FC, ReactNode } from 'react';

interface PrimaryButtonProps {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

const PrimaryButton: FC<PrimaryButtonProps> = ({ disabled, onClick, children, className = '' }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`h-10 px-6 text-sm font-medium transition duration-200 !rounded-none 
      ${disabled ? '!bg-blue-300 text-white !cursor-not-allowed' : '!bg-blue-600 text-white hover:bg-blue-700'} 
      ${className}`}
  >
    {children}
  </button>
);

export default PrimaryButton;
