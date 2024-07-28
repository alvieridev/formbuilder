
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from "jose";
import { redirect } from 'next/navigation';
// import axios from 'axios';



export type tokenDataType ={
    userDetails: UserDetailsType,
} 

export type UserDetailsType ={
    userName: string,
    userEmail: string,
    userId: number
}

export const formbuildersessionName:string = 'formbuilderSession'
const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY);


export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}


/**
 * The decrypt function expects an argument, in this case the cookie value from user's cookie and decrpyts it using the provided secrete key and algorthm
 * 
 */
export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  }


  /**
   * The getSession Function get the token value from the user's cookie and return null if the value is not found or an empty string otherwise
   * If the cookie is found, it will decrypt the cookie and return the object
   * @returns null | object 
   */
  export async function currentUser():Promise<UserDetailsType | null>  {
    // const session = cookies().get("session")?.value;
    const cookievalue =  cookies().get(formbuildersessionName)?.value 
    const reqHasCookie =  cookievalue !== undefined && cookievalue !== null && cookievalue !== ''
    reqHasCookie
    if (!reqHasCookie) return null;
    const data =await decrypt(cookievalue);
    console.log(data.userDetails)
    return data.userDetails
  }
            
  export async function logoutUser() {
    // Destroy the session
    cookies().set( formbuildersessionName, "", { expires: new Date(0) });
    redirect('/login')
  }