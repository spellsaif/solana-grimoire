import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const programId = searchParams.get("programId");

  if (!programId) {
    return NextResponse.json({ error: "Program ID is required" }, { status: 400 });
  }

  try {
    const explorerUrl = `https://explorer.solana.com/address/${programId}/anchor-program?cluster=devnet`;
    const { data } = await axios.get(explorerUrl);
    const $ = cheerio.load(data);

    // Find the "Download IDL" button and extract the link
    const idlDownloadLink = $("a:contains('Download IDL')").attr("href");

    if (!idlDownloadLink) {
      return NextResponse.json({ error: "IDL not found for this program" }, { status: 404 });
    }

    const fullDownloadUrl = `https://explorer.solana.com${idlDownloadLink}`;
    return NextResponse.json({ downloadUrl: fullDownloadUrl });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch IDL" }, { status: 500 });
  }
}
