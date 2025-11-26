import { motion } from "framer-motion";

interface Props {
  title: string;
  children: React.ReactNode;
}

export function ChartCard({ title, children }: Props) {
  return (
    <motion.div
      className="
        bg-white dark:bg-dark-card
        border border-[#E6E1F7] dark:border-dark-border
        rounded-3xl shadow-lg
        p-6
      "
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#2F2F36] dark:text-white tracking-tight">
          {title}
        </h2>
      </div>

      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
}
