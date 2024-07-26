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
import { LuHeading1, LuHeading2 } from "react-icons/lu";


const type: ELementsType = "SubTitleField";

const extraAttributes = {
    title: "Sub Title Field",

}

const propertiesSchema = z.object({
    title: z.string().min(2).max(50),
})

export const SubTitleFieldFormElement : FormElement = {
    type,

    construct: (id: string) => ({
            id,
            type,
            extraAttributes
        }),
    designerButtonElement: {
        icon: LuHeading2 ,
        label: "SubTitle Field"
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

 
    const {title} = element.extraAttributes
    return <p className="text-lg">
        {title}
    </p>
}



function DesignerComponent({elementInstance }: {elementInstance: FormElementinstance}) {
    const element = elementInstance as CustomeInstance

    const {title} = element.extraAttributes
    return <div className="flex flex-col">

        <Label className="flex flex-col gap-2 w-full">
            Sub Title Field
        </Label>
        <p className="text-lg">{title}</p>

    </div>
}


function PropertiesComponent( { elementInstance }: { elementInstance: FormElementinstance; } ){
    
    
    const element = elementInstance as CustomeInstance
    const {updateElement} = useDesigner()


    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema), 
        mode: "onBlur",
        defaultValues: {
           title: element.extraAttributes.title,
        }
    })

    useEffect( () => {
        form.reset(element.extraAttributes)
    }, [element, form]);

    function applyChanges(values: propertiesFormSchemaType) {
        updateElement(element.id, {  
            ...element,
            extraAttributes: {
                title: values.title,
            }
        })
    }
    return <Form {...form}>
        <form onBlur={form.handleSubmit(applyChanges)} className="space-y-3" onSubmit={ (e) => {
            e.preventDefault();
        } }>
              <FormField
                control={form.control}
                name="title"
                render={ ({field}) => (
                    <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                            <Input 
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




