export type CodeTokenType =
  | "keyword"
  | "string"
  | "comment"
  | "number"
  | "function"
  | "type"
  | "tag"
  | "attr"
  | "operator"
  | "plain";

export type CodeToken = { type: CodeTokenType; text: string };

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "import",
  "export",
  "from",
  "async",
  "await",
  "class",
  "extends",
  "interface",
  "type",
  "enum",
  "new",
  "this",
  "true",
  "false",
  "null",
  "undefined",
  "void",
  "typeof",
  "instanceof",
  "switch",
  "case",
  "break",
  "continue",
  "try",
  "catch",
  "finally",
  "throw",
  "default",
  "public",
  "private",
  "protected",
  "static",
  "readonly",
  "declare",
  "as",
  "in",
  "of",
  "select",
  "filter",
  "order",
  "defineQuery",
  "defineType",
  "defineField",
]);

function pushPlain(tokens: CodeToken[], text: string) {
  if (text) tokens.push({ type: "plain", text });
}

function highlightGeneric(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let i = 0;

  while (i < line.length) {
    const rest = line.slice(i);

    if (rest.startsWith("//") || rest.startsWith("#")) {
      tokens.push({ type: "comment", text: rest });
      break;
    }

    if (rest.startsWith("/*")) {
      const end = rest.indexOf("*/");
      const chunk = end === -1 ? rest : rest.slice(0, end + 2);
      tokens.push({ type: "comment", text: chunk });
      i += chunk.length;
      continue;
    }

    const strMatch = rest.match(/^(['"`])((?:\\.|(?!\1)[^\\])*)\1/);
    if (strMatch) {
      tokens.push({ type: "string", text: strMatch[0] });
      i += strMatch[0].length;
      continue;
    }

    const numMatch = rest.match(/^-?\d+(?:\.\d+)?/);
    if (numMatch) {
      tokens.push({ type: "number", text: numMatch[0] });
      i += numMatch[0].length;
      continue;
    }

    const wordMatch = rest.match(/^[A-Za-z_$][\w$]*/);
    if (wordMatch) {
      const word = wordMatch[0];
      if (KEYWORDS.has(word)) {
        tokens.push({ type: "keyword", text: word });
      } else if (/^[A-Z]/.test(word)) {
        tokens.push({ type: "type", text: word });
      } else if (line[i + word.length] === "(") {
        tokens.push({ type: "function", text: word });
      } else {
        tokens.push({ type: "plain", text: word });
      }
      i += word.length;
      continue;
    }

    const opMatch = rest.match(/^[{}()[\];:.,=<>!+\-*/&|?@]+/);
    if (opMatch) {
      tokens.push({ type: "operator", text: opMatch[0] });
      i += opMatch[0].length;
      continue;
    }

    pushPlain(tokens, rest[0]!);
    i += 1;
  }

  return tokens;
}

function highlightHtml(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);
    if (rest.startsWith("<!--")) {
      const end = rest.indexOf("-->");
      const chunk = end === -1 ? rest : rest.slice(0, end + 3);
      tokens.push({ type: "comment", text: chunk });
      i += chunk.length;
      continue;
    }
    const tagMatch = rest.match(/^<\/?[\w-]+/);
    if (tagMatch) {
      tokens.push({ type: "tag", text: tagMatch[0] });
      i += tagMatch[0].length;
      continue;
    }
    const attrMatch = rest.match(/^[\w-]+(?==)/);
    if (attrMatch) {
      tokens.push({ type: "attr", text: attrMatch[0] });
      i += attrMatch[0].length;
      continue;
    }
    const strMatch = rest.match(/^(['"])(?:\\.|(?!\1)[^\\])*\1/);
    if (strMatch) {
      tokens.push({ type: "string", text: strMatch[0] });
      i += strMatch[0].length;
      continue;
    }
    pushPlain(tokens, rest[0]!);
    i += 1;
  }
  return tokens;
}

function highlightBash(line: string): CodeToken[] {
  if (line.trim().startsWith("#")) return [{ type: "comment", text: line }];
  const tokens: CodeToken[] = [];
  const parts = line.split(/(\s+)/);
  for (const part of parts) {
    if (!part) continue;
    if (/^\s+$/.test(part)) {
      pushPlain(tokens, part);
      continue;
    }
    if (
      /^[\w./-]+$/.test(part) &&
      (part.includes("/") || part.startsWith("-") || part.endsWith(".ts"))
    ) {
      tokens.push({ type: "string", text: part });
    } else if (/^(cd|npm|npx|yarn|pnpm|node|git|echo|export|sudo)\b/.test(part)) {
      tokens.push({ type: "keyword", text: part });
    } else {
      tokens.push({ type: "plain", text: part });
    }
  }
  return tokens;
}

export function highlightCodeLine(line: string, language?: string): CodeToken[] {
  const lang = (language ?? "text").toLowerCase();
  if (lang === "html" || lang === "xml") return highlightHtml(line);
  if (lang === "bash" || lang === "sh" || lang === "shell") return highlightBash(line);
  return highlightGeneric(line);
}

/** Parse `"3,5-7"` into a set of 1-based line numbers. */
export function parseHighlightedLines(spec?: string): Set<number> {
  const set = new Set<number>();
  if (!spec?.trim()) return set;

  for (const part of spec.split(",")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    if (trimmed.includes("-")) {
      const [rawStart, rawEnd] = trimmed.split("-");
      const start = Number(rawStart);
      const end = Number(rawEnd);
      if (!Number.isFinite(start) || !Number.isFinite(end)) continue;
      for (let i = Math.min(start, end); i <= Math.max(start, end); i++) set.add(i);
    } else {
      const n = Number(trimmed);
      if (Number.isFinite(n)) set.add(n);
    }
  }

  return set;
}
