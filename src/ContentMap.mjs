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
		obj = parse(obj);
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
	if (a.suffix && b.suffix)
	{
		return a.suffix === b.suffix
			? top + sub + M_EXACT
			: M_NONE;
	}

	if (sub !== M_NONE)
	{
		return top + sub;
	}

	let suffix = M_NONE;
	if (a.suffix)
	{
		suffix = Math.min(compare(a.suffix, b.name), M_MATCH);
	}

	if (b.suffix)
	{
		suffix = Math.min(compare(b.suffix, a.name), M_MATCH);
	}

	return top + sub + suffix;
}

export default class ContentMap
{
	constructor()
	{
		this.__data = [];
	}

	add(mime, value)
	{
		if ((mime = coerce(mime)))
		{
			if (this._find(mime) === -1)
			{
				console.log('ADDED');
				this.__data.push(mime, value);
			}
		}
	}

	remove(mime)
	{
		const i = this._find(coerce(mime));
		if (i !== -1)
		{
			this.__data.splice(i, 2);
			return true;
		}

		return false;
	}

	match(mime)
	{
		if (!(mime = coerce(mime)))
		{
			return null;
		}

		let bestMatch = null;
		let bestLevel = 0;

		for (let i = 0; i < this.__data.length; i += 2)
		{
			const level = match(this.__data[i], mime);
			if (level > bestLevel)
			{
				bestMatch = this.__data[i + 1];
				bestLevel = level;

				if (level === M_FULL)
				{
					break;
				}
			}
		}

		if (bestLevel === 0)
		{
			return null;
		}

		return bestMatch;
	}

	matchAll(mime)
	{
		const list = [];

		if (!(mime = coerce(mime)))
		{
			return list;
		}

		for (let i = 0; i < this.__data.length; i += 2)
		{
			switch (match(this.__data[i], mime))
			{
				case M_NONE:
					break;

				case M_FULL:
					list.unshift(this.__data[i + 1]);
					break;

				default:
					list.push(this.__data[i + 1]);
					break;
			}
		}

		return list;
	}

	_find(mime)
	{
		if (mime)
		{
			for (let i = 0; i < this.__data.length; i += 2)
			{
				if (equals(this.__data[i], mime))
				{
					return i;
				}
			}
		}
		return -1;
	}
}
