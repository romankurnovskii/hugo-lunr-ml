import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import glob from 'glob';
import matter from 'gray-matter';
import lunr from 'lunr';
import removeMd from 'remove-markdown';
import {stripHtml} from 'string-strip-html';
import lunrStemmerSupport from 'lunr-languages/lunr.stemmer.support.js';
import lunrMulti from 'lunr-languages/lunr.multi.js';
import tinyseg from 'lunr-languages/tinyseg.js';
import lunrJa from 'lunr-languages/lunr.ja.js';
import lunrEs from 'lunr-languages/lunr.es.js';
import lunrPt from 'lunr-languages/lunr.pt.js';
import lunrDe from 'lunr-languages/lunr.de.js';
import lunrRu from 'lunr-languages/lunr.ru.js';

import {createFolders, getSystemLang} from './utils.js';

lunrStemmerSupport(lunr);
tinyseg(lunr);
lunrMulti(lunr);
lunrDe(lunr);
lunrEs(lunr);
lunrJa(lunr);
lunrPt(lunr);
lunrRu(lunr);

const DEFAULT_LANGUAGE = 'ru';
const CONTENT_PATH = 'content/**';
const OUTPUT_INDEX_FILE = 'static/search/index.json';
const OUTPUT_LUNR_INDEX_FILE = 'static/search/lunr-index.json';

class HugoIndexer {
	constructor() {
		this.defaultLanguage = getSystemLang();
		this.input = CONTENT_PATH;
		this.output = OUTPUT_INDEX_FILE;
		this.outputLunr = OUTPUT_LUNR_INDEX_FILE;
		this.baseDir = path.dirname(this.input);
		this.extensions = ['.md', '.html'];

		this.indexData = {}; // Result index
		this.indexData[DEFAULT_LANGUAGE] = [];

		this._parseArgs();
	}

	_parseArgs() {
		if (process.argv.includes('-l')) {
			// Default language
			this.output = process.argv[process.argv.indexOf('-l') + 1];
		}

		if (process.argv.includes('-i')) {
			// Input
			this.input = process.argv[process.argv.indexOf('-i') + 1];
			console.log(process.argv.indexOf('-i'));
		}

		if (process.argv.includes('-o')) {
			// Output
			this.output = process.argv[process.argv.indexOf('-o') + 1];
		}

		if (process.argv.includes('-ol')) {
			// Output for lunr index
			this.outputLunr = process.argv[process.argv.indexOf('-ol') + 1];
		}
	}

	parseContent(dirPath) {
		const files = glob.sync(dirPath);
		for (const file of files) {
			const stats = fs.lstatSync(file);
			if (stats.isFile()) {
				this.parseFile(file);
			}
		}
	}

	parseFile(filePath) {
		const ext = path.extname(filePath);

		if (!this.extensions.includes(ext)) {
			return; // Not .md or .html
		}

		const meta = matter.read(filePath);
		const {data: postMeta, content: postContent} = meta;

		let plainText = '';
		if (ext === '.md') {
			plainText = removeMd(postContent);
		} else if (ext === '.html') {
			plainText = stripHtml(postContent);
		} else {
			console.log('Sikpped file: ' + filePath);
		}

		let tags = [];

		if (postMeta.tags) {
			tags = postMeta.tags;
		}

		let [lang, uri] = this._getPostUrl(filePath, postMeta);

		const item = {
			uri,
			title: postMeta.title,
			content: plainText,
			tags,
		};

		if (lang) {
			item.lang = lang;
		} else {
			lang = DEFAULT_LANGUAGE;
		}

		const indexPosts = this.indexData[lang] || [];
		indexPosts.push(item);
		this.indexData[lang] = indexPosts;
	}

	_getPostUrl(filePath, postMeta) {
		let uri = '/' + filePath.slice(0, Math.max(0, filePath.lastIndexOf('.'))); // Remove extension .md || .html
		uri = uri.replace(this.baseDir + '/', '');

		let lang = path.extname(uri);

		if (lang) {
			// Remove lang extension [.en] etc
			lang = lang.replace('.', '');
			uri = uri.slice(0, Math.max(0, uri.lastIndexOf('.')));
		}

		if (uri.endsWith('/index')) {
			uri = uri.slice(0, -5);
		}

		if (postMeta.slug !== undefined) {
			uri = path.dirname(uri) + postMeta.slug;
		}

		if (postMeta.url !== undefined) {
			uri = postMeta.url;
		}

		return [lang, uri];
	}

	_setDefaultLanguage(lang) {
		this.defaultLanguage = lang;
	}

	_setInput(dirPath) {
		this.input = dirPath;
	}

	_setOutput(filePath) {
		this.output = filePath;
	}

	_getLanguages() {
		// Get list of language codes from created index
		return Object.keys(this.indexData);
	}

	createIndex() {
		console.log(`Arguments: input: ${this.input}, output: ${this.output}, defaultLanguage: ${this.defaultLanguage}`);

		createFolders(this.output);

		this.stream = fs.createWriteStream(this.output);

		this.parseContent(this.input);

		this.stream.write(JSON.stringify(this.indexData, null, 4));
		this.stream.end();

		console.info(`Saved json data: ${this.output}`);

		this.saveLunrIndex();
	}

	saveLunrIndex() {
		const contentMap = {};
		const languages = this._getLanguages();

		function createLunrIndex(lang, documents) {
			contentMap[lang] = contentMap[lang] || {};
			const idx = lunr(function () {
				if (languages.length > 1) {
					this.use(lunr.multiLanguage(...languages));
				}

				this.ref('uri');

				this.field('title');
				this.field('content');
				this.field('description');

				for (const doc of documents) {
					this.add(doc);
					contentMap[lang][doc.uri] = doc.title;
				}
			});
			return idx;
		}

		const lunrIndex = {};
		console.log('Languages in Index:', languages);

		for (const lang of languages) {
			const idx = createLunrIndex(lang, this.indexData[lang]);
			lunrIndex[lang] = idx;
		}

		lunrIndex.contentMap = contentMap;
		const serializedIdx = JSON.stringify(lunrIndex);

		try {
			fs.writeFileSync(this.outputLunr, serializedIdx, {flag: 'w+'});
			console.info(`Saved lunr index data: ${this.outputLunr}`);
		} catch (error) {
			console.error(error);
		}
	}
}

export {HugoIndexer, DEFAULT_LANGUAGE, CONTENT_PATH, OUTPUT_INDEX_FILE, OUTPUT_LUNR_INDEX_FILE};
