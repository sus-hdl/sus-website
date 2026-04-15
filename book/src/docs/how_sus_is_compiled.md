# How SUS code is compiled

![TODO Architecture of the SUS Compiler](philosophy/images/susArchitecture.png)

There are three major "stages" in the SUS compiler:

## Abstract Typechecking
Through the first stage (The *abstract* typing stage), all declared modules go exactly once. During this stage, global names are resolved, module ports and struct fields are resolved, it is checked that rumtime values aren't passed to compiletime contexts, clock domains are assigned, and light typechecking (integer is passed to integer, but bounds aren't checked yet). Its main task is to catch as many errors as possible before instantiation. 

```sus
module ToOneHot#(int SIZE) {
  input int#(FROM: 0, TO: SIZE) idx
  output bool[SIZE] bits
  
  for int i in 0..5 {
    bits[i] = idx == i
  }
}
```

## Execution
After the `ToOneHot` has been abstract-typechecked, it may be instantiated with some concrete arguments. In this case we chose `ToOneHot#(SIZE: 5)`. The SUS compiler acts much like a simple imperative interpreter. Using loops and `if` statements as control flow, altering compile-time variables as written. When `when` statements, or other runtime statements like assigns and submodule instantiations are encountered, they are converted to wires/submodules to be included in the final design. Importantly, the types of these wires & submodules must not be fully known at execution time. Full resolution of these types and the instantiation of submodules only happens during Concrete Typechecking. 

After executing all the compile-time code, we are left with a module that effectively looks like:
```sus
module ToOneHot_SIZE_5 {
  input int#(FROM: 0, TO: 5) idx
  output bool[5] bits
  
  bits[0] = idx == 0
  bits[1] = idx == 1
  bits[2] = idx == 2
  bits[3] = idx == 3
  bits[4] = idx == 4
}
```

![to_one_hot.png](to_one_hot.png)

During execution, errors may crop up, such as array index out of bounds errors, divide by zero, etc. These immediately halt execution. 

**Note: Since you can execute arbitrary code at compiletime, compilation times may be arbitrarily long or even hang if an infinite loop is created.**

## Concrete Typechecking
If after execution no errors came up, the instantiated module proceeds to the final stage. Here, any concrete values that cannot be generically checked from the abstract representation are checked or inferred. The bounds of integers, array sizes, and parameters of submodules are checked or inferred. When all of a submodule's parameters become known, it is instantiated recursively. 

Let's say we've got another module:
```sus
module OneHotPlusOne {
  input int#(FROM: 0, TO: 4) idx
  output bool[] bits
  
  int idx_plus_one = idx + 1
  
  ToOneHot toh
  
  toh.idx = idx_plus_one
  bits = toh.bits
}
```

The bounds of `idx_plus_one` are inferred: 
```sus
module OneHotPlusOne {
  input int#(FROM: 0, TO: 4) idx
  output bool[] bits
  
  int#(FROM: 1, TO: 5) idx_plus_one = idx + 1
  
  ToOneHot toh
  
  toh.idx = idx_plus_one
  bits = toh.bits
}
```

From this, the `SIZE` parameter of `toh` is inferred:
```sus
module OneHotPlusOne {
  input int#(FROM: 0, TO: 4) idx
  output bool[] bits
  
  int#(FROM: 1, TO: 5) idx_plus_one = idx + 1    // *
  
  ToOneHot#(SIZE: 5) toh
  
  toh.idx = idx_plus_one
  bits = toh.bits
}
```

`ToOneHot#(SIZE: 5)` is instantiated as `ToOneHot_SIZE_5`, and since its output port `output bool[5] bits` has a known size, we infer that our `bits` output should also have size 5:
```sus
module OneHotPlusOne {
  input int#(FROM: 0, TO: 4) idx
  output bool[5] bits                            // *
  
  int#(FROM: 1, TO: 5) idx_plus_one = idx + 1
  
  ToOneHot_SIZE_5 toh                            // *
  
  toh.idx = idx_plus_one
  bits = toh.bits
}
```

Finally, although we didn't cover it in this section, [Latency Counting](latency_counting.md) occurs here too.
