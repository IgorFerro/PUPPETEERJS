const puppeteer =require('puppeteer')
const expect = require('chai').expect
const config= require('../lib/config')
const helpers = require('../lib/helpers')

describe('My first puppeteer test', () =>{
let browser
let page

before(async function (){
    browser = await puppeteer.launch({
        headless:config.isHeadless,
        slowMo: config.slowMo,
        devtools: config.isDevtools,
        timeout: config.waitingTimeout,
    })
    page =await browser.newPage()
    await page.setDefaultTimeout(config.launchTimeout)
    await page.setViewport({
        width:config.viewportWidth,
        height:config.viewportHeight
    })
})
after(async function(){
await browser.close()
})
it('My first test step', async () =>{
await page.goto(config.baseUrl)
await page.waitForSelector('#nav-search')

const url = await page.url()
const title = await page.title()

expect(url).to.contain('dev')
expect(title).to.contains('Community')
})
it('browser reload', async () => {
    await page.reload()
    await page.waitForSelector('#page-content')

    const url = await page.url()
    const title = await page.title()

    await page.waitFor(3000) //Bad Pratice!

    expect(url).to.contain('dev')
    expect(title).to.contains('Community')
})
it('click method', async ()=>{
    await page.goto("https://dev.to/")
    //await page.waitForSelector('#write-link')
    //await page.click('#write-link')
    await helpers.click(page,'#write-link')
    await page.waitForSelector('.registration-rainbow')
})
it('submit searchbox', async ()=>{
    await page.goto("https://dev.to/")
    await page.waitForSelector('#nav-search')
    await page.type('#nav-search',"Javascript")
    await page.keyboard.press('Enter')
    await page.waitForSelector('#articles-list')


})
})