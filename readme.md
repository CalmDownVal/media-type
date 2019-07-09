# MIME
**This module uses ES modules and private class fields features and requires Node v12.0.0+.
Please refer to [Node's documentation](https://nodejs.org/api/esm.html#esm_enabling) to read
more on how to enable this functionality in your environment.**

Media-type parser - parses out individual parts of the syntax and returns a data structure
fully describing the type. Validates top-level types, trees and suffixes, supports
multiple parameters and comments.

Does **NOT** check sub-types against the
[IANA media-type registry](https://www.iana.org/assignments/media-types/media-types.xhtml).

## Installation
```
npm i --save @calmdownval/mime
```

## Usage
```js
import { parse } from '@calmdownval/mime';

// no options needed, parses the type into a nested object structure
// returns null for invalid mime types
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
  // parameters are case-insensitive and will always be lowercase
  parameters: {
    charset: 'utf-8'
  }
}
```
