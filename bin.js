
#!/usr/bin/env node
import { Command } from 'commander';
import { HugoIndexer } from './index.js';

const program = new Command();
program
    .option('-i, --input <path>', 'Set input path to parse', 'content/**')
    .option('-o, --output <file>', 'Set output index file path', 'static/search/index.json')
    .option('-ol, --output-lunr <file>', 'Set output lunr index file path', 'static/search/lunr-index.json')
    .option('-l, --lang <code>', 'Set default language', 'ru')
    .helpOption('-h, --help', 'Display help for command')
    .parse(process.argv);

const opts = program.opts();

try {
    new HugoIndexer({
        input: opts.input,
        output: opts.output,
        outputLunr: opts.outputLunr,
        defaultLanguage: opts.lang
    }).createIndex();
} catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
}
