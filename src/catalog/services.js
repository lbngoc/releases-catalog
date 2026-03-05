export async function fetchCatalog(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load catalog");

  const text = await res.text();

  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((line, i) => {
      const [id, version, datetime] = line.split(",").map((p) => p?.trim());
      const timestamp = new Date(datetime).getTime();
      if (!id || !version || isNaN(timestamp)) {
        const error = `Invalid line ${i + 1}`;
        console.debug("fetchCatalog", { line, error });
        // throw new Error(error);
        return null;
      };

      return {
        id,
        version,
        versionCode: `${version}.${id}`,
        timestamp,
        datetime,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.timestamp - a.timestamp);
}

export async function fetchChangelog(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load changelog");
  return res.text();
}
