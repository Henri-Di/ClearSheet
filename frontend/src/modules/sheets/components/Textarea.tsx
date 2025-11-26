interface TextareaProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function Textarea({ label, value, onChange, disabled = false, placeholder }: TextareaProps) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <textarea
        className="border rounded-xl px-3 py-2 w-full outline-none"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
