"use client"

import React, { useCallback, useRef, useState, useTransition } from 'react'
import { FormElementinstance, formElements } from './FormElements'
import { Button } from './ui/button'
import { HiCursorClick } from 'react-icons/hi'
import { Toast } from './ui/toast'
import { toast } from './ui/use-toast'
import { ImSpinner, ImSpinner2 } from 'react-icons/im'
import { SubmitForm } from '@/actions/form'

export default function FormSubmitComponent({
    formUrl,
    content
}: {
    formUrl: string,
    content: FormElementinstance[]
}) {


    const formValues = useRef<{[key:string]: string}>({});
    const formErrors = useRef<{[key:string]:boolean}>({})

    const [submitted, setSubmitted] = useState(false);

    const [pending, startTransition] = useTransition()
    const [renderKey, setRenderKey] = useState(new Date().getTime());


    //TODO: REMOVE THE USECALLBACK HOOK AND TEST WITHOUT
    const validateForm: () =>boolean = useCallback( () => {
        for(const field of content){
            const actualValue = formValues.current[field.id] || "";

            const valid = formElements[field.type].validate(field,actualValue);
            if (!valid){
                formErrors.current[field.id] = true
            }
        }

        if( Object.keys(formErrors.current).length > 0 ){
            return false
        }
        return true
    },[content] )


    const submitValue = (key:string, value: string) => {
        formValues.current[key] = value;
    }
    const submitForm = async () => {
        formErrors.current ={}
        const validForm = validateForm()

        if(!validForm){
            setRenderKey(new Date().getTime) 
            toast({
                title: "Error",
                description: "Please Check the form for errors"
            })
            return
        }
        try {
            const jsonContent = JSON.stringify(formValues.current)

            await SubmitForm(formUrl, jsonContent)
            setSubmitted(true)
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong"
            })
        }
    }
    if(submitted){
        return (
            <div className="flex justify-center w-full h-full items-center p-8">
                <div  className="flex max-w-[630px] flex-col gap-4 bg-background overflow-y-auto shadow-blue-700 rounded p-8 border flex-grow">
                    <h1 className="text-2xl font-bold">Form Submitted</h1>
                    <p className='text-muted-foreground'>Thank you for your submission, you can now close this page.</p>
                </div>
            </div>
        )
    }


  return (
    <div className="flex justify-center w-full h-full items-center p-8">
        <div key={renderKey} className="flex max-w-[630px] flex-col gap-4 bg-background overflow-y-auto shadow-blue-700 rounded p-8 border flex-grow">
            {
                content.map(element => {
                    const FormElement = formElements[element.type].formComponent
                    return <FormElement 
                    isInvalid={formErrors.current[element.id]}
                    defaultValue={formValues.current[element.id]}
                    key={element.id} elementInstance={element } submitValue={submitValue} />
                })
            }
            <Button 
             className='mt-8'
              onClick={ () => {
                startTransition(submitForm)
                
              }}
              disabled={pending}
            >
                {!pending && <>
                    
                    <HiCursorClick className='mr-2'/>
                    Submit
                </>}
                {pending && <ImSpinner2 className='animate-spin' />}
            </Button>
        </div>
    </div>
  )
}
