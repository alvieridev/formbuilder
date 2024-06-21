import React from 'react'
import { formElements } from './FormElements'
import SideBarBtnElement from './SideBarBtnElement'
import useDesigner from './hooks/useDesigner'
import FormElementsSideBar from './FormElementsSideBar'
import PropertiesFormSidebar from './PropertiesFormSidebar'

function DesignerSideBar() {

  const {selectedElement} = useDesigner()
  return (
    <aside className='w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full'>
        {!selectedElement && <FormElementsSideBar />}
        {selectedElement && <PropertiesFormSidebar />}
    </aside>
  )
}

export default DesignerSideBar