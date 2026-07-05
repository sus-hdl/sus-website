# Extern Modules

Extern modules are declared with the `extern` keyword. Their types must be fully specified, and absolute latencies must be provided on all ports. 

Let's say we want to wrap the following SystemVerilog module. It is a floating point adder IP core, with free-flowing pipeline depth of 11 stages. 
```sv
// Latency of 11 cycles
module fp32_add_ip (
    input logic aclk,
    input logic s_axis_a_tvalid,
    input logic[31:0] s_axis_a_tdata,
    input logic s_axis_b_tvalid,
    input logic[31:0] s_axis_b_tdata,
    output logic m_axis_result_tvalid,
    output logic[31:0] m_axis_result_tdata
);
endmodule
```
We would wrap it like so:
```sus
extern module fp32_add_ip {
    clock aclk
    
    input bool s_axis_a_tvalid'0
    input float s_axis_a_tdata'0
    input bool s_axis_b_tvalid'0
    input float s_axis_b_tdata'0
    output bool m_axis_result_tvalid'11
    output float m_axis_result_tdata'11
}
```

We've explicitly mapped the clock, and all ports at appropriate absolute latencies. If there are any integers or arrays within the module, they must be sized explicitly. 

## Type Mappings:
`sus` => `systemverilog`
- `bool x` => `logic x`
- `float x` => `logic[31:0] x`
- `double x` => `logic[63:0] x`
- unsigned `int#(FROM: 0, TO: 256) x` => `logic[0:$clog2(256)] x`
- signed `int#(FROM: -256, TO: 256) x` => `signed logic[0:$clog2(512)] x`
- Arrays: `int#(FROM: 0, TO: 128)[5] x` => `logic[0:$clog2(256)] x[0:4]`
- Except the lowest level of boolean array: `bool[5] x` => `logic[4:0] x`
- Arrays of boolean arrays again become unpacked: `bool[5][20] x` => `logic[4:0] x[0:19]`

## Parameters
You may wrap systemverilog modules with parameters.
Simply copy over the parameter to SUS with an appropriate type:

The SystemVerilog Module:
```sv
module PopCount #(parameter integer SIZE) (
    input clk,
    input logic[SIZE-1:0] bits,
    output logic[$clog2(SIZE+1)-1:0] count
);
endmodule
```
Maps to a SUS Extern Module:
```sus
extern module PopCount #(int SIZE) (
    clock clk
    input bool[SIZE] bits,
    output int#(FROM: 0, TO: SIZE+1) count
);
endmodule
```
