import * as CONST from '../general/const/index';
import * as Actions from '../general/actions/index';

const TIMEOUT = 40000;
const AT_ID = 'Google';
const puppeteer = require('puppeteer');

let browser, page, LINK;

beforeAll(async () => {
	browser = await puppeteer.launch({
		headless: Actions.isHeadless(),		
		slowMo: 60,
        ignoreHTTPSErrors: true,
        args: [`--window-position=0,0`, `--window-size=${Actions.RESOLUTIONS.FHD.w},${Actions.RESOLUTIONS.FHD.h}`],
		devtools: false
	});
	LINK = "https://enterprise.taskworld.com";
	page = await browser.newPage();
	
	await page.goto(LINK);
	
}, TIMEOUT);

afterAll(() => {
	browser.close();
});

describe('Google integration check', () => {    
    it(`${AT_ID} check google integration`, async () => {
        await page.goto(LINK);
		await page.waitFor(CONST.cssSelector.googleLoginButton);
        expect(CONST.cssSelector.googleLoginButton).toBeTruthy();
        await page.click(CONST.cssSelector.googleLoginButton);
        expect (page.url()).toMatch(/google.com/);
    }, TIMEOUT);
    
});