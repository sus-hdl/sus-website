# Splits

```sus
module AddFloatPairs#(int SIZE) {
    interface AddFloatPairs : float[SIZE] INS'0 -> float[SIZE / 2] outs'3
}

module TestSplit {
    split float[][5] float_reduction'5

    float_reduction[4] = [0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, 0.5, 0.6, ]

    for int i in 0..4 {
        float_reduction[i] = AddFloatPairs(float_reduction[i+1])

    }
}
```