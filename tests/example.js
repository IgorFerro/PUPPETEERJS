// Helpers Functions
const puppeteer = require('puppeteer')
const expect = require('chai').expect
const config = require('../lib/config')
const click = require('../lib/helpers').clickButton
const typeText = require('../lib/helpers').typeText
const loadUrl = require('../lib/helpers').loadUrl
const waitForText = require('../lib/helpers').waitForText
const pressKey = require('../lib/helpers').pressKey
const shouldExist = require('../lib/helpers').shouldExist
const getCount = require('../lib/helpers').getCount

// Utility Functions
const utils = require('../lib/utils')

const homePage = require('../page/home-page')
const loginPage = require('../page/login-page')
const searchResultsPage =  require('../page/searchResults-page')
const feedbackPage= require('../page/feedback-page')
const feedbackResultsPage =require('../page/feedbackResults-page')

//Page
describe('My first puppeteer test', () => {
	let browser
	let page

	before(async function() {
		browser = await puppeteer.launch({
			headless: config.isHeadless,
			slowMo: config.slowMo,
			devtools: config.isDevtools,
			timeout: config.waitingTimeout,
		})
		page = await browser.newPage()
		await page.setDefaultTimeout(config.launchTimeout)
		await page.setViewport({
			width: config.viewportWidth,
			height: config.viewportHeight,
		})
	})
	after(async function() {
		await browser.close()
	})


	describe('Login Test', () => {
		it('should navigate to homepage', async () => {
			await loadUrl(page, config.baseUrl)
			await shouldExist(page, homePage.BANKING_FEATURES)
		})
		it('should click on signin button', async () => {
			await click(page, homePage.SIGN_IN_BUTTON)
			await shouldExist(page, loginPage.LOGIN_FORM)
		})
		it('should submit login form', async () => {
			await typeText(page, utils.generateID(), loginPage.USER_NAME)
			await typeText(page, utils.generateNumbers(), loginPage.USERPASSWORD)
			await click(page, loginPage.SUBMIT_BUTTON)
		})

		it('should get error message', async () => {
			await waitForText(page, 'body', 'Login and/or password are wrong')
			await shouldExist(page, loginPage.SUBMIT_BUTTON)
		})
	})

	describe('search test', async () => {
		it('should navigate to homepage', async () => {
			await loadUrl(page, config.baseUrl)
			await shouldExist(page, homePage.BANKING_FEATURES)
		})
		it('should submit search phrase', async () => {
			await typeText(page, 'hello world', homePage.SEARCH_BAR)
			await pressKey(page, 'Enter')
		})
		it('should display search results', async () => {
			await waitForText(page, searchResultsPage.SEARCH_RESULTS_TITLE, 'Search Results')
			await waitForText(page, searchResultsPage.SEARCH_RESULTS_CONTENT, 'No results were found for the query')
		})
	})

	describe('Navbar Links Test', async () => {
		it('should navigate to homepage', async () => {
			await loadUrl(page, config.baseUrl)
			await shouldExist(page, homePage.BANKING_FEATURES)
		})
		it('should have correct number of links', async () => {
			// get count of links
			const numberOfLinks = await getCount(page, '#pages-nav > li')
			// assert the count
			expect(numberOfLinks).to.equal(3)
		})
	})

	describe('Feedback Test', async () => {
		it('should navigate to homepage', async () => {
			await loadUrl(page, config.baseUrl)
			await shouldExist(page, homePage.BANKING_FEATURES)
		})
		it('should click on feedback link', async () => {
			await click(page, homePage.LINK_FEEDBACK)
			await shouldExist(page, feedbackPage.FEEDBACK_FORM)
		})
		it('should submit feedback form', async () => {
			await typeText(page, 'Igor', feedbackPage.FORM_NAME)
			await typeText(page, utils.generateEmail(), feedbackPage.FORM_EMAIL)
			await typeText(page, 'Just Subject', feedbackPage.FORM_SUBJECT)
			await typeText(page, 'Just a comment', feedbackPage.FORM_COMMENT)
			await click(page, feedbackPage.FORM_SUBMIT_BUTTON)
		})
		it('should display sucess message', async () => {
			await shouldExist(page, feedbackResultsPage.FEEDBACK_RESULTS_TITLE)
			await waitForText(page, feedbackResultsPage.FEEDBACK_RESULTS_CONTENT, 'Thank you for your comments')
		})
	})
	describe('Forgotten Password', async () => {
		it('should navigate to homepage', async () => {
			await loadUrl(page, config.baseUrl)
			await shouldExist(page, homePage.BANKING_FEATURES)
		})
		it('should load forgotten password form', async () => {
			await loadUrl(page, 'http://zero.webappsecurity.com/forgot-password.html')
			await waitForText(page, 'h3', 'Forgotten Password')
	   })
	   it('should submit email', async () => {
		await typeText(page,utils.generateEmail(), '#user_email')
		await click(page, '.btn-primary')
	 })
	 it('should display succes message', async () => {
		await waitForText(page, 'body','Your password will be sent to the following email')
	
	 })
	 
	})
})
