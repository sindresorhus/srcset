import test from 'ava';
import srcset from '.';

test('.parse() should parse srcset', t => {
	const fixture = '  banner-HD.jpeg 2x,   banner-HD.jpeg 2x,  banner-HD.jpeg 2x,    banner-phone.jpeg   100w     ';

	t.deepEqual(srcset.parse(fixture), [
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-phone.jpeg', width: 100}
	]);
});

test('.parse() should not parse srcset', t => {
	const fixture = 'banner-phone-HD.jpeg 100w 2x';

	t.throws(() => srcset.parse(fixture));
});

test('.stringify() should stringify srcset', t => {
	const fixture = [
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-phone.jpeg', width: 100}
	];

	t.deepEqual(
		srcset.stringify(fixture),
		'banner-HD.jpeg 2x, banner-phone.jpeg 100w'
	);
});
