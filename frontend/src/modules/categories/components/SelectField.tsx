interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;

  options: {
    value: string;
    label: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
  }[];
}

export function SelectField({ label, value, onChange, options }: Props) {
  const opt = options.find((o) => o.value === value);
  const SelectedIcon = opt?.Icon || null;

  return (
    <div className="space-y-1">


      <label className="text-sm font-medium text-[#2F2F36] dark:text-gray-200">
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

        {SelectedIcon && (
          <SelectedIcon
            size={20}
            className="
              text-[#7B61FF] dark:text-indigo-300
              shrink-0 min-w-[20px]
            "
          />
        )}

     
        <select
          className="
            w-full bg-transparent outline-none text-sm cursor-pointer
            text-[#2F2F36] dark:text-gray-200
            placeholder:text-gray-400 dark:placeholder:text-gray-500
          "
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="
                text-[#2F2F36] dark:text-gray-200
                bg-white dark:bg-[#1B1A21]
              "
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
