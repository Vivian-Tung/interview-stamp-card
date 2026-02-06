"use client";

import { useEffect, useState } from "react";
import { Confetti } from "@/components/ui/confetti";

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
  const totalStamps = 10;
  const week = getCurrentWeek();
  const [filledCount, setFillCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const storedWeekKey = localStorage.getItem("weekKey");
    const storedCount = localStorage.getItem("filledCount");

    if (storedWeekKey === week.key && storedCount) {
      setFillCount(Number(storedCount));
    } else {
      localStorage.setItem("weekKey", week.key);
      localStorage.setItem("filledCount", "0");
      setFillCount(0);
    }
  }, [week.key]);

  useEffect(() => {
    localStorage.setItem("filledCount", String(filledCount));
  }, [filledCount]);

  const handlePrepToday = () => {
    setFillCount((prev) => {
      if (prev >= totalStamps) return prev;
      const next = prev + 1;
      if (next === totalStamps) setShowConfetti(true);
      return next;
    });
  };

  const handleReset = () => {
    setFillCount(0);
    setShowConfetti(false);
    localStorage.setItem("filledCount", "0");
  };

  return (
    <main style={{ padding: "2rem", minHeight: "100vh" }}>
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
            {Array.from({ length: totalStamps }).map((_, index) => {
              const isFilled = index < filledCount;
              return (
                <div
                  key={index}
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: "2px solid #333",
                    backgroundColor: isFilled ? "#333" : "transparent",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            className="mt-6 px-6 py-3 rounded-full bg-neutral-900 text-white content-start"
            onClick={handlePrepToday}
          >
            I prepped today ✨
          </button>

          {showConfetti && (
            <Confetti className="fixed inset-0 pointer-events-none z-50" />
          )}

          <button
            className="mt-4 px-6 py-3 rounded-full border"
            onClick={handleReset}
          >
            Reset week
          </button>
        </div>
      </div>
    </main>
  );
}
