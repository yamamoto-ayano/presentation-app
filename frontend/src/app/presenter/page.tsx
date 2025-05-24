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
  const [audioReady, setAudioReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleMessage = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === "stamp") {
        setShow(true);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((e) => {
            console.error("音声再生エラー", e);
          });
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setShow(false), 2000); // 2秒表示
      }
    } catch {}
  };

  useStableWebSocket(WS_URL, handleMessage);

  // 最初のユーザー操作で音声を有効化
  const enableAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.error("音声有効化エラー", e);
      });
      setAudioReady(true);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      pointerEvents: "none",
      background: "transparent",
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <audio ref={audioRef} preload="auto">
        <source src="/stamp.mp3" type="audio/mp3" />
        <source src="/oyasymi.m4a" type="audio/mp4" />
      </audio>
      {!audioReady && (
        <button
          style={{
            position: "fixed",
            top: 32,
            right: 32,
            zIndex: 100000,
            pointerEvents: "auto",
            fontSize: 20,
            padding: "12px 32px",
            borderRadius: 8,
            background: "#e53935",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={enableAudio}
        >
          音声を有効にする
        </button>
      )}
      {show && (
        <div style={{
          background: "rgba(0,0,0,0.0)",
          borderRadius: 16,
          boxShadow: "0 4px 24px #0006",
          padding: 0,
          animation: "pop 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Image src="/stamp.png" alt="ちょっと待て！！スタンプ" width={320} height={320} priority style={{ transition: "transform 0.2s" }} />
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