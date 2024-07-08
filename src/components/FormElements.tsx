import React from 'react'
import { TextFieldFormElement } from './fields/TextField';

export type ELementsType = "TextField";

export type submitFunction = (key:string, value:string) => void

export type FormElement = {
    type: ELementsType;

    construct: ( id: string ) => FormElementinstance ;

    designerButtonElement: {
        icon: React.ElementType;
        label: string
    }

    designerComponent: React.FC<{ // This will be used in the drop area after dropping a new formElemnt
        elementInstance: FormElementinstance
    }>;

    formComponent: React.FC<{ //This will be used in the form preview
        elementInstance: FormElementinstance
        submitValue?: (key:string, value:string) => void
        isInvalid:boolean,
        defaultValue?:string,
    }>;

    propertiesComponent: React.FC<{//this is used to edit the form properties in the sidebar
        elementInstance: FormElementinstance
    }>;

    validate: (FormElement: FormElementinstance, currentValue : string) => boolean

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

