import * as CONST from '../general/const/index';
import * as Actions from '../general/actions/index';

const TIMEOUT = 40000;
const puppeteer = require('puppeteer');
const AT_ID = 'Servers';
let browser, page, LINK;

beforeAll(async () => {
	browser = await puppeteer.launch({
		headless: Actions.isHeadless(),		
		slowMo: 60,
        ignoreHTTPSErrors: true,
        args: [`--window-position=0,0`, `--window-size=${Actions.RESOLUTIONS.FHD.w},${Actions.RESOLUTIONS.FHD.h}`],
		devtools: false
	});
	LINK = CONST.LINKS.northAmerica.login;
	page = await browser.newPage();
	
	await page.goto(LINK);
	
}, TIMEOUT);

afterAll(() => {
	browser.close();
});

describe('Server checks', () => {
    it(`${AT_ID} [1] server picker checks`, async () => {
        await page.goto(LINK);
        await page.waitFor(CONST.cssSelector.changeServerElement);
        expect(CONST.cssSelector.changeServerElement).toBeTruthy();
        await page.click(CONST.cssSelector.changeServerElement);
        await page.waitFor(CONST.cssSelector.changeServerPickerElement);
        expect(await page
            .$eval(CONST.cssSelector.changeServerPickerElement, el => el.innerText)
            .catch(e => console.warn(e)))
            .toMatch("North America");
    }, TIMEOUT);

    it(`${AT_ID} [2] Change server checks - Asia`, async () => {
        await page.goto(LINK);
        await page.waitFor(CONST.cssSelector.changeServerElement);
        await page.click(CONST.cssSelector.changeServerElement);
        await page.waitFor(CONST.cssSelector.asiaServer);
        await page.click(CONST.cssSelector.asiaServer);
        await page.waitFor(CONST.cssSelector.taskWorldLogo);
        expect (page.url()).toBe(CONST.LINKS.asia.login);
    }, TIMEOUT);

    it(`${AT_ID} [3] Change server checks - Europe`, async () => {
        await page.goto(LINK);
        await page.waitFor(CONST.cssSelector.changeServerElement);
        await page.click(CONST.cssSelector.changeServerElement);
        await page.waitFor(CONST.cssSelector.europeServer);
        await page.click(CONST.cssSelector.europeServer);
        await page.waitFor(CONST.cssSelector.taskWorldLogo);
        expect (page.url()).toBe(CONST.LINKS.europe.login);
    }, TIMEOUT);

    it(`${AT_ID} [4] Change server checks - return to America`, async () => {
        await page.waitFor(CONST.cssSelector.changeServerElement);
        await page.click(CONST.cssSelector.changeServerElement);
        await page.waitFor(CONST.cssSelector.northAmericaServer);
        await page.click(CONST.cssSelector.northAmericaServer);
        await page.waitFor(CONST.cssSelector.northAmericaServer);
        expect (page.url()).toBe(CONST.LINKS.northAmerica.login);
    }, TIMEOUT);
    

});