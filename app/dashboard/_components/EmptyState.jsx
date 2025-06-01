import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-screen pt-32 w-full">
      <div
        className="w-full max-w-5xl mx-16 mt-8 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center p-12 gap-10 shadow-lg"
        style={{ boxShadow: '0 8px 32px 0 rgba(59,130,246,0.25)' }}
      >
        <h2 className="text-xl font-semibold text-gray-800 mt-8">No Videos Created Yet</h2>
        <Link href={'/dashboard/create-new'}>
          <Button className="w-full max-w-xs mb-8">Create New Video</Button>
        </Link>
      </div>
    </div>
  )
}

export default EmptyState