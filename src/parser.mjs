const RE_MIME = /^([a-z]{4,11}|([xX])-[a-zA-Z0-9!#$&^_-]{0,62}|\*)\/((?:(vnd|prs)\.[a-zA-Z0-9!#$&^_.-]{0,60}|[a-zA-Z0-9][a-zA-Z0-9!#$&^_.-]{0,63}|\*)(?:\+([a-z]{3,11}|\*))?)([\s;(]|$)/;
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
	const mime = RE_MIME.exec(str);
	if (!mime)
	{
		return null;
	}

	const type =
	{
		name : mime[1],
		isExtension : !!mime[2]
	};

	if (!type.isExtension && !topTypes[type.name] && !(type.name === '*' && allowWildcards))
	{
		return null;
	}

	const subType =
	{
		name : mime[3],
		tree : mime[4] || null,
		suffix : mime[5] || null
	};

	if ((subType.tree && !trees[subType.tree]) ||
		(subType.suffix && !suffixes[subType.suffix] && !(subType.suffix === '*' && allowWildcards)))
	{
		return null;
	}

	const parameters = {};
	RE_PARAM.lastIndex = mime[0].length;

	let term = mime[6];
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

export function stringify(mime)
{
	switch (typeof mime)
	{
		case 'string':
			return mime;

		case 'object':
			if (mime && mime.type && mime.subType)
			{
				let str = `${mime.type.name}/${mime.subType.name}`;
				for (const key in mime.parameters)
				{
					str += `; ${key}=${quote(mime.parameters[key])}`;
				}
				return str;
			}
			// fall through

		default:
			throw new Error('Invalid MIME-Type object.');
	}
}
