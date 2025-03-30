'use client'
import React from 'react';
interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({ value, onChange, placeholder, onKeyDown }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    onKeyDown={onKeyDown}
    className="w-full h-24 px-4 py-3 bg-gray-800 text-white placeholder-gray-400 resize-none"
  />
);