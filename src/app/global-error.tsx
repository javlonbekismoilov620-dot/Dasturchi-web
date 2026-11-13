"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="uz">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0, background: "#08080a", color: "#eee" }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 28 }}>Platformada jiddiy xatolik yuz berdi</h1>
          <p style={{ opacity: 0.7 }}>Sahifani yangilab ko‘ring.</p>
          <button onClick={reset} style={{ marginTop: 16, padding: "10px 18px", borderRadius: 10, border: 0, cursor: "pointer" }}>Qayta urinish</button>
        </div>
      </body>
    </html>
  );
}
