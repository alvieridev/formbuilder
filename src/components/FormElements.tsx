import React from 'react'
import { TextFieldFormElement } from './fields/TextField';

export type ELementsType = "TextField";


export type FormElement = {
    type: ELementsType;

    construct: ( id: string ) => FormElementinstance ;

    designerButtonElement: {
        icon: React.ElementType;
        label: string
    }

    designerComponent: React.FC<{
        elementInstance: FormElementinstance
    }>;

    formComponent: React.FC;

    propertiesComponent: React.FC<{
        elementInstance: FormElementinstance
    }>;

}

export type FormElementinstance = {
    id: string;
    type: ELementsType;
    extraAttributes?: Record<string, any>
}

type FormElementsType ={
    [key in ELementsType]: FormElement
}

export const formElements:FormElementsType ={
    TextField: TextFieldFormElement
}

