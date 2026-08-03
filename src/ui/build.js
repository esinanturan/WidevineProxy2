const fs = require("fs");
const path = require("path");
const { minify } = require("terser");

const SRC = __dirname;
const read = f => fs.readFileSync(path.join(SRC, f), "utf8");

function stripEsm(code) {
  return code
    .replace(/^\s*import\s+[^\n]*?;?\s*$/gm, "")
    .replace(/^\s*export\s+(?=class|function|const|let|var)/gm, "");
}

const header = `(function (__g) {
var module, exports, define;
var process = { versions: {} };
`;

const footer = `
})(typeof globalThis !== "undefined" ? globalThis
 : typeof self !== "undefined" ? self
 : typeof window !== "undefined" ? window : this);
`;

const BUNDLES = [
  { name: "popup", files: ["icons.js", "keys-render.js", "popup.js"] },
  { name: "history", files: ["icons.js", "keys-render.js", "history.js"] },
];

(async () => {
  for (const { name, files } of BUNDLES) {
    const bundle = [
      header,
      ...files.flatMap(f => [`/* ===== ${f} ===== */`, stripEsm(read(f))]),
      footer,
    ].join("\n");

    const result = await minify(bundle, {
      compress: { passes: 2 },
      mangle: true,
      format: { comments: false },
    });
    if (result.error) throw result.error;
    fs.writeFileSync(path.join(SRC, `${name}.min.js`), result.code);
    console.log("minified bytes:", result.code.length, `-> ${name}.min.js`);
  }
})();
