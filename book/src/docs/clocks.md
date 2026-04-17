# Clocks

Similar to [Domains](latency_counting/domains.md), the `clock` statement affects all **ports** declared after it. If no clock is specified then a default clock named `clk` is used. When a clock is declared, it implicitly also declares a `domain` of the same name. When wires are connected, they are forced to be part of the same clock domain. This is how clock information travels from the ports to the internal wires and registers. 

```sus
module MultiClock {
    clock clka
    input int value_a   // is on clka

    clock clkb
    output int value_b  // is on clkb

    int another_wire = value_a  // Is on clka due to being connected to value_a

    // The following would result in an error, due to connecting clock domains `clka` and `clkb`
    // value_b = another_wire
}
```

## Clock Domain Crossings
**At the time of writing, no explicit clock domain crossing primitives are provided in the SUS Standard Library. You can build them yourself using `CrossDomain`, or by wrapping primitives provided by your FPGA Vendor.**

## Output clocks
It is possible for a module to declare one or more `output clock`s. These are clocks which the module itself must generate. The SUS standard library has no such modules, so it only sees use if you wish to wrap PLLs with an ´extern module´. 

```sus
extern module MyPLL {
    clock in_clk

    output clock out_clk
}
```
