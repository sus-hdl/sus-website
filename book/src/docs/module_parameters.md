# Module Parameters

Modules, types and compile-time functions can have compile-time parameters. These can be *value* parameters, like `0`, `true`, `"hello"`, etc, or *type* parameters. 

An example of such a declaration:
```sus
module FIFO#(T, int DEPTH, int MAY_PUSH_LATENCY) {
    // ...
}
```

The parameters are given within the `#()` compile-time parameter brackets. 
Type parameters are specified as simply their name, whereas Value parameters are their type, followed by their name. Note that because they are implicitly [compile time](compile_time_code/compile_time_code.md), they do not need to be marked with `gen`. 

To instantiate a module, type or compile-time function, apply the `#()` compile time parameter brackets to the module name:
```sus
FIFO#(T: type float, DEPTH: 256) my_fifo
// MAY_PUSH_LATENCY is inferred by Latency Counting
```

Type parameters must be passed as `<type parameter name>: type <type expression>`. The `type` keyword is required for the parser to understand what comes after it as a type. Value parameters are passed simply as `<value parameter name>: <value>`. 

Parameters can also be passed with a shorthand of just the parameter name, if there is a local generative variable of the same name:
```sus
module Use_FIFO#(T) {
    gen int DEPTH = 256
    FIFO#(T, DEPTH) my_fifo
}
```

Parameters may also be omitted, and in that case they are [inferred](inference.md), either through regular type-based inference, or from [Latency Inference](latency_counting/latency_inference.md) if possible. 
