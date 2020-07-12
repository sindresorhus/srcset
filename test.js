import test from 'ava';
import srcset from '.';

test('.parse() should parse srcset', t => {
	const fixture = '  banner-HD.jpeg 2x,   banner-HD.jpeg 2x,  banner-HD.jpeg 2x,    banner-phone.jpeg   100w, http://site.com/image.jpg?foo=bar,lorem 1x     ';

	t.deepEqual(srcset.parse(fixture), [
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-phone.jpeg', width: 100},
		{url: 'http://site.com/image.jpg?foo=bar,lorem', density: 1}
	]);
});

test('.parse() should not parse invalid srcset', t => {
	t.throws(() => {
		srcset.parse('banner-phone-HD.jpeg 100w 2x');
	});

	t.throws(() => {
		srcset.parse('banner-phone-HD.jpeg -100w');
	});

	t.throws(() => {
		srcset.parse('banner-phone-HD.jpeg -2x');
	});
});

test('.stringify() should stringify srcset', t => {
	const fixture = [
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-phone.jpeg', width: 100}
	];

	t.is(
		srcset.stringify(fixture),
		'banner-HD.jpeg 2x, banner-phone.jpeg 100w'
	);
});
