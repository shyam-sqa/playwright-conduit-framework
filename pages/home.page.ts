import { Locator, Page, expect } from '@playwright/test';

export class home{
    constructor(private page:Page){ 
    }
    async open(){
       await this.page.goto('/')
    }

    async get_tags_names(){
        await this.page.waitForSelector('text=Popular Tags');
        const tags:string[] = await this.page.locator(".sidebar > div > a").allInnerTexts()
        return tags
    }

    async filter_by_tag(tag:string){
        const tagLocator:Locator = this.page.locator(".sidebar > div > a").getByText(tag, { exact: true });
        await tagLocator.waitFor({state:'visible'})
        await tagLocator.click()
    }

    async expect_tag(tag:string){
        const feed_nav =this.page.locator('.feed-toggle')
        await feed_nav.waitFor({state:'visible'})
        await expect(feed_nav).toContainText(tag)
        const links = this.page.locator('.article-preview a.preview-link')
        await links.first().waitFor({state:'visible'})
        const count = await links.count()
        expect(count).toBeGreaterThan(0)
        
        for(let i=0;i<count;i++){
            const tag_list:string [] = await links.locator('.tag-list > li').allInnerTexts()
            expect(tag_list).toContain(tag)
        }

    }

    async get_article_by_name(title:string){
        let link:Locator
        await this.page.waitForSelector('.article-preview a.preview-link h1',{state:'visible'})
        const articles = await this.page.locator('.article-preview a.preview-link h1' ).allInnerTexts()
            for(let i=0; i< articles.length;i++){
            if(articles[i].trim().toLowerCase() === title.trim().toLowerCase()){
                link = this.page.locator('.article-preview').nth(i)
                return link
            } 
        }        
    }

    async get_favorites_count(title:string){
        await this.page.waitForSelector('.article-preview a.preview-link h1',{state:'visible'})
        const link = await this.get_article_by_name(title)
        if(!link){
            throw new Error('Article not found')
        }
        const countText = await link.locator('.article-meta .btn-sm').innerText()
        const count = parseInt(countText.trim(), 10)
        return count
    }

    async add_to_favorites(title:string){
        const link = await this.get_article_by_name(title)
        if(!link){
            throw new Error('Article not found')
        }
        const button = link.locator('.article-meta .btn-sm')
        const beforeText = await button.innerText()
        const beforeCount = parseInt(beforeText.replace(/\D/g, ''), 10)
        await button.click()
        await expect.poll(async () => {
            const text = await button.innerText()
            return parseInt(text.replace(/\D/g, ''), 10)
        }).toBeGreaterThan(beforeCount)

        const afterText = await button.innerText()
        const afterCount = parseInt(afterText.replace(/\D/g, ''), 10)
    }
   
    
}