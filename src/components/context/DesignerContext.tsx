"use client";

import React, { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
import { FormElementinstance } from "../FormElements";

type DesignerContextType = {
    elements: FormElementinstance[];
    removeElement: (index: string) => void;
    addElement: (index: number, element: FormElementinstance) => void;
    selectedElement: FormElementinstance | null;
    setSelectedElement: Dispatch<SetStateAction<FormElementinstance | null>>
    updateElement: (id: string, element: FormElementinstance) => void
}

export const DesignerContext = createContext<DesignerContextType | null>(null)

export default function DesignerContextProvider({children}: {children:ReactNode}){
    const [elements, setElements] = useState<FormElementinstance[]>([])
    // TODO: SAVE ADDED ELEMENTS TO LOCALSTOARAGE
    const [selectedElement, setSelectedElement] = useState<FormElementinstance | null>(null)

    const addElement = ( index:number, element: FormElementinstance ) => {
        setElements( (prev) => {
            const newElement = [...prev];
            newElement.splice(index, 0, element);
            return newElement; 

        } )
    }


    const removeElement = (id: string) => {
        setElements( (prev) => prev.filter((element) => element.id !== id ) )
    }

    const updateElement = (id: string, element: FormElementinstance) => {
        setElements( (prev) => {
            const newElement = [...prev];
            const index = newElement.findIndex(e => e.id === id)
            newElement[index] = element;
            return newElement;
        } )
    }

    return (
        <DesignerContext.Provider value={
            {elements,
            removeElement,
            selectedElement,
            setSelectedElement,
            addElement,
            updateElement,
        }
        }>
            {children}
        </DesignerContext.Provider>
    )
}