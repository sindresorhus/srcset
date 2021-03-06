import test from 'ava';
import srcset from './index.js';

test('.parse() should parse srcset', t => {
	const fixture = ' banner-HD.jpeg 2x,    banner-phone.jpeg   100w, http://site.com/image.jpg?foo=bar,lorem 3x ,banner.jpeg    ';

	t.deepEqual(srcset.parse(fixture), [
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-phone.jpeg', width: 100},
		{url: 'http://site.com/image.jpg?foo=bar,lorem', density: 3},
		{url: 'banner.jpeg'}
	]);
});

test('.parse() should parse URLs with commas', t => {
	const fixture = 'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_180,q_80,w_320/rbx48jwtuvpwum29aarr.jpg 320w, https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_264,q_80,w_470/rbx48jwtuvpwum29aarr.jpg 470w, https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_80,q_80,w_80/rbx48jwtuvpwum29aarr.jpg 80w';

	t.deepEqual(srcset.parse(fixture), [
		{
			url: 'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_180,q_80,w_320/rbx48jwtuvpwum29aarr.jpg',
			width: 320
		},
		{
			url: 'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_264,q_80,w_470/rbx48jwtuvpwum29aarr.jpg',
			width: 470
		},
		{
			url: 'https://i.kinja-img.com/gawker-media/image/upload/c_fill,f_auto,fl_progressive,g_center,h_80,q_80,w_80/rbx48jwtuvpwum29aarr.jpg',
			width: 80
		}
	]);
});

test('.parse() should parse srcset separated without whitespaces', t => {
	const fixture = 'banner-HD.jpeg 2x,banner-phone.jpeg 100w,http://site.com/image.jpg?foo=100w,lorem 1x';

	t.deepEqual(srcset.parse(fixture), [
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-phone.jpeg', width: 100},
		{url: 'http://site.com/image.jpg?foo=100w,lorem', density: 1}
	]);
});

test('.stringify() should stringify srcset', t => {
	const fixture = [
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-phone.jpeg', width: 100}
	];

	t.is(
		srcset.stringify(fixture),
		'banner-HD.jpeg 2x, banner-phone.jpeg 100w'
	);
});

const invalidStrings = [
	'banner.jpeg, fallback.jpeg', // Multiple fallback images
	'banner-phone-HD.jpg 100w 2x', // Multiple descriptors
	'banner-HD.jpeg 2x, banner.jpeg 2x', // Multiple images with the same descriptor
	'banner-phone.jpeg 100h', // Height descriptor
	'banner-phone.jpeg 100.1w', // Non-integer width
	'banner-phone.jpeg -100w', // Negative width
	'banner-hd.jpeg -2x', // Negative density
	'banner.jpeg 3q', // Invalid descriptor
	'banner.jpeg xxx', // Nonsense descriptor
	'banner.jpg 1x, fallback.jpg', // Duplicate descriptor because the fallback is equivalent to 1x
	'banner.jpg 2x, other.jpg 2.0x' // Duplicate descriptors after normalizing
];

for (const invalidSrcset of invalidStrings) {
	test(`.parse() should throw on invalid input when strict mode is enabled: "${invalidSrcset}"`, t => {
		t.throws(() => {
			srcset.parse(invalidSrcset, {strict: true});
		});
	});
}

for (const invalidSrcset of invalidStrings) {
	test(`.parse() should not throw on invalid input when strict mode is disabled: "${invalidSrcset}"`, t => {
		srcset.parse(invalidSrcset, {strict: false});
		t.pass();
	});
}

const invalidArrays = [
	[{url: 'banner.jpeg'}, {url: 'fallback.jpeg'}], // Multiple fallback images
	[{url: 'banner-phone-HD.jpg', width: 100, density: 2}], // Multiple descriptors
	[{url: 'banner-HD.jpeg', density: 2}, {url: 'banner.jpeg', density: 2}], // Multiple images with the same descriptor
	[{url: 'banner-phone.jpeg', height: 100}], // Height descriptor
	[{url: 'banner-phone.jpeg', width: 100.1}], // Non-integer width
	[{url: 'banner-phone.jpeg', width: -100}], // Negative width
	[{url: 'banner-hd.jpeg', density: -2}], // Negative density
	[{url: 'banner.jpeg', width: Number.NaN}], // Invalid descriptor
	[{url: 'banner.jpeg', width: 'xxx'}], // Nonsense descriptor
	[{url: 'banner.jpg', density: 1}, {url: 'fallback.jpg'}], // Duplicate descriptor because the fallback is equivalent to 1x
	[{url: 'banner-hd.jpg', density: 2}, {url: 'other-hd.jpg', density: 2}] // Duplicate descriptors after normalizing
];

for (const invalidSrcset of invalidArrays) {
	test(`.stringify() should throw on invalid input when strict mode is enabled: ${JSON.stringify(invalidSrcset)}`, t => {
		t.throws(() => {
			srcset.stringify(invalidSrcset, {strict: true});
		});
	});
}

for (const invalidSrcset of invalidArrays) {
	test(`.stringify() should not throw on invalid input when strict mode is disabled: ${JSON.stringify(invalidSrcset)}`, t => {
		t.notThrows(() => {
			srcset.stringify(invalidSrcset, {strict: false});
		});
	});
}
