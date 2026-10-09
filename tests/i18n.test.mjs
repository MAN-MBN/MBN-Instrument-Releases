import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {messages,translate,resolveLanguage} from '../docs/i18n.mjs';
import {selectDownloads,compareVersions,downloadVersion} from '../docs/app.mjs';

assert.deepEqual(Object.keys(messages.en).sort(),Object.keys(messages['zh-CN']).sort());
for(const key of Object.keys(messages.en)){
  assert.ok(translate('en',key),key);
  assert.ok(translate('zh-CN',key),key);
  assert.ok(!/[\u4e00-\u9fff]/.test(translate('en',key)),key);
}
const html=readFileSync(new URL('../docs/index.html',import.meta.url),'utf8');
for(const [,key] of html.matchAll(/data-i18n="([^"]+)"/g))assert.ok(messages.en[key],key);
assert.equal(resolveLanguage(null,['zh-TW']),'zh-CN');
assert.equal(resolveLanguage(null,['en-GB']),'en');
assert.equal(resolveLanguage(null,['fr-FR']),'en');
assert.equal(resolveLanguage('en',['zh-CN']),'en');
assert.equal(resolveLanguage('zh-CN',['en-GB']),'zh-CN');
assert.equal(resolveLanguage('invalid',['zh-CN']),'zh-CN');
const data=JSON.parse(readFileSync(new URL('../docs/releases.json',import.meta.url),'utf8').replace(/^\uFEFF/,''));
const downloads=selectDownloads(data.releases);
assert.ok(downloads.some(d=>d.key==='h7hex'));
assert.ok(downloads.some(d=>d.key==='h7usb'));
assert.ok(downloads.some(d=>d.key==='hex'));
assert.ok(downloads.some(d=>d.key==='usb'));
for(const d of downloads.filter(d=>d.key.startsWith('h7')))assert.ok(d.asset.name.startsWith('MBN-H7-'));
for(const d of downloads){
  assert.ok(messages.en[d.key+'.button']);
  assert.ok(messages.en[d.key+'.description']);
  assert.ok(d.asset.browser_download_url.includes('/releases/download/'));
}
assert.ok(compareVersions('v2.1.0-rc.15','v2.1.0-rc.5')>0);
console.log('Passed: translation completeness, English text, static keys, language preference, release selection.');

assert.equal(downloadVersion({group:"firmware",asset:{name:"MBN-H7-2.4.7.mbnfw"},release:{tag_name:"v2.1.0-rc.48"}}),"v2.4.7");
assert.equal(downloadVersion({group:"software",asset:{name:"MBN-Instrument-Setup.exe"},release:{tag_name:"v2.1.0-rc.48"}}),"v2.1.0-rc.48");
