import test from 'ava';
import srcset from '.';

test('.parse() should parse srcset', t => {
	const fixture = '  banner-HD.jpeg 2x,   banner-HD.jpeg 2x,  banner-HD.jpeg 2x,    banner-phone.jpeg   100w, http://site.com/image.jpg?foo=bar,lorem 3x ,banner.jpeg    ';

	t.deepEqual(srcset.parse(fixture), [
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-phone.jpeg', width: 100},
		{url: 'http://site.com/image.jpg?foo=bar,lorem', density: 3},
		{url: 'banner.jpeg', density: 1}
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

	t.throws(() => {
		srcset.parse('banner-phone-HD.jpeg 100.5w');
	});

	t.throws(() => {
		srcset.parse('banner-phone-HD.jpeg xxx');
	});
});

test('.parse() should parse srcset separated without white spaces', t => {
	const fixture = 'banner-HD.jpeg 2x,banner-HD.jpeg 2x,banner-HD.jpeg 2x,banner-phone.jpeg 100w,http://site.com/image.jpg?foo=100w,lorem 1x';

	t.deepEqual(srcset.parse(fixture), [
		{url: 'banner-HD.jpeg', density: 2},
		{url: 'banner-phone.jpeg', width: 100},
		{url: 'http://site.com/image.jpg?foo=100w,lorem', density: 1}
	]);
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
