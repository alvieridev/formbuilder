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
import { RiSeparator} from "react-icons/ri";
import { Separator } from "../ui/separator";


const type: ELementsType = "SeparatorField";



export const SeparatorFieldFormElement : FormElement = {
    type,

    construct: (id: string) => ({
            id,
            type,
        }),
    designerButtonElement: {
        icon: RiSeparator ,
        label: "Separator Field"
    },
    designerComponent : DesignerComponent,
    formComponent :  FormComponent,
    propertiesComponent : PropertiesComponent,
    validate: ():boolean => true

}
 


function FormComponent() {

 
    return <Separator />
}



function DesignerComponent({elementInstance }: {elementInstance: FormElementinstance}) {

    return <div className="flex flex-col">

        <Label className="flex flex-col gap-2 w-full">
        Separator Element
        </Label>
        <Separator />
    </div>
}


function PropertiesComponent( { elementInstance }: { elementInstance: FormElementinstance; } ){
    
    return <p>No properties for this element</p>
}




