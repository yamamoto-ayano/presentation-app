"use client"
import { useState } from "react";

export default function Setting() {
  const [keyword, setKeyword] = useState("");
  const [saved, setSaved] = useState(false);
  const participantUrl = typeof window !== "undefined"
    ? `${window.location.origin}/`
    : "";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#222" }}>
      <h1 style={{ color: "#fff", fontSize: 32, marginBottom: 32 }}>設定画面</h1>
      <div style={{ background: "#fff", borderRadius: 12, padding: 32, minWidth: 320, boxShadow: "0 2px 16px #0002" }}>
        <label style={{ fontWeight: "bold", fontSize: 18 }}>合言葉（キーワード）</label>
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ width: "100%", fontSize: 20, padding: 8, margin: "12px 0 20px 0", borderRadius: 6, border: "1px solid #ccc" }}
          placeholder="例: 1234"
        />
        <button
          onClick={handleSave}
          style={{
            fontSize: 18,
            background: saved ? "#43a047" : "#e53935",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 32px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s",
            marginBottom: 16,
          }}
        >
          {saved ? "保存しました！" : "保存"}
        </button>
        <div style={{ margin: "20px 0 8px 0", fontWeight: "bold" }}>参加者用URL</div>
        <div style={{ background: "#f5f5f5", padding: 8, borderRadius: 6, fontSize: 16, wordBreak: "break-all" }}>{participantUrl}</div>
        <div style={{ margin: "20px 0 8px 0", fontWeight: "bold" }}>QRコード（ダミー）</div>
        <div style={{ background: "#eee", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, color: "#888" }}>
          QR
        </div>
      </div>
    </div>
  );
} 