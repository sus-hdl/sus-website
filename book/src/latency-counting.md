# Pipelining through [Latency Counting](philosophy/latency.md)
```Verilog
module pow17 {
    interface pow17 : int i -> int o 
        int i2  = i * i
    reg int i4  = i2 * i2
        int i8  = i4 * i4
    reg int i16 = i8 * i8
            o   = i16 * i
}
```
![Registers can be inserted](/images/insertRegisters.png)
