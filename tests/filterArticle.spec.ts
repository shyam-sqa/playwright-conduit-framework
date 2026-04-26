import {test, } from "../libs/fixtures/test.fixture";
import { home } from "../libs/pages/home.page";

test("filter by tags",async({page})=>{
    const home_page = new home(page);
    await home_page.open()
    const tags:string[] = await home_page.get_tags_names()
    for(let tag of tags){
        await home_page.filter_by_tag(tag)
        await home_page.expect_tag(tag) 
    }
})