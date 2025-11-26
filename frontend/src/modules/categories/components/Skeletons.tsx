export const SkeletonCategory = () => (
  <div
    className="
      px-5 py-4
      animate-pulse
      flex items-center justify-between
      transition-colors

      border-t border-[#F1EEF9] dark:border-[#2A2636]

      bg-gradient-to-r 
      from-[#FAF8FF] to-[#F5F2FF]
      dark:from-[#1A1822] dark:to-[#13121A]
    "
  >
    <div className="flex items-center gap-3">

    
      <div
        className="
          w-9 h-9 rounded-2xl shadow-sm
          bg-[#EEE9FA] dark:bg-[#2A2638]
        "
      />


      <div
        className="
          h-4 w-32 rounded-xl
          bg-[#E6E1F7] dark:bg-[#3A3549]
        "
      />
    </div>

 
    <div className="flex items-center gap-4">
      <div className="h-4 w-10 rounded-xl bg-[#E6E1F7] dark:bg-[#3A3549]" />
      <div className="h-4 w-10 rounded-xl bg-[#E6E1F7] dark:bg-[#3A3549]" />
    </div>
  </div>
);
