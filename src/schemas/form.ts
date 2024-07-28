import { z } from "zod"

export const formSchema = z.object({
    name: z.string().min(4),
    description: z.string().optional(),
})
export const formRegisterSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(5),
    passwordConfirm: z.string()
}).refine((data) => {
    return data.password === data.passwordConfirm
}, {
    message: "Passwords do not match",
    path: ["passwordConfirm"]
})

export const formLoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})




export type formSchemaType = z.infer< typeof formSchema>
export type formSchemaRegisterType = z.infer< typeof formRegisterSchema>
export type formSchemaLoginType = z.infer< typeof formLoginSchema>