# Your first module

Since doing a "Hello World" in hardware isn't really viable (What's a "string"? Do I pass 'H', 'e', ... over the serial port?), we instead create a simple OR gate. 
In the module below, we first declare two inputs and an output, and finally do a continuous assignment `c = a | b`. It synthesizes to a simple OR gate. 

Create a file `hello_hardware.sus` and add the following code to it:
```sus
module hello_hardware {
  input bool a
  input bool b
  output bool c
  c = a | b
}
```

![orGate.png](orGate.png)

You can then compile this file with `sus_compiler hello_hardware.sus --top hello_hardware -o codegen.sv`. It will compile `hello_hardware` as top module, and the resulting code is stored in `codegen.sv`. 

It'll look something like this:
```verilog
// THIS IS A GENERATED FILE (Generated at 2026-02-14T16:36:01+01:00)
// This file was generated with SUS Compiler 0.3.7
// hello_hardware #()
module hello_hardware(
	input clk,
	input wire a,
	input wire b,
	output /*mux_wire*/ logic c
);

wire _3;
assign _3 = a | b;
always_comb begin // combinatorial c
	// Combinatorial wires are not defined when not valid. This is just so that the synthesis tool doesn't generate latches
	c = 1'bx;
	c = _3;
	// PATCH Vivado 23.1 Simulator Bug: 1-bit Conditional Assigns become don't care
	c = c;
end
endmodule
```

The generated code can then be synthesized or simulated using a tool of your choice. Since at PC2 we're using the u280 and v80 FPGAs, we tend to use Vivado's [TODO xsim](xsim).
