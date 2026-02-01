import Image from "next/image";

export default function Home() {
  const totalStamps = 10;
  const filledCount = 3;


  return (
    <main style={{ padding: "2rem" }}>
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
    </main>
  );
}
