"use client";

type ErrorMessageProps = {
  message: string;
  className?: string;
};

export default function ErrorMessage({
  message,
  className = "",
}: ErrorMessageProps) {
  return (
    <p className={`text-sm text-[#FF6B6B] mt-1.5 ${className}`}>
      {message}
    </p>
  );
}
