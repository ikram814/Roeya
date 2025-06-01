import React, { useEffect, useState } from 'react';
import {Player} from '@remotion/player';

import {
    Dialog,
    DialogContent,
    DialogTitle,

  } from "@/components/ui/dialog"
  
import RemotionVideo from './RemotionVideo';
import { Button } from '@/components/ui/button';
import { db } from '@/configs/db';
import { VideoData } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

  
function PlayerDialog({playVideo,videoid}) {
    const [openDialog,setOpenDialog]=useState(true);
    const [videoData,setVideoData]=useState();
    const [durationinFrames,setDurationinFrames]=useState(100);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setOpenDialog(!openDialog)
        videoid&&GetVideoData();
    },[playVideo])

    //   useEffect(() => {
    //       if (!openDialog) {
    //           router.replace('/dashboard');
    //       }
    //   }, [openDialog, router]);

    const GetVideoData = async ()=>{
        const result = await db.select().from(VideoData)
        .where(eq(VideoData.id,videoid));
        setVideoData(result[0]);

    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            
            // Supprimer la vidéo de la base de données
            await db.delete(VideoData)
                .where(eq(VideoData.id, videoid));

            // Si la vidéo a été uploadée, supprimer aussi le fichier
            if (videoData?.videoFileUrl) {
                const response = await fetch('/api/delete-video', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ videoUrl: videoData.videoFileUrl }),
                });

                if (!response.ok) {
                    throw new Error('Failed to delete video file');
                }
            }

            toast.success('Video deleted successfully!');
            setOpenDialog(false);
        } catch (error) {
            console.error('Error deleting video:', error);
            toast.error(error.message || 'Failed to delete video');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpload = async () => {
        try {
            setIsUploading(true);
            
            // Appeler l'API de rendu
            const response = await fetch('/api/render', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(videoData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to render video');
            }

            // Mettre à jour l'URL de la vidéo dans la base de données
            await db.update(VideoData)
                .set({
                    videoFileUrl: data.videoUrl
                })
                .where(eq(VideoData.id, videoid));

            toast.success('Video uploaded successfully!');
            setOpenDialog(false);
        } catch (error) {
            console.error('Error uploading video:', error);
            toast.error(error.message || 'Failed to upload video');
        } finally {
            setIsUploading(false);
        }
    };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="bg-white flex flex-col items-center max-w-md w-[400px] p-6">
        <DialogTitle className="text-2xl font-bold my-4 text-center">Your Video is Generated</DialogTitle>
        <Player
          component={RemotionVideo}
          durationInFrames={Number(durationinFrames.toFixed(0))}
          compositionWidth={300}
          compositionHeight={480}
          fps={30}
          controls={true}
          inputProps={{
              ...videoData,
              setDurationinFrames:(frameValue)=>setDurationinFrames(frameValue)
          }}
        />
        <div className="flex w-full justify-between mt-6 gap-4">
          <Button 
              variant="ghost" 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 w-1/2"
          >
              {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
          <Button onClick={handleUpload} disabled={isUploading} className="w-1/2">
              {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PlayerDialog