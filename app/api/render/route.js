import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export async function POST(req) {
  let propsPath;
  try {
    const data = await req.json();
    
    // Créer un nom de fichier unique
    const outputFilename = `video-${Date.now()}.mp4`;
    const outputPath = path.join(process.cwd(), 'public', 'videos', outputFilename);

    // Créer le dossier videos s'il n'existe pas
    if (!fs.existsSync(path.join(process.cwd(), 'public', 'videos'))) {
      fs.mkdirSync(path.join(process.cwd(), 'public', 'videos'), { recursive: true });
    }

    // Sauvegarder les props dans un fichier temporaire
    propsPath = path.join(process.cwd(), 'temp-props.json');
    fs.writeFileSync(propsPath, JSON.stringify(data));

    // Exécuter la commande de rendu Remotion avec le point d'entrée correct
    const entryPoint = path.join(process.cwd(), 'remotion', 'index.jsx');
    const command = `npx remotion render "${entryPoint}" RemotionVideo "${outputPath}" --props="${propsPath}"`;
    
    await execAsync(command);

    // Retourner l'URL de la vidéo générée
    return NextResponse.json({ 
      success: true, 
      videoUrl: `/videos/${outputFilename}` 
    });

  } catch (error) {
    console.error('Error rendering video:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // Nettoyer le fichier temporaire
    if (propsPath && fs.existsSync(propsPath)) {
      try {
        fs.unlinkSync(propsPath);
      } catch (e) {
        console.error('Error cleaning up temp file:', e);
      }
    }
  }
} 