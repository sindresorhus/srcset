import test from 'ava';
import srcset from '.';

test('.parse() should parse srcset', t => {
	const fixture = '  banner-HD.jpeg 2x,   banner-HD.jpeg 2x,  banner-HD.jpeg 2x,    banner-phone.jpeg   100w';

	t.deepEqual(srcset.parse(fixture), [
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-phone.jpeg', width: 100}
	]);
});

test('.parse() URLs contain commas', t => {
	const fixture = '  banner-,HD.jpeg 2x,   banner-,HD.jpeg 2x,  banner-,HD.jpeg 2x,    banner-ph,one.jpeg   100w';

	t.deepEqual(srcset.parse(fixture), [
		{url: 'banner-,HD.jpeg', density: 2},
		{url: 'banner-ph,one.jpeg', width: 100}
	]);
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

test('Not allowed w and x on the same candidate', t => {
	const fixture = [
		{url: 'banner-phone-HD.jpeg', width: 100, density: 2}
	];

	t.throws(() => {
		srcset.stringify(fixture);
	});
});
