"use client"
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const WS_URL = "wss://presentation-app-backend.daigaku-150207.workers.dev/ws"; // Cloudflare Workers本番用

function useStableWebSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;
    const connect = () => {
      ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onopen = () => setReady(true);
      ws.onclose = () => {
        setReady(false);
        reconnectTimer = setTimeout(connect, 1500);
      };
      ws.onerror = () => {
        setReady(false);
        ws?.close();
      };
    };
    connect();
    return () => {
      ws?.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [url]);
  return { wsRef, ready };
}

export default function Home() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { wsRef, ready } = useStableWebSocket(WS_URL);

  const handleSend = async () => {
    setSending(true);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "stamp" }));
    } else {
      setSending(false);
      alert("サーバーに接続できません。しばらくしてから再度お試しください。");
      return;
    }
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setTimeout(() => setSent(false), 1200);
    }, 600);
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
