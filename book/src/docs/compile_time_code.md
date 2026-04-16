# Compile-Time Code

To make metaprogramming easier, SUS comes with some control flow constructs that make building repetitive structures easier. Critically, these are executed at *instantiation time* (See [How SUS is compiled](how_sus_is_compiled.md)), and are not in any way present in the generated hardware. Especially for the loops this may seem confusing at first. One should think of `if` statements as the hardware either exists or it doesn't, and of `for` and `while` loops as if their contents have been replicated. 

## `if`
We already saw the `if` statement in [Conditionals](conditionals.md). When execution passes over an `if` statement, it determines if the condition is `true`. If so, the contents of the `if` statement are included in the resulting hardware. If `false`, they aren't. 

### Example
As an example, let's say we want to implement an optimization for deep shift registers, that delay our value by a fixed number of cycles. If the delay is longer than a certain amount, we instead want to use a memory block.
```sus
module ShiftReg#(T, int LATENCY) {
    input T din'0
	output T dout'LATENCY
    
    if LATENCY <= 3 {
        // Not worth it to use the memory block. A few registers back to back will do. 
		// The compiler will infer LATENCY registers here
        dout = din
    } else {
		// Create a memory block, with a rotating index
        state T[LATENCY] mem
        state int#(FROM: 0, TO: LATENCY) cur_idx
        initial cur_idx = 0
        cur_idx = cur_idx + 1 mod LATENCY

        dout = LatencyOffset#(OFFSET: LATENCY)(mem[cur_idx])
    }
}
```

## `for`
For loops allow us to express 

#### Example
```sus
module CumulativeSums {
    input int#(FROM: 0, TO: 16)[10] values
	output int[10] added_values

	added_values[0] = values[0]
	for int i in 0..10 {
		int t = values[i]
		added_values[i] = t + i

		int tt = arr[i] + values[0]
	}
}
```

## `while`
**Not yet implemented.**

## Larger example

```sus
module fizz_buzz {
    input int#(FROM: 0, TO: TABLE_SIZE) v
    output int fb
    
    gen int FIZZ = 888
	gen int BUZZ = 555
	gen int FIZZ_BUZZ = 888555

	bool is_fizz = v mod 3 == 0
	bool is_buzz = v mod 5 == 0

	when is_fizz & is_buzz {
		fb = FIZZ_BUZZ
	} else when is_fizz {
		fb = FIZZ
	} else when is_buzz {
		fb = BUZZ
	} else {
		fb = v
	}
}
```

```sus
module fizz_buzz_gen #(int TABLE_SIZE) {
    input int#(FROM: 0, TO: TABLE_SIZE) v
    output int fb

	gen int FIZZ = 888
	gen int BUZZ = 555
	gen int FIZZ_BUZZ = 888555

	gen int[TABLE_SIZE] LUT

	for int I in 0..TABLE_SIZE {
		gen bool IS_FIZZ = I mod 3 == 0
		gen bool IS_BUZZ = I mod 5 == 0

		if IS_FIZZ & IS_BUZZ {
			LUT[I] = FIZZ_BUZZ
		} else if IS_FIZZ {
			LUT[I] = FIZZ
		} else if IS_BUZZ {
			LUT[I] = BUZZ
		} else {
			LUT[I] = I
		}
	}

    // The only line that actually generates hardware
	fb = LUT[v]
}
```
