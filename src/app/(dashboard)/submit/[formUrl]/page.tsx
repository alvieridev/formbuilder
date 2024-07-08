import { getFormContentByUrl } from '@/actions/form'
import { FormElementinstance } from '@/components/FormElements'
import FormSubmitComponent from '@/components/FormSubmitComponent'
import React from 'react'

export default async function SubmitPage({params}: {params: { formUrl :string }}) {


    const form = await getFormContentByUrl(params.formUrl)

    if (!form){
      throw new Error("Form Not Found")
    }
    const formContent = JSON.parse(form.content) as FormElementinstance[]



  return <FormSubmitComponent formUrl={params.formUrl} content={formContent} />
}
