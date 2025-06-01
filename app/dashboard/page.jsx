"use client"
import { Button } from '@/components/ui/button'
import React,{useContext, useEffect, useState} from 'react'
import { Open_Sans } from 'next/font/google'
import EmptyState from './_components/EmptyState';
import Link from 'next/link';
import { db } from '@/configs/db';
import { VideoData } from '@/configs/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import VideoList from './_components/VideoList';
import Navbar from '@/components/shared/Sidebar';

  
const open_sans = Open_Sans({subsets: ["latin-ext"],style:"normal",weight: "700"});

function Dashboard() {

  const [videoList,setVideoList] = useState([]);


  const {user}=useUser();


  useEffect(()=>{
    user&&GetVideoList();
  },[user])

  const GetVideoList=async()=>{
    const result = await db.select().from(VideoData)
    .where(eq(VideoData?.createdBy,user?.primaryEmailAddress?.emailAddress))
  
    setVideoList(result);
  }


  return (
    <>
      <Navbar />
      <div className="h-24"></div>
      <div className="">
        {videoList?.length==0&&<div>
          <EmptyState/>
        </div>}
        {/* List of Videos */}
        <VideoList videoList={videoList}/>
      </div>
    </>
  )
}

export default Dashboard