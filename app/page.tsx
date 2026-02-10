"use client";

import { SpeedInsights } from "@vercel/speed-insights/next"
import { useEffect, useState, useRef } from "react";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";

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
  const confettiRef = useRef<ConfettiRef>(null)
  const totalStamps = 10;
  const week = getCurrentWeek();
  // const [filledCount, setFillCount] = useState(0);
  const [stamps, setStamps] = useState<boolean[]>(
    Array(totalStamps).fill(false)
  );
  const filledCount = stamps.filter(Boolean).length;
  const [showConfetti, setShowConfetti] = useState(false);
  const empty = Array(totalStamps).fill(false);


  useEffect(() => {
    const storedWeekKey = localStorage.getItem("weekKey");
    const stored = localStorage.getItem("stamps");

    if (storedWeekKey === week.key && stored) {
      setStamps(JSON.parse(stored));
    } else {
      localStorage.setItem("weekKey", week.key);
      localStorage.setItem("stamps", JSON.stringify(empty));
      setStamps(empty);

    }
  }, [week.key]);

  useEffect(() => {
    localStorage.setItem("filledCount", String(filledCount));
  }, [filledCount]);

  useEffect(() => {
    if (filledCount == totalStamps) {
      setShowConfetti(true);
    }
  })
  // const handlePrepToday = () => {
  //   setFillCount((prev) => {
  //     if (prev >= totalStamps) return prev;
  //     const next = prev + 1;
  //     if (next === totalStamps) setShowConfetti(true);
  //     return next;
  //   });
  // };

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
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "2px solid #8b1d18",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "9px",
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

  return (
    <main style={{ padding: "2rem", minHeight: "100vh" }}>
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
          Interview Prep Stamp Card
        </p>

        <p style={{ textAlign: "center" }}>Week of {week.label}</p>
        <p style={{ textAlign: "center", marginBottom: "15px" }}>
          {filledCount} / {totalStamps} sessions
        </p>

        {/* Stamp Grid */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "16px",
              maxWidth: "300px",
            }}
          >
          {stamps.map((isFilled, index) => (
            <button
              key={index}
              onClick={() => toggleStamp(index)}
              style={stampStyle(isFilled)}
            >
              {isFilled ? "DONE" : ""}
            </button>
          ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between w-full">
          {/* <button
            className="mt-6 px-6 py-3 rounded-full bg-neutral-900 text-white content-start"
            onClick={handlePrepToday}
          >
            I prepped today ✨
          </button> */}
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
