// pages/api/create-link.js
import { SignJWT } from "jose";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { q, days } = req.body || {};
    if (!q || typeof q !== "string") return res.status(400).json({ error: "q (search query) required" });

    const expiresInDays = Number.isFinite(Number(days)) ? Number(days) : 30;
    const secret = process.env.LINK_SECRET;
    if (!secret) return res.status(500).json({ error: "LINK_SECRET not configured" });

    const secretKey = new TextEncoder().encode(secret);
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + expiresInDays * 24 * 60 * 60;

    const token = await new SignJWT({ q })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(iat)
      .setExpirationTime(exp)
      .sign(secretKey);

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://localhost:3000`;
    const shareUrl = `${baseUrl}/s/${token}`;

    return res.status(200).json({ shareUrl, expiresInDays });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal error" });
  }
}
