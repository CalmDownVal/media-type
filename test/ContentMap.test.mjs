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
	map.add('text/document+xml', 6);

	it('should prefer exact match', () =>
	{
		strictEqual(map.match('audio/ogg'), 1);
		strictEqual(map.match('example/document+xml'), 2);
		strictEqual(map.match('text/whatever'), 3);
		strictEqual(map.match('application/json'), 4);
		strictEqual(map.match('image/png'), 5);
	});

	it('should sort multiple matches by importance', () =>
	{
		deepStrictEqual(
			map.matchAll('text/document+xml'),
			[ 6, 1, 2, 3 ]);
	});
});

describe('no suffix information', () =>
{
	const map = new ContentMap();
	map.add('*/json', 1);

	it('should not match anything', () =>
	{
		strictEqual(
			map.match('text/plain'),
			null);
	});
});

describe('iterable protocol', () =>
{
	const map = new ContentMap();
	map.add('*/json', 1);
	map.add('text/plain', 2);

	it('should give the correct size', () =>
	{
		// this is not a part of the iterable protocol, but is very handy nontheless
		strictEqual(map.size, 2);
	});

	it('should be iterable', () =>
	{
		const values = [];
		for (const value of map)
		{
			values.push(value.slice(0, 2));
		}

		deepStrictEqual(values,
			[
				[ '*/json', 1 ],
				[ 'text/plain', 2 ]
			]);
	});
});
