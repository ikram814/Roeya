"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const styleOptions = [
  "cinematic landscape",
  "ultra detailed",
  "4k",
  "photorealistic",
  "beautiful lighting",
  "dramatic shadows",
  "trending on artstation",
  "hyper-realistic",
  "masterpiece",
  "high contrast",
  "HDR",
  "cyberpunk",
  "fantasy",
  "neon lights",
  "vibrant colors",
  "epic composition",
  "cinematic lighting",
  "sharp focus",
  "octane render",
  "unreal engine",
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [numSteps, setNumSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleStyleToggle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);

      // Construire le prompt final avec les styles
      const finalPrompt =
        selectedStyles.length > 0
          ? `${prompt}, ${selectedStyles.join(", ")}`
          : prompt;

      // Créer un formulaire pour envoyer les données au script Python
      const formData = new FormData();
      formData.append("prompt", finalPrompt);
      formData.append("width", width.toString());
      formData.append("height", height.toString());
      formData.append("num_steps", numSteps.toString());
      formData.append("guidance_scale", guidanceScale.toString());

      // Exécuter le script Python via un endpoint qui exécute directement le script
      const response = await fetch("/api/run-python", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      if (data.success) {
        // Mettre à jour les images générées
        setGeneratedImages(data.images.map((img: any) => img.path));
      } else {
        console.error("Failed to generate images:", data.error);
      }
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background p-4">
      <Card className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Générateur d&apos;Images IA</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt">Description de l&apos;image</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décrivez l'image que vous souhaitez générer..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>Styles</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {styleOptions.map((style) => (
                <Button
                  key={style}
                  variant={
                    selectedStyles.includes(style) ? "default" : "outline"
                  }
                  onClick={() => handleStyleToggle(style)}
                  className="text-sm"
                >
                  {style}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Largeur: {width}px</Label>
              <Input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                min={256}
                max={1024}
                step={64}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Hauteur: {height}px</Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min={256}
                max={1024}
                step={64}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Étapes de diffusion: {numSteps}</Label>
            <Input
              type="number"
              value={numSteps}
              onChange={(e) => setNumSteps(Number(e.target.value))}
              min={20}
              max={50}
              step={1}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Guidance Scale: {guidanceScale}</Label>
            <Input
              type="number"
              value={guidanceScale}
              onChange={(e) => setGuidanceScale(Number(e.target.value))}
              min={1}
              max={20}
              step={0.5}
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              "Générer l'image"
            )}
          </Button>
        </div>

        {generatedImages.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Images générées</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedImages.map((imagePath, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={imagePath}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </main>
  );
}
