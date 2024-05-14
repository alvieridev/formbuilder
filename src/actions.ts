"use server"

import { currentUser } from "@clerk/nextjs/server"
import prisma from "./lib/prisma"
import { formSchema, formSchemaType } from "./schemas/form"
import { redirect } from "next/navigation"


class UserNotFoundError extends Error {}

export async function GetFormStats(){
    const user = await currentUser()

    if(!user) {
        // throw new UserNotFoundError()
        redirect('/sign-in')
    }

    const stats = await prisma.form.aggregate({
        where:{
            userId: user.id,
        },
        _sum: {
            visits: true,
            submission: true,
        }
    })

    const visits = stats._sum.visits || 0;
    const submissions = stats._sum.submission || 0;

    let submissionRate = 0;


    if (visits > 0) {
        submissionRate = submissions /( visits ) * 100;
    }

    const bounceRate = 100 - submissionRate;

    return {
        visits,
        submissions,
        submissionRate,
        bounceRate,
    }
}


export async function CreateForm( data: formSchemaType ){

    const validation = formSchema.safeParse( data );
    if( !validation.success ){
        throw new Error("Please fill in the form fields");
    }
    console.log("first", data.name)

    const user = await currentUser();

    if( !user){
        throw new UserNotFoundError()
    }


    const { name, description } = data
    const form = await prisma.form.create({
        data: {
            userId: user.id,
            name,
            description
        }
    })

    if (!form){
        throw new Error(" Something went wrong ");
    }


    return form.id;
}

export async function GetForms() {
    const user = await currentUser();

    if(!user) {
        throw new UserNotFoundError()
    }

    return await prisma.form.findMany({
        where: {
            userId: user.id, 
        },
        orderBy:{
             createdAt: 'desc'
        }
    })

}

export async function GetFormById(id : number) {
    const user = await currentUser();

    if(!user) {
        throw new UserNotFoundError()
    }

    return await prisma.form.findUnique({
        where: {
            userId: user.id,
            id
        }
    })
}