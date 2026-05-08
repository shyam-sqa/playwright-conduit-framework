import {test, expect} from '../fixtures/test.fixture'
import { home } from '../pages/home.page'
import { articleAPI } from '../api/article.api'

test("Add/remove to favorites",async({page, apiContext})=>{
   // const api = new articleAPI(apiContext)
    const title = "Discover Bondar Academy: Your Gateway to Efficient Learning"
   // await api.createArticle(title,'about','content')


    const home_page = new home(page)
    await home_page.open()

    const countBefore = await home_page.get_favorites_count(title)
    await home_page.add_to_favorites(title)
    expect(await home_page.get_favorites_count(title)).toBe(countBefore + 1)


    
    await home_page.remove_from_favorites(title)
    expect(await home_page.get_favorites_count(title)).toBe(countBefore)
})

test("Remove from favorites",async({page})=>{
    // const title:string = 'Mastering Knowledge with Self-Assessments: Identifying and Bridging Learning Gaps in Education'
    // const home_page = new home(page)
    // await home_page.open()
    // const preCount = await home_page.get_favorites_count(title)
    // await home_page.remove_from_favorites(title)
    // const postCount = await home_page.get_favorites_count(title)
    // expect(postCount).toEqual(preCount-1)
})