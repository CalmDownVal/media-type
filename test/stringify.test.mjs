/* eslint-env mocha */

import { strictEqual } from 'assert';
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
});
