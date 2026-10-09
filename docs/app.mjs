import { resolveLanguage, translate } from './i18n.mjs?v=20261009-h7';
let language = 'en';
let lastReleases = [];
let statusKey = 'loading';
const t = key => translate(language, key);
const REPO = 'MAN-MBN/MBN-Instrument-Releases';
const ROOT = `https://github.com/${REPO}/releases/`;
const definitions = [
  {key:'windows',group:'software',pattern:/^MBN-Instrument-Setup\.exe$/,title:'Windows',platform:'WINDOWS · X64',description:'完整安装包，包含 Qt 运行库与 ST-Link 烧录工具。USB 驱动请使用下方官方下载入口。',button:'下载 Windows 安装包'},
  {key:'arm64',group:'software',pattern:/^MBN-Instrument-macOS-arm64\.(dmg|pkg)$/,title:'macOS',platform:'MACOS · APPLE SILICON',description:'适用于 M 系列芯片。打开 DMG 并拖入 Applications；系统要求与签名信息请查看版本说明。',button:'下载 macOS'},
  {key:'x86_64',group:'software',pattern:/^MBN-Instrument-macOS-x86_64\.(dmg|pkg)$/,title:'macOS Intel',platform:'MACOS · INTEL',description:'适用于 Intel 芯片的 Mac。安装前请确认版本说明中的系统要求。',button:'下载 Intel 版本'},
  {key:'universal',group:'software',pattern:/^MBN-Instrument-macOS-universal\.(dmg|pkg)$/,title:'macOS Universal',platform:'MACOS · UNIVERSAL',description:'适用于 Apple Silicon 与 Intel Mac。系统要求以版本说明为准。',button:'下载通用版本'},
  {key:'hex',group:'firmware',pattern:/^MBN-F4-.*\.factory\.hex$/,title:'Factory HEX',platform:'STM32F407VG · ST-LINK',description:'首次安装或恢复仪器。包含引导程序与应用，使用 ST-Link 烧录。',button:'下载固件 HEX'},
  {key:'usb',group:'firmware',pattern:/^MBN-F4-.*\.mbnfw$/,title:'USB 更新包',platform:'STM32F407VG · USB',description:'用于已安装兼容引导程序的仪器。通过软件的 Check Updates 安装。',button:'下载 USB 更新包'},
  {key:'h7hex',group:'firmware',pattern:/^MBN-H7-.*\.factory\.hex$/,platform:'STM32H743II · ST-LINK'},
  {key:'h7usb',group:'firmware',pattern:/^MBN-H7-.*\.mbnfw$/,platform:'STM32H743II · USB'}
];
export function compareVersions(a,b){
  const parse=v=>/^v?(\d+)\.(\d+)\.(\d+)(?:-([\w.-]+))?$/.exec(v);
  const x=parse(a),y=parse(b);if(!x||!y)return 0;
  for(let i=1;i<=3;i++){const d=Number(x[i])-Number(y[i]);if(d)return d;}
  if(!x[4]||!y[4])return x[4]?-1:y[4]?1:0;
  const xs=x[4].split('.'),ys=y[4].split('.');
  for(let i=0;i<Math.max(xs.length,ys.length);i++){
    if(xs[i]===undefined)return -1;if(ys[i]===undefined)return 1;
    if(xs[i]===ys[i])continue;
    const xn=/^\d+$/.test(xs[i]),yn=/^\d+$/.test(ys[i]);
    if(xn&&yn)return Number(xs[i])-Number(ys[i]);
    if(xn!==yn)return xn?-1:1;
    return xs[i]<ys[i]?-1:1;
  }return 0;
}
function trustedAsset(asset){return typeof asset?.browser_download_url==='string' && asset.browser_download_url.startsWith(ROOT+'download/');}
export function selectDownloads(releases){
  const sorted=releases.filter(r=>!r.draft && /^v?\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(r.tag_name))
    .sort((a,b)=>compareVersions(b.tag_name,a.tag_name));
  return definitions.flatMap(def=>{
    for(const release of sorted){
      const assets=(release.assets||[]).filter(a=>def.pattern.test(a.name)&&trustedAsset(a)).sort((a,b)=>Number(b.name.endsWith('.dmg'))-Number(a.name.endsWith('.dmg')));
      for(const asset of assets){
        const checksum=(release.assets||[]).find(a=>a.name===asset.name+'.sha256'&&trustedAsset(a));
        if(checksum)return [{...def,release,asset,checksum}];
      }
    }return [];
  });
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sizeLabel=bytes=>bytes<1024*1024?`${(bytes/1024).toFixed(1)} KB`:`${(bytes/1024/1024).toFixed(1)} MB`;
function render(releases){
  const selected=selectDownloads(releases);
  for(const group of ['software','firmware']){
    document.getElementById(group).innerHTML=selected.filter(d=>d.group===group).map(d=>{
      const {release,asset,checksum}=d;
      const date=new Date(release.published_at).toLocaleDateString(language==='en'?'en-GB':'zh-CN');
      const notes=typeof release.html_url==='string'&&release.html_url.startsWith(ROOT+'tag/')?release.html_url:ROOT;
      const hash=/^sha256:[a-f0-9]{64}$/i.test(asset.digest||'')?`<details class="hash"><summary>${escape(t('hash'))}</summary><code>${escape(asset.digest.slice(7))}</code></details>`:'';
      return `<article id="${escape(d.key)}" class="card"><div class="card-top"><span class="platform">${d.platform}</span><span class="badge">${escape(t(release.prerelease?'preview':'stable'))}</span></div><h3>${escape(t(d.key+'.title'))}</h3><p class="description">${escape(t(d.key+'.description'))}</p><p class="version">${escape(release.tag_name)} · ${sizeLabel(asset.size)} · ${escape(date)}</p><a class="button" href="${escape(asset.browser_download_url)}">${escape(t(d.key+'.button'))} ↓</a><div class="links"><a href="${escape(checksum.browser_download_url)}">${escape(t('checksum'))}</a><a href="${escape(notes)}" target="_blank" rel="noopener noreferrer">${escape(t('notes'))}</a></div>${hash}</article>`;
    }).join('')||`<p class="empty">${escape(t('empty'))}</p>`;
  }
  if(location.hash==='#h7hex' || location.hash==='#h7usb')
    document.getElementById(location.hash.slice(1))?.scrollIntoView({block:'start'});
  return selected.length;
}
async function refresh(){
  let cached=false;
  try{
    const response=await fetch('releases.json',{cache:'no-cache'});if(!response.ok)throw new Error('snapshot');
    const snapshot=await response.json();lastReleases=snapshot.releases;cached=render(lastReleases)>0;
    setStatus('snapshot');
  }catch{}
  try{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);const releases=[];
    try{for(let page=1;page<=10;page++){
      const response=await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100&page=${page}`,{cache:'no-cache',signal:controller.signal,headers:{Accept:'application/vnd.github+json'}});
      if(!response.ok)throw new Error('API');const batch=await response.json();if(!Array.isArray(batch))throw new Error('data');
      releases.push(...batch);if(batch.length<100)break;
    }}finally{clearTimeout(timer);}
    if(!selectDownloads(releases).length)throw new Error('empty');
    lastReleases=releases;render(lastReleases);
    setStatus('synced');
  }catch{
    setStatus(cached?'cached':'unavailable');
  }
}
function setStatus(key){statusKey=key;document.getElementById('status').textContent=t(key);}
function applyLanguage(next){
  language=resolveLanguage(next);
  document.documentElement.lang=language;
  document.title=t('title');
  document.querySelector('meta[name="description"]').content=t('meta');
  document.querySelector('.brand').setAttribute('aria-label',t('home'));
  document.querySelectorAll('[data-i18n]').forEach(element=>{element.textContent=t(element.dataset.i18n);});
  document.getElementById('language').value=language;
  setStatus(statusKey);
  if(lastReleases.length)render(lastReleases);
}
if(typeof document!=='undefined'){
  let saved;try{saved=localStorage.getItem('mbn-language');}catch{}
  const requested=new URLSearchParams(location.search).get('lang');
  applyLanguage(resolveLanguage(requested==='zh'?'zh-CN':requested||saved,navigator.languages||[navigator.language]));
  document.getElementById('language').addEventListener('change',event=>{
    applyLanguage(event.target.value);
    try{localStorage.setItem('mbn-language',language);}catch{}
    const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);
  });
  refresh();
}
