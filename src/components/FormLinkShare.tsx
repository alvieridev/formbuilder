'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { ImSpinner2 } from 'react-icons/im';
import { Input } from './ui/input';
import { toast } from './ui/use-toast';

export default function FormLinkShare({shareUrl}: {shareUrl: string}) {
    const [isClient, setIsClient] = useState(false);

    useEffect( () => {
        setIsClient(true)
    },[])

    if(!isClient){
        <div className='flex items-center justify-center w-full h-full'>
        <ImSpinner2 className='animate-spin h-12 w-12'/>
    </div>
    }

    const shareLink = `${window.location.origin}/submit/${shareUrl}`;
  return (
   <div className="flex flex-grow gap-4 items-center">
    <Input readOnly value={shareLink} />
    <Button 
        className='w-[250px]'
        onClick={ () => {
            navigator.clipboard.writeText(shareLink);
            toast({
                title: "Copied",
                description:"Link copied to clipboard"
            })
        } }
    >Copy Link</Button>
   </div>
  )
}

