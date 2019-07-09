import { stringify } from './parser.mjs';

export default class ContentMapIterator
{
	#collection;
	#position;

	constructor(collection)
	{
		this.#collection = collection;
		this.#position = 0;
	}

	next()
	{
		const obj = {};
		if (this.#position < this.#collection.length)
		{
			const ctype = this.#collection[this.#position++];

			obj.done = false;
			obj.value =
			[
				stringify(ctype),
				this.#collection[this.#position++],
				ctype
			];
		}
		else
		{
			obj.done = true;
		}

		return obj;
	}
}
