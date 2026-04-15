# Actions, Triggers and Conditional Bindings
A very common pattern in hardware design is the coupling of data to a "valid" signal. Because it is so common, and there's no hardware overhead to implementing it, SUS provides a syntactic sugar for it named `action` and `trigger`. 

An `action` can be thought of as a sort-of method on a submodule. It can take any number of inputs, and produce any number of outputs. When the action is "called", the effect is that the "valid" wire associated with the action (of the same name as the action itself) is set to "1". Important to know is that since an action still represents a physical connection on a module, it can only be used once per cycle. Don't try to call an action in a `for`-loop and expect it to be "executed" multiple times. 

```sus
/// Declaration of Actions
module memory#(T, int DEPTH) {
    T[DEPTH] mem

    action write: int#(FROM: 0, TO: DEPTH) wr_addr, T wr_data {
        mem[wr_addr] = wr_data
    }
    action read: int#(FROM: 0, TO: DEPTH) rd_addr -> T rd_data {
        rd_data = mem[rd_addr]
    }
}
/// Is equivalent to
module memory#(T, int DEPTH) {
    T[DEPTH] mem

    input bool write
    input int#(FROM: 0, TO: DEPTH) wr_addr
    input T wr_data 
    when write {
        mem[wr_addr] = wr_data
    }
    input bool read
    input int#(FROM: 0, TO: DEPTH) rd_addr
    output T rd_data
    when read {
        rd_data = mem[rd_addr]
    }
}

/// Calling of Actions
module use_memory {
    memory#(T: type bool[20], DEPTH: 5) mem

    state int cur_idx

    // Really this should also be an action
    bool do_read
    output bool[20] dout
    when do_read {
        dout = mem.read(cur_idx)     // <<<===
        cur_idx = (cur_idx + 1) % 5
    }
}
```

## Triggers
Triggers are like reverse actions. In this case it is the submodule that wishes to invoke an action on its parent module, not dissimilar to a callback. In the case of triggers, it is the submodule itself that "calls" the trigger, thereby setting the trigger's "valid" bit to 1 as with actions. 

```sus
/// Declaration of triggers
module iterator#(int MAX) {
    state int cur

    action start {
        cur = 0
    }
    trigger iter : int v, bool last

    when cur != MAX {
        iter(cur, cur == MAX - 1)
        cur = (cur + 1) % MAX
    }
}
```

In the parent module, we can react to the submodule's `trigger` using a "conditional binding", marked with `<<<===`. 
```sus
/// Use of triggers and conditional bindings
module use_iter {
    int[6] terms = [5, 7, -9, 6, 5, 2]
    state int total

    iterator#(MAX: 6) iter
    action sum_up {
        total = 0
        iter.start()
    }
    trigger done : int sum
    when iter.iter : int idx, bool last {     // <<<===
        int new_total = (total + terms[idx]) % 256
        when last {
            done(new_total)
        }
        total = new_total
    }
}
```

## To recap

- An `action` is for the parent module to signal one of its submodules
- A `trigger` is for the submodule to signal its parent

