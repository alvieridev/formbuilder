"use client"

import React from 'react'
import DesignerSideBar from './DesignerSideBar'
import { useDroppable } from "@dnd-kit/core";


function Designer() {

    const droppable = useDroppable({
        id: "designer-drop-area",
        data: {
            isDesignerDropArea: true
        }
    })

  return (
    <div className='flex w-full h-full'>
        <div className="w-full p-4">
            <div className='bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto'>
                <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
                    Drop Here
                </p>
            </div>
        </div>
        <DesignerSideBar />
    </div>
  )
}

export default Designer