import {test, expect} from '../fixtures/test.fixture'
import { home } from '../pages/home.page'
import { articleAPI } from '../api/article.api'

test("Add and remove article from favorites",async({page, apiContext})=>{
    const api = new articleAPI(apiContext)
    const title = `Favorites Test ${Date.now()}`
    const slug = await api.createArticle(title,'about','content')

    const home_page = new home(page)
    await home_page.open()

    const countBefore = await home_page.get_favorites_count(title)
    await home_page.add_to_favorites(title)
    expect(await home_page.get_favorites_count(title)).toBe(countBefore + 1)


    await home_page.remove_from_favorites(title)
    expect(await home_page.get_favorites_count(title)).toBe(countBefore)

    
    await api.deleteArticle(slug)

})

