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

      if (!id || !version) throw new Error(`Invalid row ${i + 1}`);

      return {
        id,
        version,
        versionCode: `${version}.${id}`,
        datetime,
      };
    })
    .sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
}

export async function fetchChangelog(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load changelog");
  return res.text();
}
