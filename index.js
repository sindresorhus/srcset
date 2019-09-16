'use strict';
const arrayUniq = require('array-uniq');

const integerRegex = /^\d+$/;
const splitRegex = /.*?\s+\d+[xwh]\s*(?:,|$)\s*/ig;

function deepUnique(array) {
	return array.sort().filter((element, index) => {
		return JSON.stringify(element) !== JSON.stringify(array[index - 1]);
	});
}

exports.parse = string => {
	return deepUnique(
		string.match(splitRegex).map(part => {
			const result = {};
			let singleMatched = false;
			part
				.trim()
				.replace(/\s*,\s*$/, '')
				.split(/\s+/)
				.forEach((element, index) => {
					if (index === 0) {
						result.url = element;
						return;
					}

					const value = element.slice(0, element.length - 1);
					const postfix = element[element.length - 1];
					const integerValue = parseInt(value, 10);
					const floatValue = parseFloat(value);

					if (postfix === 'w' && integerRegex.test(value)) {
						if (singleMatched) {
							throw new Error(`Not allowed w and x on the same candidate: ${element}`);
						}

						singleMatched = true;
						result.width = integerValue;
					} else if (postfix === 'x' && !Number.isNaN(floatValue)) {
						if (singleMatched) {
							throw new Error(`Not allowed w and x on the same candidate: ${element}`);
						}

						singleMatched = true;
						result.density = floatValue;
					} else {
						throw new Error(`Invalid srcset descriptor: ${element}`);
					}
				});

			return result;
		})
	);
};

exports.stringify = array => {
	return arrayUniq(
		array.map(element => {
			if (!element.url) {
				throw new Error('URL is required');
			}

			if (element.width && element.density) {
				throw new Error('Not allowed w and x on the same candidate');
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
	).join(', ');
};
