import React from 'react';
import { Sparkles } from 'lucide-react';

interface ButtonProps {
  onClick: (e: any) => void;
}

export const Button: React.FC<ButtonProps> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-4 bottom-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
  >
    <Sparkles size={20} />
    Generate
  </button>
);