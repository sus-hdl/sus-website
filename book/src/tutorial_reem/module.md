# 1. Dual-Port Memory


The DualPortMem module provides a simple memory with separate read and write clock domains.

Example: A memory block with separate read and write ports, each in its own domain. Every wire belongs to a domain or remains anonymous. Signals can only cross domains via explicit crossing primitives.


![Dual-Port Memory](/images/DualPortMemCode.png)


# 2. FIFO 

FIFO Memory with Multiple Domains

In this FIFO design, the latency counting idea doesn’t fully apply because the ready signal on the push side doesn’t directly correlate with the request signal on the pop side. The FIFO operates with two domains: a push domain and a pop domain, each with related signals. It allows three cycles of pipelining slack for the input side and takes two cycles to produce data when requested.

To handle domain crossing, explicit constructs are used to ensure correct data transfer between the domains. The FIFO includes registers for read and write addresses across the latency boundary. Additionally, extra latency registers, like for the subtraction and comparison operations, help manage performance.

![FIFO module](/images/FIFOModule.png)


# 3. JoinDomains

 Synchronizes two signals across different clock domains with an adjustable offset.

![JoinDomains](JoinDomains.png)


# 4. Iteration in SUS

The iterator module provides a simple counting loop. It is a state machine for sequential iteration, flexible for various counting ranges. 

![Iterator module](/images/iterator.png)


## 5. FixedSizeIterator 

![FixedSizeIterator](/images/FixedFixedSizeIterator.png)

FixedSizeIterator module is a simple hardware iterator that counts from 0 to UP_TO - 1, based on a start signal. 


# 6. SlowClockGenerator

 SlowClockGenerator: Generates a slower clock by counting up to a given period.

![SlowClockGenerator](/images/SlowClockGenerator.png)


# 7. SplitAt

 SplitAt: Splits an array into two parts at a specified index.

 ![SplitAt](/images/SplitAt.png)

# 8. Abs

Computes the absolute value of an integer.


![absoluteCode](absCode.png)


# 9. Slice

Extracts a sub-array (slice) from a given array.

![Slice](/images/slice.png)


# 10. BitSelect

Outputs a one-hot encoded signal based on a selected index.

![BitSelect](/images/bitSelect.png)


# 11. PopCount

![popCountCode](PopCount.png)

 Counts the number of 1s in a binary array using a recursive approach.


# 12. TreeAdd

![treeAddCode](TreeAdd.png)

 Recursively sums an array of integers using a tree-based approach for efficient computation.

