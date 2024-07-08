'use client'

import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { ImSpinner2 } from 'react-icons/im';

export default function VisitBtn({shareUrl}: {shareUrl: string}) {
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
   <Button className='w-[200px]' onClick={ () => {
    window.open(shareLink, '_blank');
   } } > 
        Visit
   </Button>
  )
}

