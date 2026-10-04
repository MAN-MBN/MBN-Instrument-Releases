export const messages = {
  'zh-CN': {
    title:'MBN Instrument · 下载中心',
    meta:'MBN Instrument 官方下载中心：最新 Windows、macOS 软件、STM32F407VG 固件 HEX 和 ST-Link 驱动。',
    home:'MBN Instrument 首页', language:'语言', eyebrow:'软件与固件',
    headline:'测量，从这里开始。', intro:'MBN Instrument 下载中心', introDetail:'软件安装包与仪器固件，一处获取。',
    softwareTitle:'桌面软件', softwareHint:'选择你的操作系统',
    driverTitle:'第一次使用 ST-Link？先安装 USB 驱动。',
    driverText:'软件已内置烧录工具，USB 驱动需另行安装。下载 ST 官方 STSW-LINK009，解压后按包内说明安装；Windows 可能请求管理员授权。',
    driverLink:'下载官方驱动 ↗', firmwareTitle:'仪器固件', firmwareHint:'确认硬件型号后再烧录',
    firmwareNoteTitle:'烧录前须知',
    firmwareNote:'Factory HEX 通过 ST-Link 首次安装引导程序及应用；USB 更新包用于已安装兼容引导程序的仪器。当前 F4 开发固件面向 MBN STM32F407VG，实机烧录尚未验证。请在台架环境停止外部励磁，并保持供电和 SWD 连接。',
    installTitle:'安装软件', installText:'Windows 运行安装器；macOS 打开 DMG 后拖入 Applications。系统要求以该版本说明为准。',
    connectTitle:'连接仪器', connectText:'Windows 使用 ST-Link 前安装官方 USB 驱动，再连接对应探针和仪器。',
    updateTitle:'后续直接更新', updateText:'软件内使用 Check Updates。网页打开时也会自动查询最新发布，无需翻找 Release。',
    history:'历史版本与完整发布说明 ↗', checksum:'SHA-256 校验文件', notes:'版本说明 ↗', hash:'查看 SHA-256',
    preview:'预览版', stable:'正式版', empty:'暂无匹配的公开下载包。请稍后重试，或查看历史发布。',
    loading:'正在获取发布版本…', snapshot:'已显示发布快照，正在检查更新…',
    synced:'已同步 GitHub 最新发布 · 包含预览版本',
    cached:'暂时无法检查最新版本，当前显示已保存的发布快照',
    unavailable:'无法获取下载信息，请稍后刷新或查看历史版本',
    'windows.description':'完整安装包，包含 Qt 运行库与 ST-Link 烧录工具。USB 驱动请使用下方官方下载入口。',
    'windows.button':'下载 Windows 安装包', 'windows.title':'Windows',
    'arm64.description':'适用于 M 系列芯片。打开 DMG 并拖入 Applications；系统要求与签名信息请查看版本说明。',
    'arm64.button':'下载 macOS', 'arm64.title':'macOS',
    'x86_64.description':'适用于 Intel 芯片的 Mac。安装前请确认版本说明中的系统要求。',
    'x86_64.button':'下载 Intel 版本', 'x86_64.title':'macOS Intel',
    'universal.description':'适用于 Apple Silicon 与 Intel Mac。系统要求以版本说明为准。',
    'universal.button':'下载通用版本', 'universal.title':'macOS Universal',
    'hex.description':'首次安装或恢复仪器。包含引导程序与应用，使用 ST-Link 烧录。',
    'hex.button':'下载固件 HEX', 'hex.title':'Factory HEX',
    'usb.description':'用于已安装兼容引导程序的仪器。通过软件的 Check Updates 安装。',
    'usb.button':'下载 USB 更新包', 'usb.title':'USB 更新包'
  },
  en: {
    title:'MBN Instrument · Downloads',
    meta:'Official MBN Instrument downloads: the latest Windows and macOS software, STM32F407VG firmware HEX files, and ST-Link drivers.',
    home:'MBN Instrument home', language:'Language', eyebrow:'SOFTWARE & FIRMWARE',
    headline:'Your next measurement starts here.', intro:'MBN Instrument Download Center', introDetail:'Desktop software and instrument firmware, in one place.',
    softwareTitle:'Desktop software', softwareHint:'Choose your operating system',
    driverTitle:'New to ST-Link? Install the USB driver first.',
    driverText:'Programming tools are included in the software; the USB driver is installed separately. Download ST’s official STSW-LINK009 package, extract it, and follow the included instructions. Windows may ask for administrator approval.',
    driverLink:'Download official driver ↗', firmwareTitle:'Instrument firmware', firmwareHint:'Confirm your hardware before programming',
    firmwareNoteTitle:'Before programming',
    firmwareNote:'Use the factory HEX with ST-Link to install the bootloader and application for the first time. USB update packages require an existing compatible bootloader. The current F4 development firmware targets the MBN STM32F407VG; physical programming has not been verified. Use a bench setup, stop external excitation, and keep power and SWD connected.',
    installTitle:'Install the software', installText:'Run the installer on Windows. On macOS, open the DMG and drag the app into Applications. Check the release notes for system requirements.',
    connectTitle:'Connect your instrument', connectText:'On Windows, install the official USB driver before using ST-Link, then connect the appropriate probe and instrument.',
    updateTitle:'Update from the app', updateText:'Use Check Updates in the software. This page also checks the latest releases when opened, so you do not need to browse GitHub Releases.',
    history:'Previous versions & full release notes ↗', checksum:'SHA-256 checksum file', notes:'Release notes ↗', hash:'View SHA-256',
    preview:'PREVIEW', stable:'RELEASE', empty:'No matching public downloads are available. Please try again later or check previous releases.',
    loading:'Fetching releases…', snapshot:'Saved release snapshot loaded. Checking for updates…',
    synced:'Latest GitHub releases synced · Preview versions included',
    cached:'Unable to check for updates. Showing the saved release snapshot.',
    unavailable:'Unable to load downloads. Refresh later or check previous releases.',
    'windows.description':'Full installer with Qt runtime libraries and ST-Link programming tools. Use the official USB driver link below.',
    'windows.button':'Download Windows installer', 'windows.title':'Windows',
    'arm64.description':'For M-series Macs. Open the DMG and drag the app into Applications. See release notes for OS requirements and signing details.',
    'arm64.button':'Download macOS', 'arm64.title':'macOS',
    'x86_64.description':'For Intel-based Macs. Check the release notes for system requirements before installation.',
    'x86_64.button':'Download Intel version', 'x86_64.title':'macOS Intel',
    'universal.description':'For Apple Silicon and Intel Macs. See the release notes for system requirements.',
    'universal.button':'Download universal version', 'universal.title':'macOS Universal',
    'hex.description':'For first installation or recovery. Includes the bootloader and application; program it with ST-Link.',
    'hex.button':'Download firmware HEX', 'hex.title':'Factory HEX',
    'usb.description':'For instruments with a compatible bootloader already installed. Install using Check Updates in the software.',
    'usb.button':'Download USB update', 'usb.title':'USB update package'
  }
};
export function resolveLanguage(saved, preferred = []) {
  if (Object.hasOwn(messages, saved)) return saved;
  return /^zh(?:-|$)/i.test(preferred[0] || '') ? 'zh-CN' : 'en';
}
export function translate(language, key) {
  if (!Object.hasOwn(messages.en, key)) throw new Error(`Missing translation: ${key}`);
  return messages[language]?.[key] ?? messages.en[key];
}
