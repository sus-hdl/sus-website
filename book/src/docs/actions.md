# Actions, Triggers and Conditional Bindings
A very common pattern in hardware design is the coupling of data to a "valid" signal. Because it is so common, and there's no hardware overhead to implementing it, SUS provides a syntactic sugar for such valid signals. 

- An `action` is an `input` port with associated data. It must be called from a parent module. 
- A `trigger` is an `output` port with associated data. It is called from within the module, and can be responded to by a parent module. 
- A `function` is the local equivalent of an `action`. It does not create any input or output ports, and must be called from within the module. 

## Actions

An `action` can be thought of as a sort-of method on a submodule. It can take any number of inputs, and produce any number of outputs. When the action is "called", the effect is that the "valid" wire associated with the action (of the same name as the action itself) is set to "1". Important to know is that since an action still represents a physical connection on a module, it can only be used once per cycle. Don't try to call an action in a `for`-loop and expect it to be "executed" multiple times. 

```sus
/// Declaration of Actions
module memory#(T, int DEPTH) {
    T[DEPTH] mem

    action write: int#(0..DEPTH) wr_addr, T wr_data {
        mem[wr_addr] = wr_data
    }
    action read: int#(0..DEPTH) rd_addr -> T rd_data {
        rd_data = mem[rd_addr]
    }
}
/// Is equivalent to
module memory#(T, int DEPTH) {
    T[DEPTH] mem

    input bool write
    input int#(0..DEPTH) wr_addr
    input T wr_data 
    when write {
        mem[wr_addr] = wr_data
    }
    input bool read
    input int#(0..DEPTH) rd_addr
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

## Functions
You can also declare an action locally, which does not result in ports onto the module, but rather, must be called from within the module. As with calling actions on submodules, multiple calls to the same function in the same cycle conflict, and resolve to only the lexically latest call. 

```sus
module functions_example {
	state int#(0..128) x
	initial x = 0

	function increase_x : int by {
		x = x + by mod 128
	}

	action increase_by_5 {
		increase_x(5)
	}
	action increase_by_10 {
		increase_x(10)
	}
}
```

## Secondary bindings

You can "re-bind" an existing `action`, `trigger` or `function` by using a *conditional binding*, just like you would for a regular submodule's trigger. Importantly, for any conditional bindings that would write to an output port, you can only bind the outputs exactly once, so as not to conflict. 

Any number of bindings may bind the *inputs* of an action, but at most one site may bind its *outputs*: either the declaration's own body, or a single `when ... -> ...` binding. Every other binding must leave out the `-> outputs` part. This keeps each output driven from one place, instead of from every binding under the same condition. 

In fact, an `action`, `trigger` or `function` can be declared without the braces. In effect the braces in `action`, `trigger` and `function` are syntactic sugar for a conditional binding on them. 

```sus
module memory#(T, int DEPTH) {
    state T[DEPTH] mem
    output bool wrote

    // Declarations without a body
    action write : int#(0..DEPTH) wr_addr, T wr_data
    action read : int#(0..DEPTH) rd_addr -> T rd_data

    // Bindings that bind only the inputs can be used multiple times
    when write : int#(0..DEPTH) addr, T data {
        mem[addr] = data
    }
    when write : int#(0..DEPTH) addr, T data {
        wrote = true
    } else {
        wrote = false
    }

    // There must only be one binding that writes to the outputs
    when read : int#(0..DEPTH) addr -> T data {
        data = mem[addr]
    }
}
```

The rule also applies to bindings of a submodule's triggers: `when submod.trig : T v {}` may appear many times, but only one `when submod.trig : T v -> T r {}` may bind its outputs. 

## Shorthands: inline submodules

Often a submodules are effectively a single functional pipeline. SUS has two shorthands for this, both of which instantiate the submodule inline and call its *main interface*. 

A module whose ports are declared in the module header is a *function-style module*. It does not carry a validity wire, and should therefore be purely combinatorial (with pipeline stages). 

```sus
module Multiply #(int TO) : int#(0..TO) a, int#(0..TO) b -> int#(0..TO*TO) product {
    product = a * b
}
/// Usage
module UseMultiply {
    int#(0..10) x = 3
    int#(0..10) y = 5

    // Calling the module by name instantiates it inline
    int#(0..100) by_name = Multiply(x, y)

    // The same main interface on an explicitly declared instance
    Multiply#(TO: 10) instance
    int#(0..100) by_instance = instance(x, y)
}
```

Likewise, an `action` named after its module is that module's main interface. Calling the module by name then calls this action. 

```sus
module fp32_add {
    // Wrap a float IP core that exposes fixed-latency AXI interfaces. 
    fp32_add_ip ip
    
    action fp32_add : float a, float b -> float res {
        ip.s_axis_a_tvalid = true
        ip.s_axis_a_tdata = a
        ip.s_axis_b_tvalid = true
        ip.s_axis_b_tdata = b
        bool _0 = ip.m_axis_result_tvalid // Tie off
        res = ip.m_axis_result_tdata
    } else {
        ip.s_axis_a_tvalid = false
        ip.s_axis_b_tvalid = false
    }
}
/// Usage
module Use_fp32_add {
    action use_it : float a, float b -> float res {
        res = fp32_add(a, b)
    }
}
```
