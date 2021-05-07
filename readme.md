# srcset

> Parse and stringify the HTML `<img>` [srcset](https://www.smashingmagazine.com/2013/08/webkit-implements-srcset-and-why-its-a-good-thing/) attribute.

Can be useful if you're creating a build-tool.

## Install

```
$ npm install srcset
```

## Usage

How an image with `srcset` might look like:

```html
<img
	alt="The Breakfast Combo"
	src="banner.jpg"
	srcset="banner-HD.jpg 2x, banner-phone.jpg 100w"
>
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
	url: 'banner-super-HD.jpg',
	density: 3
});

const stringified = srcset.stringify(parsed);
console.log(stringified);
/*
banner-HD.jpg 2x, banner-phone.jpg 100w, banner-super-HD.jpg 3x
*/
```

## API

### .parse(string, options?)

Accepts a srcset string and returns an array of objects with the possible properties: `url` (always), `width`, `density`.

If options is set to `{strict: false}`, it will attempt to parse invalid input. Otherwise errors are thrown on invalid input.

### .stringify(array, options?)

Accepts an array of objects with the possible properties: `url` (required), and one of `width` or `density` and returns a srcset string.

By default it will validate the objects and throw an error if they would produce an invalid srcset string.

If options is set to `{strict: false}`, it will skip validation.

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
