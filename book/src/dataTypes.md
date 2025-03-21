# Data Types

## 1. Primitive Types (Built-in Types)

These are the fundamental types in sus:

1. bool → A single-bit value that can be true (1) or false (0).

1. int → A variable-sized integer (currently implemented as a 32-bit integer).

1. float → A single-precision IEEE 754 32-bit floating-point number.

## 2.Constants

The language defines several built-in constants:

1. true → Represents the boolean value 1.
1. false → Represents the boolean value 0.
1. sizeof #(T) →  Returns the size of the given type, in bits. 

// `sizeof #(T: type bool) = 1`

// `sizeof #(T: type bool[50]) = 50`

// `sizeof #(T: type int[10][10]) = 3200`

1. clog2 #(int V) → //  Typically used to find the size in bits that the address would need to be to address into a memory of size V. 

// Requires V > 0

// `clog2 #(V: 15) = 4`

// `clog2 #(V: 16) = 4`

// `clog2 #(V: 17) = 5`

## 3. Interfaces & Modules
The language includes built-in modules and interfaces to help with hardware design:

### .  LatencyOffset #(T, OFFSET)

![LatencyOffset](/images/latencyOffsetCode.png)

Delays a signal T by OFFSET clock cycles.

Example: A signal entering this module at cycle 0 will exit at cycle OFFSET.

### . CrossDomain #(T)

![CrossDomain](/images/crossDomain.png)

Handles clock domain crossing by defining in_clk and out_clk.

Example: Used when transferring data between different clock frequencies.

### . IntToBits / BitsToInt
![IntToBits](/images/intToBits.png)     

![BitsToInt](/images/bitsToInt.png)

Converts int to bool[32] and vice versa.


## 4. Arrays & Multi-dimensional Types

This language supports arrays, similar to traditional programming languages:

. bool[32] → A bit vector of size 32.

. int[10][10] → A 10×10 array of integers (each int is 32 bits).

Total size: 10 * 10 * 32 = 3200 bits.