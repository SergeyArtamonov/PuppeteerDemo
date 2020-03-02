import * as CONST from '../general/const/index';
import * as Actions from '../general/actions/index';

const TIMEOUT = 40000;
const puppeteer = require('puppeteer');
const AT_ID = 'Page';
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

describe('Login page check', () => {
	it(`${AT_ID} [1]Pre: Open page`, async () => {
        await page.goto(LINK);
		await page.waitFor(CONST.cssSelector.taskWorldLogo);
        expect(CONST.cssSelector.taskWorldLogo).toBeTruthy();
	}, TIMEOUT);

	it(`${AT_ID} [2]Check images - fail expected here`, async () => {
		await page.waitFor(CONST.cssSelector.peopleImage);
        expect(CONST.cssSelector.peopleImage).toBeTruthy();
        expect(await page
            .$$eval(CONST.cssSelector.peopleImage, el => el.src)
            .catch(e => console.warn(e)))
            .toBe(CONST.cssSelector.peopleImageScr);
        //.not.toBe(CONST.cssSelector.peopleImageScr); 
        // to fix this test, need to un-comment line 42 and comment line 41
        
        // this test must fails, because on this time browser page is small, and image is hidden. Same check will pass in test 3 because page size has been changed
	}, TIMEOUT);

    it(`${AT_ID} [3]Check images - expect to pass`, async () => {
        await page.setViewport({
            width: 901,
            height: 1080,
            deviceScaleFactor: 1,
          });
        await page.waitFor(CONST.cssSelector.peopleImage);
        expect(CONST.cssSelector.peopleImage).toBeTruthy();
        expect(await page
            .$eval(CONST.cssSelector.peopleImage, el => el.src)
            .catch(e => console.warn(e)))
            .toBe(CONST.cssSelector.peopleImageScr);
    }, TIMEOUT);
    
    it(`${AT_ID} [4] check signup link and text`, async () => {
        await page.setViewport({
            width: 1600,
            height: 1080,
            deviceScaleFactor: 1,
          });
        await page.waitFor(CONST.cssSelector.signUpLink);
        expect(CONST.cssSelector.signUpLink).toBeTruthy();
        expect(await page
            .$eval(CONST.cssSelector.signUpLink, el => el.innerText)
            .catch(e => console.warn(e)))
            .toBe("Sign up");
    }, TIMEOUT);
    
    it(`${AT_ID} [5] go to sign up`, async () => {
        await page.click(CONST.cssSelector.signUpLink);
        await page.waitFor(CONST.cssSelector.regEmailInput);
        expect(CONST.cssSelector.regEmailInput).toBeTruthy();
    }, TIMEOUT);
    
    it(`${AT_ID} [7] check wrong user`, async () => {
        await page.goto(LINK);
		await page.waitFor(CONST.cssSelector.googleLoginButton);
        await page.type(CONST.cssSelector.userEmailInput, "fakeemail@email.com");
        await page.type(CONST.cssSelector.userPasswordInput, "123456pass");
        await page.click(CONST.cssSelector.loginButton);
        await page.waitFor(CONST.cssSelector.errorMessage);
        expect(CONST.cssSelector.errorMessage).toBeTruthy();
        expect(await page
            .$eval(CONST.cssSelector.errorMessage, el => el.innerText)
            .catch(e => console.warn(e)))
            .toBe("Invalid email or password.");
    }, TIMEOUT);
    
    it(`${AT_ID} [8] check wrong email format`, async () => {
        await page.goto(LINK);
        await page.waitFor(CONST.cssSelector.googleLoginButton);
        await page.type(CONST.cssSelector.userEmailInput, "fakeemailNoDomain");
        await page.type(CONST.cssSelector.userPasswordInput, "123456pass");
        await page.click(CONST.cssSelector.loginButton);
        await page.waitFor(CONST.cssSelector.errorMessage);
        expect(CONST.cssSelector.errorMessage).toBeTruthy();
        expect(await page
            .$eval(CONST.cssSelector.errorMessage, el => el.innerText)
            .catch(e => console.warn(e)))
            .toBe("Please enter your email address.");
    }, TIMEOUT);
    
    it(`${AT_ID} [9] check no password enter`, async () => {
        await page.goto(LINK);
        await page.waitFor(CONST.cssSelector.googleLoginButton);
        await page.type(CONST.cssSelector.userEmailInput, "fakeemail@NoDomain.com");
        await page.type(CONST.cssSelector.userPasswordInput, "");
        await page.click(CONST.cssSelector.loginButton);
        await page.waitFor(CONST.cssSelector.errorMessage);
        expect(CONST.cssSelector.errorMessage).toBeTruthy();
        expect(await page
            .$eval(CONST.cssSelector.errorMessage, el => el.innerText)
            .catch(e => console.warn(e)))
            .toBe("Enter your password (at least 6 characters).");
    }, TIMEOUT);
    
    it(`${AT_ID} [10] check wrong email format - no domain zone`, async () => {
        await page.goto(LINK);
        await page.waitFor(CONST.cssSelector.googleLoginButton);
        await page.type(CONST.cssSelector.userEmailInput, "fakeemail@NoDomainZone");
        await page.type(CONST.cssSelector.userPasswordInput, "123456pass");
        await page.click(CONST.cssSelector.loginButton);
        await page.waitFor(CONST.cssSelector.errorMessage);
        expect(CONST.cssSelector.errorMessage).toBeTruthy();
        expect(await page
            .$eval(CONST.cssSelector.errorMessage, el => el.innerText)
            .catch(e => console.warn(e)))
            .toBe("Please enter your email address.");
    }, TIMEOUT);

    it(`${AT_ID} [11] check signup link and text`, async () => {
        await page.goto(LINK);
        await page.waitFor(CONST.cssSelector.forgotPasswordLink);
        expect(CONST.cssSelector.forgotPasswordLink).toBeTruthy();
        expect(await page
            .$eval(CONST.cssSelector.forgotPasswordLink, el => el.innerText)
            .catch(e => console.warn(e)))
            .toBe("Forgot password?");
    }, TIMEOUT);    

});