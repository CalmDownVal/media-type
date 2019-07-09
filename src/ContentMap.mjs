import ContentMapIterator from './ContentMapIterator.mjs';
import { parse } from './parser.mjs';

const M_NONE = 0;
const M_MATCH = 1;
const M_EXACT = 2;
const M_FULL = 3 * M_EXACT;

function coerce(obj)
{
	let type = typeof obj;
	if (type === 'string')
	{
		obj = parse(obj, true);
		type = 'object';
	}

	if (!obj || type !== 'object')
	{
		return null;
	}

	const { subType : sub } = obj;
	if (!sub.nameWithoutSuffix)
	{
		sub.nameWithoutSuffix = sub.suffix
			? sub.name.slice(0, -(sub.suffix.length + 1))
			: sub.name;
	}

	return obj;
}

function equals(a, b)
{
	return a.type.name === b.type.name && a.subType.name === b.subType.name;
}

function compare(a, b)
{
	return a === b ? M_EXACT : (a === '*' || b === '*' ? M_MATCH : M_NONE);
}

function match(a, b)
{
	const top = compare(a.type.name, b.type.name);
	if (top === M_NONE)
	{
		return 0;
	}

	a = a.subType;
	b = b.subType;

	const sub = compare(a.nameWithoutSuffix, b.nameWithoutSuffix);
	if (a.suffix === b.suffix)
	{
		return a.suffix || sub !== M_NONE
			? top + sub + M_EXACT
			: M_NONE;
	}
	else if (a.suffix && b.suffix)
	{
		return M_NONE;
	}

	let suffix;
	if (a.suffix)
	{
		suffix = Math.min(compare(a.suffix, b.name), M_MATCH);
	}
	else
	{
		suffix = Math.min(compare(b.suffix, a.name), M_MATCH);
	}

	return suffix === M_NONE
		? M_NONE
		: top + sub + suffix;
}

export default class ContentMap
{
	#data;
	#indexOf = mime =>
	{
		for (let i = 0; i < this.#data.length; i += 2)
		{
			if (equals(this.#data[i], mime))
			{
				return i;
			}
		}
		return -1;
	};

	constructor()
	{
		this.#data = [];
	}

	get size()
	{
		return this.#data.length >>> 1;
	}

	[Symbol.iterator]()
	{
		return new ContentMapIterator(this.#data);
	}

	get(mime)
	{
		let bestMatch;
		if ((mime = coerce(mime)))
		{
			let bestLevel = 0;
			for (let i = 0; i < this.#data.length; i += 2)
			{
				const level = match(this.#data[i], mime);
				if (level > bestLevel)
				{
					bestMatch = this.#data[i + 1];
					bestLevel = level;

					if (level === M_FULL)
					{
						break;
					}
				}
			}
		}
		return bestMatch;
	}

	getAll(mime)
	{
		const list = [];
		if ((mime = coerce(mime)))
		{
			for (let i = 0; i < this.#data.length; i += 2)
			{
				switch (match(this.#data[i], mime))
				{
					case M_NONE:
						break;

					case M_FULL:
						list.unshift(this.#data[i + 1]);
						break;

					default:
						list.push(this.#data[i + 1]);
						break;
				}
			}
		}
		return list;
	}

	has(mime)
	{
		if ((mime = coerce(mime)))
		{
			for (let i = 0; i < this.#data.length; i += 2)
			{
				if (match(this.#data[i], mime))
				{
					return true;
				}
			}
		}
		return false;
	}

	set(mime, value)
	{
		if ((mime = coerce(mime)))
		{
			if (this.#indexOf(mime) === -1)
			{
				this.#data.push(mime, value);
			}
		}
	}

	delete(mime)
	{
		if ((mime = coerce(mime)))
		{
			const i = this.indexOf(mime);
			if (i !== -1)
			{
				this.#data.splice(i, 2);
				return true;
			}
		}
		return false;
	}
}
