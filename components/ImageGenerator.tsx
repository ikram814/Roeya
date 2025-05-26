import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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

export function ImageGenerator() {
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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          options: {
            width,
            height,
            numInferenceSteps: numSteps,
            guidanceScale,
            styles: selectedStyles,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
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
    <div className="container mx-auto p-4">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Générateur d'Images IA</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt">Description de l'image</Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Décrivez l'image que vous souhaitez générer..."
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
              <Slider
                value={[width]}
                onValueChange={([value]) => setWidth(value)}
                min={256}
                max={1024}
                step={64}
              />
            </div>
            <div>
              <Label>Hauteur: {height}px</Label>
              <Slider
                value={[height]}
                onValueChange={([value]) => setHeight(value)}
                min={256}
                max={1024}
                step={64}
              />
            </div>
          </div>

          <div>
            <Label>Étapes de diffusion: {numSteps}</Label>
            <Slider
              value={[numSteps]}
              onValueChange={([value]) => setNumSteps(value)}
              min={20}
              max={50}
              step={1}
            />
          </div>

          <div>
            <Label>Guidance Scale: {guidanceScale}</Label>
            <Slider
              value={[guidanceScale]}
              onValueChange={([value]) => setGuidanceScale(value)}
              min={1}
              max={20}
              step={0.5}
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
    </div>
  );
}
