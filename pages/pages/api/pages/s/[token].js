// pages/s/[token].js
import { jwtVerify } from "jose";

export async function getServerSideProps(context) {
  const { token } = context.params || {};
  const secret = process.env.LINK_SECRET;
  if (!secret) {
    return { redirect: { destination: "/expired?reason=misconfig", permanent: false } };
  }

  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey);
    const q = payload?.q;

    if (typeof q !== "string" || q.trim() === "") {
      return { redirect: { destination: "/expired?reason=bad-target", permanent: false } };
    }

    return { redirect: { destination: `/search?q=${encodeURIComponent(q)}`, permanent: false } };
  } catch (e) {
    return { redirect: { destination: "/expired?reason=expired", permanent: false } };
  }
}

export default function RedirectPage() { return null; }
