# Generative Code

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
