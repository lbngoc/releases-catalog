const DEFAULT_CONFIG = {
  pageSize: 5,
  catalogCsv: "catalog.csv",
  releasesRelativePath: "releases",

  getAssetIconUrl(asset) {
    if (asset.includes(".zip")) return "assets/svg/package.svg";
    if (asset.includes(".ipa") || asset.includes(".plist"))
      return "assets/svg/ios.svg";
    if (asset.includes(".apk") || asset.includes(".aab"))
      return "assets/svg/android.svg";

    return "assets/svg/unknown.svg";
  },

  getAssetDownloadUrl(version, asset) {
    return `${this.releasesRelativePath}/${encodeURIComponent(
      version,
    )}/${encodeURIComponent(asset)}`;
  },

  getAssetDownloadName(version, asset) {
    return asset;
  },

  getChangelogUrl(versionCode) {
    const version = versionCode.substring(0, versionCode.lastIndexOf("."));

    return `${this.releasesRelativePath}/${encodeURIComponent(
      version,
    )}/CHANGELOG.md`;
  },

  transformChangelogHtml(html) {
    return html;
  },
};

export function getConfig() {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  return { ...DEFAULT_CONFIG, ...(window.catalogConfig || {}) };
}
