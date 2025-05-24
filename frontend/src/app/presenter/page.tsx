"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const WS_URL = "wss://presentation-app-backend.daigaku-150207.workers.dev/ws"; // Cloudflare Workers本番用

function useStableWebSocket(url: string, onMessage: (data: string) => void) {
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
      ws.onmessage = (event) => {
        onMessage(event.data as string);
      };
    };
    connect();
    return () => {
      ws?.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [url, onMessage]);
  return { wsRef, ready };
}

export default function Presenter() {
  const [show, setShow] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMessage = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === "stamp") {
        setShow(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setShow(false), 1000);
      }
    } catch {}
  };

  useStableWebSocket(WS_URL, handleMessage);

  return (
    <div style={{ position: "fixed", right: 32, bottom: 32, zIndex: 99999, pointerEvents: "none" }}>
      {show && (
        <div style={{
          background: "rgba(0,0,0,0.0)",
          borderRadius: 16,
          boxShadow: "0 4px 24px #0006",
          padding: 0,
          animation: "pop 0.2s",
        }}>
          <Image src="/stamp.png" alt="ちょっと待て！！スタンプ" width={180} height={180} priority style={{ transition: "transform 0.2s" }} />
        </div>
      )}
      <style>{`
        @keyframes pop {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
} 