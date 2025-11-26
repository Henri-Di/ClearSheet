import { type ReactNode } from "react";

interface Props {
  label: string;
  icon?: ReactNode;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function InputField({ label, icon, value, onChange, placeholder }: Props) {
  return (
    <div className="space-y-1">
      <label
        className="
          text-sm font-medium 
          text-[#2F2F36] 
          dark:text-gray-200
        "
      >
        {label}
      </label>

      <div
        className="
          flex items-center gap-3
          bg-white dark:bg-dark-input
          border border-[#E6E1F7] dark:border-dark-border
          rounded-2xl px-4 py-3 shadow-sm
          focus-within:ring-2 focus-within:ring-[#7B61FF]
          transition-colors
        "
      >
        {icon && (
          <div className="text-gray-400 dark:text-gray-300">
            {icon}
          </div>
        )}

        <input
          className="
            w-full outline-none bg-transparent text-sm
            text-[#2F2F36] dark:text-gray-200
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          "
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
