import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Récupérer les paramètres du formulaire
    const prompt = formData.get("prompt") as string;
    const width = formData.get("width") as string;
    const height = formData.get("height") as string;
    const numSteps = formData.get("num_steps") as string;
    const guidanceScale = formData.get("guidance_scale") as string;

    // Vérifier que le script Python existe
    const pythonScript = path.join(
      process.cwd(),
      "scripts",
      "generate_image.py"
    );
    if (!fs.existsSync(pythonScript)) {
      console.error("Python script not found at:", pythonScript);
      return NextResponse.json(
        { success: false, error: "Python script not found" },
        { status: 500 }
      );
    }

    // Créer le dossier generated s'il n'existe pas
    const generatedDir = path.join(process.cwd(), "public", "generated");
    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true });
    }

    console.log("Executing Python script with parameters:", {
      prompt,
      width,
      height,
      numSteps,
      guidanceScale,
    });

    // Définir les variables d'environnement pour optimiser l'utilisation de la mémoire
    const env = {
      ...process.env,
      PYTORCH_CUDA_ALLOC_CONF: "max_split_size_mb:512",
      TF_ENABLE_ONEDNN_OPTS: "0",
    };

    // Exécuter le script Python avec les paramètres
    const pythonProcess = spawn(
      "python",
      [
        pythonScript,
        "--prompt",
        prompt,
        "--width",
        width,
        "--height",
        height,
        "--num_inference_steps",
        numSteps,
        "--guidance_scale",
        guidanceScale,
      ],
      { env }
    );

    return new Promise((resolve) => {
      let output = "";
      let error = "";

      pythonProcess.stdout.on("data", (data) => {
        const chunk = data.toString();
        console.log("Python stdout:", chunk);
        output += chunk;
      });

      pythonProcess.stderr.on("data", (data) => {
        const chunk = data.toString();
        console.error("Python stderr:", chunk);
        error += chunk;
      });

      pythonProcess.on("close", (code) => {
        console.log("Python process exited with code:", code);

        if (code !== 0) {
          // Vérifier si l'erreur est liée à la mémoire
          if (
            error.includes("MemoryError") ||
            error.includes("paging file is too small")
          ) {
            resolve(
              NextResponse.json(
                {
                  success: false,
                  error:
                    "Not enough memory to generate the image. Please try with a smaller image size or fewer steps.",
                  details: error,
                },
                { status: 500 }
              )
            );
            return;
          }

          resolve(
            NextResponse.json(
              {
                success: false,
                error: `Python script failed with code ${code}: ${error}`,
              },
              { status: 500 }
            )
          );
          return;
        }

        try {
          const result = JSON.parse(output);
          resolve(NextResponse.json({ success: true, ...result }));
        } catch (e) {
          console.error("Failed to parse Python output:", e);
          console.error("Raw output:", output);
          resolve(
            NextResponse.json(
              {
                success: false,
                error: "Failed to parse Python script output",
                rawOutput: output,
              },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error("Error in run-python endpoint:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
