#!/usr/bin/env node
/* eslint-disable @stylistic/max-len */
import assert from 'node:assert';
import {readFileSync} from 'node:fs';
import lunr from 'lunr';
import {describe, it, before} from 'mocha';
import {OUTPUT_INDEX_FILE, OUTPUT_LUNR_INDEX_FILE, HugoIndexer} from './index.js';

const DEFAULT_LANGUAGE = 'en';

before(async () => {
	const index = new HugoIndexer({defaultLanguage: 'ru'});
	index._setOutput(OUTPUT_INDEX_FILE);
	await index.createIndex();
});

describe('Search index', () => {
	it('index content is equal to expected', () => {
		// Expect
		const expectedIndex = {
			ru: [
				{
					uri: '/posts/post-sub01',
					title: 'Текст-рыба',
					description: 'описание',
					content: '\nПовседневная практика показывает, что постоянный количественный рост и сфера нашей активности требуют от нас анализа направлений прогрессивного развития. Повседневная практика показывает, что дальнейшее развитие различных форм деятельности обеспечивает широкому кругу (специалистов) участие в формировании систем массового участия.\n\nТоварищи! Рамки и место обучения кадров требуют от нас анализа соответствующий условий активизации. Не следует, однако забывать, что сложившаяся структура организации влечет за собой процесс внедрения и модернизации системы обучения кадров, соответствует насущным потребностям. Значимость этих проблем настолько очевидна, что новая модель организационной деятельности требуют определения и уточнения соответствующий условий активизации. Разнообразный и богатый опыт новая модель организационной деятельности позволяет выполнять важные задания по разработке дальнейших направлений развития. Равным образом начало повседневной работы по формированию позиции влечет за собой процесс внедрения и модернизации соответствующий условий активизации. Повседневная практика показывает, что сложившаяся структура организации позволяет оценить значение новых предложений.',
					tags: [],
					lang: 'ru',
				},
			],
			en: [
				{
					uri: '/posts/post-sub01',
					title: 'Test post 01 Eng',
					description: null,
					content: '\nLorem Ipsum is simply dummy text of the printing and typesetting industry.\n\nLorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.\n\nIt was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
					tags: [],
					lang: 'en',
				},
			],
		};

		// Actual
		const data = readFileSync(OUTPUT_INDEX_FILE);
		const fileData = JSON.parse(data);

		// Assert
		assert.equal(JSON.stringify(fileData), JSON.stringify(expectedIndex));
	});
});

describe('Lunr index', () => {
	let lunrIndex;
	let lngIndex = {};
	let lngIndexRu = {};
	let index = {};
	let indexRu = {};
	before(() => {
		lunrIndex = JSON.parse(readFileSync(OUTPUT_LUNR_INDEX_FILE));
		lngIndex = lunrIndex[DEFAULT_LANGUAGE];
		index = lunr.Index.load(lngIndex);

		// Ru
		lngIndexRu = lunrIndex.ru;
		indexRu = lunr.Index.load(lngIndexRu);
	});

	it('is created lunr index object correct', () => {
		// Expect
		const minSearchResultsLength = 1;

		// Actual
		const searchResult = index.search('1960s');

		// Assert
		assert.equal(searchResult.length, minSearchResultsLength);
	});

	it('supports multiple languages (zh)', () => {
		const index = new HugoIndexer({defaultLanguage: 'zh'});
		// Check if it doesn't throw and initializes
		assert.doesNotThrow(() => index._getLanguages());
	});

	it('find russian post', () => {
		// Expect
		const pagesStore = lunrIndex.contentMap.ru;
		const minSearchResultsLength = 1;
		const expectedPageTitle = 'Текст-рыба';

		// Actual
		const searchResultRu = indexRu.search('Рамки');

		// Assert
		assert.equal(searchResultRu.length, minSearchResultsLength);

		const foundUri = searchResultRu[0].ref;
		const foundPageTitle = pagesStore[foundUri];
		assert.equal(foundPageTitle, expectedPageTitle);
	});

	it('return empty search result if there is no search request', () => {
		// Expect
		const minSearchResultsLength = 0;

		// Actual
		const searchResult = index.search('some other string');

		// Assert
		assert.equal(searchResult.length, minSearchResultsLength);
	});
});

