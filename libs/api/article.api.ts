import { request } from '@playwright/test';

export class articleAPI{
    private apiContext;
    
    constructor(){
        this.apiContext = request
    }

    async getArticle(slug:string){
        const context = await this.apiContext.newContext()
        return await context.get(`https://conduit-api.bondaracademy.com/api/articles/${slug}`)
    }

    async getComments(slug:string){
        const context = await this.apiContext.newContext()
        return await context.get(`https://conduit-api.bondaracademy.com/api/articles/${slug}/comments`)
    }


}