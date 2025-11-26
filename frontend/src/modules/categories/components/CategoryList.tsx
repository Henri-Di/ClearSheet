import { CategoryRow } from "./CategoryRow";
import type { Category } from "../types/category";
import { SkeletonCategory } from "./Skeletons";

export function CategoryList({
  categories,
  loading,
  selectedCategoryId,
  onSelect,
  onEdit,
  onDelete,
}: {
  categories: Category[];
  loading: boolean;
  selectedCategoryId: number | null;
  onSelect: (c: Category) => void;
  onEdit: (c: Category) => void;
  onDelete: (id: number) => void;
}) {

  if (loading)
    return (
      <>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCategory key={i} />
        ))}
      </>
    );

  if (categories.length === 0)
    return (
      <p className="p-6 text-sm text-gray-500 dark:text-gray-300">
        Nenhuma categoria cadastrada.
      </p>
    );

  return (
    <table className="w-full border-collapse">
      

      <thead
        className="
          bg-[#F6F4FF] 
          text-[#4B4A54]
          dark:bg-[#1C1A22]
          dark:text-gray-200
          border-b border-[#E6E1F7] dark:border-[#2C2B33]
        "
      >
        <tr>
          <th className="p-4 text-left">Nome</th>
          <th className="p-4 text-left">Ícone</th>
          <th className="p-4 text-right pr-6">Ações</th>
        </tr>
      </thead>


      <tbody className="bg-white dark:bg-[#14131A]">
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            selected={category.id === selectedCategoryId}
            onSelect={() => onSelect(category)}
            onEdit={() => onEdit(category)}
            onDelete={() => onDelete(category.id)}
          />
        ))}
      </tbody>

    </table>
  );
}
