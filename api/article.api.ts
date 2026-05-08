import { APIRequestContext, expect } from '@playwright/test';

export class articleAPI{
    private apiContext: APIRequestContext;
    
    constructor(apiContext: APIRequestContext){
        this.apiContext = apiContext;
    }

    async getArticle(slug:string){
        return await this.apiContext.get(`/api/articles/${slug}`)
    }

    async getComments(slug:string){
        return await this.apiContext.get(`/api/articles/${slug}/comments`)
    }

    async createArticle(title:string,description:string,body:string,taglist?:string[]){
        const response = this.apiContext.post('/api/articles/',{
            data:{
                article:{
                    title:title,
                    description: description,
                    body:body,
                    taglist: taglist
                }
            }
        })
        expect((await response).status()).toBe(200)
    }


}