# Math.abs — alternative implementations

A few ways to reimplement `Math.abs` in TypeScript if it didn't exist.
Descriptions only.

### 1. Ternary

`x < 0 ? -x : x`. If the value is negative, flip the sign. The
simplest answer.

### 2. If / else

Same idea spelled out:

```ts
if (x < 0) return -x;
return x;
```

### 3. Math.max

`Math.max(x, -x)`. The bigger of `x` and `-x` is always the
non-negative one.

### 4. Square root of the square

`Math.sqrt(x * x)`. Squaring drops the sign, the square root brings
the magnitude back. Loses precision for very large numbers.

### 5. Multiply by the sign

`x * Math.sign(x)`. `Math.sign` returns `1` or `-1` (or `0`); the
multiplication produces the non-negative value.

### 6. Subtract from zero when negative

`x < 0 ? 0 - x : x`. Same as the ternary, just written as a
subtraction instead of a negation.

### 7. Strip the leading minus from the string

Stringify, remove the `-` if there is one, parse back:
`Number(String(x).replace(/^-/, ''))`. The example given in the prompt.

### 8. Bitwise trick (integers only)

`(x ^ (x >> 31)) - (x >> 31)`. Works for 32-bit signed integers —
`x >> 31` is `0` for non-negative numbers and `-1` for negatives, so
the XOR and subtract together produce the absolute value without
branching.

### 9. Loop until non-negative

`while (x < 0) x = -x;`. Runs at most once. A silly version of the
ternary, included to show the same logic in another shape.
