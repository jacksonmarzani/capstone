import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get("target");
  const username = request.nextUrl.searchParams.get("username");
  const password = request.nextUrl.searchParams.get("password");

  if (!target) {
    return new Response("Missing target URL", {
      status: 400,
    });
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(target);
  } catch {
    return new Response("Invalid target URL", {
      status: 400,
    });
  }

  const headers = new Headers();

  if (username && password) {
    const auth = Buffer.from(username + ":" + password).toString("base64");
    headers.set("Authorization", "Basic " + auth);
  }

  let response: Response;

  try {
    response = await fetch(parsedUrl.toString(), {
      headers,
      cache: "no-store",
    });
  } catch (error) {
    console.error("Proxy fetch failed:", error);

    return new Response("Failed to connect to camera stream", {
      status: 502,
    });
  }

  if (!response.ok || !response.body) {
    return new Response("Failed to connect to camera stream", {
      status: 502,
    });
  }

  const contentType =
    response.headers.get("content-type") || "application/octet-stream";

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Connection: "keep-alive",
    },
  });
}