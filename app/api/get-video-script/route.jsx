// route.js
import { callLlama3 } from "@/configs/aimodel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log("Prompt received:", prompt);
    console.log("Avant appel Llama3");
    const result = await callLlama3(prompt);
    console.log("Après appel Llama3");
    console.log("LLaMA 3 result:", result);

    // Après avoir reçu la réponse de Llama3 dans la variable "result"
    let json = null;
    try {
      // Supposons que 'result' contient la réponse texte de Llama3
      // On extrait le premier tableau JSON trouvé dans la réponse
      const match = result.match(/\[\s*{[\s\S]*?}\s*\]/);
      if (!match) {
        throw new Error("Aucun JSON valide trouvé dans la réponse Llama3");
      }
      const json = JSON.parse(match[0]);
      return NextResponse.json({ result: json });
    } catch (e) {
      throw new Error("Aucun JSON valide trouvé dans la réponse Llama3");
    }
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json({ error: e.toString() }, { status: 500 });
  }
}
