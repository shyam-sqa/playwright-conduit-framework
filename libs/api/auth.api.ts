import { APIRequestContext } from '@playwright/test';

export async function createUserAPI(apiContext: APIRequestContext){

    const uniqueEmail:string = `${Math.random().toString(36).substring(2, 8)}@test.com`
    const password:string = '12345678'
    const username:string = ''

    const response = await apiContext.post(
        '/api/users/',
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