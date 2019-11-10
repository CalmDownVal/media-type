/**
 * This script replaces absolute paths in C8 coverage reports and feeds it to Codacy.
 * Expects `CODACY_PROJECT_TOKEN` to be filled in the `.env` file.
 */

const { readFile } = require('fs');
const { resolve, relative } = require('path');

const RE_PATH = /^SF:(.*)$/gm;

const rootPath = resolve(__dirname, '..');
const filePath = resolve(rootPath, 'coverage/lcov.info');

readFile(filePath, 'utf8', (error, coverage) =>
{
	if (error)
	{
		throw error;
	}

	console.log('converting coverage report...');

	let match;
	let count = 0;

	RE_PATH.lastIndex = 0;
	while ((match = RE_PATH.exec(coverage)))
	{
		const path = relative(rootPath, match[1]);
		const index = match.index + match[0].length;

		coverage = coverage.slice(0, match.index) + `SF:${path}` + coverage.slice(index);
		RE_PATH.lastIndex = index;

		++count;
	}

	console.log(`converted ${count} paths`);
	console.log('uploading coverage report...');
	require('dotenv').config();
	require('codacy-coverage').handleInput(coverage, { verbose: true });
});
