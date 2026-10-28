// Registers SUS syntax highlighting with highlight.js and runs it on all
// code.language-sus blocks on doc pages.
// Depends on highlight.js being loaded first.
hljs.registerLanguage("sus", function(hljs) {
  return {
    name: "SUS",
    keywords: {
      interface_keyword:
        "module struct const interface input output action query " +
        "trigger domain clock extern __builtin__",
      keyword:
        "gen if when else while for in reg state initial assume split type",
      literal: "false true",
      type: "int bool float double string T T1 T2 T3 T4 ElemT",
      operator: "mod",
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE
    ]
  };
});

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('code.language-sus').forEach(function(block) {
    hljs.highlightBlock(block);
  });
});
