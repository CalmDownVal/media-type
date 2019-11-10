# Media Type parser

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/fde997ed76e44d4ba0ec46ae9071810c)](https://www.codacy.com/manual/vaclavlahuta/media-type?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=vaclavlahuta/media-type&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/fde997ed76e44d4ba0ec46ae9071810c)](https://www.codacy.com/manual/vaclavlahuta/media-type?utm_source=github.com&utm_medium=referral&utm_content=vaclavlahuta/media-type&utm_campaign=Badge_Coverage)

**This module uses ESM import/export and requires Node v8.15.0+ with the `--experimental-modules`
flag. Please see [Node's documentation](https://nodejs.org/api/esm.html#esm_enabling)
for details.**

Parses out individual parts of the media type syntax and returns a data structure fully describing
the type. Validates top-level types, trees and suffixes, supports multiple parameters and comments.

See [RFC 2046](https://tools.ietf.org/html/rfc2046) for details of the syntax and its rules.
This library *does not* yet support any extensions such as
[RFC 2231](https://tools.ietf.org/html/rfc2231) and it *does not* check sub-types against the
[IANA media-type registry](https://www.iana.org/assignments/media-types/media-types.xhtml) either.

## Installation

```sh
npm i --save @calmdownval/media-type
```

## Usage

```js
import { parse } from '@calmdownval/media-type';

// no options needed, parses the type into a nested object structure
// returns null for invalid media types
parse('application/vnd.api+json; charset=utf-8');
```

parse output:

```js
{
  type: {
    name: 'application',
    isExtension: false
  },
  subType: {
    name: 'vnd.api+json',
    tree: 'vnd',
    suffix: 'json'
  },
  // parameters are case-insensitive, output is always lowercased
  parameters: {
    charset: 'utf-8'
  }
}
```
