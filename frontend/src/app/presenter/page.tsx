"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { io, type Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

const WS_URL = "wss://presentation-app-nef9.onrender.com";

export default function Presenter() {
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [stamps, setStamps] = useState<{ id: string; type: "stamp" | "clap"; x?: number }[]>([]);

  useEffect(() => {
    const socket = io(WS_URL, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.on("stamp", () => {
      const id = uuidv4();
      setStamps((prev) => [...prev, { id, type: "stamp" }]);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e) => {
          console.error("音声再生エラー", e);
        });
      }
      setTimeout(() => {
        setStamps((prev) => prev.filter((s) => s.id !== id));
      }, 2000);
    });
    socket.on("clap", () => {
      const id = uuidv4();
      const x = Math.random() * 70 + 10;
      setStamps((prev) => [...prev, { id, type: "clap", x }]);
      setTimeout(() => {
        setStamps((prev) => prev.filter((s) => s.id !== id));
      }, 3000);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const original = document.body.style.background;
    document.body.style.background = "transparent";
    return () => {
      document.body.style.background = original;
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
      {stamps.map((s) =>
        s.type === "stamp" ? (
          <div key={s.id} style={{
            animation: "pop 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: "auto",
            pointerEvents: "none"
          }}>
            <Image src="/stamp.png" alt="ちょっと待て！！スタンプ" width={600} height={600} priority style={{ transition: "transform 0.2s", maxWidth: "90vw", maxHeight: "90vh" }} />
          </div>
        ) : (
          <div key={s.id} style={{
            animation: `clap-float-random 3s cubic-bezier(0.22, 1, 0.36, 1)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: `${s.x ?? 50}%`,
            top: "70%",
            pointerEvents: "none",
            transform: "translate(-50%, 0)",
          }}>
            <Image src="/clap.png" alt="拍手" width={180} height={180} priority style={{ maxWidth: "30vw", maxHeight: "30vh" }} />
          </div>
        )
      )}
      <style>{`
        @keyframes pop {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes clap-float-random {
          0% { transform: translate(-50%, 0) scale(0.7); opacity: 0; }
          10% { opacity: 1; }
          60% { transform: translate(-50%, -80px) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -240px) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
} 