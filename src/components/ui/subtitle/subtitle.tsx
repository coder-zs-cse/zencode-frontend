import React from 'react';

interface SubtitleProps {
  text: string;
}

export const Subtitle: React.FC<SubtitleProps> = ({ text }) => (
  <p className="text-xl text-gray-300 max-w-2xl mx-auto">{text}</p>
);