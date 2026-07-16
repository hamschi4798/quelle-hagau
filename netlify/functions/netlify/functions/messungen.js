import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("quelle-hagau");
  const SECRET = Netlify.env.get("APP_PASSWORD");

  if (!SECRET) {
    return new Response(JSON.stringify({ error: "server_not_configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const auth = req.headers.get("x-app-password");
  if (auth !== SECRET) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "GET") {
    const data = await store.get("messungen", { type: "json" });
    return new Response(JSON.stringify(data ?? null), {
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "PUT" || req.method === "POST") {
    const body = await req.json();
    await store.setJSON("messungen", body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/messungen" };
