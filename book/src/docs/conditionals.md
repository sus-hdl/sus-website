# Conditionals
SUS includes two kinds of conditionals: Compiletime conditionals, denoted by `if`, and Runtime conditionals, denoted by `when`. 

Compiletime (`if`) conditionals are executed at instantiation time. The SUS interpreter takes either branch depending on the value of the condition. (See [How SUS is Compiled](compiler/how_sus_is_compiled.md) and [Compile-Time Code](compile_time_code/compile_time_code.md))
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

## Boolean Operators

The boolean "and" `&`, "or" `|`, and "xor" `^` operators are used to chain multiple comparisons. The "not" `!` operator inverts. SUS does not does not support the "double" boolean operators (`&&`, `||`) that are common in SystemVerilog and other languages[^1]. As explained in [Operator Precedence](syntax/operators.md), the boolean operators have lower precedence than the comparison operators, as shown in the following example below. This is a slight difference to other languages. 

[^1] The reason SystemVerilog, C and others provide this operator is to do an implicit conversion of the boolean vector type to a single boolean. In SUS this kind of reduction is better expressed with the unary `|` and `&` operators. See [Tensor Reductions](tensors/reductions.md). 

```sus
module Between {
  input int#(FROM: 0, TO: 256) min
  input int#(FROM: 0, TO: 256) max
  input int#(FROM: 0, TO: 256) v
  output bool is_between
  
  when min <= x & x >= max {
    is_between = true
  } else {
    is_between = false
  }
}
```
