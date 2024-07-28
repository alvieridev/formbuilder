"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import React from 'react'
import { formRegisterSchema } from "@/schemas/form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { toast } from './ui/use-toast';
import { createNewUser } from "@/actions/form"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { ImSpinner2 } from "react-icons/im"
import { Link } from "next-view-transitions"



function SignupForm() {
    const router = useRouter()

    const form = useForm<z.infer<typeof formRegisterSchema>>({
        resolver: zodResolver(formRegisterSchema),
        defaultValues: {
            name: '',
            password: '',
            email: '',
            passwordConfirm: ''
        }
    })
    const handleSubmit = async (values: z.infer<typeof formRegisterSchema>) => {
        try {
            const response = await createNewUser(values)
            if(response.status !== 201){
                toast({
                    title: "Error",
                    description: response.message,
                    variant: "destructive"
                })
                return
            }
            toast({
                title: "Success",
                description: "Registeration Successful",
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
                name="name"
                control={form.control}
                render={ ({field}) => {
                    return <FormItem>
                        <FormLabel>User Name</FormLabel>
                        <FormControl>
                            <Input {...field} type="text" placeholder="Enter your name" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                }}
                 />
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
            <FormField
                name="passwordConfirm"
                control={form.control}
                render={ ({field}) => {
                    return <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input {...field} type="passwordConfirm" placeholder="Confirm Password" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                }}
                 />
            <Button type="submit" className="w-full">
            { !form.formState.isSubmitting && <span>Register</span> }
            {form.formState.isSubmitting && <ImSpinner2  className='animate-spin'/> }
            </Button>
            <div className="text-center">
                <span>Have an account? </span>
                <Link href="/sign-in" className="underline">Sign in</Link>
            </div>
        </form>
    </div>
  </Form>
}

export default SignupForm