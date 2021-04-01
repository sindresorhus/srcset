'use strict';

const srcsetRegex = /\s*([^,]\S*[^,](?:\s+[^,]+)?)\s*(?:,|$)/;

function deepUnique(array) {
	return array.sort().filter((element, index) => {
		return JSON.stringify(element) !== JSON.stringify(array[index - 1]);
	});
}

exports.parse = string => {
	return deepUnique(
		string.split(srcsetRegex)
			.filter((part, index) => index % 2 === 1)
			.map(part => {
				const [url, ...descriptors] = part.trim().split(/\s+/);

				const result = {url};

				(descriptors.length > 0 ? descriptors : ['1x']).forEach(descriptor => {
					const postfix = descriptor[descriptor.length - 1];
					const value = Number.parseFloat(descriptor.slice(0, -1));

					if (Number.isNaN(value)) {
						throw new TypeError(`${descriptor.slice(0, -1)} is not a valid number`);
					}

					if (postfix === 'w') {
						if (value <= 0) {
							throw new Error('Width descriptor must be greater than zero');
						} else if (!Number.isInteger(value)) {
							throw new TypeError('Width descriptor must be an integer');
						}

						result.width = value;
					} else if (postfix === 'x') {
						if (value <= 0) {
							throw new Error('Pixel density descriptor must be greater than zero');
						}

						result.density = value;
					} else {
						throw new Error(`Invalid srcset descriptor: ${descriptor}`);
					}

					if (result.width && result.density) {
						throw new Error('Image candidate string cannot have both width descriptor and pixel density descriptor');
					}
				});

				return result;
			})
	);
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
