"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { io, type Socket } from "socket.io-client";

const WS_URL = "wss://presentation-app-nef9.onrender.com";

export default function Presenter() {
  const [show, setShow] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(WS_URL, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.on("stamp", () => {
      setShow(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e) => {
          console.error("音声再生エラー", e);
        });
      }
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShow(false), 2000);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

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