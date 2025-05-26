import torch
from diffusers import StableDiffusionPipeline
import argparse
import json
from pathlib import Path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--prompt", type=str, required=True)
    parser.add_argument("--width", type=int, default=512)
    parser.add_argument("--height", type=int, default=512)
    parser.add_argument("--num_inference_steps", type=int, default=20)
    parser.add_argument("--guidance_scale", type=float, default=7.5)
    args = parser.parse_args()

    # Utiliser un modèle plus léger et plus stable
    model_id = "CompVis/stable-diffusion-v1-4"
    
    try:
        # Optimiser l'utilisation de la mémoire
        pipe = StableDiffusionPipeline.from_pretrained(
            model_id,
            torch_dtype=torch.float32,  # Utiliser float32 pour plus de stabilité
            safety_checker=None,  # Désactiver le safety checker pour économiser de la mémoire
            requires_safety_checker=False
        )

        # Déplacer le modèle sur CPU
        pipe = pipe.to("cpu")
        
        # Activer les optimisations de mémoire
        pipe.enable_attention_slicing()
        pipe.enable_vae_tiling()

        # Générer l'image
        with torch.no_grad():
            image = pipe(
                prompt=args.prompt,
                width=args.width,
                height=args.height,
                num_inference_steps=args.num_inference_steps,
                guidance_scale=args.guidance_scale
            ).images[0]

        # Créer le dossier generated s'il n'existe pas
        output_dir = Path("public/generated")
        output_dir.mkdir(parents=True, exist_ok=True)

        # Sauvegarder l'image
        image_path = output_dir / f"image_{int(torch.rand(1).item() * 1000000)}.png"
        image.save(image_path)

        # Retourner le chemin de l'image
        print(json.dumps({
            "success": True,
            "images": [{"path": f"/generated/{image_path.name}"}]
        }))

    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        raise

if __name__ == "__main__":
    main() 