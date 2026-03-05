import { marked } from "marked";
import { getConfig } from "./config";

export function parseMarkdown(raw) {
  const FRONTMATTER_REGEX = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/;

  const match = raw.match(FRONTMATTER_REGEX);

  if (!match) {
    return {
      frontmatter: {},
      body: raw,
      html: render(raw),
    };
  }

  const frontmatterBlock = match[1];
  const body = raw.slice(match[0].length);
  const frontmatter = parseFrontmatter(frontmatterBlock);

  return {
    frontmatter,
    body,
    html: render(body),
  };
}

function parseFrontmatter(frontmatterString) {
  const data = {};
  let current = null;

  frontmatterString.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    // array item
    if (trimmed.startsWith("- ") && current) {
      if (!Array.isArray(data[current])) data[current] = [];
      data[current].push(parseScalarValue(trimmed.slice(2).trim()));
      return;
    }

    const idx = trimmed.indexOf(":");
    if (idx === -1) return;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    current = key;

    if (value === "") {
      data[key] = [];
    } else {
      data[key] = parseScalarValue(value);
    }
  });

  return data;
}

function parseScalarValue(value) {
  if (typeof value !== "string") return value;

  value = value.trim();

  if (!value) return value;

  const first = value[0];
  const last = value[value.length - 1];

  // remove surrounding quotes
  if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
    value = value.slice(1, -1);

    // unescape quotes
    value = value
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, "\\");
  }

  return value;
}

function render(body) {
  const html = marked.parse(body || "", {
    mangle: false,
    headerIds: false,
    breaks: true,
  });

  return getConfig().transformChangelogHtml(html);
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
