#!/usr/bin/env node
import process from 'node:process';
import {Command} from 'commander';
import {HugoIndexer} from './index.js';

const program = new Command();
program
	.option('-i, --input <path>', 'Set input path to parse', 'content/**')
	.option('-o, --output <file>', 'Set output index file path', 'static/search/index.json')
	.option('-L, --output-lunr <file>', 'Set output lunr index file path', 'static/search/lunr-index.json')
	.option('-l, --lang <code>', 'Set default language', 'ru')
	.helpOption('-h, --help', 'Display help for command')
	.parse(process.argv);

const options = program.opts();

try {
	await new HugoIndexer({
		input: options.input,
		output: options.output,
		outputLunr: options.outputLunr,
		defaultLanguage: options.lang,
	}).createIndex();
} catch (error) {
	console.error('Error:', error.message);
	process.exit(1);
}
