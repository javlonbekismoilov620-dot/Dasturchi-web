/* Yengil sintaksis yoritgich: HTML, CSS, JavaScript/TypeScript, Python, Bash, JSON, SQL.
   Natija — xavfsiz (escape qilingan) HTML satr. Server va brauzerda ishlaydi. */

export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

type Rule = [RegExp, string | null];

const span = (cls: string | null, text: string) => (cls ? `<span class="tok-${cls}">${escapeHtml(text)}</span>` : escapeHtml(text));

function tokenize(code: string, rules: Rule[]): string {
  let out = "";
  let i = 0;
  const sticky = rules.map(([re, cls]) => [new RegExp(re.source, re.flags.includes("y") ? re.flags : re.flags + "y"), cls] as const);
  while (i < code.length) {
    let matched = false;
    for (const [re, cls] of sticky) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m[0].length) {
        out += span(cls, m[0]);
        i += m[0].length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      out += escapeHtml(code[i]);
      i++;
    }
  }
  return out;
}

const JS_KEYWORDS =
  "const|let|var|function|return|if|else|for|while|do|break|continue|switch|case|default|new|class|extends|import|from|export|async|await|try|catch|finally|throw|typeof|instanceof|in|of|this|null|undefined|true|false|interface|type|enum|implements|public|private|readonly";
const JS_BUILTINS = "console|document|window|Math|JSON|Array|Object|String|Number|Promise|Date|fetch|localStorage|alert|setTimeout|setInterval";

const jsRules: Rule[] = [
  [/\/\/[^\n]*/, "comment"],
  [/\/\*[\s\S]*?\*\//, "comment"],
  [/`(?:\\[\s\S]|[^`\\])*`/, "string"],
  [/"(?:\\.|[^"\\\n])*"/, "string"],
  [/'(?:\\.|[^'\\\n])*'/, "string"],
  [new RegExp(`\\b(?:${JS_KEYWORDS})\\b`), "keyword"],
  [new RegExp(`\\b(?:${JS_BUILTINS})\\b`), "builtin"],
  [/\b\d+(?:\.\d+)?\b/, "number"],
  [/\b[A-Za-z_$][\w$]*(?=\s*\()/, "fn"],
  [/[A-Za-z_$][\w$]*/, null],
  [/[{}()[\];,.=<>+\-*/%!&|?:]+/, "punct"],
];

const PY_KEYWORDS =
  "def|return|if|elif|else|for|while|break|continue|in|not|and|or|is|None|True|False|import|from|as|class|try|except|finally|raise|with|lambda|pass|global|yield";
const PY_BUILTINS = "print|input|len|range|int|float|str|list|dict|set|tuple|type|sum|min|max|abs|round|sorted|enumerate|zip|open";

const pyRules: Rule[] = [
  [/#[^\n]*/, "comment"],
  [/"""[\s\S]*?"""/, "string"],
  [/'''[\s\S]*?'''/, "string"],
  [/[fF]?"(?:\\.|[^"\\\n])*"/, "string"],
  [/[fF]?'(?:\\.|[^'\\\n])*'/, "string"],
  [new RegExp(`\\b(?:${PY_KEYWORDS})\\b`), "keyword"],
  [new RegExp(`\\b(?:${PY_BUILTINS})\\b(?=\\s*\\()`), "builtin"],
  [/\b\d+(?:\.\d+)?\b/, "number"],
  [/\b[A-Za-z_]\w*(?=\s*\()/, "fn"],
  [/[A-Za-z_]\w*/, null],
  [/[{}()[\]:,.=<>+\-*/%]+/, "punct"],
];

const cssRules: Rule[] = [
  [/\/\*[\s\S]*?\*\//, "comment"],
  [/"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/, "string"],
  [/@[\w-]+/, "keyword"],
  [/#[0-9a-fA-F]{3,8}\b/, "number"],
  [/-?\d*\.?\d+(?:px|rem|em|%|vh|vw|ch|fr|s|ms|deg)?\b/, "number"],
  [/[\w-]+(?=\s*:(?!:))/, "prop"],
  [/[.#]?[\w-]+(?=[^{};]*\{)/, "tag"],
  [/::?[\w-]+/, "attr"],
  [/[\w-]+(?=\()/, "fn"],
  [/[{}():;,>+~*]/, "punct"],
];

function highlightHtml(code: string): string {
  let out = "";
  const re = /(<!--[\s\S]*?-->)|(<style[^>]*>)([\s\S]*?)(<\/style>)|(<script[^>]*>)([\s\S]*?)(<\/script>)|(<\/?[\w-]+)((?:\s+[\w:@-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?>)|(<!DOCTYPE[^>]*>)/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  const tag = (open: string, attrs: string, close: string) => {
    let s = `<span class="tok-punct">&lt;${open.startsWith("</") ? "/" : ""}</span>`;
    s += `<span class="tok-tag">${escapeHtml(open.replace(/^<\/?/, ""))}</span>`;
    s += attrs.replace(/([\w:@-]+)(\s*=\s*)?("[^"]*"|'[^']*'|[^\s>]+)?/g, (_m, name: string, eq?: string, val?: string) =>
      `<span class="tok-attr">${escapeHtml(name)}</span>${eq ? `<span class="tok-punct">${escapeHtml(eq)}</span>` : ""}${val ? `<span class="tok-string">${escapeHtml(val)}</span>` : ""}`,
    );
    s += `<span class="tok-punct">${escapeHtml(close)}</span>`;
    return s;
  };
  while ((m = re.exec(code))) {
    out += escapeHtml(code.slice(last, m.index));
    if (m[1]) out += span("comment", m[1]);
    else if (m[2]) out += highlightHtml(m[2]) + tokenize(m[3], cssRules) + highlightHtml(m[4]);
    else if (m[5]) out += highlightHtml(m[5]) + tokenize(m[6], jsRules) + highlightHtml(m[7]);
    else if (m[8]) out += tag(m[8], m[9] ?? "", m[10]);
    else if (m[11]) out += span("comment", m[11]);
    last = re.lastIndex;
  }
  out += escapeHtml(code.slice(last));
  return out;
}

const bashRules: Rule[] = [
  [/#[^\n]*/, "comment"],
  [/"(?:\\.|[^"\\])*"|'[^']*'/, "string"],
  [/^\s*[\w.-]+/m, "fn"],
  [/\s--?[\w-]+/, "attr"],
  [/\$\w+/, "builtin"],
];

const jsonRules: Rule[] = [
  [/"(?:\\.|[^"\\])*"(?=\s*:)/, "prop"],
  [/"(?:\\.|[^"\\])*"/, "string"],
  [/\b(?:true|false|null)\b/, "keyword"],
  [/-?\d+(?:\.\d+)?/, "number"],
  [/[{}[\]:,]/, "punct"],
];

const sqlRules: Rule[] = [
  [/--[^\n]*/, "comment"],
  [/'(?:''|[^'])*'/, "string"],
  [/\b(?:SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|JOIN|LEFT|RIGHT|INNER|ON|GROUP|BY|ORDER|LIMIT|AS|AND|OR|NOT|NULL|CREATE|TABLE|PRIMARY|KEY|REFERENCES|COUNT|SUM|AVG|HAVING|DISTINCT)\b/i, "keyword"],
  [/\b\d+\b/, "number"],
];

export function highlight(code: string, language: string): string {
  switch (language) {
    case "html":
      return highlightHtml(code);
    case "css":
      return tokenize(code, cssRules);
    case "javascript":
    case "typescript":
    case "js":
    case "ts":
      return tokenize(code, jsRules);
    case "python":
      return tokenize(code, pyRules);
    case "bash":
      return tokenize(code, bashRules);
    case "json":
      return tokenize(code, jsonRules);
    case "sql":
      return tokenize(code, sqlRules);
    default:
      return escapeHtml(code);
  }
}

export const LANGUAGE_LABEL: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  bash: "Terminal",
  json: "JSON",
  sql: "SQL",
  text: "Matn",
};
