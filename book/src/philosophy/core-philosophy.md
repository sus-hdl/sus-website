# Core Philosophy
SUS is meant to be a direct competitor to Synthesizeable Verilog and VHDL. Its main goal is to be an intuitive and thin syntax for building netlists, such that traditional synthesis tools can still be used to analyze the resulting hardware. SUS shall impose no paradigm on the hardware designer, such as requiring specific communication protocols or iteration constructs. In other words, SUS is not there to abstract away complexity, but rather to make the inherent complexity of hardware design more manageable.

The one restriction SUS does impose over Verilog and VHDL is that it requires the hardware to be *synchronous* over one or more clocks. Asynchronous hardware is therefore *unrepresentable* making SUS less suitable for ASIC development. 

There are three main features that set SUS apart from the rest: 
- Generative Variables and Types can be freely combined. Any "Dependent Types" headaches that are caused by this are sidestepped by doing the main type checking after instantiation. 
- Easy Pipelining through an orthogonal language construct called "Latency Counting". 'Orthogonal' means that adding pipeline registers does not interfere with other language features such as generative or conditional code. 
- Separation of pipelines with interfaces. This keeps the user from accidentally crossing signals that have no logical relationship. At this level Clock Domain Crossings are implemented.

Finally, an important consideration of SUS is the user interface. SUS comes with a VSCode IDE plugin that allows the copiler to be used fully in-IDE. Compiling, typechecking and instantiation is done as the user writes code, leading to a very tight development feedback loop. 