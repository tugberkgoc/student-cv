/* eslint-disable linebreak-style */
'use strict'

const puppeteer = require('puppeteer')
const { configureToMatchImageSnapshot } = require('jest-image-snapshot')
const PuppeteerHar = require('puppeteer-har')
const shell = require('shelljs')

const width = 1600
const height = 850
const delayMS = 5

let browser
let page
let har

// threshold is the difference in pixels before the snapshots dont match
const toMatchImageSnapshot = configureToMatchImageSnapshot({
	customDiffConfig: { threshold: 2 },
	noColors: true,
})
expect.extend({ toMatchImageSnapshot })

beforeAll( async() => {
	browser = await puppeteer.launch({ headless: true, slowMo: delayMS, args: [`--window-size=${width},${height}`] })
	page = await browser.newPage()
	har = new PuppeteerHar(page)
	await page.setViewport({ width, height })
	await shell.exec('sh acceptanceTests/scripts/beforeAll.sh')
})

afterAll( async() => {
	await browser.close()
	await shell.exec('sh acceptanceTests/scripts/afterAll.sh')
})

beforeEach(async() => {
	await shell.exec('sh acceptanceTests/scripts/beforeEach.sh')
})


async function clear(page, selector) {
	await page.evaluate(selector => {
	  document.querySelector(selector).value = ''
	}, selector)
}

describe('CreatingCv', () => {
	test('Creating new Cv', async done => {
		//start generating a trace file.
		await page.tracing.start({path: 'trace/registering_user_har.json',screenshots: true})
		await har.start({path: 'trace/registering_user_trace.har'})
		//ARRANGE
		await page.goto('http://localhost:8080/register', { timeout: 30000, waitUntil: 'load' })
		//ACT
		await page.type('input[name=user].signup', 'NewUser')
		await page.type('input[name=email]', 'email@h.h')
		await page.type('input[name=phoneNumber]', '11111111111')
		await page.type('input[name=pass].signup', 'password')
		await page.click('input[type=submit].signup')
		await page.type('input[name=user]', 'NewUser')
		await page.type('input[name=pass]', 'password')
		await page.click('input[type=submit]#myPass')
		await page.goto('http://localhost:8080/cv/edit', {timeout: 30000, waitUntil: 'load' })
		await clear(page, 'input[name=name]')
		await page.type('input[name=name]', 'NewCv')
		await clear(page, 'input[name=addressLine1]')
		await page.type('input[name=addressLine1]', 'test steet 5')
		await clear(page, 'input[name=addressLine2]')
		await page.type('input[name=addressLine2]', 'test steet 7')
		await clear(page, 'input[name=postcode]')
		await page.type('input[name=postcode]', 'cv6 5fr')
		await clear(page, 'input[name=country]')
		await page.type('input[name=country]', 'Test')
		await clear(page, 'input[name=phoneNumber]')
		await page.type('input[name=phoneNumber]', '11111111111')
		await page.click('input[type=submit]#next')
		//await clear(page, 'input[name=summary]')
		await page.type('input[name=summary]', 'NewCv')
		//await clear(page, 'input[name=careerObj]')
		await page.type('input[name=careerObj]', 'test steet 5')
		//await clear(page, 'input[name=careerSum]')
		await page.type('input[name=careerSum]', 'test steet 7')
		//await clear(page, 'input[name=workExperience]')
		await page.type('input[name=workExperience]', 'cv6 5fr')
		//await clear(page, 'input[name=personalSkills]')
		await page.type('input[name=personalSkills]', 'Test')
		//await clear(page, 'input[name=education]')
		await page.type('input[name=education]', '11111111111')
		//await clear(page, 'input[name=references]')
		await page.type('input[name=references]', '11111111111')
		await page.click('input[type=submit]#create')
		await page.goto('http://localhost:8080/cv', {timeout: 30000, waitUntil: 'load' })
		//ASSERT
		//check that the user is taken to the homepage after attempting to login as the new user:
		await page.waitForSelector('h2')
		expect( await page.evaluate( () => document.querySelector('h2').innerText ) )
			.toBe('NEWCV')

		// grab a screenshot
		const image = await page.screenshot()
		// compare to the screenshot from the previous test run
		expect(image).toMatchImageSnapshot()
		// stop logging to the trace files
		await page.tracing.stop()
		await har.stop()
		done()
	}, 16000)
})
