# Introduction to the SUS Hardware Design Language

SUS (Synchronous Ultra-Structured) is a new language for hardware design (RTL) similar to Verilog and VHDL, but it focuses on simplifying the development of high-performance FPGA accelerators. Unlike other hardware description languages, SUS does not attempt to hide complexity; instead, it provides a clearer way to manage it.


# What is the main purpose of SUS ?
The main purpose of SUS is that, as the programmer, you are in the driver's seat. This means you're responsible for designing the hardware and ensuring every component is built to your specifications. While this places the responsibility on you, it also gives you immense power to ensure the hardware functions and is built exactly as you intend.

# Direct Translation and Feedback for Hardware Design
SUS provides tools that help manage hardware complexity, allowing you to design any hardware while making it easier to handle intrinsic challenges. It acts as a direct translation to the netlist, which you can input into synthesis tools like Vivado or Quartus for feedback. This feedback highlights areas to improve your hardware, such as routing conflicts, and helps you address issues. SUS also offers immediate in-editor feedback, notifying you of errors like bad feedback loops, and guides you in improving your code to ensure it works correctly.

```rust
module bad cycle : int a -> int r{
state int state_reg
initial state_reg = 0
r = state_reg
reg state_reg = state_reg + a
}
```

<p style="text-align: right;">This register is part of a net-positive latency cycle of +1
state_reg'1
-> state_reg'2 (+1)
Which conflicts with the starting latency</p>

# Key Features

1. Generative Variables and Types
SUS allows flexible use of generative variables and types without complicated issues, with type checking occurring after generation.

2. Support for Parallel Execution (Pipelining)
SUS includes Latency Counting to make it easier to insert pipeline registers without affecting other language features.

3. Signal Separation Using Interfaces
The use of interfaces in SUS ensures that different domains are separated, preventing unrelated signal interference and facilitating handling of cross-domain timing issues.

# SUS through Examples
The SUS language enables a direct translation to a netlist, which is crucial for hardware synthesis. To illustrate this, consider simple examples.

# XOR gate
![XOR gate](/images/xorGates.drawio.png)
```rust
module xor {
interface xor : bool x1, bool x2 -> bool y
bool wl = !xl
bool w2 = !x2
bool w3 = x1 & w2
bool W4 = x2 & W1
y = W3 | W4
}
module use xor {
bool b = xor(true, false)
}
```

In the SUS language, this module would have two inputs, X1 and X2, and an output Y. In the middle, we may have several intermediary operators and variables that perform necessary computations, ultimately assigning the result to the output Y.

Below the module definition, you'll see how such a module can be instantiated. The instantiation follows a function-call-like syntax, which, when synthesized, translates into corresponding hardware gates in the netlist."

# Conditions
![Conditions](/images/muxExample.drawio.png)
```rust
module Abs {
interface Abs : int a > int o
if a < 0{
o = -a
} else {
o = a
}
}
```
In hardware design, it's important to understand that all hardware is always running on a chip; you can't just conditionally enable or disable hardware. The only thing that changes with conditions is whether certain assignments are made. For example, in the given scenario, inputs are checked to see if they are less than zero. If they are, a negation block is used, otherwise, the value is used as-is. However, any additional hardware in the middle will still execute regardless of the conditions, as it's always running at runtime. These are essentially runtime if statements.


# Multiple Interfaces

![Multiple Interfaces](/images/multipleInterfaces.drawio.png)
```rust
module Iterator {
// action
interface start : bool start, int up_to
// trigger
interface iter : > bool valid, state int value
state int current
_limit
start
valid = value != current
_limit
if start {
current_limit = up_to
value = 0
} else if valid {
value = value + 1}}

```
A module is presented here that implements a for-loop as a runtime iterator. This module has two interfaces: a 'start' interface, which initiates the iterator. A value is provided to define the range for iteration. Once the iteration begins, the module also features a 'trigger' interface, which acts like a callback within the hardware. This interface informs the hardware of the current values being iterated through. The implementation below demonstrates the module, including a condition and other necessary components

## How to use Multiple Interfaces?

```rust
Using Multiple Interfaces
module use_Iterator {
interface start_iteration : bool do_start 
input int[10] myArr 
output int outval

Iterator arrayStream

// if do_start {arrayStream.start (10)}
arrayStream.start(do_start, 10)

// if arrayIter.iter() : int value {...}
bool iter_valid, int value = arrayStream.iter()
if iter valid {
outVal = myArr [value]
}}
```
To use it, you would wrap it in an array of values, set up output values, and instantiate an iterator. You can then start iterating from a specific point and use a callback function. 

