"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import React from 'react'
import { formLoginSchema, formRegisterSchema } from "@/schemas/form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { toast } from './ui/use-toast';
import { createNewUser, loginUser } from "@/actions/form"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Link } from "next-view-transitions"
import { ImSpinner2 } from "react-icons/im"



function SigninForm() {
    const router = useRouter()

    const form = useForm<z.infer<typeof formLoginSchema>>({
        resolver: zodResolver(formLoginSchema),
        defaultValues: {
            password: '',
            email: '',
        }
    })
    const handleSubmit = async (values: z.infer<typeof formLoginSchema>) => {
        console.log(values)
        try {
            const response = await loginUser(values)
            if(response.status !== 200){
                toast({
                    title: "Error",
                    description: response.message,
                    variant: "destructive"
                })
                return
            }
            toast({
                title: "Success",
                description: "Login Successful",
                variant: "default"
            })
            
            router.push('/')

        } catch (error) {
            
        }
    }
  return <Form {...form}>
    <div className="flex justify-center items-center h-screen">
        <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-md w-full flex flex-col gap-4 ">
        
            <FormField
                name="email"
                control={form.control}
                render={ ({field}) => {
                    return <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input {...field} type="email" placeholder="Enter your email" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                }}
                 />
            <FormField
                name="password"
                control={form.control}
                render={ ({field}) => {
                    return <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input {...field} type="password" placeholder="Password" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                }}
                 />
            <Button type="submit" className="w-full">
            { !form.formState.isSubmitting && <span>Sign In</span> }
            {form.formState.isSubmitting && <ImSpinner2  className='animate-spin'/> }
            </Button>
            <div className="text-center">
                <span>Dont  have an account? </span>
                <Link href="/sign-up" className="underline">Sign up</Link>
            </div>
        </form>
    </div>
  </Form>
}

export default SigninForm