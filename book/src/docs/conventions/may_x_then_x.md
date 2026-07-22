# `may_x` then `x()` idiom
Many actions have a certain backpressure associated with them. A [FIFO](https://sus-lang.org/std/fifo.html#FIFO) may not have space to `push()` into or a [SlowState](https://sus-lang.org/std/control_flow.html#SlowState) may not have stabilized yet. To indicate if a submodule is "ready" to take an action, we use a `may_*` output. If `may_do_thing` is low, then the parent module is not permitted to execute the corresponding `do_thing()` action. Now, this is just a convention, it is not enforced by the compiler. 

`may_x` and `x()` can be offset from each other by an arbitrary latency (of course, with `may_x` still preceding `x`). For instance, [FIFO](https://sus-lang.org/std/fifo.html#FIFO)'s `may_push` signal is `MAY_PUSH_LATENCY` cycles ahead of the corresponding `push` signal, allowing the user to insert pipeline stages between them. 

```sus
when input_fifo.may_pop & output_fifo.may_push {
    int data = input_fifo.pop()
    reg int data_twice = data + data

    output_fifo.push(data_twice)
}
```

It may seem similar to your typical `ready`/`valid` handshake protocol (like AXIS), as `ready` is provided by the target module, and the source module asserts `valid` to indicate that its data is valid. The stark difference is that in AXI, a "transfer" only happens when both `ready` and `valid` are high, whereas `do_thing()` *may not* be high if `may_do_thing` is low. This is the difference that prevents free flowing pipelines in a protocol like AXI (due to the 0-cycle response time required when `ready` goes low), whereas the `may_x`/`x()` protocol permits it. 
