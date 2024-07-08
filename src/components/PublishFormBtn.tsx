import React, { startTransition, useTransition } from 'react'
import { Button } from './ui/button'
import { MdOutlinePublish } from 'react-icons/md';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { FaIcons } from 'react-icons/fa';
import { toast } from './ui/use-toast';
import { PublishForm } from '@/actions/form';
import { useRouter } from 'next/navigation';

function PublishFormBtn({id} : {id:number}) {

  const router = useRouter()

  const [loading, startTransition] = useTransition()

  async function publishForm() {
    try {
        await PublishForm(id);
        toast({
          title: 'Success!',
          description: 'Your form is now available to the public'
        })
        router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong'
      })
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"} className='gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400' >
          <MdOutlinePublish className='h-6 w-6'/>
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to publish this form</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone</AlertDialogDescription>
          <br />
          <span className='font-medium'>You may want to preview the form before publishing.</span>
          <br />
          <span className='font-medium'>By publishing this form, you will make it available to the public and you will be able to collect submissions</span>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} >Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} 
            onClick={ (e) => {
              e.preventDefault();
              startTransition(publishForm)
            } }
          >Proceed {loading && <FaIcons className='animate-spin'/>} </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PublishFormBtn