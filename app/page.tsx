"use client"; 

import Image from "next/image";
import { useEffect, useState } from "react";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"



export default function Home() {
  
  const totalStamps = 10;
  const [filledCount, setFillCount] = useState(0); // capture state of the stamps
  const [showConfetti, setShowConfetti] = useState(false); //state for confetti

  useEffect(() => {
    const savedCount = localStorage.getItem("filledCount");

    if (savedCount !== null) {
      setFillCount(Number(savedCount));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("filledCount", filledCount.toString());
  }, [filledCount]);

  return (
    <main style={{ padding: "2rem" }} > 
      <h1>Interview Prep Stamp Card</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
          marginTop: "24px",
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
      <div className="relative">
        <button 
          style={{ marginTop: "24px", position: "relative", zIndex: 1  }}
          onClick={() => {
            if (filledCount < totalStamps) {
              setFillCount((prev) => {
              const next = prev + 1;
              
              if (next === totalStamps) {
                setShowConfetti(true);
              }

              return next;
              });
            }
          }}
        >
          I prepped today
        </button>
        {showConfetti && (
          <Confetti
            className="fixed inset-0 pointer-events-none z-50"
          />
        )}


      </div>
      <button
        style={{ 
          marginTop: "24px",
         }}
        onClick={() => {
          setFillCount(0);
          setShowConfetti(false);
          localStorage.removeItem("filledCount");
        }}
      >
        Reset week
      </button>
    </main>
  );
}
