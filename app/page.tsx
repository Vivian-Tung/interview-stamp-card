"use client";

import { useEffect, useState, useRef } from "react";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import CreateCard from "./CreateCard";


export type CardConfig = {
  title: string;
  totalStamps: number;
}

type WeekInfo = {
  start: Date;
  end: Date;
  key: string;
  label: string;
};



export function getCurrentWeek(date = new Date()): WeekInfo {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  const start = new Date(d);
  start.setDate(d.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(0, 0, 0, 0);

  const key = start.toISOString().slice(0, 10);

  const label = `${start.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })} – ${end.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}`;

  return { start, end, key, label };
}

export default function Home() {
  const STAMPS_PER_ROW = 5;
  const [config, setConfig] = useState<CardConfig | null>(null);

  const totalStamps = config?.totalStamps ?? 0;
  const week = getCurrentWeek();
  const [stamps, setStamps] = useState<boolean[]>([]);
  const columns = totalStamps > 0 ? Math.min(totalStamps, STAMPS_PER_ROW) : 1;
  const filledCount = stamps.filter(Boolean).length;
  const empty = Array(totalStamps).fill(false);
  const nextIndex = stamps.findIndex(s => !s);

  const [showConfetti, setShowConfetti] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem("cardConfig");
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!config) return;

    const storedWeekKey = localStorage.getItem("weekKey");
    const stored = localStorage.getItem("stamps");

    const empty = Array(config.totalStamps).fill(false);

    if (storedWeekKey === week.key && stored) {
      setStamps(JSON.parse(stored));
    } else {
      localStorage.setItem("weekKey", week.key);
      localStorage.setItem("stamps", JSON.stringify(empty));
      setStamps(empty);
    }
  }, [config, week.key]);


  useEffect(() => {
    if (stamps.length === 0) return;
    localStorage.setItem("stamps", JSON.stringify(stamps));
  }, [stamps]);

  const prevFilled = useRef(0);

  useEffect(() => {
    if (filledCount === totalStamps && prevFilled.current !== totalStamps) {
      setShowConfetti(true);
    }
    prevFilled.current = filledCount;
  }, [filledCount, totalStamps]);

  const toggleStamp = (index: number) => {
    setStamps(prev => {
      const updated = [...prev];
      updated[index] = !updated[index]; // toggle
      return updated;
    });
  };

  const handleReset = () => {
    setStamps(empty)
    setShowConfetti(false);
    localStorage.setItem("stamps", JSON.stringify(empty));
  };

  const stampStyle = (filled: boolean) => ({
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    border: "2px solid #8b1d18",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "#8b1d18",
    backgroundColor: filled ? "rgba(139, 29, 24, 0.15)" : "transparent",
    opacity: filled ? 1 : 0.35,
    transform: filled
      ? "rotate(-3deg) scale(1.05)"
      : "scale(1)",
    transition: "all 0.2s ease",
  });
  
  if (!config) {
    return (
      <>
        <CreateCard onCreate={setConfig} />
      </>
    );
  }

  return (
    <main style={{ padding: "2rem", minHeight: "100vh" }}>
      <button
        className="mt-4 text-sm underline"
        onClick={() => {
          localStorage.removeItem("cardConfig");
          localStorage.removeItem("stamps");
          setConfig(null);
        }}
      >
        Create a new card
      </button>
      {showConfetti && (
        <Confetti 
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-50"
          />
      )}
      <div
        style={{
          marginTop: "24px",
          padding: "20px",
          borderRadius: "16px",
          background: "#faf7f2",
          border: "2px dashed #c4b8a9",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
          maxWidth: "400px",
          marginInline: "auto",
        }}
      >
        <p style={{ textAlign: "center", fontWeight: 600 }}>
          {config.title} Stamp Card
        </p>

        <p style={{ textAlign: "center" }}>Week of {week.label}</p>
        <p style={{ textAlign: "center", marginBottom: "15px" }}>
          {filledCount} / {totalStamps} sessions
        </p>

        {/* Stamp Grid */}
        <div 
          style={{ 
            display: "flex",
            justifyContent: "center",
            width: "100%",
            overflowX: "hidden",
         }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${columns}, 56px)`,
              justifyContent: "center",
              gap: "14px",
              padding: "8px 0",
            }}
          >
          {stamps.map((isFilled, index) => {
            const isNext = index === nextIndex;
            return(
              <button
                key={index}
                onClick={() => toggleStamp(index)}
                style={{
                  ...stampStyle(isFilled),
                  boxShadow: isNext
                    ? "0 0 0 3px rgba(139,29,24,0.3)"
                    : "none", 
                  cursor: "pointer",
                }}
              >
                {isFilled ? "DONE" : ""}
              </button>
            );
          })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between w-full">
          <button
            className="mt-4 px-6 py-3 rounded-full border"
            onClick={handleReset}
          >
            Reset week
          </button>
        </div>
      </div>
      <SpeedInsights />
    </main>
  );
}
