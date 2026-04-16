# Conditionals
SUS includes two kinds of conditionals: Compiletime conditionals, denoted by `if`, and Runtime conditionals, denoted by `when`. 

Compiletime (`if`) conditionals are executed at instantiation time. The SUS interpreter takes either branch depending on the value of the condition. (See [How SUS is Compiled](how_sus_is_compiled.md) and [Control Flow](control_flow.md))
Runtime (`when`) conditionals synthesize to "guards" on any runtime assignments within them.

If Example:
```sus
module CompileTime {
  gen int SIZE = 20
  
  gen int ALIGN
  if SIZE <= 16 {
    ALIGN = 2
  } else if SIZE <= 32 { // if statements can be chained
    ALIGN = 4
  } else {
    ALIGN = 8
  }
  
  // Here ALIGN=4 ...
}
```

When Example:
```sus
module Abs {
  input int#(FROM: -20, TO: 21) x
  output int y
  
  when x < 0 {
    y = -x
  } else {
    y = x
  }
}
```
