import { ContentMapIterator } from './ContentMapIterator.mjs';
import { parse } from './parser.mjs';

const M_NONE = 0;
const M_MATCH = 1;
const M_EXACT = 2;
const M_FULL = 6;

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
		return M_NONE;
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

	const suffix = Math.min(
		a.suffix
			? compare(a.suffix, b.name)
			: compare(b.suffix, a.name),
		M_MATCH
	);

	return suffix === M_NONE
		? M_NONE
		: top + sub + suffix;
}

export class ContentMap
{
	constructor()
	{
		this.data = [];
	}

	get size()
	{
		return this.data.length >>> 1;
	}

	[Symbol.iterator]()
	{
		return new ContentMapIterator(this.data);
	}

	get(type)
	{
		let bestMatch;
		if ((type = coerce(type)))
		{
			let bestLevel = 0;
			for (let i = 0; i < this.data.length; i += 2)
			{
				const level = match(this.data[i], type);
				if (level > bestLevel)
				{
					bestMatch = this.data[i + 1];
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

	getAll(type)
	{
		const list = [];
		if ((type = coerce(type)))
		{
			for (let i = 0; i < this.data.length; i += 2)
			{
				switch (match(this.data[i], type))
				{
					case M_NONE:
						break;

					case M_FULL:
						list.unshift(this.data[i + 1]);
						break;

					default:
						list.push(this.data[i + 1]);
						break;
				}
			}
		}
		return list;
	}

	has(type)
	{
		if ((type = coerce(type)))
		{
			for (let i = 0; i < this.data.length; i += 2)
			{
				if (match(this.data[i], type))
				{
					return true;
				}
			}
		}
		return false;
	}

	set(type, value)
	{
		if ((type = coerce(type)))
		{
			if (this.indexOf(type) === -1)
			{
				this.data.push(type, value);
			}
		}
	}

	delete(type)
	{
		if ((type = coerce(type)))
		{
			const i = this.indexOf(type);
			if (i !== -1)
			{
				this.data.splice(i, 2);
				return true;
			}
		}
		return false;
	}

	indexOf(type)
	{
		for (let i = 0; i < this.data.length; i += 2)
		{
			if (equals(this.data[i], type))
			{
				return i;
			}
		}
		return -1;
	}
}
