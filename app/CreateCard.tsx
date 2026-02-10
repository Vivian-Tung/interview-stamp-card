"use client";
import { useState } from "react";
import type { CardConfig } from "./page";

type CreateCardProps = {
  onCreate: (config: CardConfig) => void;
};

export default function CreateCard({ onCreate }: CreateCardProps) {
  const [title, setTitle] = useState("");
  const [total, setTotal] = useState(10);

  const handleSubmit = () => {
    const newConfig = {
      title,
      totalStamps: Number(total),
    };

    localStorage.setItem("cardConfig", JSON.stringify(newConfig));
    onCreate(newConfig);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="bg-[#faf7f2] border-2 border-dashed rounded-xl p-8 w-[360px] shadow-lg">
        <h1 className="text-xl font-semibold text-center mb-6">
          Create your stamp card
        </h1>

        <label className="block mb-2 text-sm font-medium">
          Topic
        </label>
        <input
          className="w-full border rounded-md p-2 mb-4"
          placeholder="e.g. Interview Prep"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label className="block mb-2 text-sm font-medium">
          Sessions / stamps
        </label>
        <input
          type="number"
          min={3}
          max={60}
          className="w-full border rounded-md p-2 mb-6"
          value={total}
          onChange={(e) => setTotal(Number(e.target.value))}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-neutral-900 text-white rounded-full py-3"
        >
          Create Card ✨
        </button>
      </div>
    </main>
  );
}
