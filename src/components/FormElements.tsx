import React from 'react'
import { TextFieldFormElement } from './fields/TextField';
import { TitleFieldFormElement } from './fields/TitleField';
import { SubTitleFieldFormElement } from './fields/SubTitleField';
import { ParagraphFieldFormElement } from './fields/ParagraphField';
import { SeparatorFieldFormElement } from './fields/SeparatorField';

export type ELementsType = 
    "TextField" | 
    "TitleField" | 
    "SubTitleField" |
    "ParagraphField" |
    "SeparatorField"
    ;

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
    TextField: TextFieldFormElement,
    TitleField: TitleFieldFormElement,
    SubTitleField: SubTitleFieldFormElement,
    ParagraphField: ParagraphFieldFormElement,
    SeparatorField: SeparatorFieldFormElement,
}

