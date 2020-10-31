import {expectType, expectError} from 'tsd';
import srcset = require('.');

const parsed = srcset.parse('banner-HD.jpg 2x, banner-phone.jpg 100w');
expectType<srcset.SrcSetDefinition[]>(parsed);

parsed.push({url: 'banner-phone-HD.jpg'});
parsed.push({url: 'banner-phone-HD.jpg', width: 100});
parsed.push({url: 'banner-phone-HD.jpg', density: 2});
expectError(parsed.push({}));

expectType<string>(srcset.stringify(parsed));

expectError(srcset.stringify(parsed, true));
expectError(srcset.stringify(parsed, {minify: 1}));
