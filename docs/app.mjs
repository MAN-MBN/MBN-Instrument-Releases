const REPO = 'MAN-MBN/MBN-Instrument-Releases';
const ROOT = `https://github.com/${REPO}/releases/`;
const definitions = [
  {key:'windows',group:'software',pattern:/^MBN-Instrument-Setup\.exe$/,title:'Windows',platform:'WINDOWS · X64',description:'完整安装包，包含 Qt 运行库与 ST-Link 烧录工具。USB 驱动请使用下方官方下载入口。',button:'下载 Windows 安装包'},
  {key:'arm64',group:'software',pattern:/^MBN-Instrument-macOS-arm64\.(dmg|pkg)$/,title:'macOS',platform:'MACOS · APPLE SILICON',description:'适用于 M 系列芯片。打开 DMG 并拖入 Applications；系统要求与签名信息请查看版本说明。',button:'下载 macOS'},
  {key:'x86_64',group:'software',pattern:/^MBN-Instrument-macOS-x86_64\.(dmg|pkg)$/,title:'macOS Intel',platform:'MACOS · INTEL',description:'适用于 Intel 芯片的 Mac。安装前请确认版本说明中的系统要求。',button:'下载 Intel 版本'},
  {key:'universal',group:'software',pattern:/^MBN-Instrument-macOS-universal\.(dmg|pkg)$/,title:'macOS Universal',platform:'MACOS · UNIVERSAL',description:'适用于 Apple Silicon 与 Intel Mac。系统要求以版本说明为准。',button:'下载通用版本'},
  {key:'hex',group:'firmware',pattern:/^MBN-F4-.*\.factory\.hex$/,title:'Factory HEX',platform:'STM32F407VG · ST-LINK',description:'首次安装或恢复仪器。包含引导程序与应用，使用 ST-Link 烧录。',button:'下载固件 HEX'},
  {key:'usb',group:'firmware',pattern:/^MBN-F4-.*\.mbnfw$/,title:'USB 更新包',platform:'STM32F407VG · USB',description:'用于已安装兼容引导程序的仪器。通过软件的 Check Updates 安装。',button:'下载 USB 更新包'}
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
function render(releases){
  const selected=selectDownloads(releases);
  for(const group of ['software','firmware']){
    document.getElementById(group).innerHTML=selected.filter(d=>d.group===group).map(d=>{
      const {release,asset,checksum}=d;
      const date=new Date(release.published_at).toLocaleDateString('zh-CN');
      const notes=typeof release.html_url==='string'&&release.html_url.startsWith(ROOT+'tag/')?release.html_url:ROOT;
      const hash=/^sha256:[a-f0-9]{64}$/i.test(asset.digest||'')?`<details class="hash"><summary>查看 SHA-256</summary><code>${escape(asset.digest.slice(7))}</code></details>`:'';
      return `<article class="card"><div class="card-top"><span class="platform">${d.platform}</span>${release.prerelease?'<span class="badge">PREVIEW</span>':'<span class="badge">RELEASE</span>'}</div><h3>${d.title}</h3><p class="description">${d.description}</p><p class="version">${escape(release.tag_name)} · ${(asset.size/1024/1024).toFixed(1)} MB · ${escape(date)}</p><a class="button" href="${escape(asset.browser_download_url)}">${d.button} ↓</a><div class="links"><a href="${escape(checksum.browser_download_url)}">SHA-256 校验文件</a><a href="${escape(notes)}" target="_blank" rel="noopener noreferrer">版本说明 ↗</a></div>${hash}</article>`;
    }).join('')||'<p class="empty">暂无匹配的公开下载包。请稍后重试，或查看历史发布。</p>';
  }
  return selected.length;
}
async function refresh(){
  const status=document.getElementById('status');let cached=false;
  try{
    const response=await fetch('releases.json',{cache:'no-cache'});if(!response.ok)throw new Error('snapshot');
    const snapshot=await response.json();cached=render(snapshot.releases)>0;
    status.textContent=`已显示发布快照，正在检查更新…`;
  }catch{}
  try{
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);const releases=[];
    try{for(let page=1;page<=10;page++){
      const response=await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=100&page=${page}`,{signal:controller.signal,headers:{Accept:'application/vnd.github+json'}});
      if(!response.ok)throw new Error('API');const batch=await response.json();if(!Array.isArray(batch))throw new Error('data');
      releases.push(...batch);if(batch.length<100)break;
    }}finally{clearTimeout(timer);}
    if(!render(releases))throw new Error('empty');
    status.textContent='已同步 GitHub 最新发布 · 包含预览版本';
  }catch{
    status.textContent=cached?'暂时无法检查最新版本，当前显示已保存的发布快照':'无法获取下载信息，请稍后刷新或查看历史版本';
  }
}
if(typeof document!=='undefined')refresh();
