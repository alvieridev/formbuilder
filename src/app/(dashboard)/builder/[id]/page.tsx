import { GetFormById } from '@/actions/form';
import FormBuilder from '@/components/FormBuilder';
import React from 'react'


// TODO: add the metadata here depending on the formid. Cache the fetch
async function BuilderPage( {params}: {params: { id :string }} ) {
    const {id} = params;
    const form = await GetFormById( Number(id) )
    if ( !form ) {
        throw new Error("Form not Found")
    }
  return (
    <FormBuilder form={form} />
  )
}

export default BuilderPage