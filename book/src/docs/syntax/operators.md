# Operators

All operators SUS supports are shown in the below table. Higher rows have higher precedence, with array indexing (`[]`), function calls (`()`) and field access `.` having the highest precedence (binding the strongest), and the boolean binary operator `|` having the lowest precedence. 

| Kind           | Operator                           |
| -------------- | ---------------------------------- |
| postscript_op  | `[]`, `()`, `.`                    |
| unary          | `+`, `-`, `*`, `&`, `\|`, `^`, `!` |
| multiplicative | `*`, `/`, `%`                      |
| additive       | `+`, `-`                           |
| shift          | `<<`, `>>`                         |
| modulo         | `mod`                              |
| compare        | `==`, `!=`, `<`, `<=`, `>`, `>=`   |
| and            | `&`                                |
| xor            | `^`                                |
| or             | `\|`                               |
