// pages/create-link.js
import { useState } from "react";

export default function CreateLink() {
  const [q, setQ] = useState("flowers");
  const [days, setDays] = useState(30);
  const [shareUrl, setShareUrl] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/create-link", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ q, days: Number(days) })
    });
    const data = await res.json();
    setShareUrl(data.shareUrl || (data.error || ""));
  };

  return (
    <div style={{padding:20}}>
      <h1>Create expiring Shutterstock search link</h1>
      <form onSubmit={onSubmit} style={{display:"grid", gap:10, maxWidth:600}}>
        <label>Search query: <input value={q} onChange={e=>setQ(e.target.value)} /></label>
        <label>Expire (days): <input type="number" value={days} onChange={e=>setDays(e.target.value)} /></label>
        <button type="submit">Generate</button>
      </form>

      {shareUrl && (
        <p style={{marginTop:12}}>
          Share URL: <a href={shareUrl} target="_blank" rel="noreferrer">{shareUrl}</a>
        </p>
      )}
    </div>
  );
}
