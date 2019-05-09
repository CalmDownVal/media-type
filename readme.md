# MIME
**This module uses the ES modules feature and requires Node v8.15.0+.
Please refer to [Node's documentation](https://nodejs.org/api/esm.html#esm_enabling) to read
more on how to enable this functionality in your environment.**

## Installation
```
npm i --save @calmdownval/mime
```

## Usage
```js
import parse from '@calmdownval/mime';

console.log( parse('application/vnd.api+json; charset=utf-8') );
```
outputs:
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
  // since parameters are case-insensitive
  // they will always be lowercase
  parameters: {
    charset: 'utf-8'
  }
}
```
