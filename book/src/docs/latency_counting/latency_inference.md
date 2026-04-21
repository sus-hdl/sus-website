# Latency Inference

TODOBesides computing the absolute latencies of all wires in a module based on the absolute latencies of all of its submodules ("Latency Counting"), it is also possible to infer the parameters of your submodules based on the latencies present on their ports, which we term "Latency Inference". For this, one or more parameters of your *Latency Sensitive* module must be inferrable. 

Latency Inference starts at the declaration of your module. You must attach absolute latency annotations to at least an input and an output port of your module, and the difference between those absolute latencies must be linear in exactly one integer parameter of this module. Since this is a bit of a mouthful, let's look at an example:

```sus
module FIFO #(T, int DEPTH, int MAY_PUSH_LATENCY) {
    domain push_dom
        output bool may_push'-MAY_PUSH_LATENCY
        action push'0 : T push_data'0
    domain pop_dom
        output bool may_pop'0
        action pop'0 : -> T pop_data'1
}
```

The `MAY_PUSH_LATENCY` parameter of FIFO is inferrable. 

TODO
