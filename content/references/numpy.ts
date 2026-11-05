import type { Reference } from "@/content/schema";

export const numpyReferences: Reference[] = [
  {
    id: "numpy-array",
    library: "numpy",
    slug: "array",
    symbol: "np.array",
    signature: "np.array(object, dtype=None, copy=True)",
    summary: "Create an array from a Python sequence or another array.",
    description:
      "np.array is the most direct way to turn nested lists into a NumPy array. The dtype is inferred from the values unless you pass one explicitly. Arrays created this way own their data by default.",
    parameters: [
      {
        name: "object",
        type: "array_like",
        description: "A list, tuple, nested sequence, or existing array.",
      },
      {
        name: "dtype",
        type: "dtype, optional",
        description: "The element type to store, such as float64 or int32.",
        optional: true,
      },
      {
        name: "copy",
        type: "bool",
        description: "Whether to copy the input data.",
        optional: true,
      },
    ],
    returns: "ndarray",
    example: {
      code: `import numpy as np

values = np.array([1, 2, 3])
print(values)
print(values.shape)`,
      output: "[1 2 3]\n(3,)",
    },
    pitfalls: [
      "Lists with mixed types may be promoted to a common dtype, so check dtype when exact storage matters.",
      "Use np.asarray when you want to avoid an unnecessary copy of an existing array.",
    ],
    related: ["numpy-zeros", "numpy-arange"],
  },
  {
    id: "numpy-zeros",
    library: "numpy",
    slug: "zeros",
    symbol: "np.zeros",
    signature: "np.zeros(shape, dtype=float)",
    summary: "Create an array filled with zeros.",
    description:
      "np.zeros allocates a new array of the requested shape and initializes every element to 0. It is useful as a placeholder before filling values or as a starting point for accumulators.",
    parameters: [
      {
        name: "shape",
        type: "int or tuple of ints",
        description: "The dimensions of the new array.",
      },
      {
        name: "dtype",
        type: "dtype, optional",
        description: "The element type. Defaults to float.",
        optional: true,
      },
    ],
    returns: "ndarray",
    example: {
      code: `import numpy as np

grid = np.zeros((2, 3))
print(grid)`,
      output: "[[0. 0. 0.]\n [0. 0. 0.]]",
    },
    pitfalls: [
      "The default dtype is float, not int; pass dtype=int if you need integer zeros.",
      "A shape argument must be a tuple for multiple dimensions: (2, 3), not 2, 3.",
    ],
    related: ["numpy-array", "numpy-linspace"],
  },
  {
    id: "numpy-arange",
    library: "numpy",
    slug: "arange",
    symbol: "np.arange",
    signature: "np.arange(start, stop=None, step=1, dtype=None)",
    summary: "Create evenly spaced values within a half-open interval.",
    description:
      "np.arange behaves like Python's range but returns an array. It starts at start, stops before stop, and advances by step. Floating-point steps can accumulate representation error.",
    parameters: [
      {
        name: "start",
        type: "number",
        description: "The first value, or the stop value when stop is omitted.",
      },
      {
        name: "stop",
        type: "number, optional",
        description: "The end of the interval, excluded from the result.",
        optional: true,
      },
      {
        name: "step",
        type: "number, optional",
        description: "The distance between consecutive values.",
        optional: true,
      },
    ],
    returns: "ndarray",
    example: {
      code: `import numpy as np

print(np.arange(0, 10, 2))`,
      output: "[0 2 4 6 8]",
    },
    pitfalls: [
      "The stop value is excluded, matching range semantics.",
      "Prefer linspace when you need a specific number of points and exact endpoints.",
    ],
    related: ["numpy-linspace", "numpy-reshape"],
  },
  {
    id: "numpy-linspace",
    library: "numpy",
    slug: "linspace",
    symbol: "np.linspace",
    signature: "np.linspace(start, stop, num=50, endpoint=True)",
    summary: "Create a chosen number of evenly spaced points.",
    description:
      "np.linspace divides the interval from start to stop into num points. Unlike arange, you specify the count rather than the step, and the endpoint is included by default.",
    parameters: [
      {
        name: "start",
        type: "number",
        description: "The first value in the sequence.",
      },
      {
        name: "stop",
        type: "number",
        description: "The final value when endpoint is True.",
      },
      {
        name: "num",
        type: "int, optional",
        description: "Number of points to generate. Defaults to 50.",
        optional: true,
      },
      {
        name: "endpoint",
        type: "bool, optional",
        description: "Whether to include stop in the result.",
        optional: true,
      },
    ],
    returns: "ndarray",
    example: {
      code: `import numpy as np

print(np.linspace(0, 1, 5))`,
      output: "[0.   0.25 0.5  0.75 1.  ]",
    },
    pitfalls: [
      "num must be a nonnegative integer; zero returns an empty array.",
      "For integer grids with a natural step, arange may read more clearly.",
    ],
    related: ["numpy-arange", "numpy-zeros"],
  },
  {
    id: "numpy-reshape",
    library: "numpy",
    slug: "reshape",
    symbol: "ndarray.reshape",
    signature: "ndarray.reshape(shape, order='C')",
    summary: "Return an array with the same data arranged in a new shape.",
    description:
      "reshape changes how the existing values are addressed without changing their number. The total number of elements must stay the same. A dimension of -1 asks NumPy to infer that length.",
    parameters: [
      {
        name: "shape",
        type: "int or tuple of ints",
        description: "The target shape. One dimension may be -1.",
      },
      {
        name: "order",
        type: "str, optional",
        description: "Read order: 'C' for row-major or 'F' for column-major.",
        optional: true,
      },
    ],
    returns: "ndarray",
    example: {
      code: `import numpy as np

values = np.arange(6)
print(values.reshape(2, 3))`,
      output: "[[0 1 2]\n [3 4 5]]",
    },
    pitfalls: [
      "The element count must match; 6 values can become (2, 3) or (3, 2), not (4, 2).",
      "Reshape returns a view when possible; mutating that view can affect the original array.",
    ],
    related: ["numpy-arange", "numpy-array"],
  },
  {
    id: "numpy-sum",
    library: "numpy",
    slug: "sum",
    symbol: "np.sum",
    signature: "np.sum(a, axis=None, keepdims=False, dtype=None)",
    summary: "Add values across an array or along one axis.",
    description:
      "np.sum reduces an array to a total. Without an axis it sums every element. With an axis it collapses that axis and keeps the others, unless keepdims asks for a length-one dimension instead.",
    parameters: [
      {
        name: "a",
        type: "array_like",
        description: "The values to add.",
      },
      {
        name: "axis",
        type: "int or tuple of ints, optional",
        description: "The axis or axes to collapse.",
        optional: true,
      },
      {
        name: "keepdims",
        type: "bool, optional",
        description: "Keep collapsed axes as length-one dimensions.",
        optional: true,
      },
    ],
    returns: "ndarray or scalar",
    example: {
      code: `import numpy as np

grid = np.array([[1, 2, 3], [4, 5, 6]])
print(grid.sum(axis=0))
print(grid.sum(axis=1))`,
      output: "[5 7 9]\n[ 6 15]",
    },
    pitfalls: [
      "Axis 0 collapses rows, so the result has one value per column.",
      "Integer sums can overflow a small dtype; specify dtype when needed.",
    ],
    related: ["numpy-mean", "numpy-array"],
  },
  {
    id: "numpy-mean",
    library: "numpy",
    slug: "mean",
    symbol: "np.mean",
    signature: "np.mean(a, axis=None, keepdims=False, dtype=None)",
    summary: "Compute the arithmetic mean along an axis.",
    description:
      "np.mean adds the selected values and divides by their count. It is the arithmetic average, not a median or a weighted mean.",
    parameters: [
      {
        name: "a",
        type: "array_like",
        description: "The values to average.",
      },
      {
        name: "axis",
        type: "int or tuple of ints, optional",
        description: "The axis or axes to collapse.",
        optional: true,
      },
      {
        name: "keepdims",
        type: "bool, optional",
        description: "Preserve collapsed axes as length-one dimensions.",
        optional: true,
      },
    ],
    returns: "ndarray or scalar",
    example: {
      code: `import numpy as np

scores = np.array([[80, 90, 70], [60, 75, 85]])
print(scores.mean(axis=1))`,
      output: "[80.         73.33333333]",
    },
    pitfalls: [
      "The mean is sensitive to outliers; inspect the distribution before summarizing.",
      "An empty array produces a warning and a NaN result.",
    ],
    related: ["numpy-sum", "numpy-array"],
  },
  {
    id: "numpy-where",
    library: "numpy",
    slug: "where",
    symbol: "np.where",
    signature: "np.where(condition, x=None, y=None)",
    summary: "Choose values by condition or return matching indices.",
    description:
      "With three arguments, np.where returns x where the condition is true and y elsewhere. With only a condition, it returns the indices where the condition is true.",
    parameters: [
      {
        name: "condition",
        type: "array_like of bool",
        description: "The mask that selects between x and y.",
      },
      {
        name: "x",
        type: "array_like, optional",
        description: "Values used where condition is true.",
        optional: true,
      },
      {
        name: "y",
        type: "array_like, optional",
        description: "Values used where condition is false.",
        optional: true,
      },
    ],
    returns: "ndarray or tuple of ndarrays",
    example: {
      code: `import numpy as np

values = np.array([-2, 0, 5])
print(np.where(values > 0, "positive", "non-positive"))`,
      output: "['positive' 'non-positive' 'positive']",
    },
    pitfalls: [
      "Both x and y must be provided to choose values.",
      "Boolean indexing with values[values > 0] is often simpler when you only need the kept values.",
    ],
    related: ["numpy-array", "numpy-sum"],
  },
  {
    id: "numpy-default-rng",
    library: "numpy",
    slug: "default-rng",
    symbol: "np.random.default_rng",
    signature: "np.random.default_rng(seed=None)",
    summary: "Create a reproducible random number generator.",
    description:
      "default_rng returns a Generator with methods such as integers, normal, and permutation. Passing a seed recreates the same starting stream for repeatable experiments.",
    parameters: [
      {
        name: "seed",
        type: "int, array_like, or None",
        description: "Initial state for the generator. None uses fresh entropy.",
        optional: true,
      },
    ],
    returns: "Generator",
    example: {
      code: `import numpy as np

rng = np.random.default_rng(7)
print(rng.integers(1, 7, size=5))`,
    },
    pitfalls: [
      "Re-seeding inside a loop can produce repeated blocks of values.",
      "A seed makes a run repeatable, not cryptographically secure.",
    ],
    related: ["numpy-mean", "numpy-linalg-solve"],
  },
  {
    id: "numpy-linalg-solve",
    library: "numpy",
    slug: "linalg-solve",
    symbol: "np.linalg.solve",
    signature: "np.linalg.solve(a, b)",
    summary: "Solve a square linear system a @ x = b.",
    description:
      "np.linalg.solve computes the vector or matrix x that satisfies a @ x = b. It is more stable and usually faster than multiplying by an explicit inverse.",
    parameters: [
      {
        name: "a",
        type: "ndarray",
        description: "The square coefficient matrix.",
      },
      {
        name: "b",
        type: "ndarray",
        description: "The right-hand side vector or matrix.",
      },
    ],
    returns: "ndarray",
    example: {
      code: `import numpy as np

a = np.array([[2.0, 1.0], [1.0, 3.0]])
b = np.array([5.0, 10.0])
x = np.linalg.solve(a, b)
print(x)`,
    },
    pitfalls: [
      "The coefficient matrix must be square and non-singular for a unique solution.",
      "Check the result with a @ x; floating-point answers may differ from b by tiny amounts.",
    ],
    related: ["numpy-default-rng", "numpy-array"],
  },
  {
    id: "numpy-clip",
    library: "numpy",
    slug: "clip",
    symbol: "np.clip",
    signature: "np.clip(a, a_min, a_max)",
    summary: "Limit every value in an array to a fixed range.",
    description:
      "np.clip returns a new array where values below a_min become a_min and values above a_max become a_max. It is a compact way to winsorize features or keep predictions inside valid bounds.",
    parameters: [
      {
        name: "a",
        type: "array_like",
        description: "Values to limit.",
      },
      {
        name: "a_min",
        type: "scalar or array_like",
        description: "Lower bound, or None to leave the lower side alone.",
      },
      {
        name: "a_max",
        type: "scalar or array_like",
        description: "Upper bound, or None to leave the upper side alone.",
      },
    ],
    returns: "ndarray",
    example: {
      code: `import numpy as np

scores = np.array([-3, 4, 9, 12])
print(np.clip(scores, 0, 10))`,
      output: "[ 0  4  9 10]",
    },
    pitfalls: [
      "Clipping hides extreme values instead of explaining them; inspect them first.",
      "Fit clipping bounds on training data only so test outliers stay honest.",
    ],
    related: ["numpy-where", "numpy-mean"],
  },
  {
    id: "numpy-concatenate",
    library: "numpy",
    slug: "concatenate",
    symbol: "np.concatenate",
    signature: "np.concatenate((a1, a2, ...), axis=0)",
    summary: "Join arrays along an existing axis.",
    description:
      "np.concatenate stacks arrays that share every dimension except the chosen axis. Use it to combine feature blocks or append train and test predictions, and use np.vstack or np.hstack when you want the common shortcut.",
    parameters: [
      {
        name: "arrays",
        type: "sequence of ndarray",
        description: "Arrays with matching shapes except along axis.",
      },
      {
        name: "axis",
        type: "int, optional",
        description: "Axis along which to join; default zero.",
        optional: true,
      },
    ],
    returns: "ndarray",
    example: {
      code: `import numpy as np

age = np.array([[21], [34]])
income = np.array([[40.0], [55.0]])
print(np.concatenate([age, income], axis=1))`,
      output: "[[21. 40.]\n [34. 55.]]",
    },
    pitfalls: [
      "All other dimensions must match exactly or NumPy raises an error.",
      "Use np.column_stack for one-dimensional features that need a new axis.",
    ],
    related: ["numpy-reshape", "numpy-array"],
  },
  {
    id: "numpy-argmax",
    library: "numpy",
    slug: "argmax",
    symbol: "np.argmax",
    signature: "np.argmax(a, axis=None)",
    summary: "Return the index of the largest value.",
    description:
      "np.argmax finds the position of the maximum along an axis. For a matrix of class scores it turns each row into the predicted class index, which is the usual bridge between probabilities and labels.",
    parameters: [
      {
        name: "a",
        type: "array_like",
        description: "Values to search.",
      },
      {
        name: "axis",
        type: "int, optional",
        description: "Axis to reduce; default flattens the input.",
        optional: true,
      },
    ],
    returns: "ndarray or int",
    example: {
      code: `import numpy as np

scores = np.array([[0.1, 0.7, 0.2], [0.8, 0.1, 0.1]])
print(np.argmax(scores, axis=1))`,
      output: "[1 0]",
    },
    pitfalls: [
      "Ties return the first maximum, so do not rely on a stable tie policy.",
      "For calibrated probabilities use argmax on the probability matrix, not raw scores.",
    ],
    related: ["numpy-mean", "numpy-where"],
  },
  {
    id: "numpy-percentile",
    library: "numpy",
    slug: "percentile",
    symbol: "np.percentile",
    signature: "np.percentile(a, q, axis=None)",
    summary: "Compute a percentile of the values in an array.",
    description:
      "np.percentile summarizes a distribution at a chosen rank. It is useful for robust feature ranges, clipping thresholds, and reading the spread of residuals without assuming a normal distribution.",
    parameters: [
      {
        name: "a",
        type: "array_like",
        description: "Values to summarize.",
      },
      {
        name: "q",
        type: "float or array_like",
        description: "Percentile or percentiles between zero and one hundred.",
      },
      {
        name: "axis",
        type: "int, optional",
        description: "Axis to reduce; default flattens the input.",
        optional: true,
      },
    ],
    returns: "ndarray or scalar",
    example: {
      code: `import numpy as np

latency = np.array([12, 15, 18, 21, 240])
print(np.percentile(latency, [50, 95]))`,
      output: "[18. 240.]",
    },
    pitfalls: [
      "The default linear interpolation can return a value that was never observed.",
      "Percentiles are not additive across groups; recompute after combining data.",
    ],
    related: ["numpy-mean", "numpy-clip"],
  },
  {
    id: "numpy-linalg-norm",
    library: "numpy",
    slug: "linalg-norm",
    symbol: "np.linalg.norm",
    signature: "np.linalg.norm(x, ord=None, axis=None)",
    summary: "Measure the length of a vector or matrix.",
    description:
      "np.linalg.norm computes vector and matrix norms. Row-wise L2 norms are the usual way to build distance features, normalize embeddings, or check how far a prediction moved from a baseline.",
    parameters: [
      {
        name: "x",
        type: "array_like",
        description: "Vector or matrix to measure.",
      },
      {
        name: "ord",
        type: "int or str, optional",
        description: "Norm order; default is the L2 norm for vectors.",
        optional: true,
      },
      {
        name: "axis",
        type: "int or tuple, optional",
        description: "Axis or axes to reduce.",
        optional: true,
      },
    ],
    returns: "ndarray or float",
    example: {
      code: `import numpy as np

vec = np.array([[3.0, 4.0], [5.0, 12.0]])
print(np.linalg.norm(vec, axis=1))`,
      output: "[ 5. 13.]",
    },
    pitfalls: [
      "A huge norm can mean a real outlier or an unscaled feature; check units.",
      "For squared distances skip the square root and save a little work.",
    ],
    related: ["numpy-linalg-solve", "numpy-array"],
  },
];
