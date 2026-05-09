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

    async createArticle(title:string,description:string,body:string,taglist?:string[]):Promise<string>{
        const response = await this.apiContext.post('/api/articles/',{
            data:{
                article:{
                    title:title,
                    description: description,
                    body:body,
                    taglist: taglist
                }
            }
        })
        expect(response.status()).toBe(201)
        const responseBody = await response.json()
        const slug = responseBody.article.slug
        console.log(slug)
        return slug
    }

    async deleteArticle(slug:string){
        const response = this.apiContext.delete(`api/articles/${slug}`)
        expect((await response).status()).toBe(204)
    }

}