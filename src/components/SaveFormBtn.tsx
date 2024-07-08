"use client"
import React, { useTransition } from 'react'
import { Button } from './ui/button'
import { HiSaveAs } from 'react-icons/hi'
import useDesigner from './hooks/useDesigner'
import { UpdateFormContent } from '@/actions/form'
import { toast } from './ui/use-toast'
import { FaSpinner } from 'react-icons/fa'

function SaveFormBtn({id}: {id: number}) {
  const {elements} = useDesigner()
  const [loading, startTransition] = useTransition()


  const updateFormContent = async() => {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateFormContent(id,jsonElements)
      toast({
        title: "Success",
        description: "Your form has been saved!"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred",
        variant: 'destructive'
      })
    }
  }
  return (
     <Button 
      variant={"outline"}
      className='gap-2'
      onClick={ () => {
        startTransition(updateFormContent)
      } } 
      disabled={loading}>
    <HiSaveAs className='h-6 w-6'/>
    {loading ? 'Saving...': 'Save'}
    {loading && <FaSpinner className='animate-spin' />}
</Button>
  )
}

export default SaveFormBtn