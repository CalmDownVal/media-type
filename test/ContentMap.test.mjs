/* eslint-env mocha */

import { strictEqual, deepStrictEqual } from 'assert';
import { ContentMap } from '../src/index.mjs';

describe('matching types', () =>
{
	const map = new ContentMap();
	map.add('*/*', 1);
	map.add('*/*+xml', 2);
	map.add('text/*', 3);
	map.add('*/json', 4);
	map.add('image/png', 5);

	it('should prefer exact match', () =>
	{
		strictEqual(map.match('audio/ogg'), 1);
		strictEqual(map.match('example/document+xml'), 2);
		strictEqual(map.match('text/whatever'), 3);
		strictEqual(map.match('application/json'), 4);
		strictEqual(map.match('image/png'), 5);
	});
});
