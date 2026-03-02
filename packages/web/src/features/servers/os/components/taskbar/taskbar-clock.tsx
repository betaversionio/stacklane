import { useState, useEffect } from "react";

export function TaskbarClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center leading-tight select-none">
      <span className="text-[11px] font-medium text-white/85 tabular-nums">
        {time}
      </span>
      <span className="text-[10px] text-white/50">{date}</span>
    </div>
  );
}
