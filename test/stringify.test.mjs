/* eslint-env mocha */

import { strictEqual, throws } from 'assert';
import { stringify } from '../src/index.mjs';

describe('stringify', () =>
{
	it('should convert back to string', () =>
	{
		const mime =
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
		};

		strictEqual(
			stringify(mime),
			'application/vnd.openstreetmap.data+xml; charset=utf-8; needs="To (be) quoteD"');
	});

	it('passes string form through', () =>
	{
		strictEqual(
			stringify('text/plain'),
			'text/plain');
	});

	it('throws on invalid input', () =>
	{
		throws(() => stringify(123));
		throws(() => stringify({ type : { name : 'missing subType' } }));
	});
});
