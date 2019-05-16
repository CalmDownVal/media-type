import parse from './parse.mjs';

function coerce(ctype, allowWildcard)
{
	return ctype.__MIME__ ? ctype : new MIME(ctype, allowWildcard);
}

export default class ContentMap
{
	constructor()
	{
		this.__data = [];
	}

	add(ctype, value)
	{
		if (this._indexOf(ctype) === -1)
		{
			this.__data.push(
				coerce(ctype, true),
				value);
		}
	}

	remove(ctype)
	{
		const i = this._indexOf(ctype);
		if (i !== -1)
		{
			this.__data.splice(i, 2);
			return true;
		}

		return false;
	}

	get(ctype)
	{
		const mime = coerce(ctype, false);

		let bestMatch = null;
		let bestLevel = 0;

		for (let i = 0; i < this.__data.length; i += 2)
		{
			const level = this.__data[i].match(mime);
			if (level > bestLevel)
			{
				bestMatch = this.__data[i + 1];
				bestLevel = level;

				if (level === MIME.Match.FULL)
				{
					break;
				}
			}
		}

		if (bestLevel === 0)
		{
			throw new Error(`no matching content found for type '${ctype}'`);
		}

		return bestMatch;
	}

	_indexOf(ctype)
	{
		for (let i = 0; i < this.__data.length; i += 2)
		{
			if (this.__data[i].toString() === ctype)
			{
				return i;
			}
		}

		return -1;
	}
}
