import Alpine from "alpinejs";
import { getConfig } from "./config";
import { fetchCatalog, fetchChangelog } from "./services";
import { parseMarkdown, formatDate, formatTime } from "./utils";

window.Alpine = Alpine;

Alpine.data("catalogApp", () => ({
  config: getConfig(),

  releases: [],
  changelogs: {},
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  loading: true,

  activeHashVersion: null,
  copiedVersion: null,

  get pageSize() {
    return this.config.pageSize;
  },

  get paginated() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.releases.slice(start, start + this.pageSize);
  },

  get latestVersion() {
    if (this.totalItems > 0) {
      return this.releases.slice(0, 1).pop()?.versionCode;
    }
    return null;
  },

  get latestUpdate() {
    if (this.totalItems > 0) {
      const datetime = this.releases.slice(0, 1).pop()?.datetime;
      if (datetime) {
        return `${formatDate(datetime)} ${formatTime(datetime)}`;
      }
    }
    return null;
  },

  async init() {
    await this.loadCatalog();

    const hashCode = this.getVersionFromHash();

    if (hashCode) {
      const index = this.releases.findIndex((r) => r.versionCode === hashCode);

      if (index !== -1) {
        this.currentPage = Math.floor(index / this.pageSize) + 1;

        this.activeHashVersion = hashCode;
      }
    } else {
       // ✅ Auto expand latest release (first item)
      this.activeHashVersion = this.latestVersion;
    }

    await this.loadCurrentPage();

    this.$nextTick(() => this.scrollToHash());
    this.prefetchNextPage();

    window.addEventListener("hashchange", () => {
      this.activeHashVersion = this.getVersionFromHash();
      this.scrollToHash();
    });
  },

  async loadCatalog() {
    try {
      const rows = await fetchCatalog(this.config.catalogCsv);

      this.releases = rows.map((r) => ({
        ...r,
        date: formatDate(r.datetime),
        time: formatTime(r.datetime),
      }));

      this.totalPages = Math.ceil(this.releases.length / this.pageSize);
      this.totalItems = this.releases.length;
    } catch (error) {
      this.totalItems = -1;
      console.error("loadCatalog", error);
    } finally {
      this.loading = false;
    }
  },

  async loadCurrentPage() {
    await Promise.all(
      this.paginated.map((r) => this.loadChangelog(r.versionCode)),
    );
  },

  async loadChangelog(versionCode) {
    if (this.changelogs[versionCode]) return;

    const cacheKey = `changelog_${versionCode}`;
    const cached = sessionStorage.getItem(cacheKey);

    if (cached) {
      this.changelogs[versionCode] = JSON.parse(cached);
      return;
    }

    this.changelogs[versionCode] = { status: "loading" };

    try {
      const url = this.config.getChangelogUrl(versionCode);

      const text = await fetchChangelog(url);
      const parsed = parseMarkdown(text);

      const data = {
        status: "loaded",
        data: parsed,
      };

      this.changelogs[versionCode] = data;
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (error) {
      console.error("loadChangelog", versionCode, error);
      this.changelogs[versionCode] = { status: "error" };
    }
  },

  async changePage(page) {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;

    // XÓA HASH
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname);
      this.activeHashVersion = null;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    await this.loadCurrentPage();
    this.prefetchNextPage();
  },

  prefetchNextPage() {
    const next = this.currentPage + 1;
    if (next > this.totalPages) return;

    const start = (next - 1) * this.pageSize;
    const items = this.releases.slice(start, start + this.pageSize);

    items.forEach((r) => this.loadChangelog(r.versionCode));
  },

  onDetailsToggle(event, version) {
    if (event.target.open) {
      this.setVersionToHash(version);
    }
  },

  setVersionToHash(version) {
    const hash = `#v=${encodeURIComponent(version)}`;
    this.activeHashVersion = version;
    history.replaceState(null, "", hash);
    return hash;
  },

  getVersionFromHash() {
    if (!window.location.hash.startsWith("#v=")) return null;
    return decodeURIComponent(window.location.hash.replace("#v=", ""));
  },

  scrollToHash() {
    const code = this.getVersionFromHash();
    if (!code) return;

    const el = document.getElementById("v" + code);
    if (!el) return;

    const headerOffset =
      document.querySelector("[data-sticky-header]")?.offsetHeight || 0;

    const top =
      el.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12;

    window.scrollTo({
      top,
      behavior: "smooth",
    });
  },

  copySharedUrl(versionCode) {
    const hash = this.setVersionToHash(versionCode);
    const fullUrl = window.location.origin + window.location.pathname + hash;

    navigator.clipboard.writeText(fullUrl).then(() => {
      this.copiedVersion = versionCode;
      setTimeout(() => {
        this.copiedVersion = null;
      }, 1200);
    });
  },

  refreshVersion(versionCode) {
    const cacheKey = `changelog_${versionCode}`;
    sessionStorage.removeItem(cacheKey);
    delete this.changelogs[versionCode];
    this.loadChangelog(versionCode);
  },

  refreshAll() {
    sessionStorage.clear();
    window.location.reload();
  },

  formatDate,
  formatTime,

  getAssetIconUrl(asset) {
    return this.config.getAssetIconUrl(asset);
  },

  getAssetDownloadUrl(version, asset) {
    return this.config.getAssetDownloadUrl(version, asset);
  },

  getAssetDownloadName(version, asset) {
    return this.config.getAssetDownloadName(version, asset);
  },
}));

Alpine.start();
