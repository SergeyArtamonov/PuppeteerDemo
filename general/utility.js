const fs = require('fs');

const RESOLUTIONS = {
	HD: {
		w: 1366,
		h: 768
	},
	FHD: {
		w: 1920,
		h: 1040
	}
};

const isHeadless = () => {
	const argv = process.argv[Symbol.iterator](),
	  bin = argv.next().value,
	  file = argv.next().value;
	
	let headless = true;
	
	for (let item of argv) {
		if (item === 'headless' || item === '--runInBand') {
			headless = true;
			break;
		}
	}
	
	return headless;
};

const hasElement = async (page, el) => await page.evaluate(el => !!document.querySelector(el), el).catch(e => console.warn('hasElement', e));

const hasClass = async (page, el, str) => await  page.evaluate(el => {
	const _el = document.querySelector(el);
	
	return _el && _el.classList.contains(str);
}, el, str).catch(e => console.warn('hasClass', e));

export {
	RESOLUTIONS,
    isHeadless,
    hasElement,
    hasClass

};