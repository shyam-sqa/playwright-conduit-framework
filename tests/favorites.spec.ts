import {test, expect} from '../fixtures/test.fixture'
import { home } from '../pages/home.page'

test("Add to favorites",async({page})=>{
    const title:string = 'Mastering Knowledge with Self-Assessments: Identifying and Bridging Learning Gaps in Education'
    const home_page = new home(page)
    await home_page.open()
    const preCount = await home_page.get_favorites_count(title)
    await home_page.add_to_favorites(title)
    const postCount = await home_page.get_favorites_count(title)
    expect(postCount).toEqual(preCount+1)
})