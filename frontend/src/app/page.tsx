"use client"
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    // ここでWebSocket送信処理を追加予定
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 1200);
    }, 600);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#111" }}>
      <div style={{ marginBottom: 32 }}>
        <Image src="/stamp.png" alt="ちょっと待て！！スタンプ" width={240} height={240} style={{ filter: sending ? "grayscale(1) blur(2px)" : "none", transition: "0.3s" }} />
      </div>
      <button
        onClick={handleSend}
        disabled={sending}
        style={{
          fontSize: 24,
          background: sent ? "#e53935" : "#fff",
          color: sent ? "#fff" : "#e53935",
          border: "2px solid #e53935",
          borderRadius: 12,
          padding: "16px 48px",
          fontWeight: "bold",
          cursor: sending ? "not-allowed" : "pointer",
          boxShadow: sent ? "0 0 24px #e53935" : "none",
          transition: "all 0.3s",
        }}
      >
        {sending ? "送信中..." : sent ? "送信しました！" : "スタンプを送る"}
      </button>
    </div>
  );
}
