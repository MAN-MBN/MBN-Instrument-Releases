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

// Firmware is ranked by the version in its file name, not by the release tag:
// H7 2.4.10 shipped in v2.1.1-rc.2, below the firmware-only tag v2.4.8.
{
  const asset=(tag,name)=>({name,browser_download_url:`https://github.com/MAN-MBN/MBN-Instrument-Releases/releases/download/${tag}/${name}`});
  const release=(tag,names)=>({tag_name:tag,draft:false,assets:names.flatMap(n=>[asset(tag,n),asset(tag,n+'.sha256')])});
  const picked=selectDownloads([
    release('v2.4.8',['MBN-F4-2.4.8.mbnfw','MBN-H7-2.4.8.mbnfw']),
    release('v2.1.1-rc.2',['MBN-Instrument-Setup.exe','MBN-H7-2.4.10.mbnfw']),
    release('v2.1.1-rc.1',['MBN-Instrument-Setup.exe'])]);
  const by=key=>picked.find(d=>d.key===key);
  assert.equal(by('h7usb').asset.name,'MBN-H7-2.4.10.mbnfw');
  assert.equal(by('usb').asset.name,'MBN-F4-2.4.8.mbnfw');
  assert.equal(by('windows').release.tag_name,'v2.1.1-rc.2');
  const live=selectDownloads(data.releases);
  assert.equal(live.find(d=>d.key==='h7usb').asset.name,'MBN-H7-2.4.12.mbnfw');
  assert.equal(live.find(d=>d.key==='h7hex').asset.name,'MBN-H7-2.4.12.factory.hex');
  assert.equal(live.find(d=>d.key==='windows').release.tag_name,'v2.1.1-rc.8');
  assert.equal(live.find(d=>d.key==='arm64').release.tag_name,'v2.1.1-rc.6');
  console.log('Passed: firmware ranked by file-name version across release tags.');
}
