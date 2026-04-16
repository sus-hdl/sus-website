// Register SUS syntax highlighting with highlight.js.
// This runs after book.js has already called hljs.highlightBlock() on all
// code blocks. That's fine: hljs reads element.textContent (not innerHTML),
// so re-running highlightBlock on a block that was already processed (but
// left unstyled because 'sus' was unknown) works correctly.
hljs.registerLanguage("sus", function(hljs) {
  return {
    name: "SUS",
    keywords: {
      keyword:
        "module struct const interface input output action query " +
        "trigger domain clock extern __builtin__",
      built_in:
        "gen if when else while for in reg state initial assume split mod type",
      type: "int bool float double string"
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_NUMBER_MODE
    ]
  };
});

document.querySelectorAll("code.language-sus").forEach(function(block) {
  hljs.highlightBlock(block);
});
