"use client"

import { Form } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import PreviewDailogBtn from './PreviewDailogBtn'
import SaveFormBtn from './SaveFormBtn'
import PublishFormBtn from './PublishFormBtn'
import Designer from './Designer'
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import DrapOverLayWrapper from './DrapOverLayWrapper'
import useDesigner from './hooks/useDesigner'
import { ImSpinner2 } from 'react-icons/im'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'
import { Link } from 'next-view-transitions'
import Confetti from 'react-confetti'
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs'

function FormBuilder( {form}: {form: Form} ) {
    const {setElements} = useDesigner()
    const [isReady, setIsReady] = useState(false);
  
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

    useEffect(() => {
        if(isReady) return
        const elements = JSON.parse(form.content);
        setElements(elements)
        const readyTimeOut = setTimeout( () => setIsReady(true), 3000 )
        
        return () => {
            clearTimeout(readyTimeOut)
        } 

    }, [form, setElements])
  

    if(!isReady) {
        return <div className='flex flex-col items-center justify-center w-full h-full'>
             <ImSpinner2 className='animate-spin h-12 w-12'/>
        </div>
    }
    if(form.published) {

        const shareURL = `${window.location.origin}/submit/${form.shareURL}`
         return <>   
         <Confetti 
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={1500}
            
         />
            <div className="flex flex-col items-center justify-center h-full w-full">
                <div className='max-w-md'>
                    <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">🎉Form Published🎉</h1>
                    <h2 className='text-2xl'>Share this form</h2>
                    <p className='text-4xl text-muted-foreground border-b pb-10'>Anyone with the link can fill and submit the form</p>
                    <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
                        <Input className='w-full' readOnly value={shareURL} />
                        <Button className='mt-2 w-full' onClick={ () => {
                            navigator.clipboard.writeText(shareURL)
                            toast({
                                title: "Copied",
                                description: "Link copied to clipboard"
                            })
                        } }>Copy Link</Button>
                </div>
                <div className="flex justify-between">
                    <Button asChild variant={'link'}>
                        <Link href={'/'} className='gap-2'>
                            <BsArrowLeft />
                            Back Home
                        </Link>
                    </Button>
                    <Button asChild variant={'link'}>
                        <Link href={`/forms/${form.id}`} className='gap-2'>
                            <BsArrowLeft />
                            Form Details
                            <BsArrowRight />
                        </Link>
                    </Button>
                </div>
                </div>
            </div>
         </>
    }
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
                            <SaveFormBtn id={form.id} />
                            <PublishFormBtn id={form.id} />
                        </>
                    )}
                </div>
            </nav>
          
            <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
                    <Designer />
            </div>
        </main>
        <DrapOverLayWrapper />
    </DndContext>
  )
}

export default FormBuilder