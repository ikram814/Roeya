import { NextResponse } from "next/server";
import { generateImage } from "@/lib/imageGenerator";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, options } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await generateImage(prompt, options);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in generate endpoint:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
