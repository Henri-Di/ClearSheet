import type { JSX } from "react";

interface InputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: JSX.Element;
  disabled?: boolean;
  placeholder?: string;
}

export function Input({ label, value, onChange, type = "text", icon, disabled = false, placeholder }: InputProps) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
        {icon}
        <input
          type={type}
          className="w-full bg-transparent outline-none"
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
