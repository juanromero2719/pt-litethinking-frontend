"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
};

export default function Button({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-[#4A90E2] text-white hover:bg-[#3B7BC8] active:bg-[#2D5FA0] disabled:bg-[#ADB5BD] disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:ring-[#4A90E2]",
    secondary: "bg-[#F8F9FA] text-[#2C3E50] border border-[#E1E8ED] hover:bg-[#F1F3F5] active:bg-[#E9ECEF] disabled:bg-[#F8F9FA] disabled:text-[#ADB5BD] disabled:cursor-not-allowed focus:ring-[#CED4DA]",
    danger: "bg-[#FF6B6B] text-white hover:bg-[#FF5252] active:bg-[#FF3838] disabled:bg-[#FFB3B3] disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:ring-[#FF6B6B]",
    ghost: "bg-transparent text-[#4A90E2] hover:bg-[#E8F4FD] active:bg-[#B8DFF8] disabled:text-[#ADB5BD] disabled:cursor-not-allowed focus:ring-[#4A90E2]",
  };

  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-2.5 text-base",
    large: "px-8 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
