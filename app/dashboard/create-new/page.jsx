"use client"
import React, { useContext, useEffect, useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import {Outfit} from 'next/font/google'
import SelectDuration from './_components/SelectDuration'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import CustomLoading from './_components/Loading'
import {v4 as uuidv4} from 'uuid'
import { VideoDataContext } from '@/app/_context/VideoDataContext'
import { Users, VideoData } from '@/configs/schema'
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs/db'
import dynamic from 'next/dynamic'
import { UserDetailContext } from '@/app/_context/UserDetailContext'
import { toast } from 'sonner'
import { eq } from 'drizzle-orm'
import Navbar from '@/components/shared/Sidebar'

const outfit = Outfit({subsets: ["latin-ext"],weight: "600"});
const PlayerDialog = dynamic(() => import('../_components/PlayerDialog'), { ssr: false });

function CreateNew() {

  const [formData,setFormData]= useState([]);
  const [loading,setLoading]=useState(false);
  const [videoScript,setVideoScript]=useState();
  const [audioFileUrl,setAudioFileUrl]=useState();
  const [caption,setCaption]=useState();
  const [imageList,setImageList]=useState();
  const {videoData,setVideoData} = useContext(VideoDataContext);
  const {user}=useUser();
  const [playVideo,setPlayVideo]=useState();
  const [videoid,setVideoid]=useState();
  const {userDetail,setUserDetail}=useContext(UserDetailContext);



  const onHandleChange=(fieldName,fieldValue)=>{
    setFormData(
      prev=>({
        ...prev,
        [fieldName]:fieldValue
      })
    )
  }

  const onCreateClickHandler=()=>{
    if (userDetail?.credits<=0)
    {
      console.log(userDetail?.credits);
      toast('You do not have enough credits to create a video. Please buy more credits to continue.');
      return;
    }
    GetVideoScript();
  }

  const GetVideoScript = async () => {
  setLoading(true);

  const fixedPrompt =
    `Generate ONLY a valid JSON array for a video script of ${formData.duration} on the topic "${formData.topic}". 
Each array element must be an object with two fields: 
- "imagePrompt": a short AI image prompt in ${formData.imageStyle} style for the scene,
- "contentText": the narration for the scene.
Do NOT include any text, explanation, or markdown. Respond ONLY with the JSON array. Example:
[
  {"imagePrompt": "...", "contentText": "..."},
  {"imagePrompt": "...", "contentText": "..."}
]`;

  try {
    const result = await axios.post('/api/get-video-script', {
      prompt: fixedPrompt
    });

    console.log("Réponse brute Llama3 :", result.data?.result);

    if (result.data && result.data.result) {
      let scenesArr = [];
      try {
        const parsed = typeof result.data.result === 'string'
          ? JSON.parse(result.data.result)
          : result.data.result;
        if (Array.isArray(parsed)) {
          scenesArr = parsed;
        } else {
          scenesArr = parsed.scenes || parsed.video || [];
        }
      } catch (e) {
        console.error("Erreur de parsing du script :", e);
      }

      setVideoScript(scenesArr);
      await GetAudioFile(scenesArr);
    }
  } catch (error) {
    console.error("Error getting script:", error);
  } finally {
    setLoading(false);
  }
};


  const GetAudioFile = async (videoScriptData) => {
    let script = "";
    const id = uuidv4();

    videoScriptData.forEach((item) => {
      script += item.contentText + " ";
    });

    console.log("SCRIPT GÉNÉRÉ POUR AUDIO :", script);

    try {
      const response = await axios.post(
        "/api/generate-audio-file",
        {
          text: script,
          id: id,
        },
        { responseType: "json" }
      );

      const audioUrl = response.data.url;
      console.log("URL envoyée à GenerateAudioCaption :", audioUrl);

      // Mettre à jour videoData avec le script et l'URL audio
      const updatedVideoData = {
        ...videoData,
        videoScript: videoScriptData,
        audioFileUrl: audioUrl
      };
      setVideoData(updatedVideoData);
      setAudioFileUrl(audioUrl);

      // Générer les captions avec l'URL audio
      await GenerateAudioCaption(audioUrl, videoScriptData, updatedVideoData);
    } catch (error) {
      console.error("Error generating audio:", error);
      setLoading(false);
    }
  };


  const GenerateAudioCaption = async (fileUrl, videoScriptData, currentVideoData) => {
    try {
      console.log('Appel GenerateAudioCaption avec :', fileUrl);
      const res = await axios.post('/api/generate-caption', {
        audioFileUrl: fileUrl
      });
      console.log('REPONSE COMPLETE CAPTION :', res.data);
      console.log('CAPTIONS GENERES :', res.data.result);
      
      // Mettre à jour videoData avec les captions
      const updatedVideoData = {
        ...currentVideoData,
        captions: res?.data?.result
      };
      setVideoData(updatedVideoData);
      setCaption(res?.data?.result);

      // Vérifier que toutes les données sont présentes avant de générer les images
      if (videoScriptData && fileUrl && res?.data?.result) {
        await GenerateImage(videoScriptData, updatedVideoData);
      } else {
        console.error('Missing data for image generation:', {
          videoScriptData,
          audioFileUrl: fileUrl,
          caption: res?.data?.result
        });
      }
    } catch (e) {
      console.error('Erreur dans GenerateAudioCaption :', e);
      setLoading(false);
    }
  }

  const GenerateImage = async(videoScriptData, currentVideoData) => {
    let images = [];
    
    // Vérifier que toutes les données requises sont présentes
    if (!videoScriptData || !currentVideoData?.audioFileUrl || !currentVideoData?.captions) {
      console.error('Missing required data:', { 
        videoScriptData, 
        audioFileUrl: currentVideoData?.audioFileUrl, 
        caption: currentVideoData?.captions 
      });
      return;
    }

    try {
      // Créer d'abord l'entrée dans la base de données
      const videoResult = await db.insert(VideoData).values({
        script: videoScriptData,
        audioFileUrl: currentVideoData.audioFileUrl,
        captions: currentVideoData.captions,
        imageList: [],
        createdBy: user?.primaryEmailAddress?.emailAddress
      }).returning({id:VideoData?.id});

      const videoId = videoResult[0].id;
      setVideoid(videoId);

      for (const element of videoScriptData){
        try{
          const res = await axios.post('/api/generate-image',
            {
              prompt: element.imagePrompt,
              videoId: videoId
            });
            images.push(res.data.result);
        }
        catch(e){
          console.log('ERROR'+e);
        }
      }

      // Mettre à jour le videoData avec les nouvelles images
      const updatedVideoData = {
        ...currentVideoData,
        imageList: images
      };

      setVideoData(updatedVideoData);
      setImageList(images);
      setLoading(false);
      setPlayVideo(true);
    } catch (error) {
      console.error('Error in GenerateImage:', error);
      setLoading(false);
    }
  }

  const SaveVideoData = async (videoData)=>{
    if (!videoid) {
      console.error('No video ID available');
      return;
    }

    setLoading(true);
    try {
      // Mettre à jour l'entrée existante
      const result = await db.update(VideoData)
        .set({
          script: videoData?.videoScript,
          audioFileUrl: videoData?.audioFileUrl,
          captions: videoData?.captions,
          imageList: videoData?.imageList
        })
        .where(eq(VideoData.id, videoid))
        .returning({id:VideoData?.id});

      await UpdateUserCredits();
    } catch (error) {
      console.error('Error saving video data:', error);
    } finally {
      setLoading(false);
    }
  }

  const UpdateUserCredits=async()=>{
    const result =await db.update(Users).set({
      credits: userDetail?.credits-10
    }).where(eq(Users?.email,user?.primaryEmailAddress?.emailAddress))

    setUserDetail(prev=>({
      ...prev,
      "credits": userDetail?.credits-10
    }))
  }
  
  const uploadAudioToSupabase = async (audioBlob, id) => {
    const formData = new FormData();
    formData.append('file', new File([audioBlob], `${id}.mp3`, { type: 'audio/mp3' }));
    formData.append('id', id);

    const res = await fetch('/api/upload-audio', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    console.log("Fichier disponible ici :", data.url);
    // Tu peux aussi setAudioFileUrl(data.url) ici si tu veux
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className='max-w-4xl mx-auto px-8 sm:px-16 lg:px-64 mt-20 ml-8'>
        <h2 className={`text-4xl text-primary text-center ${outfit.className}`}>Create A New Video</h2>
        <div className='mt-7'>
          <SelectTopic onUserSelect={onHandleChange}/>
          <div className='mt-8'>
            <SelectStyle onUserSelect={onHandleChange}/>
          </div>
          <div className='mt-8'>
            <SelectDuration onUserSelect={onHandleChange}/>
          </div>
          <Button className='mt-10 w-full h-10' onClick={onCreateClickHandler}>
            Generate The Video
          </Button>
        </div>
        <CustomLoading loading={loading}/>
        <PlayerDialog playVideo={playVideo} videoid={videoid}/>
      </div>
    </div>
  )
}

export default CreateNew