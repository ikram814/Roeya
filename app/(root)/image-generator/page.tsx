"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWandMagicSparkles,
  faMoon,
  faSun,
  faDice,
  faWandSparkles,
  faDownload,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
//import "./styles.css";
import { useRouter } from "next/navigation";

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

export default function ImageGenerator() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [numSteps, setNumSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleStyleToggle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleRandomPrompt = () => {
    const randomPrompts = [
      "A magic forest with glowing plants and fairy homes among giant mushrooms",
      "An old steampunk airship floating through golden clouds at sunset",
      "A future Mars colony with glass domes and gardens against red mountains",
      "A dragon sleeping on gold coins in a crystal cave",
      "An underwater kingdom with merpeople and glowing coral buildings",
    ];
    const randomPrompt =
      randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(randomPrompt);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    try {
      setIsGenerating(true);

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

      // Exécuter le script Python
      const response = await fetch("/api/run-python", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.json();
      if (data.success) {
        setGeneratedImages(data.images.map((img: any) => img.path));
      } else {
        console.error("Failed to generate images:", data.error);
      }
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <h1 className="text-center pt-8 h1-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-4xl font-bold text-transparent">
        Generate Image
      </h1>

      <form onSubmit={handleGenerate} className="p-8 space-y-6 bg-transparent">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            className="w-full min-h-[120px] rounded-xl border-2 border-purple-100/50 dark:border-gray-700/50 bg-transparent p-4 text-black dark:text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200/50 dark:focus:ring-purple-700/50 placeholder-black/70 dark:placeholder-white/70"
            placeholder="Describe your imagination in detail..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            autoFocus
          />
          <button
            type="button"
            className="absolute bottom-4 right-4 rounded-full bg-purple-500/80 p-2 text-white transition-all hover:bg-purple-600 hover:shadow-md"
            onClick={handleRandomPrompt}
          >
            <FontAwesomeIcon icon={faDice} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 max-w-4xl mx-auto">
          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border-2 border-purple-100/50 dark:border-gray-700/50 bg-transparent p-3 pr-10 text-black dark:text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200/50 dark:focus:ring-purple-700/50"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              required
            >
              <option value="512">512px</option>
              <option value="768">768px</option>
              <option value="1024">1024px</option>
            </select>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 dark:text-white/70 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border-2 border-purple-100/50 dark:border-gray-700/50 bg-transparent p-3 pr-10 text-black dark:text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200/50 dark:focus:ring-purple-700/50"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              required
            >
              <option value="512">512px</option>
              <option value="768">768px</option>
              <option value="1024">1024px</option>
            </select>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 dark:text-white/70 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              className="w-full appearance-none rounded-xl border-2 border-purple-100/50 dark:border-gray-700/50 bg-transparent p-3 pr-10 text-black dark:text-white shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200/50 dark:focus:ring-purple-700/50"
              value={numSteps}
              onChange={(e) => setNumSteps(Number(e.target.value))}
              required
            >
              <option value="20">20 Steps</option>
              <option value="30">30 Steps</option>
              <option value="40">40 Steps</option>
              <option value="50">50 Steps</option>
            </select>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/70 dark:text-white/70 pointer-events-none"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-purple-500/80 px-6 py-3 font-medium text-white transition-all hover:bg-purple-600 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isGenerating}
          >
            <FontAwesomeIcon icon={faWandSparkles} />
            {isGenerating ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">Styles</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {styleOptions.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => handleStyleToggle(style)}
                className={`p-2 rounded-lg text-sm transition-all ${
                  selectedStyles.includes(style)
                    ? "bg-purple-500 text-white"
                    : "bg-purple-100/50 dark:bg-gray-700/50 text-black dark:text-white hover:bg-purple-200/50 dark:hover:bg-gray-600/50"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {generatedImages.map((imagePath, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-xl border-2 border-purple-100 dark:border-gray-700 bg-white dark:bg-black"
            >
              <img
                src={imagePath}
                alt={`Generated image ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100">
                <a
                  href={imagePath}
                  download={`generated_image_${index + 1}.png`}
                  className="rounded-full bg-white p-3 text-purple-500 transition-transform hover:scale-110"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </form>
    </>
  );
}
