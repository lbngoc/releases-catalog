---
title: Version 0.1.0
description: "Feature update introducing richer documentation and enhanced \"UI\" behavior"
code: 260306462
date: 2026-03-01T00:00:00.000Z
sprint: 3
hash: 9ab4f1c
assets:
  - release-catalog-0.1.0.aab
	- release-catalog-0.1.0.apk
	- release-catalog-0.1.0.ipa
  - release-catalog-0.1.0.zip
---

This release introduces several improvements to the catalog interface and documentation experience.

---

## ✨ New Features

- Improved layout for release items
- Enhanced rendering of changelog content
- Support for richer Markdown elements including tables and images

### UI Enhancements

- Better spacing and typography
- Improved highlight styles for active releases
- More consistent visual feedback during loading

---

## 📊 Compatibility Table

| Platform | Status | Notes |
|--------|--------|------|
| Android | ✅ Supported | Full artifact download |
| iOS | ✅ Supported | Placeholder support |
| Desktop | ✅ Supported | Works in modern browsers |

---

## 🖼 Example Image

Below is a sample image rendered inside the changelog:

![Sample Preview](https://dummyimage.com/800x300/e5e7eb/374151&text=Release+Catalog+Preview)

---

## 🧩 Nested Feature List

### Catalog Improvements

- Release browsing
  - Pagination support
  - Version grouping
  - Artifact listing
- Changelog viewer
  - Markdown rendering
  - Code block support
  - Automatic formatting

### Developer Experience

- Simplified configuration structure
- Improved folder organization
- Clearer release structure for artifacts

---

## 📦 Artifacts

Available build packages:

- Android AAB package
- Android APK package
- Compressed release archive

Example installation command:

```bash
adb install release-catalog-0.1.0.apk
ios-deploy -b release-catalog-0.1.0.ipa
````

---

## Notes

This version demonstrates a more complete changelog format including rich Markdown features such as:

* tables
* images
* nested lists
* extended documentation sections