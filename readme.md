# MIME
**This module uses the ES modules feature and requires Node v8.15.0+.
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
import parseMIME from '@calmdownval/mime';

// the library directly exports the parse function
parseMIME('application/vnd.api+json; charset=utf-8');
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
