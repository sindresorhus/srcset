import {expectType, expectError} from 'tsd';
import srcset = require('./index.js');

const parsed = srcset.parse('banner-HD.jpg 2x, banner-phone.jpg 100w');
expectType<srcset.SrcSetDefinition[]>(parsed);

parsed.push({url: 'banner-phone-HD.jpg'}, {url: 'banner-phone-HD.jpg', width: 100}, {url: 'banner-phone-HD.jpg', density: 2});
expectError(parsed.push({}));

expectType<string>(srcset.stringify(parsed));
