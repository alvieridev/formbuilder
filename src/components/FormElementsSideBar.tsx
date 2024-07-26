"use client"

import React from 'react'
import SideBarBtnElement from './SideBarBtnElement'
import { formElements } from './FormElements'
import { Separator } from './ui/separator'

function FormElementsSideBar() {
  return (
    <div>
      <p className='text-sm text-foreground/70'> Drag and Drop Elements</p>
      <Separator className='my-2'/>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
        <p className='text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start'>Layout Elements</p>

       
        <SideBarBtnElement formElement={formElements.TitleField} />
        <SideBarBtnElement formElement={formElements.SubTitleField} />
        <SideBarBtnElement formElement={formElements.ParagraphField} />
        <SideBarBtnElement formElement={formElements.SeparatorField} />

        <p className='text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start'>Form Elements</p>
        <SideBarBtnElement formElement={formElements.TextField} />

      </div>
    </div>
  )
}

export default FormElementsSideBar