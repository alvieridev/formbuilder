"use client"

import React, { useState } from 'react'
import DesignerSideBar from './DesignerSideBar'
import { DragEndEvent, useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { cn } from '@/lib/utils';
import useDesigner from './hooks/useDesigner';
import { ELementsType, FormElementinstance, formElements } from './FormElements';
import { idGenerator } from '@/lib/idGenerator';
import { Button } from './ui/button';
import { BiSolidTrash } from 'react-icons/bi';


function Designer() {

    const {addElement, elements, selectedElement, setSelectedElement, removeElement} = useDesigner()
 
    const droppable = useDroppable({
        id: "designer-drop-area", 
        data: {
            isDesignerDropArea: true
        }
    })

    useDndMonitor({
        onDragEnd: (event: DragEndEvent) => {
            const {active , over} = event
            if(!active || !over) return

            const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;

            const isDroppingOverDesignerDropArea = active.data?.current?.isDesignerDropArea;
             

            //first scenario: dropping a sidebar element over the designer drop area
            if(isDesignerBtnElement && isDroppingOverDesignerDropArea){
                const type = active.data?.current?.type;

                const newElement = formElements[type as ELementsType].construct(
                    idGenerator()
                )
                addElement( elements.length, newElement )
                console.log("New Element:", newElement)
            }
            console.log("Drag end",event)

            const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isTopBottomDesginerElement;
            const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopBottomDesginerElement;

            const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf ||isDroppingOverDesignerElementBottomHalf

            const droppingSideBarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement


            //second scenario
            if(droppingSideBarBtnOverDesignerElement){
                const type = active.data?.current?.type;

                const newElement = formElements[type as ELementsType].construct(
                    idGenerator()
                )

                const overId = over.data?.current?.elementId;
                
                const overElementIndex = elements.findIndex(el => el.id === overId)

                if(overElementIndex === -1){
                    throw new Error("Element not Found");
                }

                let indexForNewElement = overElementIndex ; //i assume i'm on top-half
                if(isDroppingOverDesignerElementBottomHalf){
                    indexForNewElement = overElementIndex + 1;
                }
                addElement( indexForNewElement, newElement )
                console.log("New Element:", newElement)   
            }


            const isDraggingDesignerElement = active.data?.current?.isDesignerElement

            // Third Scenario
            const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement

            if(draggingDesignerElementOverAnotherDesignerElement){
                const activeId = active.data?.current?.elementId;
                const overId = over.data?.current?.elementId;

                const activeElementIndex = elements.findIndex( el => el.id === activeId)
                const overElementIndex = elements.findIndex( el => el.id === overId)

                if(activeElementIndex === -1 || overElementIndex === -1){
                    throw new Error("Element not found")
                }
                const activeElement ={ ...elements[activeElementIndex]}
                 removeElement(activeId)
                 let indexForNewElement = overElementIndex ; //i assume i'm on top-half
                 if(isDroppingOverDesignerElementBottomHalf){
                     indexForNewElement = overElementIndex + 1;
                 }
                 addElement(indexForNewElement, activeElement)
            }


        }
    })
  return (
    <div className='flex w-full h-full'>
        <div className="w-full p-4" onClick={ () => {
            if(selectedElement) setSelectedElement(null)
        }}>
            <div
            ref={droppable.setNodeRef}
            className={ cn('bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto', 
                droppable.isOver && " ring-4  ring-primary ring-inset"
            )} >
                { !droppable.isOver && elements.length === 0 && <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
                    Drop Here
                </p>}
                {
                    droppable.isOver && elements.length === 0 && <div className='p-4 w-full'>
                        <div className="h-[120px] bg-primary/20 rounded-md"></div>
                    </div>
                }
                {
                    elements.length > 0 && (
                        <div className="flex flex-col w-full gap-2 p-4">
                            {
                                elements.map( (element) => (
                                    <DesignerElementWrapper key={element.id} element={element} />
                                ) )
                            }
                        </div>
                    )
                }
            </div>
        </div>
        <DesignerSideBar />
    </div>
  )
}

function DesignerElementWrapper( {element}: {element: FormElementinstance} ) {
    const [ mouseIsOver, setMouseIsOver ] = useState(false)

    const {removeElement, selectedElement, setSelectedElement} = useDesigner()

    const topHalf = useDroppable({
        id: element.id + "top",
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfDesginerElement: true,
        }
    })
    const bottomHalf = useDroppable({
        id: element.id + "bttom",
        data: {
            type: element.type,
            elementId: element.id,
            isTopBottomDesginerElement: true,
        }
    })
    const DesignerElement = formElements[element.type].designerComponent  

    const draggable = useDraggable({
        id: element.id + "-drag-handler",
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true,
        }
    })

    if(draggable.isDragging) return null;
  return (
    <div
    ref={draggable.setNodeRef}
    {...draggable.listeners}
    {...draggable.attributes}
        onMouseEnter={ () => {
            setMouseIsOver(true)
        }} 
        onMouseLeave={ () => {
            setMouseIsOver(false) 
        }} 
        onClick={ (e) => {
            e.stopPropagation()
            setSelectedElement(element)
        } }
        className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset' >
    <div  ref={topHalf.setNodeRef} className="absolute w-ful l h-1/2 rounded-t-md "></div>
    <div ref={bottomHalf.setNodeRef} className="absolute w-full h-1/2 rounded-b-md  bottom-0"></div>
    {
        mouseIsOver && (
           <>
            <div className="absolute right-0 h-full">
                <Button
                    variant={"outline"}
                    onClick={ (e) => {
                        e.stopPropagation();
                        removeElement(element.id)
                    } } 
                    className='flex justify-center h-full border rounded-md rounded-l-none bg-red-500' >
                    <BiSolidTrash className='h-6 w-6' />
                </Button>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                <p className='text-muted-foreground text-sm'>Click for properties or drag to move</p>
            </div>
           
           </>
        ) 
    }
        {topHalf.isOver && (
            <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none"/>
        )}
        <div className={cn('w-full flex h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100', 
        // topHalf.isOver && "border-t-4 border-t-foreground",
        // bottomHalf.isOver && "border-t-4 border-b-foreground",
        mouseIsOver && "opacity-30"
         )}>
            <DesignerElement elementInstance={element}/> 
        </div>
        {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-t-none"/>
        )}
    </div>
    
  )
}


export default Designer