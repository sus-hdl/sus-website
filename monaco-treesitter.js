

module: {
  rules: [
    // This is required for web-tree-sitter
    {
      test: /\.wasm$/,
      loader: "file-loader",
      type: "javascript/auto" // Disable Webpack's built-in WASM loader
    },
    // These two are required for monaco-editor-webpack-plugin
    // See https://github.com/microsoft/monaco-editor-webpack-plugin
    {
      test: /\.css$/,
      use: ["style-loader", "css-loader"]
    },
    {
      test: /\.ttf$/,
      use: ["file-loader"]
    }
  ]
}

plugins: [
  new MonacoWebpackPlugin()
]

node: {
  fs: "empty" // See https://github.com/tree-sitter/tree-sitter/issues/466
}


import { Theme, Language, MonacoTreeSitter } from "https://cdn.jsdelivr.net/npm/monaco-tree-sitter/+esm";
import Parser from "https://cdn.jsdelivr.net/npm/web-tree-sitter/+esm";
import * as monaco from "https://cdn.jsdelivr.net/npm/monaco-editor/+esm";

// JSON und WASM laden
async function loadJSON(url) {
  const response = await fetch(url);
  return response.json();
}

async function loadWASM(url) {
  const response = await fetch(url);
  const bytes = await response.arrayBuffer();
  return WebAssembly.compile(bytes);
}

// Lade Highlights & Theme
const highlights = await loadJSON("./highlights.json");
const SUSTheme = await loadJSON("./sus-theme.json");

// Lade und initialisiere Tree-Sitter
await Parser.init();
const susWasm = await loadWASM("./tree-sitter-sus.wasm");




monaco.languages.register({ id: 'sus' });

monaco.editor.defineTheme("SUS Theme", SUSTheme);


Theme.load(SUSTheme);

(async () => {
  await Parser.init().then(/* initialized */);
})();




const susLanguage = new Language(highlights);


await susLanguage.init(susWasm, Parser);


  // Highlighting aktivieren
  new MonacoTreeSitter(Monaco, editor, susLanguage);
