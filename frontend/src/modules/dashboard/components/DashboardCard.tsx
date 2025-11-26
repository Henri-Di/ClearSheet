import { motion } from "framer-motion";

interface Props {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  value: number;
}

export function DashboardCard({ icon, iconBg, title, value }: Props) {
  return (
    <motion.div
      className="
        bg-white dark:bg-dark-card
        p-6 rounded-3xl border border-[#E6E1F7] dark:border-dark-border
        shadow-sm cursor-default relative
      "
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 28px rgba(0,0,0,0.10)"
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.div
        className={`
          absolute -top-4 left-4 p-3 rounded-2xl shadow-sm border border-white dark:border-dark-border
          ${iconBg}
        `}
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.25 }}
      >
        {icon}
      </motion.div>

      <div className="mt-6">
        <p className="text-sm text-[#5A556A] dark:text-gray-300 font-medium mb-1">
          {title}
        </p>

        <motion.h3
          className="
            text-4xl font-display font-semibold tracking-tight
            text-[#2F2F36] dark:text-white
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {value}
        </motion.h3>
      </div>
    </motion.div>
  );
}
