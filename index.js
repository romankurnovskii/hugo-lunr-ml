

import fs from 'fs'
import path from 'path'
import glob from 'glob'
import matter from 'gray-matter';
import removeMd from 'remove-markdown';
import { stripHtml } from "string-strip-html";

const DEFAULT_LANGUAGE = 'ru'
const CONTENT_PATH = 'content/**'
const OUTPUT_INDEX_FILE = 'public/search-index.json'

class HugoIndexer {

    constructor() {
        this.defaultLanguage = DEFAULT_LANGUAGE
        this.input = CONTENT_PATH
        this.output = OUTPUT_INDEX_FILE;
        this.baseDir = path.dirname(this.input);
        this.extensions = ['.md', '.html']

        this.indexData = {} // result index
        this.indexData[DEFAULT_LANGUAGE] = []

        this._parseArgs()
    }

    _parseArgs() {
        if (process.argv.indexOf("-l") != -1) {
            // default language
            this.output = process.argv[process.argv.indexOf("-l") + 1];
        }
        if (process.argv.indexOf("-i") != -1) {
            // input
            this.input = process.argv[process.argv.indexOf("-i") + 1];
            console.log(process.argv.indexOf("-i"))
        }
        if (process.argv.indexOf("-o") != -1) {
            // output
            this.output = process.argv[process.argv.indexOf("-o") + 1];
        }
    }

    parseContent(dirPath) {
        const files = glob.sync(dirPath)
        for (let file of files) {
            const stats = fs.lstatSync(file)
            if (stats.isFile()) {
                this.parseFile(file)
            }
        }
    }

    parseFile(filePath) {
        const ext = path.extname(filePath)

        if (!this.extensions.includes(ext)) {
            return // not .md or .html
        }

        const meta = matter.read(filePath);
        const { data: postMeta, content: postContent } = meta

        let plainText = ""
        if (ext == '.md') {
            plainText = removeMd(postContent);
        } else if (ext == '.html') {
            plainText = stripHtml(postContent);
        } else {
            console.log("Sikpped file: " + filePath)
        }

        let tags = [];

        if (postMeta.tags != undefined) {
            tags = postMeta.tags;
        }

        let [lang, uri] = this._getPostUrl(filePath, postMeta)

        const item = {
            'uri': uri,
            'title': postMeta.title,
            'content': plainText,
            'tags': tags
        };

        if (lang) {
            item['lang'] = lang
        } else {
            lang = DEFAULT_LANGUAGE
        }

        const indexPosts = this.indexData[lang] || []
        indexPosts.push(item)
        this.indexData[lang] = indexPosts

    }

    _getPostUrl(filePath, postMeta) {

        let uri = '/' + filePath.substring(0, filePath.lastIndexOf('.')); // remove extension .md || .html
        uri = uri.replace(this.baseDir + '/', '');

        let lang = path.extname(uri);

        if (lang) {
            // remove lang extension [.en] etc
            lang = lang.replace('.', '')
            uri = uri.substring(0, uri.lastIndexOf('.'));
        }

        if (uri.endsWith('/index')) {
            uri = uri.slice(0, -5)
        }

        if (postMeta.slug != undefined) {
            uri = path.dirname(uri) + postMeta.slug;
        }

        if (postMeta.url != undefined) {
            uri = postMeta.url
        }

        return [lang, uri]

    }

    _setDefaultLanguage(lang) {
        this.defaultLanguage = lang
    }
    
    _setInput(dirPath) {
        this.input = dirPath
    }

    _setOutput(filePath) {
        this.output = filePath
    }

    createIndex() {

        console.log(`Arguments: input: ${this.input}, output: ${this.output}`)

        this.stream = fs.createWriteStream(this.output);

        this.parseContent(this.input)

        this.stream.write(JSON.stringify(this.indexData, null, 4));
        this.stream.end()

        console.info(`Saved index: ${this.output}`)

    }

}

export { HugoIndexer, CONTENT_PATH, OUTPUT_INDEX_FILE }