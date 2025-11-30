import { useMemo } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Landmark,
  Wallet,
  PiggyBank,
  Banknote,
  CreditCard,
  Coins,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";

const ICONS = [
  ArrowUpCircle,
  ArrowDownCircle,
  Landmark,
  Wallet,
  PiggyBank,
  Banknote,
  CreditCard,
  Coins,
  DollarSign,
];

export function FloatingFinanceIcons() {
  const items = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      Icon: ICONS[i % ICONS.length],

      // divisão organizada em 10 colunas invisíveis
      col: i % 10,

      // posição aleatória dentro da coluna
      offsetX: Math.random() * 10, 
      offsetY: Math.random() * 150,

      size: 22 + Math.random() * 30,

      duration: 12 + Math.random() * 10, 
      delay: Math.random() * 8,

      opacity: 0.22 + Math.random() * 0.25,
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {items.map(({ id, Icon, col, offsetX, offsetY, size, duration, delay, opacity }) => (
        <motion.div
          key={id}
          initial={{
            y: `${120 + offsetY}%`,
            x: offsetX,
            opacity: 0,
          }}
          animate={{
            y: `-${20 + offsetY}%`,
            x: offsetX + Math.sin(id) * 15, // drift suave horizontal
            opacity,
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `calc(${col * 10}% + ${offsetX}px)`, // distribui em 10 colunas
          }}
        >
          <Icon
            size={size}
            className={`
              text-[#8B5CF6] dark:text-[#C084FC] 
              ${id % 3 === 0 ? "text-[#EC4899] dark:text-[#F472B6]" : ""}
              ${id % 4 === 0 ? "text-[#10B981] dark:text-[#34D399]" : ""}
              ${id % 5 === 0 ? "text-[#3B82F6] dark:text-[#60A5FA]" : ""}
            `}
            style={{ opacity }}
          />
        </motion.div>
      ))}
    </div>
  );
}
