# Parameter Inference

Module parameters are often inferrable from the types and latencies of the module's ports. Most Parameter inference happens via *exact match*. So for instance, if a type `float[3]` is provided to an input of of type `T`, then `T` infers to `type float[3]`. 

```sus
module IAmInferrable#(T) {
    input T my_input
    //...
}

module Use {
    float[3] x = [0.1, 0.2, 0.3]
    IAmInferrable inf // Infers to T: type float[3]
    inf.my_input = x
}
```

Similarly, values used within the declaration of types can also be inferred. For instance, in the following case, the parameter `WIDTH` can be inferred from the size of the incoming boolean array. 

```sus
module InferMyArraySize#(int WIDTH) {
    input bool[WIDTH] bits
    //...
}

module Use {
    InferMyArraySize inf // Infers to WIDTH: 32
    inf.bits = 32'hDEADBEEF
}
```

## Integer Inference

While other parameters can only be inferred by exact match, integer parameters actually can be inferred more flexibly due to the [integer subtyping relationship](integers.md), with inference candidates providing *minimum* and *maximum* values rather than requiring an *exact match*. 

For example, let's take this `IntegerEquals` module:
```sus
module IntegerEquals #(int FROM, int TO) {
    action IntegerEquals :
        int#(FROM: FROM, TO: TO) a,
        int#(FROM: FROM, TO: TO) b ->
        bool result

    result = a == b
}

module UseIntegerEquals {
    int#(FROM: 3, TO: 9) x
    int#(FROM: -2, TO: 5) y

    bool are_eq = IntegerEquals(x, y)
    // infers to IntegerEquals#(FROM: -2, TO: 9)
}
```

On `IntegerEquals::FROM`, there are two *maximum* constraints: One for `FROM <= 3` for `a`, and one for `FROM <= -2` for `b`. Therefore `FROM` infers to `-2`. Likewise `IntegerEquals::TO` has two *minimum* constraints: `TO >= 9` for `a` and `TO >= 5` for `b`, inferring `TO` to `9`. 

## Latency Inference
Latency Inference is a kind of integer inference. And as with inference of integer bounds, Latency Inference only applies a *maximum* latency constraint from an `output` to an `input`, which translates to a minimum or maximum bound on the latency inferrable parameter. 

See [Latency Inference](latency_counting/latency_inference.md).
