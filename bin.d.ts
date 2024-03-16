export class HugoIndexer {
	constructor();
	parseContent(directoryPath: string): void;
	parseFile(filePath: string): void;
	createIndex(): void;
	saveLunrIndex(): void;
}
