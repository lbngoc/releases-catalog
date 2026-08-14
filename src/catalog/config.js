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
    if (isAbsoluteUrl(asset)) return asset;
    return `${this.releasesRelativePath}/${encodeURIComponent(version)}/${encodeURIComponent(asset)}`;
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

export function getConfig() {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  return { ...DEFAULT_CONFIG, ...(window.catalogConfig || {}) };
}
