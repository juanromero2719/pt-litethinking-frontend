"use client";

import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  required?: boolean;
};

export default function FormField({
  label,
  error,
  required = false,
  id,
  ...inputProps
}: FormFieldProps) {
  const fieldId = id || `field-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={fieldId} required={required}>
        {label}
      </Label>
      <Input
        id={fieldId}
        error={!!error}
        {...inputProps}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
