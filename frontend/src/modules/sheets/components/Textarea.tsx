interface TextareaProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function Textarea({
  label = "",
  value,
  onChange,
  disabled = false,
  placeholder
}: TextareaProps) {
  return (
    <div className="w-full">
      {/* LABEL */}
      {label && (
        <label className="block mb-1 text-sm font-semibold text-[#2F2F36] dark:text-white/90">
          {label}
        </label>
      )}

 
      <textarea
        disabled={disabled}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full min-h-[95px] p-3 text-sm resize-none rounded-2xl shadow-sm

          bg-white dark:bg-[#2A2733]
          text-[#2F2F36] dark:text-white/90

          border border-gray-300 dark:border-white/15
          transition-all

          focus:ring-2 focus:ring-[#7B61FF]
          outline-none

          disabled:opacity-60 disabled:cursor-not-allowed
        "
      />
    </div>
  );
}
