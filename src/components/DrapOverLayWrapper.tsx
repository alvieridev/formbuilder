import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core'
import React, { useState } from 'react'
import { SideBarBtnElementOverlay } from './SideBarBtnElement'
import { ELementsType, formElements } from './FormElements'
import useDesigner from './hooks/useDesigner'
import { Delius_Swash_Caps } from 'next/font/google'

function  DrapOverLayWrapper() {
  const {elements} = useDesigner()
  const [draggedItem, setDragedItem] = useState<Active | null>(null)
    const minotor = useDndMonitor({
      onDragStart: (event) => {
        // console.log("Drag Item", event)
        setDragedItem(event.active) //setting the currently dragged element to active.
      }, 
      onDragCancel: () => {
        console.log("Drag Item Cancelled")
        setDragedItem(null)
      },
      onDragEnd: () => {
        console.log("Drag Item Ended")
        setDragedItem(null)
      }
    })

    // console.log("DRAGGED Item: ",draggedItem)
    // console.log("Elements ",elements)
    if(!draggedItem) return null
    let node = <div>No drag Overlay</div>
    const isSiderBarButtonElement = draggedItem.data.current?.isDesignerBtnElement;

  if(isSiderBarButtonElement) {
    const type = draggedItem.data?.current?.type as ELementsType;
    node = <div className=''>
      <SideBarBtnElementOverlay formElement={formElements[type]} />
    </div>
  }

  const isDesignerElement = draggedItem.data?.current?.isDesignerElement;
  console.log("Is designer Element: ",isDesignerElement)
  if(isDesignerElement){
    const elementId = draggedItem.data?.current?.elementId; // i use this id to get the element from the DesignerContext

    const element = elements.find(e => e.id === elementId)
    if(!element) node = <div>Element Not Found</div>
    else{
      const DesignerElementComponent = formElements[element.type].designerComponent
      node = <div className='flex bg-accent border rounded-md h-[120px] w-full py-2 px-2 opacity-80 pointer-events-none'>
        <DesignerElementComponent elementInstance={element}/>
      </div>
    }
  }
  return (
    <DragOverlay>
      {node}
    </DragOverlay>
  )
}

export default DrapOverLayWrapper