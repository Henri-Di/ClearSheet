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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.025,
        y: -4,
        boxShadow: "0 10px 28px rgba(0,0,0,0.14)",
      }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="
        relative rounded-3xl p-6 cursor-default select-none
        bg-white/95 dark:bg-dark-card/80
        border border-[#E6E1F7] dark:border-dark-border
        shadow-sm backdrop-blur-xl
        transition-all
      "
    >
   
      <motion.div
        className={`
          absolute -top-4 left-4 p-3 rounded-2xl
          shadow-sm backdrop-blur-xl
          border border-white/50 dark:border-white/10
          flex items-center justify-center
          ${iconBg}
        `}
        whileHover={{ scale: 1.12 }}
        transition={{ duration: 0.22 }}
      >
        {icon}
      </motion.div>

    
      <div className="mt-7">
        <p
          className="
            text-sm font-medium tracking-wide
            text-[#5A556A] dark:text-gray-300
          "
        >
          {title}
        </p>

        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="
            mt-1 text-4xl font-display font-semibold tracking-tight
            text-[#2F2F36] dark:text-white
          "
        >
          {value}
        </motion.h3>
      </div>

   
      <div
        className="
          mt-5 h-[5px] w-full rounded-full 
          bg-gradient-to-r from-primary/40 to-primary/20 
          dark:from-primary/30 dark:to-primary/10
        "
      />
    </motion.div>
  );
}
