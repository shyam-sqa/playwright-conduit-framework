import { Locator, Page, expect } from '@playwright/test';

export class home{
    constructor(private page:Page){ 
    }
    async open(){
       await this.page.goto("https://conduit.bondaracademy.com/")
    }

    async get_tags_names(){
        await this.page.waitForSelector('text=Popular Tags');
        const tags:string[] = await this.page.locator(".sidebar > div > a").allInnerTexts()
        return tags
    }

    async filter_by_tag(tag:string){
        //  const tagLocator:Locator =  this.page.locator(".sidebar > div > a",{hasText:tag})
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

   
    
}