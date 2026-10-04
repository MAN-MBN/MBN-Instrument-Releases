# MBN-Instrument-Releases
Public Windows/macOS release packages, firmware images, and automatic-update feeds for MBN Instrument.

## Download website

[MBN Instrument Download Center](https://man-mbn.github.io/MBN-Instrument-Releases/)

Direct downloads for Windows, macOS, factory HEX and USB firmware packages,
with SHA-256 links and the official ST-Link USB driver download reminder.
Simplified Chinese and English are available from the header language selector.
The browser language sets the initial choice, and explicit selections are
remembered locally. Share `?lang=en` or `?lang=zh-CN` for a specific language.
Release notes on GitHub remain in their original language.
The page queries public GitHub Releases on each visit and selects the highest
semantic version that contains both the requested asset and its checksum.
Preview releases are included and labeled. Update-channel releases are excluded.

GitHub Pages publishes `main:/docs`. The site needs no build tools, external
fonts, analytics, or secret tokens. `docs/releases.json` is a fallback snapshot
for GitHub API outages/rate limits; refresh it when publishing if needed. The
page explicitly labels fallback data instead of claiming it is current.

Validate translations and selection logic with `node tests/i18n.test.mjs`.
