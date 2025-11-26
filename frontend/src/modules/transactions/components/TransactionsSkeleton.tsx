export function TransactionsSkeleton() {
  return (
    <div className="animate-fadeIn space-y-10 pb-20">


      <div
        className="
          bg-white dark:bg-dark-card 
          border border-[#E4E2F0] dark:border-dark-border
          rounded-3xl p-6 shadow-sm
          flex flex-col gap-4
        "
      >

        <div className="h-6 w-64 bg-[#EEE9FA] dark:bg-[#2A2638] rounded-xl" />


<div
  className="
    flex items-center gap-2 flex-1
    bg-[#F5F4FA] dark:bg-[#1B1923]
    border border-[#E0DEED] dark:border-[#2A2633]
    rounded-xl px-4 py-3
    transition-colors
  "
>
  <div className="h-4 w-4 bg-[#D8D4EB] dark:bg-[#3A3549] rounded" />
  <div className="h-4 w-40 bg-[#E7E3F8] dark:bg-[#3D394C] rounded" />
</div>



        <div className="flex gap-3">
          <div
            className="
              h-11 w-40 bg-[#F4F2FF] dark:bg-[#2A2638]
              border border-[#E0DEED] dark:border-dark-border
              rounded-xl
            "
          />
          <div
            className="
              h-11 w-40 bg-[#F4F2FF] dark:bg-[#2A2638]
              border border-[#E0DEED] dark:border-dark-border
              rounded-xl
            "
          />
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="
              bg-white dark:bg-dark-card
              border border-[#E6E1F7] dark:border-dark-border
              rounded-3xl p-6 shadow-sm
            "
          >
            <div className="h-4 w-24 bg-[#EEE9FA] dark:bg-[#2A2638] rounded-lg mb-3" />
            <div className="h-7 w-32 bg-[#E4DEFF] dark:bg-[#3A3549] rounded-lg" />
          </div>
        ))}
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="
              bg-white dark:bg-dark-card
              border border-[#E6E1F7] dark:border-dark-border
              rounded-3xl p-6 shadow-sm
            "
          >
     
            <div className="h-4 w-28 bg-[#EEE9FA] dark:bg-[#2A2638] rounded mb-2" />
            <div className="h-4 w-20 bg-[#EEE9FA] dark:bg-[#2A2638] rounded mb-4" />

        
            <div className="h-20 w-full bg-[#F4F2FF] dark:bg-[#2A2638] rounded-xl" />
          </div>
        ))}
      </div>


      <div
        className="
          bg-white dark:bg-dark-card
          border border-[#E6E1F7] dark:border-dark-border
          rounded-3xl p-6 shadow-sm
        "
      >
        <div className="h-5 w-48 bg-[#EEE9FA] dark:bg-[#2A2638] rounded mb-6" />
        <div className="h-32 w-full bg-[#F4F2FF] dark:bg-[#2A2638] rounded-xl" />
      </div>

      <div
        className="
          bg-white dark:bg-dark-card
          border border-[#E6E1F7] dark:border-dark-border
          rounded-3xl p-6 shadow-sm
        "
      >
        <div className="h-5 w-48 bg-[#EEE9FA] dark:bg-[#2A2638] rounded mb-4" />

        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="
              h-7 w-full bg-[#F4F2FF] dark:bg-[#2A2638]
              rounded mb-2
            "
          />
        ))}
      </div>

    </div>
  );
}
