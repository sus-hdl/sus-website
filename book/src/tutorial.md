# SUS Language Tutorial: A Safety-First Hardware Description Language

---

## 1. Introduction to SUS
SUS is a modern HDL designed for *safety-first* hardware development. Key features:
- **Explicit latency management**: Automatic register insertion for timing closure.
- **Flow descriptors**: Regex-like patterns to enforce correct module interactions.
- **Bounded integers**: Eliminate overflow bugs through compile-time checks.
- **Template system**: Inspired by Verilog's `#()` syntax but with named parameters.
- **Clock domain rhythms**: Safe cross-clock communication.

### Example: Basic Module
```verilog
module Adder {
  interface Adder : int a, int b -> int sum
  sum = a + b
}
```

## 2. Basic Syntax & Types

### Product Types (Structs)
Bundle multiple signals into a single type:

```rust
struct Pixel {
  int red
  int green
  int blue
}
```
### Example
```rust

module ColorMixer {
  interface ColorMixer : Pixel p1, Pixel p2 -> Pixel out
  out.red   = (p1.red + p2.red) / 2
  out.green = (p1.green + p2.green) / 2
  out.blue  = (p1.blue + p2.blue) / 2
}
```
### Enums

Explicit control over encoding (one-hot, binary):

```rust
enum State #[onehot] {
  Idle
  Processing
  Done
}
```
## 3. Templates & Code Generation

Templates use named parameters for clarity:

```rust
module Memory#(type T, int DEPTH) {
  interface Write : T data, int addr -> {}
  interface Read : int addr -> T data
  // Implementation...
}

// Instantiation with named args
Memory#(T: int[32], DEPTH: 1024) my_mem

```
## 4. Registers: State vs Latency

### State registers

Critical for module behavior.

### Latency registers

Added automatically for timing.
```rust

module Counter {
  interface Counter : bool reset -> int count
  state int value = 0  // State register (initialized)
  reg int buffered_value // Latency register
  
  if reset {
    value = 0
  } else {
    value = value + 1
  }
  buffered_value = value  // Adds 1-cycle latency
}
```
## 5. Safety Features

### Flow Descriptors

Define valid input/output patterns:

```rust

module Unpacker {
  interface Unpacker #[pattern="(X -> /){4}"] : int[4] packed -> int out
  // Implementation...
}
```
### Clock Domain Rhythms

Safe 3:5 clock crossing:
```rust
rhythmGenerator(clk_slow, clk_fast) cdc
cross cdc.left() -> cdc.right()  // Compiler enforces rhythm

```
## 6. Standard Library Components

### FIFO with Explicit Latency

```rust

FIFO#(DEPTH: 32, DATA_TYPE: int) my_fifo
if my_fifo.push_ready {
  my_fifo.push(data_in)  // Conditional binding syntax
}
```
### Multi-Clock Memory
```rust
MultiClockMemory#(
  CLK_A: clk_100MHz,
  CLK_B: clk_200MHz
) shared_mem
```
## 7. Control Flow

### Generative for Loops

Create parallel hardware:
```rust
module VectorAdd {
  interface VectorAdd : int[8] a, int[8] b -> int[8] out
  for int i in 0..8 {
    out[i] = a[i] + b[i]
  }
}
```
### Priority Encoding with first
```rust

module PriorityEncoder {
  interface PriorityEncoder : bool[8] req -> int idx
  chain bool found = false
  for int i in 0..8 {
    if first req[i] in found {
      idx = i
    }
  }
}
```
## 8. Best Practices
Always bind integers:
```rust
int#[0:100] sensor_value  // Compiler rejects values >100

```

. Prefer named template parameters for readability.
. Use cross for multi-clock signals instead of direct assignments.
. Annotate flow descriptors for stateful modules.

