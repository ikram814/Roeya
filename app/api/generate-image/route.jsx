import axios from 'axios';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/configs/db';
import { VideoData } from '@/configs/schema';
import { eq } from 'drizzle-orm';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(req) {
    try {
        const { prompt, videoId } = await req.json();
        
        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const response = await axios.post(
            'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
            {
                inputs: prompt,
                options: {
                    wait_for_model: true
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'image/png'
                },
                responseType: 'arraybuffer'
            }
        );

        // Convert arraybuffer to base64
        const base64Image = Buffer.from(response.data).toString('base64');
        const dataURI = `data:image/png;base64,${base64Image}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'generated-images',
            resource_type: 'image'
        });

        // Si un videoId est fourni, mettre à jour la base de données
        if (videoId) {
            const video = await db.select().from(VideoData).where(eq(VideoData.id, videoId));
            if (video.length > 0) {
                const currentImages = video[0].imageList || [];
                await db.update(VideoData)
                    .set({
                        imageList: [...currentImages, result.secure_url]
                    })
                    .where(eq(VideoData.id, videoId));
            }
        }

        return NextResponse.json(
            {
                result: result.secure_url
            },
            {
                status: 200,
                headers: {
                    'Cache-Control': 'public, max-age=31536000',
                }
            }
        );

    } catch (error) {
        console.error('Error generating image:', error?.response?.data || error.message);
        return NextResponse.json(
            { error: 'Error generating image' },
            { status: 500 }
        );
    }
}