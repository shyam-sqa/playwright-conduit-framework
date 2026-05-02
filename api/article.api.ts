import { APIRequestContext } from '@playwright/test';

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


}