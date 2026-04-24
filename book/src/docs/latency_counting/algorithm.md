# Latency Counting Algorithm

## Background: Bellman-Ford

## Incorporate the Specified Latencies into the Latency Counting Graph

## Check for Net-Positive Latency Cycles

## Figure out Port Latencies

## Fill in internal Latencies

# Latency Inference

## Poisoning
`fp32_mul` below is of unknown latency, and thus the edges between `a` -> `result` and `b` -> `result` are "Poison" edges. 

![Poison Edge Example](fifo_infer_1.svg)

Poison Edges are called as such because any Latency Inference probes that pass through them will become "poisoned", preventing inference if the target node of the Latency Inference probe lies in the poison edge's fanout. This is done because at the time of inference, the poison edge might hide an arbitrarily large latency, that could overpower any maximum latency assumed of it. 

Usually, Poison edges just prevent premature inference, and are thus not a huge problem. Whatever modules poisoned the previous latency inference attempt likely get resolved in the next round of concrete typechecking, after which their exactly known latencies can be used to do the inference properly. 
