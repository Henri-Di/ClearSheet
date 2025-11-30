import { motion } from "framer-motion";

interface Props {
  title: string;
  children: React.ReactNode;
}

export function ChartCard({ title, children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -6,
        scale: 1.015,
        boxShadow: `
          0 10px 30px rgba(0,0,0,0.12),
          0 0 22px rgba(123,97,255,0.15)
        `,
      }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="
        relative overflow-hidden
        rounded-3xl p-6 shadow-lg border
        bg-white/90 dark:bg-dark-card/80
        border-[#E6E1F7] dark:border-dark-border
        backdrop-blur-xl
      "
      style={{
        WebkitMask:
          "linear-gradient(180deg, rgba(0,0,0,1) 90%, rgba(0,0,0,0.55) 100%)",
      }}
    >

   
      <div
        className="
          pointer-events-none
          absolute inset-0
          bg-gradient-to-br from-[#7B61FF]/5 via-transparent to-[#E76BA3]/5
          dark:from-[#7B61FF]/10 dark:via-transparent dark:to-[#E76BA3]/10
        "
      />

      <div className="relative z-10 flex items-center justify-between mb-5">
        <h2
          className="
            text-lg font-semibold tracking-tight select-none
            text-[#2F2F36] dark:text-gray-100
          "
        >
          {title}
        </h2>
      </div>

    
      <div className="relative z-10">
        {children}
      </div>

    
      <div
        className="
          absolute left-0 right-0 bottom-0 h-[22px]
          rounded-b-3xl pointer-events-none
          bg-gradient-to-t from-black/[0.07]
          dark:from-white/[0.06]
        "
      />
    </motion.div>
  );
}
