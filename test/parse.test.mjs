/* eslint-env mocha */

import { ok, strictEqual, deepStrictEqual } from 'assert';
import { parse } from '../src/index.mjs';

describe('parse', () =>
{
	describe('top-level types', () =>
	{
		it('should match registered top-level types', () =>
		{
			const result = parse('example/sub-type');
			strictEqual(
				result && result.type.name,
				'example');
		});

		it('should match extension types', () =>
		{
			const result = parse('x-some-type/sub-type');
			strictEqual(
				result && result.type.isExtension,
				true);
		});

		it('should not match invalid types', () =>
		{
			strictEqual(parse('invalid-type/sub-type'), null);
		});
	});

	describe('sub-types', () =>
	{
		it('should parse out sub-type', () =>
		{
			const result = parse('example/sub-type');
			strictEqual(
				result && result.subType.name,
				'sub-type');
		});

		it('should recognize valid tree prefixes', () =>
		{
			const result1 = parse('example/vnd.sub-type');
			strictEqual(
				result1 && result1.subType.tree,
				'vnd');

			const result2 = parse('example/prs.sub-type');
			strictEqual(
				result2 && result2.subType.tree,
				'prs');

			const result3 = parse('example/xxx.sub-type');
			strictEqual(
				result3 && result3.subType.tree,
				null);
		});

		it('should recognize suffixes', () =>
		{
			const result1 = parse('example/sub-type+xml');
			strictEqual(result1 && result1.subType.suffix,
				'xml');

			const result2 = parse('example/sub-type');
			strictEqual(result2 && result2.subType.suffix,
				null);

			strictEqual(parse('example/sub-type+bad'), null);
		});
	});

	describe('parameters', () =>
	{
		it('should parse out parameters (lowercased)', () =>
		{
			const result = parse('example/sub-type; ChArSeT=utf-8; bad');
			deepStrictEqual(
				result && result.parameters,
				{ charset : 'utf-8' });
		});

		it('should handle comments', () =>
		{
			ok(parse('example/sub-type; ChArSeT=utf-8 (Im a comment!)'));
		});
	});

	describe('pattern wildcards', () =>
	{
		it('should reject wildcards by default', () =>
		{
			strictEqual(parse('*/javascript'), null);
		});

		it('should parse wildcards when explicitly enabled', () =>
		{
			deepStrictEqual(
				parse('*/*+*', true),
				{
					type :
					{
						name : '*',
						isExtension : false
					},
					subType :
					{
						name : '*+*',
						tree : null,
						suffix : '*'
					},
					parameters : {}
				});
		});
	});

	describe('final test', () =>
	{
		it('should parse a complex type', () =>
		{
			deepStrictEqual(
				parse('application/vnd.openstreetmap.data+xml; charset=utf-8; NeEdS="To (be) quoteD" (hello world)'),
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
						needs : 'To (be) quoteD'
					}
				});
		});
	});
});
