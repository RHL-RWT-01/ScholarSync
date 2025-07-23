import { fetchScholarData } from "@/lib/fetchScholarData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { scholarName  } = await req.json();

    const scholarData = await fetchScholarData(scholarName );
    return NextResponse.json(scholarData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch scholar data" },
      { status: 500 }
    );
  }
}
