'use strict';

/**
This regex represents a loose rule of an “image candidate string”.

@see https://html.spec.whatwg.org/multipage/images.html#srcset-attribute

An “image candidate string” roughly consists of the following:
1. Zero or more whitespace characters.
2. A non-empty URL that does not start or end with `,`.
3. Zero or more whitespace characters.
4. An optional “descriptor” that starts with a whitespace character.
5. Zero or more whitespace characters.
6. Each image candidate string is separated by a `,`.

We intentionally implement a loose rule here so that we can perform more aggressive error handling and reporting in the below code.
*/
const imageCandidateRegex = /\s*([^,]\S*[^,](?:\s+[^,]+)?)\s*(?:,|$)/;

const FALLBACK_DESCRIPTOR = '';

const checkDescriptor = (strict, allDescriptors, descriptor) => {
	if (!strict) {
		return;
	}

	if (allDescriptors.has(descriptor)) {
		if (descriptor === FALLBACK_DESCRIPTOR) {
			throw new Error('Only one fallback image is allowed');
		} else {
			throw new Error(`No more than one image candidate is allowed for a given descriptor: ${descriptor}`);
		}
	}

	allDescriptors.add(descriptor);
};

exports.parse = (string, options = {strict: true}) => {
	const strict = options.strict !== false;
	const allDescriptors = strict ? new Set() : null;
	return string.split(imageCandidateRegex)
		.filter((part, index) => index % 2 === 1)
		.map(part => {
			const [url, ...elements] = part.trim().split(/\s+/);

			const result = {url};

			if (elements.length === 0) {
				checkDescriptor(strict, allDescriptors, FALLBACK_DESCRIPTOR);
			}

			const descriptors = elements.length > 0 ? elements : ['1x'];

			if (strict && descriptors.length > 1) {
				throw new Error(`Image candidate may have no more than one descriptor, found ${descriptors.length}: ${part}`);
			}

			for (const descriptor of descriptors) {
				const postfix = descriptor[descriptor.length - 1];
				const value = Number.parseFloat(descriptor.slice(0, -1));

				checkDescriptor(strict, allDescriptors, descriptor);

				if (Number.isNaN(value)) {
					if (strict) {
						throw new TypeError(`${descriptor.slice(0, -1)} is not a valid number`);
					} else {
						continue;
					}
				}

				if (postfix === 'w') {
					if (strict && value <= 0) {
						throw new Error('Width descriptor must be greater than zero');
					} else if (strict && !Number.isInteger(value)) {
						throw new TypeError('Width descriptor must be an integer');
					}

					result.width = value;
				} else if (postfix === 'h') {
					if (strict) {
						throw new Error(`Height descriptor is no longer allowed: ${descriptor}`);
					}

					result.height = value;
				} else if (postfix === 'x') {
					if (strict && value <= 0) {
						throw new Error('Pixel density descriptor must be greater than zero');
					}

					result.density = value;
				} else if (strict) {
					throw new Error(`Invalid srcset descriptor: ${descriptor}`);
				}
			}

			return result;
		});
};

exports.stringify = array => {
	return [...new Set(
		array.map(element => {
			if (!element.url) {
				throw new Error('URL is required');
			}

			const result = [element.url];

			if (element.width) {
				result.push(`${element.width}w`);
			}

			if (element.density) {
				result.push(`${element.density}x`);
			}

			return result.join(' ');
		})
	)].join(', ');
};
