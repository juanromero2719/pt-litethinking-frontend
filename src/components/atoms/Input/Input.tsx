"use client";

import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export default function Input({
  className = "",
  error = false,
  ...props
}: InputProps) {
  const baseStyles = "w-full px-4 py-3 bg-white border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 text-[#2C3E50] placeholder:text-[#ADB5BD]";
  
  const stateStyles = error
    ? "border-[#FF6B6B] focus:border-[#FF6B6B] focus:ring-[#FFE3E3]"
    : "border-[#E1E8ED] focus:border-[#4A90E2] focus:ring-[#E8F4FD] hover:border-[#CED4DA]";

  return (
    <input
      className={`${baseStyles} ${stateStyles} ${className}`}
      {...props}
    />
  );
}
