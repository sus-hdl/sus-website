# Planned
- Type safety with Bounded Integers
- Multi-Clock modules
- Formal Verification Integration
- Syntactic sugar for common constructs like valid signals, resets and submodule communication
- Moving some[^timing] timing constraints to the source file

[^timing]: Some timing constraints affect the cycle-by-cycle functioning of the design, such as the relative speeds of synchronous clocks and False/Multi-Cycle Path constraints. Because they affect the cycle-wise behaviour of the design, they should be provided as part of the language and incorporated in simulation. Of course, timing constraints like real clock speeds, edge patterns and external component timings still rightfully belong in the Timing Constraints file. It should not be possible to express SUS code that behaves differently between Simulation and Synthesis. 