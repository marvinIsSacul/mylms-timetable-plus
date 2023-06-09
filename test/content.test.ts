import puppeteer from 'puppeteer'
import { buildMyLMSEvents } from '../src/content'
import { readFileSync } from 'fs'
import { join } from 'path'

describe.skip('content', () => {
	jest.setTimeout(30000)

	const html = readFileSync(join(__dirname, '_data_/honours-data-science-timetable.htm'), 'utf8')

	describe('buildSections', () => {
		it('should', async () => {
			const browser = await puppeteer.launch({
				headless: 'new',
				defaultViewport: { width: 1000, height: 900 }
			})
			const page = await browser.newPage()

			await page.goto('about:blank')
			await page.setContent(html)
			await page.waitForSelector('.timetable-events')
            
			const sections = await page.evaluate(buildMyLMSEvents)

			await browser.close()

			expect(sections.length).toBe(6)
		})
               
	})
})
