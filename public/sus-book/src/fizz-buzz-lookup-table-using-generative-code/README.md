# FIZZ-BUZZ Lookup Table using Generative Code
```Verilog
module fizz_buzz_gen {
    interface fizz_buzz_gen : int v -> int fb 
    gen int FIZZ = 15
    gen int BUZZ = 11
    gen int FIZZ_BUZZ = 1511
    gen int TABLE_SIZE = 256

    gen int[TABLE_SIZE] lut
    
    for int i in 0..TABLE_SIZE {
        gen bool fizz = i % 3 == 0
        gen bool buzz = i % 5 == 0
        
        gen int tbl_fb
        if fizz & buzz {
            tbl_fb = FIZZ_BUZZ
        } else if fizz {
            tbl_fb = FIZZ
        } else if buzz {
            tbl_fb = BUZZ
        } else {
            tbl_fb = i
        }

        lut[i] = tbl_fb
    }

    fb = lut[v]
}
```
In the end, the generative code is executed and all that results is a lookup table. 
