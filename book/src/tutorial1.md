# Introduction to SUS Language

## Overview
SUS (Safety-First Hardware Language) is a high-level hardware description language designed for safe and efficient hardware design. It introduces innovative concepts such as **Flow Descriptors**, **Latency Counting**, and **enhanced type safety** to prevent common hardware design errors while maintaining flexibility and efficiency.

## 1. Basic Data Types in SUS

### Product Types (Structs)
SUS supports **product types**, which group multiple data fields together:
```Verilog
struct MemoryBlock {
    int addr;
    int data;
}
```

### Sum Types (Union & Option Types)
SUS does not natively support general sum types at the language level due to implementation complexities in hardware. However, an exception is made for the **Maybe (Option) type**, which fits well within the flow descriptors system:
```Verilog
union Result {
    int value;
    bool error;
}
```

### Enums
Enums allow precise representation and optimization:
```Verilog
enum State {
    IDLE = 0b01;
    BUSY = 0b10;
}
```

## 2. Writing and Using Modules

### Defining a Module
A module in SUS represents a hardware component with defined inputs and outputs:
```Verilog
module Adder {
    interface Adder : int a, int b -> int sum;
    sum = a + b;
}
```

### Using a Module
Modules can be instantiated and used within another module:
```Verilog
module TopModule {
    Adder add1;
    int result = add1(3, 5);
}
```

## 3. Control Flow in SUS

### If Statements
#### Compile-time Conditional
```Verilog
gen bool ENABLE_LOGIC = true;
if ENABLE_LOGIC {
    int x = 10;
}
```

#### Runtime Conditional
```Verilog
module Comparator {
    interface Comparator : int a, int b -> bool result;
    result = a > b;
}
```

### Loops
Loops are used for compile-time repetition (no dynamic loops in hardware):
```Verilog
for int i in 0..10 {
    int arr[i] = i * 2;
}
```

## 4. Flow Descriptors
Flow Descriptors ensure correct data flow through modules:
```Verilog
interface FIFO {
    bool pop() -> bool valid, int data;
}
```

**Usage:**
```Verilog
if myFifo.pop() : int val {
    // Process data
}
```

## 5. Latency Counting
Latency is crucial for pipelined designs:
```Verilog
reg int mul0 = a * b;
reg int result = mul0 + c;
```
This ensures that the second operation only starts when the first is complete.

## 6. Clock Domain Crossing
SUS provides mechanisms for safe clock domain crossing using **rhythms**:
```Verilog
rhythm clk_fast, clk_slow;
```

## Conclusion
SUS Language provides powerful abstractions for **safe and optimized hardware design**. By enforcing safety rules and providing flexible module interfaces, it helps designers create efficient and error-free circuits.

---


