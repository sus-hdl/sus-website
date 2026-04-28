# Domains

Latency Domains are a way of splitting up temporally unrelated wires. Take for instance the [FIFO](https://sus-lang.org/std/memory.html#FIFO):
```sus
module FIFO #(T, int DEPTH, int MAY_PUSH_LATENCY) {
   domain push_dom
    output bool may_push'-MAY_PUSH_LATENCY
    action push'0 : T push_data'0

   domain pop_dom
    output bool may_pop'0
    action pop'0 : -> T pop_data'1

   domain reset
    action rst
}
```

Similar to [Clocks](../clocks.md), the `domain` statement applies to all **ports** that are declared lexically after it. In the FIFO example, `may_push`, `push`, and `push_data` belong to `domain push_dom`, and `may_pop`, `pop`, and `pop_data` belong to `pop_dom`. The reset signal also goes into its own domain. 

The `push` and `push_data` wires are clearly temporally linked. A high `push` signal is associated with a `push_data` value in that clock cycle *and only that clock cycle*. Indeed, a similar relationship exists between `pop` and `pop_data`, only in this case, the `pop` signal is associated with a `pop_data` value *exactly one cycle later*. Even `may_push` and `push` are closely linked, since a high value for `may_push` indicates that `MAY_PUSH_LATENCY` cycles later, `push` is allowed to go high. (In the case of `FIFO`, a `may_push` actually tells us that the FIFO has at least `MAY_PUSH_LATENCY` elements worth of space left). 

Clearly, within the scope of "pushing" there are cycle-wise relationships, and within the scope of "popping" there are relationships, but there is no such direct cycle-to-cycle correspondence across these two scopes. 

With domains, we make the lack of dependencies between the interfaces clear. 

## The benefits
If we were to keep all the wires in the same domain, we could run into [Net Positive Latency Cycle Errors](resolving_errors.md), or accidentally instantiate a large number of unneeded pipeline stages as the compiler unneccesarily compensates for the difference between two interfaces that should be unrelated. 

## Warning
It is easy to create invalid modules by being too liberal with declaring domains. For instance below:
```sus
module DisconnectDomains {
    domain a_dom
    input bool x'0
    domain b_dom
    output bool y'4 = x
}
```

With this module, it effectively instantiates 4 latency registers internally, but by adding the separate domains we've effectively severed any relationship of the ports to the outside world. 

As a rule of thumb, you should only split up domains so far that the wires within a domain are fully self-sufficient for their own backpressure. 
