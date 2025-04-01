import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export const Loader = ({ size = "md", className = "" }: LoaderProps) => {
  return (
    <div
      className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 ${sizeMap[size]} ${className}`}
    />
  );
}; 