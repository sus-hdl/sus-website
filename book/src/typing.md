# Typing 

# 1. Abstract Types

int []

- Typecheck at Flattening time

- Only type names and structure

- LSP Into & suggestions

- trait bounds

# 1.  Concrete Types

int [256]

- Typecheck at Instantiation time

- Type names and concrete values

- Actually defines wires


![Typing](/images/typings.png)   

In Sus, variables never appear within types, which affects how dependent types work. You can see this in the compiler by hovering over a value—this reveals its abstract type.

For example, in a recursive module like three_add, initially instantiated with size 255, the compiler splits it repeatedly (e.g., 255 → 127 → 63, etc.), showing the concrete types of each instantiation.