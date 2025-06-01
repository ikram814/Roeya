"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

function SelectStyle({onUserSelect, small}) {

    const styleOptions = [
        {
            name:"Realistic",
        },
        {
            name:"Cartoon",
        },
        {
            name:"Comic",
        },
        {
            name:"Watercolor",
        },
        {
            name:"CyberPunk",
        },
    ]

    const [selectedStyle, setSelectedStyle] = useState("");
  return (
    <div className={small ? 'mt-4' : 'mt-7'}>
        <h2 className='font-bold text-xl text-primary mb-1'>
            Styles
        </h2>
        <p className='text-gray-500 mb-2'>
            Select the Style for your Video
        </p>
        <Select onValueChange={value => {
            setSelectedStyle(value);
            onUserSelect('imageStyle', value);
        }}>
            <SelectTrigger className="w-full mt-1 p-6 text-sm">
                <SelectValue placeholder="Select Style" />
            </SelectTrigger>
            <SelectContent>
          {styleOptions.map((item, index) => (
                    <SelectItem key={index} value={item.name}>{item.name}</SelectItem>
          ))}
            </SelectContent>
        </Select>
    </div>
  )
}

export default SelectStyle