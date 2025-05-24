"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const WS_URL = "wss://presentation-app-nef9.onrender.com"; // Render本番用

export default function Home() {
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io(WS_URL, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.on("connect", () => setReady(true));
    socket.on("disconnect", () => setReady(false));
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = () => {
    setSending(true);
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("stamp", { type: "stamp" });
      setTimeout(() => {
        setSending(false);
        setSent(true);
        setTimeout(() => setSent(false), 1200);
      }, 600);
    } else {
      setSending(false);
      alert("サーバーに接続できません。しばらくしてから再度お試しください。");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#111" }}>
      <div style={{ marginBottom: 32 }}>
        <Image src="/stamp.png" alt="ちょっと待て！！スタンプ" width={240} height={240} priority style={{ filter: sending ? "grayscale(1) blur(2px)" : "none", transition: "0.3s" }} />
      </div>
      <button
        onClick={handleSend}
        disabled={sending || !ready}
        style={{
          fontSize: 24,
          background: sent ? "#e53935" : "#fff",
          color: sent ? "#fff" : "#e53935",
          border: "2px solid #e53935",
          borderRadius: 12,
          padding: "16px 48px",
          fontWeight: "bold",
          cursor: sending || !ready ? "not-allowed" : "pointer",
          boxShadow: sent ? "0 0 24px #e53935" : "none",
          transition: "all 0.3s",
        }}
      >
        {sending ? "送信中..." : sent ? "送信しました！" : !ready ? "接続中..." : "スタンプを送る"}
      </button>
    </div>
  );
}
