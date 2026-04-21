# Resolving Latency Counting Errors
When working with the Latency Counting system, errors may crop up that may at first seem rather cryptic. Usually they stem from Latency Counting's rather stringent [Deterministic Resolution](latency_counting.md#deterministic-resolution) requirement, and are therefore fairly trivial to resolve. Still, this article covers what causes each Latency Counting Error and provides strategies to resolve it. 

## Net Positive Latency Cycle
This is perhaps the most straight-forward of them all. You've created a loop in the pipeline, which makes it impossible to assign absolute latencies to your wires without violating the latency requirement of one of your submodules, or ignoring one of your `reg` requirements. 

### Example 1
```sus
module Accumulator {
    input float value
    output state float total = 0.0

    // Latency of +11
    total = fp32_add(total, value)
}
```

In this example, we wish to accumulate floating point values as they come in, but we forgot to account for the 11 cycles of latency [fp32_add](https://github.com/pc2/sus-float) takes. The compiler rightfully complains that there isn't enough time to compute the sum before it is required for the next addition. 

### Resolution
Some operations have a fundamental latency that cannot be reduced without degrading our clock frequency. In this case we can either use a more appropriate primitive [fp32_acc](https://github.com/pc2/sus-float), or we must use multiple accumulators multiplexed over the input stream using [ParallelWhile](/std/control_flow.html#ParallelWhile)

### Example 2
```sus
module SetReset {
    input bool set_true
    input bool set_false

    output state bool x = false

    when !x & set_true {
        reg x = true // <<<=== Incorrectly added `reg` here. 
    }
    when x & set_false {
        x = false
    }
}
```
In this example, there is a subtle dependency between reading `x` in the condition, and setting `x` to `true` with a delay of `1` register. This dependency creates a net positive latency cycle of `+1`. 

### Resolution
In this case, of course we should remove the register, since a `state` variable already comes with a register. This example was meant to illustrate the subtle dependencies that can arise from the conditions on our `when` blocks. 

## Conflicting Specified Latencies
Quite similar to the [Net Positive Latency Cycle](#net-positive-latency-cycle), but in this case the difference in the Absolute Latencies you have explicitly assigned to two wires is smaller than the minimum latency the path between them actually takes. 

### Example
```sus

```

## Not Strongly Connected Ports



## Indeterminable Port Latency
