# Bounded Integers

```sus
type int#(int FROM, int TO)
```

In SUS, integers are *bounded*. They are described with an **inclusive** lower `FROM` bound, and an **exclusive** upper `TO` bound. These bounds are compile-time values that can be positive or negative. Compile-Time integer values themselves are unbounded and can be arbitrarily large. (They are stored as [Big Integers](https://docs.rs/ibig/latest/ibig/) internally).

```sus
int#(FROM: 0, TO: 16) four_bit_int

int#(FROM: 0, TO: pow2#(E: 32)) u32               // unsigned 32-bit int
int#(FROM: 0, TO: pow2#(E: 64)) u64               // unsigned 64-bit int
int#(FROM: -pow2#(E: 31), TO: pow2#(E: 31)) i32   // signed 32-bit int
int#(FROM: -pow2#(E: 63), TO: pow2#(E: 63)) i64   // signed 64-bit int

int#(FROM: 7, TO: 8) seven = 7
int#(FROM: -3, TO: -2) minus_three = -3

// In many cases, integer bounds can be inferred
int five_bit_int = four_bit_int + seven
// infers to int#(FROM: 7, TO: 23)
```

By defining integers as bounded instead of explicitly signed or unsigned at a given bitwidth, we sidestep many of the common pitfalls that plague integer operations in other HDLs, such as unexpected truncation if we used too few bits for the result of an operation, or Verilog's odd automatic coersion of signed values to unsigned if the other operand is unsigned. As an added benefit, these bounds let us perform compile-time boundschecks on any arrays we may want to index, as well as letting us define the interfaces of our modules more precisely. 

After compilation, bounded integers do map to bitvectors, with the mapping to unsigned bitvectors for `FROM >= 0`, and signed bitvectors if `FROM < 0`. The size of these bitvectors is the minimum number of bits required to hold all the values in the range of the integer. For unsigned integers, this is simply `clog2#(V: TO)`. One could argue that for large integers with narrow bounds (such as `int#(FROM: 20, TO: 25)`) a narrower bitwidth could be used, but this would be confusing for anyone viewing such wires under a simulator. 

```sus
gen int INT_TO = 20
sizeof#(T: type int#(FROM: 0, TO: INT_TO)) == clog2#(V: INT_TO)
```

## Operators
Integers support the following operators:
- `+` signed/unsigned addition
- `-` signed/unsigned subtraction
- `*` signed/unsigned multiply
- `/` signed/unsigned divide
- `%` signed/unsigned remainder
- `mod` signed/unsigned modulo
- `<<` arithmetic or logical left shift, depending on signedness
- `>>` arithmetic or logical right shift, depending on signedness
- `unary -` signed/unsigned negation

### Guaranteed optimizations


### What about bitwise operators?
Since there is no natural way to compute the bounds of an `&` or `|` operation on integers, the `int` type doesn't support these. For the most common operations one would want to use these for, IE masking out the lower N bits, or concatenating bits, SUS instead provides:

```sus
module BitwiseIntSplit #(int TO, int LOWER_BITS) :
    int#(FROM: 0, TO) v'0 ->
    int#(FROM: 0, TO: (TO-1) / pow2#(E: LOWER_BITS) + 1) upper'0,
    int#(FROM: 0, TO: pow2#(E: LOWER_BITS)) lower'0
```

```sus
module BitwiseIntConcat #(int UPPER_TO, int LOWER_BITS) :
    int#(FROM: 0, TO: UPPER_TO) upper'0,
    int#(FROM: 0, TO: pow2#(E: LOWER_BITS)) lower'0 ->
    int#(FROM: 0, TO: UPPER_TO * pow2#(E: LOWER_BITS)) v'0
```

```sus
module AlignToPow2 #(int FROM, int TO, int LOWER_BITS) {
    gen int ALIGNED_FROM = FROM - (FROM mod clog2#(V: LOWER_BITS))
    gen int ALIGNED_TO = TO - (TO + 1 mod clog2#(V: LOWER_BITS))
    interface AlignToPow2 :
        int#(FROM, TO) i'0 ->
        int#(FROM: ALIGNED_FROM, TO: ALIGNED_TO) o'0
```



```sus
module IntToBits#(int NUM_BITS) : int #(FROM: -pow2 #(E: NUM_BITS - 1), TO: pow2 #(E: NUM_BITS - 1)) value'0 -> bool[NUM_BITS] bits'0
```

```sus
module UIntToBits #(int NUM_BITS) : int #(FROM: 0, TO: pow2 #(E: NUM_BITS)) value'0 -> bool[NUM_BITS] bits'0
```
```sus
module BitsToInt #(int NUM_BITS) : bool[NUM_BITS] bits'0 -> int #(FROM: -pow2 #(E: NUM_BITS - 1), TO: pow2 #(E: NUM_BITS - 1)) value'0
```
```sus
module BitsToUInt #(int NUM_BITS) : bool[NUM_BITS] bits'0 -> int #(FROM: 0, TO: pow2 #(E: NUM_BITS)) value'0
```

```sus
const bool[NUM_BITS] IntToBitsGen #(int NUM_BITS, int V) {}
```

```sus
const bool[NUM_BITS] UIntToBitsGen #(int NUM_BITS, int V) {}
```

```sus
const int BitsToIntGen #(int NUM_BITS, bool[NUM_BITS] BITS) {}
```

```sus
const int BitsToUIntGen #(int NUM_BITS, bool[NUM_BITS] BITS) {}
```

```sus
module IntToBool : int#(FROM: 0, TO: 2) i'0 -> bool o'0
```

```sus
module BoolToInt : bool i'0 -> int#(FROM: 0, TO: 2) o'0
```
