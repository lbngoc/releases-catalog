import { marked } from "marked";

export function parseMarkdown(raw) {
  const FRONTMATTER_REGEX = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/;

  const match = raw.match(FRONTMATTER_REGEX);

  if (!match) {
    return render(raw);
  }

  const frontmatterBlock = match[1];
  const body = raw.slice(match[0].length);

  const frontmatter = parseKeyValue(frontmatterBlock);

  return {
    frontmatter,
    body,
    html: marked.parse(body || "", {
      mangle: false,
      headerIds: false,
      breaks: true,
    }),
  };
}

function parseKeyValue(text) {
  const data = {};
  let currentKey = null;

  text.split(/\r?\n/).forEach((line) => {
    if (!line.trim()) return;

    // array item
    if (line.trim().startsWith("- ") && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      data[currentKey].push(line.trim().slice(2).trim());
      return;
    }

    const idx = line.indexOf(":");
    if (idx === -1) return;

    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();

    currentKey = key;

    if (!value) {
      data[key] = [];
    } else {
      data[key] = value;
    }
  });

  return data;
}

function render(body) {
  return {
    frontmatter: {},
    body,
    html: marked.parse(body || "", {
      mangle: false,
      headerIds: false,
      breaks: true,
    }),
  };
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatTime(value) {
  return new Date(value).toLocaleTimeString("en-US");
}
