import {expectType, expectError} from 'tsd';
import {parseSrcset, stringifySrcset, SrcSetDefinition} from './index.js';

const parsed = parseSrcset('banner-HD.jpg 2x, banner-phone.jpg 100w');
expectType<SrcSetDefinition[]>(parsed);

parsed.push({url: 'banner-phone-HD.jpg'}, {url: 'banner-phone-HD.jpg', width: 100}, {url: 'banner-phone-HD.jpg', density: 2});
expectError(parsed.push({}));

expectType<string>(stringifySrcset(parsed));
