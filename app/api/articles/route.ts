import { NextRequest, NextResponse } from "next/server";

// Proxy request to Java backend to avoid CORS issues and centralise URL.
export async function GET(req: NextRequest) {
  // we no longer need offset/limit; backend returns up to 60 stored articles
  const backendUrl = `http://localhost:8080/articles`;

  try {
    const res = await fetch(backendUrl);
    if (!res.ok) {
      return NextResponse.json({ error: "backend error" }, { status: res.status });
    }
    const data = await res.json();
    console.log("json:" + JSON.stringify(data, null, 2));
    // return whatever we got (entities will match Article interface closely)
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "backend fetch failed" }, { status: 500 });
  }
}
