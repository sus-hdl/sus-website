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
Integers support the following [operators](syntax/operators.md):
- `+` signed/unsigned addition
- `-` signed/unsigned subtraction
- `*` signed/unsigned multiply
- `/` signed/unsigned divide
- `%` signed/unsigned remainder
- `mod` signed/unsigned modulo
- `<<` arithmetic or logical left shift, depending on signedness
- `>>` arithmetic or logical right shift, depending on signedness
- `unary -` signed/unsigned negation

The `mod` operator is recommended for [integer modulos](https://en.wikipedia.org/wiki/Modular_arithmetic), since it has a more widely useful behavior over negative integers compared to `%`. Also, to support the common pattern of implicit 2s complement modular overflow, `mod` has a prescedence below the common arithmetic operators:

```sus
gen int SIZE = 200
state int#(FROM: 0, TO: 200) cur_index

input bool up

when up {
    // Note, no parentheses are needed
    cur_index = cur_index + 1 mod SIZE
} else {
    cur_index = cur_index - 1 mod SIZE
}
```

### Guaranteed optimizations

The SUS code generator will take care to convert `mod` operators to more efficient bit masking or conditional assigns, if powers of two are involved, or if modulo-ing over small differences. 

#### For each `v`, `v mod N` optimizations
- `int#(FROM: 0, TO: N+1) v`: optimizes to conditional assign to 0
- `int#(FROM: -1, TO: N) v`: optimizes to conditional assign to `N`
- `int#(FROM: 0, TO: 2*N) v`: optimizes to conditional assign to `v - N`
- `int#(FROM: -N, TO: N) v`: optimizes to conditional assign to `v + N`
- `any v` with `N` a positive power of 2: optimizes to a bitmask

### What about bitwise operators?
Since there is no natural way to compute the bounds of an `&` or `|` operation on integers, the `int` type doesn't support these. For the most common operations one would want to use these for, IE masking out the lower N bits, or concatenating bits, SUS instead provides:

- [BitwiseIntSplit](https://sus-lang.org/std/util.html#BitwiseIntSplit)
- [BitwiseIntConcat](https://sus-lang.org/std/util.html#BitwiseIntConcat)
- [AlignToPow2](https://sus-lang.org/std/util.html#AlignToPow2)

However, if you *do* need to apply boolean operators to your integers not covered by the above, or 
- [IntToBool](https://sus-lang.org/std/util.html#IntToBool)
- [BoolToInt](https://sus-lang.org/std/util.html#BoolToInt)
- [IntToBits](https://sus-lang.org/std/core.html#IntToBits)
- [UIntToBits](https://sus-lang.org/std/core.html#UIntToBits)
- [BitsToInt](https://sus-lang.org/std/core.html#BitsToInt)
- [BitsToUInt](https://sus-lang.org/std/core.html#BitsToUInt)
It is recommended to use these instead of [ToBits](https://sus-lang.org/std/util.html#ToBits) and [FromBits](https://sus-lang.org/std/util.html#FromBits), as they display the intent more clearly. 

The compile-time equivalents of those:
[IntToBitsGen](https://sus-lang.org/std/core.html#IntToBitsGen)
[UIntToBitsGen](https://sus-lang.org/std/core.html#UIntToBitsGen)
[BitsToIntGen](https://sus-lang.org/std/core.html#BitsToIntGen)
[BitsToUIntGen](https://sus-lang.org/std/core.html#BitsToUIntGen)

### Integer Narrowing
In most cases, the recommended way to *narrow* the bounds of an integer is to use `mod` with a power of 2. This mimics the rollover behavior seen in Verilog or VHDL. However, if you need narrowing to ranges that are not powers of 2, you can use [IntNarrow](https://sus-lang.org/std/core.html#IntNarrow) as a fallback. 

There are [plans for introducing flow-sensitive integer narrowing](https://github.com/pc2/sus-compiler/issues/102), which should alleviate most of the circumstances where `IntNarrow` is needed, but at this time this isn't implementated yet. 
