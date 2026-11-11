# Tensors

## Array Literals

An array can be written out element by element: `[a, b, c]` is an array of three elements, which may be runtime wires or compile-time values. Literals nest for multidimensional arrays: `[[1, 2], [3, 4]]`.

A literal may end with a *default element*, written `v ...`, which fills every remaining slot of the array. The size of such a literal is not fixed by the literal itself. It is inferred from where the literal is used: the declared type of the target, the slice it is written to, or the port it is connected to. The list of explicit elements before the default may be empty, and the default must be separated from the explicit elements by a comma.

```sus
output bool[8] zeros = [false ...]      // all eight bits false
output int[4] ints = [1, 2, 0 ...]      // [1, 2, 0, 0]
gen int[2][2] M = [[1, 2], [3 ...]]     // [[1, 2], [3, 3]]

bool[64] data
data[..32] = low_half
data[32..] = [false ...]                // the slice width gives the size

input bool v
output bool[3] vs = [v ...]             // every element is driven by v

state bool[8] flags
initial flags = [false ...]
```

It is an error when the explicit elements do not fit the target (`int[2] x = [1, 2, 3, 0 ...]`), and when the size of a literal with a default cannot be inferred from its context.

## Slicing Syntax

Arrays are indexed with `arr[i]`. The index can be a compile-time value, or a runtime [bounded integer](../integers.md) whose bounds the compiler checks against the size of the array.

A *slice* selects a contiguous part of an array and is itself an array of the same element type. The slice operators are:

| Syntax                            | Selects                                                        | Result size |
| --------------------------------- | -------------------------------------------------------------- | ----------- |
| `arr[a..b]`                       | elements `a` up to, but excluding, `b`                         | `b - a`     |
| `arr[a..=b]`                      | elements `a` up to and including `b`                           | `b - a + 1` |
| `arr[a..]`, `arr[..b]`, `arr[..]` | from `a` to the end, from the start up to `b`, or everything   |             |
| `arr[a +.. w]`                    | `w` elements starting at `a`                                   | `w`         |
| `arr[a -.. w]`                    | `w` elements ending at, and including, `a`                     | `w`         |
| `arr[a *.. w]`                    | `w` elements starting at `a * w`: chunk number `a` of size `w` | `w`         |

The bounds of `..` and `..=` slices must be compile-time values. The *part-selects* `+..`, `-..` and `*..` take a compile-time width `w`, but their position `a` may be a runtime integer. The compiler uses the bounds of `a` to check that every possible selection stays inside the array.

```sus
bool[64] data
bool[8] third_byte = data[16..24]
bool[8] also_third_byte = data[16 +.. 8]

input int#(0..8) byte_idx
bool[8] selected_byte = data[byte_idx *.. 8]   // byte byte_idx, same as data[byte_idx * 8 +.. 8]

// Slices can be written to as well
data[..32] = low_half
data[32..] = high_half

// Slicing applies per dimension
bool[20][30] matrix
bool[2][3] block = matrix[3 +.. 3][4..6]
```

The same slicing syntax is also used for [integer bounds](../integers.md#shorthand) and [`for` loop ranges](../compile_time_code/compile_time_code.md#for).

## Multidimensional Slicing

