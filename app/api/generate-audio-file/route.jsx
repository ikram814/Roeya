import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import say from 'say';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req) {
  try {
    const { text, id } = await req.json();
    const outputPath = `./public/audio/${id}.mp3`;

    // Génère l'audio avec say
    await new Promise((resolve, reject) => {
      say.export(text, null, 1.0, outputPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Upload sur Cloudinary
    const result = await cloudinary.uploader.upload(outputPath, {
      resource_type: 'video', // pour les fichiers audio/vidéo
      folder: 'audio' // optionnel, pour organiser tes fichiers
    });

    // Supprime le fichier local après upload
    fs.unlinkSync(outputPath);

    // Retourne l'URL publique Cloudinary
    return Response.json({ status: 'ok', url: result.secure_url });
  } catch (err) {
    console.error('❌ Erreur generate-audio-file :', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
