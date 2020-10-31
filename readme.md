# srcset [![Build Status](https://travis-ci.com/sindresorhus/srcset.svg?branch=master)](https://travis-ci.com/github/sindresorhus/srcset)

> Parse and stringify the HTML `<img>` [srcset](https://www.smashingmagazine.com/2013/08/webkit-implements-srcset-and-why-its-a-good-thing/) attribute.

Can be useful if you're creating a build-tool.

## Install

```
$ npm install srcset
```

## Usage

How an image with `srcset` might look like:

```html
<img alt="The Breakfast Combo"
     src="banner.jpg"
     srcset="banner-HD.jpg 2x, banner-phone.jpg 100w, banner-phone-HD.jpg 100w 2x">
```

Then have some fun with it:

```js
const srcset = require('srcset');

const parsed = srcset.parse('banner-HD.jpg 2x, banner-phone.jpg 100w');
console.log(parsed);
/*
[
	{
		url: 'banner-HD.jpg',
		density: 2
	},
	{
		url: 'banner-phone.jpg',
		width: 100
	}
]
*/

parsed.push({
	url: 'banner-phone-HD.jpg',
	width: 100,
	density: 2
});

const stringified = srcset.stringify(parsed);
console.log(stringified);
/*
banner-HD.jpg 2x, banner-phone.jpg 100w, banner-phone-HD.jpg 100w 2x
*/

const stringifiedAndMinified = srcset.stringify(parsed, {minify: true});
console.log(stringifiedAndMinified);
/*
banner-HD.jpg 2x,banner-phone.jpg 100w,banner-phone-HD.jpg 100w 2x
*/
```

## API

### .parse(srcset)

- `srcset`: `<string>` Accepts a srcset string
- Returns: `<srcset.SrcSetDefinition>` An array of objects with the possible properties: `url` (always), `width`, `density`.

### .stringify(srcSetDefinition[, stringifyOption])

- `srcSetDefinition`: `<srcset.SrcSetDefinition>` Accepts an array of objects with the possible properties: `url` (required), `width`, `density`.
- `stringifyOption`: `<srcset.StringifyOption>`
  - `minify`: `<boolean>`: Whether to strip redundant white spaces. Default `false`.
- Returns: `<string>`: A srcset string

---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-srcset?utm_source=npm-srcset&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
