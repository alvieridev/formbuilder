import React from 'react'
import { Button } from './ui/button'
import { HiSaveAs } from 'react-icons/hi'
import useDesigner from './hooks/useDesigner'
import { UpdateFormContent } from '@/actions/form'
import { toast } from './ui/use-toast'

function SaveFormBtn() {
  const {elements} = useDesigner()

  const updateFormContent = async() => {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateFormContent(id,jsonElements)
      toast({
        title: "Success",
        description: "Your form has been saved"
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
     <Button variant={"outline"} className='gap-2' >
    <HiSaveAs className='h-6 w-6'/>
    Save
</Button>
  )
}

export default SaveFormBtn