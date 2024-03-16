/* eslint-disable @typescript-eslint/naming-convention */

export function createFolders(path: string): void;
export function getSystemLang(): string;

export type PostMeta = {
	title: string;
	description: string;
	tags: string[];
	slug?: string;
	url?: string;
};

export type Item = {
	uri: string;
	title: string;
	description: string;
	content: string;
	tags: string[];
	lang?: string;
};

export class HugoIndexer {
	constructor();
	parseContent(directoryPath: string): void;
	parseFile(filePath: string): void;
	createIndex(): void;
	saveLunrIndex(): void;
}

export const DEFAULT_LANGUAGE: string;
export const CONTENT_PATH: string;
export const OUTPUT_INDEX_FILE: string;
export const OUTPUT_LUNR_INDEX_FILE: string;
