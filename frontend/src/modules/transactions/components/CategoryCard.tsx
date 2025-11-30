import { motion } from "framer-motion";
import { formatCurrency } from "../utils/currency";

export function CategoryCard({ category }: any) {
  const value = Number(category.value ?? 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.25 }}
      className="
        rounded-3xl p-5
        bg-white dark:bg-white/5
        border border-[#E1E0EB] dark:border-white/10
        shadow-sm dark:shadow-black/40
        hover:shadow-md dark:hover:shadow-black/60
        transition-all select-none
        backdrop-blur-xl
      "
    >

      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-[#222] dark:text-white text-sm">
          {category.title}
        </h4>


        {category.icon && (
          <div className="w-8 h-8 rounded-xl bg-[#F5F2FF] dark:bg-white/10
                          border border-[#E6E1F7] dark:border-white/10
                          flex items-center justify-center shadow-sm">
            {typeof category.icon === "string" ? (
              <img src={category.icon} className="w-5 h-5 opacity-80" />
            ) : (
              category.icon
            )}
          </div>
        )}
      </div>

   
      <p
        className="
          text-xl font-extrabold mt-3 
          text-[#7B61FF] dark:text-[#B0A3FF]
        "
      >
        {formatCurrency(value)}
      </p>

   
      <div className="mt-4 w-full h-[6px] rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="
            h-full 
            bg-gradient-to-r 
            from-[#7B61FF] to-[#A48BFF] 
            dark:from-[#7B61FF] dark:to-[#C6BAFF]
            shadow-[0_0_8px_rgba(123,97,255,0.45)]
          "
        />
      </div>
    </motion.div>
  );
}
