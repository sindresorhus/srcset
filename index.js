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

const duplicateDescriptorCheck = (allDescriptors, descriptor) => {
	if (allDescriptors.has(descriptor)) {
		if (descriptor === FALLBACK_DESCRIPTOR) {
			throw new Error('Only one fallback image candidate is allowed');
		} else {
			throw new Error(`No more than one image candidate is allowed for a given descriptor: ${descriptor}`);
		}
	}

	allDescriptors.add(descriptor);
};

const descriptorCountyCheck = (allDescriptors, currentDescriptors) => {
	if (currentDescriptors.length === 0) {
		duplicateDescriptorCheck(allDescriptors, FALLBACK_DESCRIPTOR);
	} else if (currentDescriptors.length > 1) {
		throw new Error(`Image candidate may have no more than one descriptor, found ${currentDescriptors.length}: ${currentDescriptors.join(' ')}`);
	}
};

const validDescriptorCheck = (value, postfix, descriptor) => {
	if (Number.isNaN(value)) {
		throw new TypeError(`${descriptor || value} is not a valid number`);
	}

	if (postfix === 'w') {
		if (value <= 0) {
			throw new Error('Width descriptor must be greater than zero');
		} else if (!Number.isInteger(value)) {
			throw new TypeError('Width descriptor must be an integer');
		}
	} else if (postfix === 'x') {
		if (value <= 0) {
			throw new Error('Pixel density descriptor must be greater than zero');
		}
	} else if (postfix === 'h') {
		throw new Error('Height descriptor is no longer allowed');
	} else {
		throw new Error(`Invalid srcset descriptor: ${descriptor}`);
	}
};

exports.parse = (string, {strict = true} = {}) => {
	const strict = options.strict !== false;
	const allDescriptors = strict ? new Set() : null;
	return string.split(imageCandidateRegex)
		.filter((part, index) => index % 2 === 1)
		.map(part => {
			const [url, ...elements] = part.trim().split(/\s+/);

			const result = {url};

			const descriptors = elements.length > 0 ? elements : ['1x'];

			if (strict) {
				descriptorCountyCheck(allDescriptors, elements);
			}

			for (const descriptor of descriptors) {
				const postfix = descriptor[descriptor.length - 1];
				const value = Number.parseFloat(descriptor.slice(0, -1));

				if (strict) {
					validDescriptorCheck(value, postfix, descriptor);
					duplicateDescriptorCheck(allDescriptors, descriptor);
				}

				if (postfix === 'w') {
					result.width = value;
				} else if (postfix === 'h') {
					result.height = value;
				} else if (postfix === 'x') {
					result.density = value;
				}
			}

			return result;
		});
};

const knownDescriptors = new Set(['width', 'height', 'density']);

exports.stringify = (array, options = {strict: true}) => {
	const strict = options.strict !== false;
	const allDescriptors = strict ? new Set() : null;
	return array.map(element => {
		if (!element.url) {
			if (strict) {
				throw new Error('URL is required');
			}

			return '';
		}

		const descriptorKeys = Object.keys(element).filter(key => knownDescriptors.has(key));

		if (strict) {
			descriptorCountyCheck(allDescriptors, descriptorKeys);
		}

		const result = [element.url];

		descriptorKeys.forEach(descriptorKey => {
			const value = element[descriptorKey];
			let postfix;
			if (descriptorKey === 'width') {
				postfix = 'w';
			} else if (descriptorKey === 'height') {
				postfix = 'h';
			} else if (descriptorKey === 'density') {
				postfix = 'x';
			}

			const descriptor = `${value}${postfix}`;

			if (strict) {
				validDescriptorCheck(value, postfix);
				duplicateDescriptorCheck(allDescriptors, descriptor);
			}

			result.push(descriptor);
		});

		return result.join(' ');
	}).join(', ');
};
