"use client"

import React from 'react'
import SideBarBtnElement from './SideBarBtnElement'
import { formElements } from './FormElements'

function FormElementsSideBar() {
  return (
    <div>
      Elements
      <SideBarBtnElement formElement={formElements.TextField} />
    </div>
  )
}

export default FormElementsSideBar