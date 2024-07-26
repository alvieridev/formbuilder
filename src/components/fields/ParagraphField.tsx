"use client"

import { MdTextFields } from "react-icons/md";
import { ELementsType, FormElement, FormElementinstance, submitFunction } from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../hooks/useDesigner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { LuHeading1 } from "react-icons/lu";
import { BsTextParagraph } from "react-icons/bs";
import { Textarea } from "../ui/textarea";


const type: ELementsType = "ParagraphField";

const extraAttributes = {
    text: "Text Here",

}

const propertiesSchema = z.object({
    text: z.string().min(2).max(500),
})

export const ParagraphFieldFormElement : FormElement = {
    type,

    construct: (id: string) => ({
            id,
            type,
            extraAttributes
        }),
    designerButtonElement: {
        icon: BsTextParagraph ,
        label: "Paragraph Field"
    },
    designerComponent : DesignerComponent,
    formComponent :  FormComponent,
    propertiesComponent : PropertiesComponent,
    validate: ():boolean => true

}
 
type CustomeInstance = FormElementinstance & {
    extraAttributes: typeof extraAttributes;
}


type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function FormComponent({elementInstance }: {elementInstance: FormElementinstance}) {
    const element  = elementInstance as CustomeInstance

 
    const {text} = element.extraAttributes
    return <p>
        {text}
    </p>
}



function DesignerComponent({elementInstance }: {elementInstance: FormElementinstance}) {
    const element = elementInstance as CustomeInstance

    const {text} = element.extraAttributes
    return <div className="flex flex-col">

        <Label className="flex flex-col gap-2 w-full">
            Paragraph Field
        </Label>
        <p>{text}</p>

    </div>
}


function PropertiesComponent( { elementInstance }: { elementInstance: FormElementinstance; } ){
    
    
    const element = elementInstance as CustomeInstance
    const {updateElement} = useDesigner()


    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema), 
        mode: "onBlur",
        defaultValues: {
           text: element.extraAttributes.text,
        }
    })

    useEffect( () => {
        form.reset(element.extraAttributes)
    }, [element, form]);

    function applyChanges(values: propertiesFormSchemaType) {
        updateElement(element.id, {  
            ...element,
            extraAttributes: {
                text: values.text,
            }
        })
    }
    return <Form {...form}>
        <form onBlur={form.handleSubmit(applyChanges)} className="space-y-3" onSubmit={ (e) => {
            e.preventDefault();
        } }>
              <FormField
                control={form.control}
                name="text"
                render={ ({field}) => (
                    <FormItem>
                        <FormLabel>Text</FormLabel>
                        <FormControl>
                            <Textarea
                            rows={5}
                                {...field}
                                onKeyDown={ (e) => {
                                    if(e.key === "Enter") e.currentTarget.blur();
                                } } 
                            
                            />
                        </FormControl>
                        
                        <FormMessage />
                    </FormItem>
                )}
             />
            
        </form>
    </Form>
}




