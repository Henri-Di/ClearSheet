
import { FileSearch } from "lucide-react";

export function EmptyState({ title = "Nada encontrado", subtitle = "" }) {
  return (
    <div
      className="
        flex flex-col items-center justify-center
        py-20 rounded-3xl bg-[#F5F2FF] border border-[#E6E1F7]
        shadow-sm text-center
      "
    >
      <FileSearch size={42} className="text-[#7B61FF] mb-4" />
      <h3 className="text-lg font-semibold text-[#2F2F36]">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
    </div>
  );
}
