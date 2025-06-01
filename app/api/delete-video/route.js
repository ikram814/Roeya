import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const { videoUrl } = await req.json();
    
    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    // Extraire le nom du fichier de l'URL
    const filename = videoUrl.split('/').pop();
    const filePath = path.join(process.cwd(), 'public', 'videos', filename);

    // Vérifier si le fichier existe
    if (fs.existsSync(filePath)) {
      // Supprimer le fichier
      fs.unlinkSync(filePath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting video file:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 