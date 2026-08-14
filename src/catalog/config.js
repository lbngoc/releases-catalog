function isAbsoluteUrl(value) {
  return /^(https?:)?\/\//i.test(value);
}

function extractFileName(value) {
  const last = value.split(/[?#]/)[0].split("/").filter(Boolean).pop() || value;
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

function isPlist(asset) {
  return extractFileName(asset).toLowerCase().endsWith(".plist");
}

function toAbsoluteUrl(value) {
  if (isAbsoluteUrl(value)) return value;
  if (typeof window === "undefined") return value;
  return new URL(value, window.location.href).href;
}

const DEFAULT_CONFIG = {
  pageSize: 5,
  catalogCsv: "catalog.csv",
  releasesRelativePath: "releases",

  getAssetIconUrl(asset) {
    const name = isAbsoluteUrl(asset) ? extractFileName(asset) : asset;

    if (name.includes(".zip")) return "assets/svg/package.svg";
    if (name.includes(".ipa") || name.includes(".plist"))
      return "assets/svg/ios.svg";
    if (name.includes(".apk") || name.includes(".aab"))
      return "assets/svg/android.svg";

    return "assets/svg/unknown.svg";
  },

  getAssetDownloadUrl(version, asset) {
    const url = isAbsoluteUrl(asset)
      ? asset
      : `${this.releasesRelativePath}/${encodeURIComponent(version)}/${encodeURIComponent(asset)}`;

    // iOS OTA install: Safari only triggers the install prompt for a .plist
    // manifest when linked via itms-services, never a plain https link.
    if (isPlist(asset)) {
      return `itms-services://?action=download-manifest&url=${toAbsoluteUrl(url)}`;
    }

    return url;
  },

  getAssetDownloadName(version, asset) {
    if (isAbsoluteUrl(asset)) return extractFileName(asset);
    return asset;
  },

  getChangelogUrl(versionCode) {
    const version = versionCode.substring(0, versionCode.lastIndexOf("."));
    return `${this.releasesRelativePath}/${encodeURIComponent(version)}/CHANGELOG.md`;
  },

  transformChangelogHtml(html) {
    return html;
  },
};

if (typeof window !== "undefined") {
  // Lets a window.catalogConfig override delegate back to the built-in
  // behavior for cases it doesn't want to special-case, e.g.:
  //   getAssetDownloadName(version, asset) {
  //     if (asset === "app.plist") return "MyApp.app";
  //     return window.catalogConfigDefaults.getAssetDownloadName.call(this, version, asset);
  //   }
  window.catalogConfigDefaults = DEFAULT_CONFIG;
}

export function getConfig() {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  return { ...DEFAULT_CONFIG, ...(window.catalogConfig || {}) };
}
