import fs from 'node:fs';
import path from 'node:path';
import {DEFAULT_LANGUAGE} from './index.js';

const getSystemLang = () => {
	let {locale} = new Intl.DateTimeFormat().resolvedOptions();
	try {
		locale = locale.slice(0, 2);
	} catch {
		console.info(`Couldn't get system language. Setting default: ${DEFAULT_LANGUAGE}`);
		locale = DEFAULT_LANGUAGE;
	}

	return locale;
};

const createFolders = fullPath => {
	const directoryName = path.dirname(fullPath);
	if (!fs.existsSync(directoryName)) {
		const result = fs.mkdirSync(directoryName, {recursive: true});
		console.log('Created output path:', result);
	}
};

export {getSystemLang, createFolders};
