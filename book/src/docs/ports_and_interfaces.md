# Ports

Ports in SUS are very similar to what you'd find in SystemVerilog, VHDL, and the like. There's the continuous `input` and `output` ports, and `action`s and `trigger`s. 

## `input` and `output`
The `input` and `output` keywords are used to declare *continuous* ports. They are the most basic kind of port, with the same semantics as their SystemVerilog equivalents. We call them *continuous* because, in contrast to actions and triggers, they are meant to carry a valid value every cycle. They are declared with their respective keywords modifying a non-generative wire declaration. To access them from a parent module, read and write to them as if they were struct fields. 

```sus
/// Declare the input and output ports
module BoolToInt {
    input bool the_bool
    output int as_int

    when the_bool {
        as_int = 1
    } else {
        as_int = 0
    }
}
/// Usage
module UseBoolToInt {
    BoolToInt instance

    instance.the_bool = true
    int result = instance.as_int
}
```

Where possible, it is recommended to try to use actions and triggers instead. Normally you wouldn't see them very often, except for in [External Modules](extern_modules.md) which may not be readily expressible using these more high-level constructs. 

## Actions and Triggers

More information on these is found in [Actions, Triggers and Conditional Bindings](actions.md)