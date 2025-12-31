"use client";

import { LabelHTMLAttributes, ReactNode } from "react";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
  required?: boolean;
};

export default function Label({
  children,
  required = false,
  className = "",
  ...props
}: LabelProps) {
  return (
    <label
      className={`block text-sm font-medium text-[#2C3E50] mb-1.5 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-[#FF6B6B] ml-1">*</span>}
    </label>
  );
}
