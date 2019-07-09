/* eslint-env mocha */

import { strictEqual, deepStrictEqual } from 'assert';
import { ContentMap } from '../src/index.mjs';

describe('matching types', () =>
{
	const map = new ContentMap();
	map.set('*/*+xml', 1);
	map.set('text/*', 2);
	map.set('*/json', 3);
	map.set('image/png', 4);
	map.set('text/document+xml', 5);

	it('should prefer exact match', () =>
	{
		strictEqual(map.get('example/document+xml'), 1);
		strictEqual(map.get('text/whatever'), 2);
		strictEqual(map.get('application/json'), 3);
		strictEqual(map.get('image/png'), 4);
	});

	it('should detect presence', () =>
	{
		strictEqual(map.has('audio/ogg'), false);
		strictEqual(map.has('example/document+xml'), true);
	});

	it('should sort multiple matches by importance', () =>
	{
		deepStrictEqual(
			map.getAll('text/document+xml'),
			[ 5, 1, 2 ]);
	});
});

describe('no suffix information', () =>
{
	const map = new ContentMap();
	map.set('*/json', 1);

	it('should not match anything', () =>
	{
		strictEqual(
			map.get('text/plain'),
			undefined);
	});
});

describe('iterable protocol', () =>
{
	const map = new ContentMap();
	map.set('*/json', 1);
	map.set('text/plain', 2);

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
