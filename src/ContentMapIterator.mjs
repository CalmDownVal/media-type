import { stringify } from './parser.mjs';

export class ContentMapIterator
{
	constructor(collection)
	{
		this.collection = collection;
		this.position = 0;
	}

	next()
	{
		const obj = {};
		if (this.position < this.collection.length)
		{
			const type = this.collection[this.position++];

			obj.done = false;
			obj.value =
			[
				stringify(type),
				this.collection[this.position++],
				type
			];
		}
		else
		{
			obj.done = true;
		}

		return obj;
	}
}
