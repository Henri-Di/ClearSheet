import { useState } from "react";
import { Pencil, Trash2, HelpCircle } from "lucide-react";
import type { Category } from "../types/category";
import { getCategoryIcon } from "../utils/categoryIcons";

export function CategoryRow({
  category,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  category: Category;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const iconInfo = getCategoryIcon(category.icon);
  const IconComp = iconInfo.Icon;

  const [hoverKey, setHoverKey] = useState<string | null>(null);

  const Tooltip = ({ text }: { text: string }) => (
    <div
      className="
        absolute 
        -top-8 left-1/2 -translate-x-1/2 
        px-3 py-1 rounded-lg shadow-lg
        text-xs whitespace-nowrap pointer-events-none
        z-50 animate-fadeIn
        bg-black/80 text-white
        dark:bg-white/10 dark:text-gray-200
      "
    >
      {text}
    </div>
  );

  return (
    <tr
      onClick={onSelect}
      className={`
        transition-all cursor-pointer group
        border-t border-[#F1EEF9] dark:border-[#2C2B33]
        ${selected 
          ? "bg-[#F3ECFF] dark:bg-[#2A2538]" 
          : "bg-white dark:bg-[#14131A]"
        }
        hover:bg-[#F8F5FF] dark:hover:bg-[#1C1A22]
        hover:shadow-sm dark:hover:shadow-md
      `}
    >

      <td className="p-4 relative">
        <div className="flex items-center gap-1">
          <span
            className={`
              text-sm font-medium transition
              ${selected
                ? "text-[#5A3FD8] dark:text-[#9d8aff]"
                : "text-[#2F2F36] dark:text-gray-200"
              }
              group-hover:text-[#5A3FD8] dark:group-hover:text-[#b9a5ff]
            `}
          >
            {category.name}
          </span>

          <div
            className="relative flex items-center"
            onMouseEnter={(e) => {
              e.stopPropagation();
              setHoverKey("name");
            }}
            onMouseLeave={() => setHoverKey(null)}
          >
            <HelpCircle
              size={14}
              className="
                text-[#7B61FF] opacity-70 hover:opacity-100
                dark:text-[#9d8aff]
                cursor-pointer
              "
            />
            {hoverKey === "name" && (
              <Tooltip text="Nome identificador desta categoria." />
            )}
          </div>
        </div>
      </td>

      <td className="p-4 relative">
        <div className="flex items-center gap-2 relative">
          <div
            className={`
              w-9 h-9 rounded-2xl flex items-center justify-center shadow-sm
              border transition-all
              ${
                selected
                  ? "border-[#D6CEFF] bg-[#F3ECFF] dark:border-[#6A54E6] dark:bg-[#241F33]"
                  : "border-[#EEEAFB] bg-white dark:border-[#2C2B33] dark:bg-[#1A1920]"
              }
              group-hover:border-[#CFC5FF] dark:group-hover:border-[#7B61FF]
              group-hover:bg-[#F7F4FF] dark:group-hover:bg-[#2A2538]
            `}
          >
            <IconComp
              size={18}
              className={`
                transition
                ${
                  selected
                    ? "text-[#7B61FF] dark:text-[#b9a5ff]"
                    : "text-[#7B61FF] opacity-80 dark:text-[#9d8aff]"
                }
                group-hover:opacity-100
              `}
            />
          </div>

          <span
            className={`
              text-xs transition
              ${selected
                ? "text-[#7B61FF] dark:text-[#b9a5ff]"
                : "text-gray-500 dark:text-gray-400"
              }
              group-hover:text-[#7B61FF] dark:group-hover:text-[#cdbfff]
            `}
          >
            {iconInfo.label}
          </span>

          <div
            className="relative flex items-center"
            onMouseEnter={(e) => {
              e.stopPropagation();
              setHoverKey("icon");
            }}
            onMouseLeave={() => setHoverKey(null)}
          >
            <HelpCircle
              size={14}
              className="
                text-[#7B61FF] opacity-60 hover:opacity-100
                dark:text-[#9d8aff]
                cursor-pointer
              "
            />
            {hoverKey === "icon" && (
              <Tooltip text="Ícone visual que representa a categoria." />
            )}
          </div>
        </div>
      </td>


      <td className="p-4 pr-6">
        <div className="flex justify-end gap-5 items-center">

          <div
            className="relative flex items-center"
            onMouseEnter={(e) => {
              e.stopPropagation();
              setHoverKey("edit");
            }}
            onMouseLeave={() => setHoverKey(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="
                flex items-center gap-1 text-xs font-medium
                text-[#7B61FF] hover:text-[#6A54E6]
                dark:text-[#b9a5ff] dark:hover:text-[#d6caff]
                transition-opacity opacity-70 hover:opacity-100
              "
            >
              <Pencil size={14} />
              Editar
            </button>

            {hoverKey === "edit" && (
              <Tooltip text="Editar nome e ícone da categoria." />
            )}
          </div>

          <div
            className="relative flex items-center"
            onMouseEnter={(e) => {
              e.stopPropagation();
              setHoverKey("delete");
            }}
            onMouseLeave={() => setHoverKey(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="
                flex items-center gap-1 text-xs font-medium
                text-red-600 hover:text-red-700
                dark:text-red-400 dark:hover:text-red-300
                transition-opacity opacity-70 hover:opacity-100
              "
            >
              <Trash2 size={14} />
              Excluir
            </button>

            {hoverKey === "delete" && (
              <Tooltip text="Excluir esta categoria permanentemente." />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
