
# FIFO

# Multiple Domain
![fifoExampleHighLevel](/images/fifoExampleHighLevel.png)


In a FIFO with multiple clock domains, latency counting doesn’t fully apply because there’s no direct one-to-one mapping between push and pop signals. The FIFO operates with separate push and pop domains, each with internally related signals. Here, the push side allows three cycles of pipelining slack, while the FIFO itself takes two cycles to produce data when requested. This separation means that tracking data as it moves through the pipeline requires a different approach than simple latency counting.



# Latency cuts 

![fifoImpl.png](/images/fifoImpl.png)

In this FIFO, a domain boundary separates the push and pop sides, requiring explicit domain-crossing constructs to ensure correct latency handling. The FIFO uses a large memory block for storage, with write and read address registers on opposite sides of the boundary. Additional latency registers may be introduced, such as for expensive operations like subtraction and comparison. A latency offset mechanism allows treating signals as if they have an adjusted latency, enabling long-latency feedback loops that would otherwise be impossible.





![structureFIFO.png](/images/structureFIFO.png)

In the dedin project, domain boundaries frequently occur around FIFOs, making them natural points for handling latency and synchronization. The design follows a hierarchical structure: a small internal loop in the dant kernel, repeated 30 times, with data distributed across these instances, and this entire structure replicated 10 times. While FIFOs are the typical boundary elements, a dual-port memory is used instead of a FIFO in the innermost block, showing that other memory structures can also serve this purpose.