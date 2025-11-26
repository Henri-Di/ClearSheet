import { motion } from "framer-motion";
import { formatCurrency } from "../utils/currency";

export function CategoryCard({ category }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        rounded-3xl p-5 bg-white border border-[#E1E0EB]
        shadow-sm hover:-translate-y-[2px] transition-all
      "
    >
      <h4 className="font-semibold text-[#222]">{category.title}</h4>
      <p className="text-lg font-bold mt-2 text-[#7B61FF]">
        {formatCurrency(category.value)}
      </p>
    </motion.div>
  );
}
