/* eslint-env mocha */

import { ok, strictEqual, deepStrictEqual } from 'assert';
import parse from '../src/parser.mjs';

const NO_MATCH = 'did not match a valid type';
const INVALID_MATCH = 'matched invalid type';

describe('top-level types', () =>
{
	it('should match registered top-level types', () =>
	{
		const result = parse('example/sub-type');
		strictEqual(
			result && result.type.name,
			'example',
			NO_MATCH);
	});

	it('should match extension types', () =>
	{
		const result = parse('x-some-type/sub-type');
		strictEqual(
			result && result.type.isExtension,
			true,
			NO_MATCH);
	});

	it('should not match invalid types', () =>
	{
		const result = parse('invalid-type/sub-type');
		strictEqual(
			result,
			null,
			INVALID_MATCH);
	});
});

describe('sub-types', () =>
{
	it('should parse out sub-type', () =>
	{
		const result = parse('example/sub-type');
		strictEqual(
			result && result.subType.name,
			'sub-type',
			NO_MATCH);
	});

	it('should recognize valid tree prefixes', () =>
	{
		const result1 = parse('example/vnd.sub-type');
		strictEqual(
			result1 && result1.subType.tree,
			'vnd',
			NO_MATCH);

		const result2 = parse('example/prs.sub-type');
		strictEqual(
			result2 && result2.subType.tree,
			'prs',
			NO_MATCH);

		const result3 = parse('example/xxx.sub-type');
		strictEqual(
			result3 && result3.subType.tree,
			null,
			INVALID_MATCH);
	});

	it('should recognize suffixes', () =>
	{
		const result1 = parse('example/sub-type+xml');
		strictEqual(result1 && result1.subType.suffix,
			'xml',
			NO_MATCH);

		const result2 = parse('example/sub-type');
		strictEqual(result2 && result2.subType.suffix,
			null,
			NO_MATCH);

		const result3 = parse('example/sub-type+bad');
		strictEqual(result3,
			null,
			INVALID_MATCH);
	});
});

describe('parameters', () =>
{
	it('should parse out parameters (lowercased)', () =>
	{
		const result = parse('example/sub-type; ChArSeT=utf-8');
		deepStrictEqual(
			result && result.parameters,
			{ charset : 'utf-8' },
			NO_MATCH);
	});

	it('should handle comments', () =>
	{
		const result = parse('example/sub-type; ChArSeT=utf-8 (Im a comment!)');
		ok(result, NO_MATCH);
	});
});

it('should parse a complex type', () =>
{
	const result = parse('application/vnd.openstreetmap.data+xml; charset=utf-8; FoO=BaR (hello world)');
	deepStrictEqual(
		result,
		{
			type :
			{
				name : 'application',
				isExtension : false
			},
			subType :
			{
				name : 'vnd.openstreetmap.data+xml',
				tree : 'vnd',
				suffix : 'xml'
			},
			parameters :
			{
				charset : 'utf-8',
				foo : 'BaR'
			}
		},
		NO_MATCH);
});
