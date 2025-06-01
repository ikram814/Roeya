import React, { useState } from 'react'
import { Thumbnail } from "@remotion/player";
import RemotionVideo from './RemotionVideo';
import dynamic from 'next/dynamic';
const PlayerDialog = dynamic(() => import('./PlayerDialog'), { ssr: false });

function VideoList({videoList}) {
    const [openPlayDialog,setOpenPlayDialog]=useState(false);
    const [videoid,setVideoid]=useState();

  return (
    <div className='mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-16 place-items-center'>
        {videoList?.map((video,index)=>(
                <div key={video?.id || index} className='cursor-pointer hover:scale-105 transition-all shadow-sm flex justify-center items-center w-[300px] h-[480px] mt-8'
                onClick={()=>{setOpenPlayDialog(Date.now());setVideoid(video?.id)}}>
                     <Thumbnail
                        component={RemotionVideo}
                        compositionWidth={300}
                        compositionHeight={480}
                        frameToDisplay={30}
                        durationInFrames={120}
                        fps={30}
                        style={{
                            borderRadius: 20,
                            overflow: 'hidden',
                            imageRendering: 'pixelated',
                            width: '300px',
                            height: '480px',
                        }}
                        inputProps={{
                            ...video,
                            setDurationinFrames:(v)=>console.log(v)
                        }}
                        />
                     
                </div>
                
        ))}   <PlayerDialog playVideo={openPlayDialog} videoid={videoid}/>
    </div>
  )
}

export default VideoList