"use client"

import React, { useEffect, useState } from 'react'
import Header from './_components/Header'
import SideNav from './_components/SideNav'
import { VideoDataContext } from '../_context/VideoDataContext'
import { UserDetailContext } from '../_context/UserDetailContext'
import { useUser } from '@clerk/nextjs'
import { db } from '@/configs/db'
import { eq } from 'drizzle-orm'
import { Users } from '@/configs/schema'


function DashboardLayout({children}) {
  const [videoData,setVideoData] = useState([]);
  const [userDetail,setUserDetail] = useState([]);
  const {user} = useUser();

  useEffect(()=>{
    user&&getUserDetail()
  },[user])


  const getUserDetail = async()=>{
    const result = await db.select().from(Users)
    .where(eq(Users.email,user?.primaryEmailAddress?.emailAddress));
    setUserDetail(result[0]);
    
  }
  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      <VideoDataContext.Provider value={{ videoData , setVideoData }}>
        <div>
          <div className='p-10'>
            {children}
          </div>
        </div>
      </VideoDataContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default DashboardLayout