import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function generateImage(
  prompt: string,
  options: {
    width?: number;
    height?: number;
    numImages?: number;
    numInferenceSteps?: number;
    guidanceScale?: number;
    styles?: string[];
  }
) {
  const {
    width = 512,
    height = 512,
    numImages = 1,
    numInferenceSteps = 30,
    guidanceScale = 7.5,
    styles = [],
  } = options;

  // Construire le prompt final avec les styles
  const finalPrompt =
    styles.length > 0 ? `${prompt}, ${styles.join(", ")}` : prompt;

  try {
    // Exécuter le script Python
    const pythonScript = path.join(
      process.cwd(),
      "scripts",
      "generate_image.py"
    );
    const pythonProcess = spawn("python", [
      pythonScript,
      "--prompt",
      finalPrompt,
      "--width",
      width.toString(),
      "--height",
      height.toString(),
      "--num_images",
      numImages.toString(),
      "--num_inference_steps",
      numInferenceSteps.toString(),
      "--guidance_scale",
      guidanceScale.toString(),
    ]);

    return new Promise((resolve, reject) => {
      let output = "";
      let error = "";

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${error}`));
          return;
        }
        resolve(output);
      });
    });
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}
