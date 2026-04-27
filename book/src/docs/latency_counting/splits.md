# Splits

Sometimes you're building more complicated hardware structures, and you find yourself in a situation where you've got a repetitive structure that you'd really really want to express as `for` loops over a series of intermediary arrays. Only, some constraint is holding you back. Perhaps you're implementing some type of cascading structure where Latency Counting inadvertently ties your array elements together causing [Net Positive Latency Cycles](resolving_errors.md). 

An array declared as a `split` lets you get around this limitation. Each index in the outermost array becomes a separate wire, and any parameter of these wires not explicitly specified in the declaration can vary freely. Examples of parameters you can vary are:
- Absolute Latency (for `split` wires at multiple points in a pipeline)
- Array sizes
- Integer bounds

## Example
```sus
module AddFloats {
    input float[16] floats
    output float sum

    split float[][5] float_reduction
    // Results in:
    //    float[1] float_reduction_split_0'44
    //    float[2] float_reduction_split_1'33
    //    float[4] float_reduction_split_2'22
    //    float[8] float_reduction_split_3'11
    //    float[16] float_reduction_split_4'0

    float_reduction[4] = input_floats
    sum = float_reduction[0]

    for int I in 0..4 {
        gen int SIZE = pow2#(E: I)
        float[SIZE] lefts = float_reduction[I+1][SIZE:]
        float[SIZE] rights = float_reduction[I+1][:SIZE]
        // We do have to declare sums as a temporary array here to help type inference
        // May fix in future https://github.com/pc2/sus-compiler/issues/160
        float[SIZE] sums
        for int J in 0..SIZE {
            sums[J] = fp32_add(lefts, rights)
        }
        float_reduction[I] = sums
    }
}
```

In the above example, we've implemented a basic floating point TreeAdd. 16 floats are accepted, and a tree of 15 floating point adders from [sus-float](https://github.com/pc2/sus-float) reduces this down to 1 float. We need `split` here because:
- We wish to halve the number of floats in each step. We couldn't declare this as a normal 2D array, because it would need to be a staggered array, which non-split wires don't support. 
- `fp32_add` has a latency of 11 cycles on U280 FPGAs. Since we use the same variable for each pair of sequential layers, this would create a net-positive latency cycle from `float_reduction` to itself. With the split, `float_reduction[0]` is a distinct wire from `float_reduction[1]`, which is distinct from `float_reduction[2]`, etc. Hence, allowing them to be at different absolute latencies. 

## Drawbacks of `split`
- You cannot use a runtime index into the "split" array dimension. 
- The parameters of each wire in the split *must* be [Inferred](../inference.md). This may lead to funky constructs. 
- Ports cannot be declared `split` (Yet... https://github.com/pc2/sus-compiler/issues/196)
- `split` generates individual wires. This means in the waveform viewer it's slightly harder to discern. 
