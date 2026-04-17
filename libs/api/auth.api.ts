import { request } from '@playwright/test';

export async function createUserAPI(){
    const apiContext = await request.newContext();

    const uniqueEmail:string = `${Math.random().toString(36).substring(2, 8)}@test.com`
    const password:string = '12345678'
    const username:string = ''

    const response = await apiContext.post(
        'https://conduit-api.bondaracademy.com/api/users/',
        {
           data: {
                user: {
                    email: uniqueEmail,
                    password: password,
                    username : uniqueEmail.split('@')[0]
                }
           }
        }
    );
    const body = await response.json();

    if (!body.user) {
    console.log("API Error:", body);
    throw new Error("User creation/login failed");
    }
    
    return{
        email : body.user.email,
        password,
        username: body.user.username,
        token: body.user.token

    }
}