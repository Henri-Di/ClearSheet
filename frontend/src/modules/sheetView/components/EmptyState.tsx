import { FileSearch } from "lucide-react";

interface Props {
  title?: string;
  subtitle?: string;
}

export default function EmptyState({
  title = "Nenhum item encontrado",
  subtitle = "Tente ajustar os filtros ou criar um novo item.",
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 opacity-80">
      <div className="p-6 bg-[#F5F2FF] border border-[#E6E1F7] rounded-3xl shadow-sm">
        <FileSearch size={48} className="text-[#7B61FF]" />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-[#2F2F36]">
        {title}
      </h3>

      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}
