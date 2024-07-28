"use server"

import prisma from "../lib/prisma"
import { formSchema, formSchemaType, formSchemaRegisterType, formSchemaLoginType, formLoginSchema, formRegisterSchema } from "../schemas/form"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import bycryptjs from "bcryptjs"
import { currentUser, encrypt, formbuildersessionName, UserDetailsType } from "./auth"
import { cookies } from "next/headers"


class UserNotFoundError extends Error {}


export async function loginUser(data: formSchemaLoginType){

console.log(data)
   const validation = formLoginSchema.safeParse( data ); //validation step
    if( !validation.success ){
        return{
            status: 400,
            message: "Please fill in the required fields",
            sucess: false,
        }
    }
    const userExist = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
    if(!userExist) {
        return{
            status: 400,
            message: "User Does not exist",
            sucess: false,
        }
    }

    const correctPassowrd = await bycryptjs.compare(data.password, userExist.password);

    if(!correctPassowrd){
        return {
            status: 400,
            message: "Invalid Credentials",
            sucess: false,
        }
    }
    
    const userDetails: UserDetailsType = {
        userName: userExist.name ?? 'null',
        userEmail: userExist.email,
        userId: userExist.id,
    }
    
    // Create a session for the user
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ userDetails });
  
    // Save the session in a cookie
    cookies().set(formbuildersessionName, session, { expires, httpOnly: true, sameSite: true });

    return {
        status: 200,
        message: "Login successful",
        sucess: true,
    }


}
export async function createNewUser(data: formSchemaRegisterType){


   const validation = formRegisterSchema.safeParse( data ); //validation step
    if( !validation.success ){
        return{
            status: 400,
            message: "Please fill in the required fields",
            sucess: false,
        }
    }
    const userExist = await prisma.user.findUnique({
        where: {
            email: data.email
        }
    })
    if(userExist) {
        return{
            status: 400,
            message: "User already exist",
            sucess: false,
        }
    }

    const hashedPassword = await bycryptjs.hash(data.password, 10);

    const newUser = await prisma.user.create({
        data: {
            email: data.email,
            name: data.name,
            password: hashedPassword,
        }
    })

    if (!newUser){
        return{
            status: 500,
            sucess: false,
            message: "Something went wrong"
        }
    }
    
    const userDetails: UserDetailsType = {
        userName: newUser.name ?? 'null',
        userEmail: newUser.email,
        userId: newUser.id,
    }
    
    // Create a session for the user
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ userDetails });
  
    // Save the session in a cookie
    cookies().set(formbuildersessionName, session, { expires, httpOnly: true, sameSite: true });

    return {
        status: 201,
        message: "user created successfully",
        sucess: true,
    }


}


export async function GetFormStats(){
    const user = await currentUser()

    if(!user) {
        // throw new UserNotFoundError()
        redirect('/sign-in')
    }

    const stats = await prisma.form.aggregate({
        where:{
            userId: user.userId.toString(),
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

    const validation = formSchema.safeParse( data ); //validation step
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
            userId: user.userId.toString(),
            name,
            description
        }
    })

    if (!form){
        throw new Error(" Something went wrong ");
    }


    return form.id;
}


/**
 * This function is responsible for retreiving all the forms a user has created, wether published or not
 * It returns an error if the user is not found
 * @returns Promise<{
    id: number;
    userId: string;
    createdAt: Date;
    published: boolean;
    name: string;
    description: string;
    content: string;
    visits: number;
    submission: number;
    shareURL: string;
}[]>
 */
export async function GetForms() {
    const user = await currentUser();

    if(!user) {
        throw new UserNotFoundError()

    }

    return await prisma.form.findMany({
        where: {
            userId: user.userId.toString(), 
        },
        orderBy:{
             createdAt: 'desc'
        }
    })

}


/**
 * 
 * @param id it takes an id as argument 
 * @type {Number}
 * @returns  Promise<{
    id: number;
    userId: string;
    createdAt: Date;
    published: boolean;
    name: string;
    description: string;
    content: string;
    visits: number;
    submission: number;
    shareURL: string;
} | null> if the user and formid is found
 */
export async function GetFormById(id : number) {
    const user = await currentUser();

    if(!user) {
        throw new UserNotFoundError()
    }

    return await prisma.form.findUnique({
        where: {
            userId: user.userId.toString(),
            id
        }
    })
}


//use this  later to edit the form after it is submitted
export async function UpdateFormContent(id: number, jsonContent: string){
    const user = await currentUser();
    
    if(!user) {
        throw new UserNotFoundError()
    }

    return await prisma.form.update({
        where: {
            userId: user.userId.toString(),
            id
        },
        data: {
            content: jsonContent
        }
    })
}



export async function PublishForm(id: number, ){
    const user = await currentUser();
    
    if(!user) {
        throw new UserNotFoundError()
    }
    return await prisma.form.update({
        where: {
            userId: user.userId.toString(),
            id
        },
        data: {
            // content: jsonContent,
            published: true,
        }
    })
}

export async function getFormContentByUrl(formUrl:string) {
    const user = await currentUser();
    
    if(!user) {
        throw new UserNotFoundError()
    }
 
    return await prisma.form.update({
        select: {
            content: true
        },
        data: {
            visits: {
                increment: 1
            },
        },
        where: {
            shareURL: formUrl
        }
    })
    
}

export async function SubmitForm(formUrl: string, content: string){

    return await prisma.form.update({
        
        data: {
            submission: {
                increment: 1
            },
            FormSubmissions: {
                create: {
                    content
                }
            }
        },
        where: {
            shareURL: formUrl,
            published:true
        }
    }) 
}
export async function getFormSubmissions(id : number) {
    
    const user = await currentUser();
    
    if(!user) {
        throw new UserNotFoundError()
    }


    return await prisma.form.findUnique({
        where: {
            userId: user.userId.toString(),
            id
        },
        include: {
            FormSubmissions: true
        }
    })

}