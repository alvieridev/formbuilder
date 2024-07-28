/**
 * An array of routes that are accessible only when the user is logged in 
* @type {string[]}  
*/
export const protectedRouted = [
    '/',
    '/builder',
    '/forms',
    '/submit'
    
]

/**
* An array of routes that are used for authentication. cannot be accessed when the user is not logged in
* @type {string[]}  
*/
export const authRoutes = [
    '/sign-up',
    '/sign-in',
    '/forgot-password',
    '/reset-password',
    '/user-verification',
    // '/verify-email/step-1',
]