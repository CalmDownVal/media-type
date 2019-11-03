const RE_MEDIA = /^([a-z]{4,11}|([xX])-[a-zA-Z0-9!#$&^_-]{0,62}|\*)\/((?:(vnd|prs)\.[a-zA-Z0-9!#$&^_.-]{0,60}|[a-zA-Z0-9][a-zA-Z0-9!#$&^_.-]{0,63}|\*)(?:\+([a-z]{3,11}|\*))?)([\s;(]|$)/;
const RE_PARAM = /\s*((?:(?![()[\]<>\\/@,;"?=\s])[!-~])+)=(?:"([^"]+)"|((?:(?![()[\]<>\\/@,;"?=\s])[!-~])+))([\s;(]|$)/g;
const RE_QUOTE = /[()[\]<>\\/@,;"?=\s]/;

const topTypes =
{
	// discrete-type
	text : true,
	image : true,
	audio : true,
	video : true,
	application : true,
	font : true,
	model : true,
	example : true,

	// composite-type
	message : true,
	multipart : true
};

const trees =
{
	vnd : true,
	prs : true
};

const suffixes =
{
	xml : true,
	json : true,
	ber : true,
	der : true,
	fastinfoset : true,
	wbxml : true,
	zip : true,
	gzip : true,
	cbor : true
};

export function parse(str, allowWildcards = false)
{
	const match = RE_MEDIA.exec(str);
	if (!match)
	{
		return null;
	}

	const type =
	{
		name : match[1],
		isExtension : !!match[2]
	};

	if (!type.isExtension && !topTypes[type.name] && !(type.name === '*' && allowWildcards))
	{
		return null;
	}

	const subType =
	{
		name : match[3],
		tree : match[4] || null,
		suffix : match[5] || null
	};

	if ((subType.tree && !trees[subType.tree]) ||
		(subType.suffix && !suffixes[subType.suffix] && !(subType.suffix === '*' && allowWildcards)))
	{
		return null;
	}

	const parameters = {};
	RE_PARAM.lastIndex = match[0].length;

	let term = match[6];
	while (term === ';')
	{
		const param = RE_PARAM.exec(str);
		if (!param)
		{
			break;
		}

		parameters[param[1].toLowerCase()] = param[2] || param[3];
		term = param[4];
	}

	// finalize the object
	return {
		type,
		subType,
		parameters
	};
}

function quote(str)
{
	return RE_QUOTE.test(str) ? `"${str}"` : str;
}

export function stringify(media)
{
	switch (typeof media)
	{
		case 'string':
			return media;

		case 'object':
			if (media && media.type && media.subType)
			{
				let str = `${media.type.name}/${media.subType.name}`;
				for (const key in media.parameters)
				{
					str += `; ${key}=${quote(media.parameters[key])}`;
				}
				return str;
			}
			// fall through

		default:
			throw new Error('invalid media type object');
	}
}
