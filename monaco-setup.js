require(['vs/editor/editor.main'], function () {
    
    monaco.languages.register({ id: 'sus' });

    monaco.languages.setMonarchTokensProvider('sus', {
        keywords: [
           'gen', 'if', 'when', 'else', 'while', 'for', 'in', 'input', 'output',
          'module', 'struct', 'type', 'const', 'interface', 'action', 'query', 'trigger', 'domain', 'extern', '__builtin__',
          'reg', 'state', 'initial', 'assume'
        ],
        typeKeywords: [
            'bool', 'double', 'byte', 'int', 'short', 'char', 'void', 'long', 'float','T'
          ],
        operators: ['=', '>', '<', '>=', '<=', '==', '!=', '+', '-', '*', '/', '%', '^', '|', '&'],
        symbols: /[=><!~?:&|+\-*/^%]+/,
        tokenizer: {
          root: [
            [/[a-z_$][\w$]*/, { cases: { '@typeKeywords': 'keyword',
                '@keywords': 'keyword',
                '@default': 'identifier' } }],
            [/[A-Z][\w\$]*/, 'type.identifier' ],

            // Constants (numbers)
            [/\b\d[\d_]*(?:\.*[\d_]*)\b/, 'number'],
            
            // Single-line comments
            [/\/\/[^\n]*\n/, 'comment'],
            
            // Block comments
            [/\/\*/, 'comment', '@comment'],
            
            // Parentheses, brackets, and braces
            [/[{}()\[\]]/, '@brackets'],
            
            // Operators
            [/[=><!~?:&|+\-*/^%]+/, 'operator'],
            
            // Identifiers
            [/[a-zA-Z_$][\w$]*/, {
              cases: {
                '@keywords': 'keyword',
                '@default': 'identifier'
              }
            }],
            
            // Expressions
            [/\b\d[\d_]*(?:\.*[\d_]*)\b/, 'number']
          ],
      
          // Comment state
          comment: [
            [/[^*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[/*]/, 'comment']
          ]
        }
      });


});