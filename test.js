'use strict';
var assert = require('assert');
var srcset = require('../srcset');

describe('.parse()', function () {
	it('should parse srcset', function () {
		var fixture = '  banner-HD.jpeg 2x,   banner-HD.jpeg 2x,  banner-HD.jpeg 2x,    banner-phone.jpeg   100w,   banner-phone-HD.jpeg 100w 2x  ';
		var expected = [
			{ url: 'banner-HD.jpeg', density: 2 },
			{ url: 'banner-phone.jpeg', width: 100 },
			{ url: 'banner-phone-HD.jpeg', width: 100, density: 2 }
		];
		var actual = srcset.parse(fixture);
		assert.deepEqual(actual, expected);
	});
});

describe('.stringify()', function () {
	it('should stringify srcset', function () {
		var fixture = [
			{ url: 'banner-HD.jpeg', density: 2 },
			{ url: 'banner-HD.jpeg', density: 2 },
			{ url: 'banner-phone.jpeg', width: 100 },
			{ url: 'banner-phone-HD.jpeg', width: 100, density: 2 }
		];
		var expected = 'banner-HD.jpeg 2x, banner-phone.jpeg 100w, banner-phone-HD.jpeg 100w 2x';
		var actual = srcset.stringify(fixture);
		assert.deepEqual(actual, expected);
	});
});
