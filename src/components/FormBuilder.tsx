"use client"

import { Form } from '@prisma/client'
import React from 'react'
import PreviewDailogBtn from './PreviewDailogBtn'
import SaveFormBtn from './SaveFormBtn'
import PublishFormBtn from './PublishFormBtn'
import Designer from './Designer'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import DrapOverLayWrapper from './DrapOverLayWrapper'

function FormBuilder( {form}: {form: Form} ) {
  
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10//10px
        }
    })

    const touchSensor = useSensor(TouchSensor, { //this will enable it work on mobile devices
        activationConstraint: {
            delay: 300,//300ms
            tolerance: 5
        }
    })
    const sensors = useSensors(mouseSensor, touchSensor)
  
    return (
    <DndContext sensors={sensors}>
        <main className="flex flex-col w-full">
            <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
                <h2 className='truncate font-medium'>
                    <span className="text-muted-foreground mr-2">
                    Form: 
                    </span>
                        {form.name}
                </h2>
                <div className="flex items-center gap-2">
                    <PreviewDailogBtn />
                    {!form.published && (
                        <>
                            <SaveFormBtn />
                            <PublishFormBtn />
                        </>
                    )}
                </div>
            </nav>``
          
            <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
                    <Designer />
            </div>
        </main>
        <DrapOverLayWrapper />
    </DndContext>
  )
}

export default FormBuilder