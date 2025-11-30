import type { JSX } from "react";

interface InputProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  icon?: JSX.Element;
  disabled?: boolean;
  placeholder?: string;
}

export function Input({
  label = "",
  value,
  onChange,
  type = "text",
  icon,
  disabled = false,
  placeholder,
}: InputProps) {
  return (
    <div className="w-full">

      {label && (
        <label className="block mb-1 text-sm font-semibold text-[#2F2F36] dark:text-white/90">
          {label}
        </label>
      )}


      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-2xl shadow-sm
          border transition-all

          bg-white dark:bg-[#2A2733]
          border-gray-300 dark:border-white/15
          
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
          focus-within:ring-2 focus-within:ring-[#7B61FF]
        `}
      >
   
        {icon && (
          <div className="text-gray-400 dark:text-gray-300 flex-shrink-0">
            {icon}
          </div>
        )}

    
        <input
          type={type}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full bg-transparent outline-none text-sm
            text-[#2F2F36] dark:text-white/90
          "
        />
      </div>
    </div>
  );
}
