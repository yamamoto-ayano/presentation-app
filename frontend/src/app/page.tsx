"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";

const WS_URL = "wss://presentation-app-nef9.onrender.com"; // Render本番用

export default function Home() {
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const socketRef = useRef<Socket | null>(null);

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
        setCooldown(true);
        setTimeout(() => setSent(false), 1200);
        setTimeout(() => setCooldown(false), 5000);
      }, 600);
    } else {
      setSending(false);
      alert("サーバーに接続できません。しばらくしてから再度お試しください。");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#111" }}>
      <button
        onClick={handleSend}
        disabled={sending || !ready || cooldown}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: sending || !ready || cooldown ? "not-allowed" : "pointer",
          outline: "none",
        }}
      >
        <Image
          src="/button.png"
          alt="スタンプを送る"
          width={240}
          height={240}
          priority
          style={{
            filter: sending ? "grayscale(1) blur(2px)" : "none",
            opacity: !ready || cooldown ? 0.5 : 1,
            transition: "0.3s"
          }}
        />
      </button>
      {sent && (
        <div style={{ color: "#fff", fontSize: 24, marginTop: 24, fontWeight: "bold", textShadow: "0 2px 8px #000" }}>
          送信完了！
        </div>
      )}
    </div>
  );
}
