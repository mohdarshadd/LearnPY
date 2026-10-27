import type { Lesson } from "@/content/schema";

export const numpyLessons: Lesson[] = [
  {
    id: "numpy-arrays",
    library: "numpy",
    slug: "arrays",
    title: "NumPy arrays: one type, many values",
    summary:
      "Meet the array: a fixed-type block of values that supports whole-array arithmetic, slicing, and shape-aware operations.",
    minutes: 8,
    level: "beginner",
    packages: ["numpy"],
    objectives: [
      "Create arrays from Python lists and NumPy constructors.",
      "Read an array's shape, dimensions, and dtype.",
      "Index, slice, and filter arrays by position or condition.",
      "Explain why array arithmetic differs from list arithmetic.",
    ],
    sections: [
      {
        id: "why-arrays",
        title: "Why arrays exist",
        blocks: [
          {
            type: "text",
            text: "A Python list is wonderfully flexible: it can hold numbers, strings, nested lists, and objects in the same container. That flexibility costs memory and speed. A NumPy array makes the opposite trade: every value has the same type, and the values sit in one compact block. In return, NumPy can operate on the whole block at once.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nvalues = [10, 20, 30]\narray = np.array(values)\n\nprint(values * 2)\nprint(array * 2)',
            language: "python",
            caption: "The same multiplication, two different meanings",
            output: "[10, 20, 30, 10, 20, 30]\n[20 40 60]",
            runnable: true,
          },
          {
            type: "text",
            text: "Multiplying a list repeats it. Multiplying an array scales every element. This is vectorized arithmetic: you describe the operation on the whole array, and NumPy handles the loop in compiled code.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Think in whole columns",
            text: "Once data is in an array, prefer expressions like prices * 1.2 or readings - baseline over hand-written for loops. The loop still happens, but it happens inside NumPy where it is faster and harder to get wrong.",
          },
        ],
      },
      {
        id: "creating-arrays",
        title: "Creating arrays",
        blocks: [
          {
            type: "text",
            text: "Most lessons start with np.array(...), but NumPy also has constructors for common shapes. zeros and ones fill a shape with a starting value, arange builds evenly spaced ranges, and linspace asks for a specific number of points between two endpoints.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nzeros = np.zeros((2, 3))\nones = np.ones(4)\nsteps = np.arange(0, 10, 2)\nspaced = np.linspace(0, 1, 5)\n\nprint(zeros)\nprint(ones)\nprint(steps)\nprint(spaced)',
            language: "python",
            caption: "Four common constructors",
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "np.zeros(shape) and np.ones(shape) are useful placeholders before a loop or calculation fills them.",
              "np.arange(start, stop, step) excludes the stop value, like range().",
              "np.linspace(start, stop, count) includes both endpoints and gives you a chosen number of points.",
            ],
          },
          {
            type: "callout",
            tone: "note",
            title: "Shape is a tuple",
            text: "A one-dimensional array of four values has shape (4,). A two-row, three-column array has shape (2, 3). The trailing comma matters in the one-dimensional case: (4,) is a tuple with one item, not the number 4.",
          },
        ],
      },
      {
        id: "shape-and-axes",
        title: "Shape, dimensions, and axes",
        blocks: [
          {
            type: "text",
            text: "Shape tells you how many values sit along each axis. For a table-like array, axis 0 runs down the rows and axis 1 runs across the columns. Reduction methods such as sum accept an axis argument, which chooses the direction that gets collapsed.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\ngrid = np.array([[1, 2, 3], [4, 5, 6]])\n\nprint(grid)\nprint(grid.shape)\nprint(grid.ndim)\nprint(grid.sum(axis=0))\nprint(grid.sum(axis=1))',
            language: "python",
            caption: "A 2 by 3 grid and its reductions",
            output: "[[1 2 3]\n [4 5 6]]\n(2, 3)\n2\n[5 7 9]\n[ 6 15]",
            runnable: true,
          },
          {
            type: "text",
            text: "grid.sum(axis=0) collapses the rows and returns one total per column: [5, 7, 9]. grid.sum(axis=1) collapses the columns and returns one total per row: [6, 15]. When an axis is collapsed, it disappears from the result's shape.",
          },
          {
            type: "table",
            caption: "Reading the grid",
            headers: ["Expression", "Result", "What happened"],
            rows: [
              ["grid.shape", "(2, 3)", "2 rows, 3 columns"],
              ["grid.ndim", "2", "Two axes"],
              ["grid.sum(axis=0)", "[5, 7, 9]", "Columns collapsed"],
              ["grid.sum(axis=1)", "[6, 15]", "Rows collapsed"],
            ],
          },
        ],
      },
      {
        id: "indexing-slicing",
        title: "Indexing, slicing, and masks",
        blocks: [
          {
            type: "text",
            text: "Array indexing starts at zero, just like a list. Slices keep the start and drop the stop. The difference is that a NumPy slice returns another array, and you can use a boolean array as an index to keep only the positions where the condition is true.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nvalues = np.array([4, 8, 15, 16, 23, 42])\n\nprint(values[1])\nprint(values[1:4])\nprint(values[::2])\nprint(values[values > 15])',
            language: "python",
            caption: "Position, slice, step, and mask",
            output: "8\n[ 8 15 16]\n[ 4 15 23]\n[16 23 42]",
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "values[1] selects one value and returns a NumPy scalar.",
              "values[1:4] selects positions 1, 2, and 3; the stop index is excluded.",
              "values[::2] takes every second value from start to finish.",
              "values[values > 15] keeps the entries where the mask is True.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Masks are arrays too",
            text: "The expression values > 15 produces a boolean array such as [False, False, False, True, True, True]. Passing that array inside the brackets filters values instead of choosing one position.",
          },
        ],
      },
      {
        id: "dtype",
        title: "One dtype for the whole array",
        blocks: [
          {
            type: "text",
            text: "Because every slot has the same size, NumPy stores a single dtype for the array. When you mix integers and floats, the result has to promote to a type that can hold both. You can inspect the dtype and convert explicitly with astype.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nmixed = np.array([1, 2.5, 3])\n\nprint(mixed)\nprint(mixed.dtype)\nprint(mixed.astype("int64"))',
            language: "python",
            caption: "Promotion and explicit conversion",
            output: "[1.  2.5 3. ]\nfloat64\n[1 2 3]",
            runnable: true,
          },
          {
            type: "text",
            text: "The decimal values forced the whole array to float64. astype(\"int64\") then created a new integer array, truncating toward zero. The default integer width can vary by platform, including WebAssembly, so name a dtype when exact storage matters.",
          },
          {
            type: "callout",
            tone: "note",
            title: "Conversion copies",
            text: "astype returns a new array with the requested dtype; it does not mutate the original in place. That is usually what you want, but it does mean large conversions allocate more memory.",
          },
        ],
      },
      {
        id: "putting-it-together",
        title: "Putting it together",
        blocks: [
          {
            type: "text",
            text: "A short analysis usually combines construction, a mask, an aggregation, and vectorized arithmetic. The example below filters a week of temperatures, computes an average, and standardizes the values so each one describes its distance from the mean in standard deviations.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\ntemps = np.array([12.0, 15.5, 9.0, 21.0])\nabove_twelve = temps[temps > 12]\nz_scores = (temps - temps.mean()) / temps.std()\n\nprint(temps)\nprint(temps.mean())\nprint(above_twelve)\nprint(z_scores)',
            language: "python",
            caption: "Filter, summarize, and standardize",
            runnable: true,
          },
          {
            type: "text",
            text: "Notice that none of these steps needed an explicit loop. The array carries its shape through each operation, and NumPy applies the arithmetic element by element. The next lesson extends that idea to arrays with different but compatible shapes.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "convert-temperatures",
        prompt:
          "Convert the Celsius readings to Fahrenheit with vectorized array arithmetic. Keep the result as a NumPy array.",
        starterCode: `import numpy as np

celsius = np.array([12.0, 15.5, 9.0, 21.0])
fahrenheit = None`,
        tests: [
          {
            name: "fahrenheit is a NumPy array",
            code: 'assert isinstance(fahrenheit, np.ndarray), f"expected a NumPy array, got {type(fahrenheit).__name__}"',
          },
          {
            name: "the shape is preserved",
            code: 'assert fahrenheit.shape == (4,), f"expected shape (4,), got {fahrenheit.shape}"',
          },
          {
            name: "every value uses the conversion formula",
            code: 'expected = celsius * 9 / 5 + 32\nassert np.allclose(fahrenheit, expected), f"expected {expected}, got {fahrenheit}"',
          },
        ],
        hints: [
          "Fahrenheit is Celsius times 9/5, plus 32.",
          "Write one expression that uses the whole celsius array at once; no loop is needed.",
        ],
        solution: `import numpy as np

celsius = np.array([12.0, 15.5, 9.0, 21.0])
fahrenheit = celsius * 9 / 5 + 32

print(fahrenheit)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "list-versus-array",
        question: "What does np.array([1, 2, 3]) * 2 produce?",
        options: [
          { id: "repeat", label: "[1, 2, 3, 1, 2, 3]" },
          { id: "scale", label: "[2, 4, 6]" },
          { id: "error", label: "A TypeError" },
        ],
        answerId: "scale",
        explanation:
          "Array multiplication is elementwise, so every value is doubled. A Python list would repeat instead, which is why converting to an array changes the meaning of arithmetic.",
      },
      {
        id: "shape-result",
        question: "What is np.ones((3, 2)).shape?",
        options: [
          { id: "three-two", label: "(3, 2)" },
          { id: "two-three", label: "(2, 3)" },
          { id: "six", label: "(6,)" },
        ],
        answerId: "three-two",
        explanation:
          "Shape is written in axis order: 3 rows and 2 columns. np.ones fills that shape without changing it.",
      },
      {
        id: "axis-zero",
        question:
          "For a 2D array, what does grid.sum(axis=0) return?",
        options: [
          { id: "columns", label: "One total per column" },
          { id: "rows", label: "One total per row" },
          { id: "scalar", label: "A single total for the whole array" },
        ],
        answerId: "columns",
        explanation:
          "axis=0 is the row axis. Summing over it collapses the rows and leaves one value for each column.",
      },
    ],
    next: {
      label: "Continue to broadcasting and aggregation",
      href: "/learn/numpy/broadcasting",
    },
  },
  {
    id: "numpy-broadcasting",
    library: "numpy",
    slug: "broadcasting",
    title: "Broadcasting and aggregation without loops",
    summary:
      "Combine arrays of different shapes, reduce values along an axis, and use keepdims to keep the dimensions you still need.",
    minutes: 9,
    level: "beginner",
    packages: ["numpy"],
    objectives: [
      "Predict whether two array shapes can broadcast.",
      "Add a row or column to a matrix without writing a loop.",
      "Choose the right axis for sum, mean, and standard deviation.",
      "Use keepdims to preserve a reduced axis for later arithmetic.",
    ],
    sections: [
      {
        id: "shape-rules",
        title: "How broadcasting works",
        blocks: [
          {
            type: "text",
            text: "Broadcasting is NumPy's rule for combining arrays whose shapes differ. It compares shapes from right to left. A dimension of 1 can stretch to match the other side, and a missing leading dimension is treated as 1. If two dimensions are different and neither is 1, the operation fails.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nmatrix = np.array([[1, 2, 3], [4, 5, 6]])\nrow = np.array([10, 20, 30])\ncolumn = np.array([[100], [200]])\n\nprint(matrix + row)\nprint(matrix + column)',
            language: "python",
            caption: "A row and a column broadcast in different directions",
            output: "[[11 22 33]\n [14 25 36]]\n[[101 102 103]\n [204 205 206]]",
            runnable: true,
          },
          {
            type: "text",
            text: "The row has shape (3,), which aligns with the matrix's last axis. NumPy reuses that row for both rows of the matrix. The column has shape (2, 1): its single column stretches across all three columns. In both cases, the smaller array is not copied by hand; NumPy applies the values logically during the operation.",
          },
          {
            type: "table",
            caption: "Common shape combinations",
            headers: ["Left shape", "Right shape", "Result", "Why"],
            rows: [
              ["(2, 3)", "(3,)", "(2, 3)", "Row repeats for each matrix row"],
              ["(2, 3)", "(2, 1)", "(2, 3)", "Column repeats across columns"],
              ["(2, 3)", "(1, 3)", "(2, 3)", "Leading 1 stretches to 2"],
              ["(2, 3)", "(2,)", "error", "Rightmost 3 and 2 conflict"],
            ],
          },
        ],
      },
      {
        id: "aggregations",
        title: "Aggregations and axes",
        blocks: [
          {
            type: "text",
            text: "Aggregations reduce an array to fewer values. Without an axis, a reduction collapses everything to one scalar. With an axis, it collapses only that axis and keeps the others. The axis you choose is the direction that disappears from the result.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nscores = np.array([[80, 90, 70], [60, 75, 85]])\n\nprint(scores.sum())\nprint(scores.mean(axis=0))\nprint(scores.mean(axis=1))\nprint(scores.std(axis=1))',
            language: "python",
            caption: "Totals, means, and variation along each axis",
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "scores.sum() returns one number for the whole array.",
              "scores.mean(axis=0) collapses rows and returns one mean per column.",
              "scores.mean(axis=1) collapses columns and returns one mean per row.",
              "scores.std(axis=1) returns the spread within each row.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Name the axis out loud",
            text: "For axis=1, say: move across each row and collapse the columns. For axis=0, say: move down each column and collapse the rows. The sentence and the result usually agree.",
          },
        ],
      },
      {
        id: "keepdims",
        title: "Keep the dimension you need",
        blocks: [
          {
            type: "text",
            text: "A reduction normally removes the collapsed axis. That is fine when you only need the summary, but it can break the next broadcast. keepdims=True leaves the reduced axis in place with length 1, which is exactly the shape broadcasting can stretch.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nscores = np.array([[80, 90, 70], [60, 75, 85]])\nrow_means = scores.mean(axis=1, keepdims=True)\ncentered = scores - row_means\n\nprint(row_means)\nprint(centered)\nprint(centered.mean(axis=1))',
            language: "python",
            caption: "Center each row on its own mean",
            runnable: true,
          },
          {
            type: "text",
            text: "row_means has shape (2, 1), so subtracting it from scores with shape (2, 3) broadcasts one mean down each row. Without keepdims, row_means would have shape (2,), which would try to align the 2 with the 3 columns and fail.",
          },
        ],
      },
      {
        id: "common-mistakes",
        title: "Where broadcasting goes wrong",
        blocks: [
          {
            type: "list",
            ordered: false,
            items: [
              "Adding a three-value array to a four-column matrix fails because 3 and 4 are neither equal nor 1.",
              "Subtracting row means with shape (2,) from a (2, 3) matrix fails; use keepdims=True to get (2, 1).",
              "Passing the wrong axis can give a correct-looking result with the wrong meaning, so check the result shape.",
              "In-place operations such as arr += row change the original array; make a copy first if other code still needs it.",
            ],
          },
          {
            type: "callout",
            tone: "warning",
            title: "Broadcasting does not guess intent",
            text: "If two shapes conflict, NumPy raises an error instead of choosing a direction. Reshape one side explicitly when you know which axis you meant.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "center-rows",
        prompt:
          "Subtract each row's mean from that row. Keep the result in an array with the same shape as scores.",
        starterCode: `import numpy as np

scores = np.array([
    [80, 90, 70, 85],
    [60, 75, 85, 70],
    [95, 88, 92, 90],
])
centered = None`,
        tests: [
          {
            name: "centered is a NumPy array",
            code: 'assert isinstance(centered, np.ndarray), f"expected a NumPy array, got {type(centered).__name__}"',
          },
          {
            name: "the shape matches scores",
            code: 'assert centered.shape == scores.shape, f"expected {scores.shape}, got {centered.shape}"',
          },
          {
            name: "every row now has mean zero",
            code: 'row_means = centered.mean(axis=1)\nassert np.allclose(row_means, 0), f"row means are {row_means}"',
          },
          {
            name: "the values match row-wise centering",
            code: 'expected = scores - scores.mean(axis=1, keepdims=True)\nassert np.allclose(centered, expected), "the centered values do not match"',
          },
        ],
        hints: [
          "Compute the row means with axis=1.",
          "Pass keepdims=True so the means have shape (3, 1), not (3,).",
          "Subtract the means from scores with one array expression.",
        ],
        solution: `import numpy as np

scores = np.array([
    [80, 90, 70, 85],
    [60, 75, 85, 70],
    [95, 88, 92, 90],
])
centered = scores - scores.mean(axis=1, keepdims=True)

print(centered)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "broadcast-shapes",
        question: "What is the shape of np.ones((3, 1)) + np.ones((1, 4))?",
        options: [
          { id: "three-four", label: "(3, 4)" },
          { id: "four-three", label: "(4, 3)" },
          { id: "error", label: "A broadcasting error" },
        ],
        answerId: "three-four",
        explanation:
          "The 1 in each shape stretches to the other side: 3 stays 3 and 1 becomes 4 in the first dimension, while 1 becomes 3 and 4 stays 4 in the second. The result is (3, 4).",
      },
      {
        id: "axis-one-mean",
        question: "What does matrix.mean(axis=1) return for a 2D matrix?",
        options: [
          { id: "rows", label: "One mean per row" },
          { id: "columns", label: "One mean per column" },
          { id: "scalar", label: "One mean for the whole matrix" },
        ],
        answerId: "rows",
        explanation:
          "axis=1 is the column direction within each row. Collapsing it leaves one value per row.",
      },
      {
        id: "keepdims-purpose",
        question: "Why use keepdims=True on a row-mean reduction?",
        options: [
          { id: "shape", label: "It preserves the reduced axis as length 1, so the result can broadcast back" },
          { id: "precision", label: "It increases floating-point precision" },
          { id: "sort", label: "It sorts the rows before reducing" },
        ],
        answerId: "shape",
        explanation:
          "keepdims keeps the axis in the result with length 1. A (3, 1) mean can broadcast across a (3, 4) matrix; a (3,) mean cannot.",
      },
    ],
    next: {
      label: "Continue to randomness and linear algebra",
      href: "/learn/numpy/random-linear-algebra",
    },
  },
  {
    id: "numpy-random-linalg",
    library: "numpy",
    slug: "random-linear-algebra",
    title: "Randomness and linear algebra",
    summary:
      "Generate reproducible random data with a seeded Generator, then use matrix products and solve to work with systems of equations.",
    minutes: 10,
    level: "beginner",
    packages: ["numpy"],
    objectives: [
      "Create reproducible random values with np.random.default_rng.",
      "Choose between elementwise multiplication and the @ matrix product.",
      "Check matrix shapes before multiplying.",
      "Solve a linear system without computing an explicit inverse.",
    ],
    sections: [
      {
        id: "generators",
        title: "Random numbers from a Generator",
        blocks: [
          {
            type: "text",
            text: "Modern NumPy uses a Generator object created by np.random.default_rng(). The generator has methods for common distributions: integers draws whole numbers, normal draws from a bell curve, and permutation shuffles a sequence.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nrng = np.random.default_rng(7)\n\nprint(rng.integers(1, 7, size=5))\nprint(rng.normal(loc=20, scale=3, size=4))\nprint(rng.permutation(np.arange(5)))',
            language: "python",
            caption: "Dice, sensor noise, and a shuffled range",
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "rng.integers(low, high, size) includes low and excludes high, just like range().",
              "rng.normal(loc, scale, size) uses the mean and standard deviation you provide.",
              "rng.permutation(values) returns a shuffled copy of the sequence.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Keep one generator",
            text: "Create the generator once near the top of your program and pass it to the functions that need randomness. Re-seeding inside a loop can produce repeated blocks of values.",
          },
        ],
      },
      {
        id: "seeds",
        title: "Seeds make a run reproducible",
        blocks: [
          {
            type: "text",
            text: "A seed initializes the generator's internal state. Two generators created with the same seed and asked for the same sequence produce the same values. That does not make the values predictable in a security sense; it makes experiments repeatable.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nfirst = np.random.default_rng(42).normal(size=3)\nsecond = np.random.default_rng(42).normal(size=3)\n\nprint(np.array_equal(first, second))',
            language: "python",
            caption: "Same seed, same starting stream",
            output: "True",
            runnable: true,
          },
          {
            type: "text",
            text: "The exact numbers can change across NumPy versions, so do not build tests around a hard-coded stream. Test the properties you care about, such as shape, range, or a seeded comparison within the same run.",
          },
        ],
      },
      {
        id: "matrix-products",
        title: "Elementwise multiplication versus matrix products",
        blocks: [
          {
            type: "text",
            text: "The * operator multiplies matching positions. The @ operator performs a matrix product, where each output value is a dot product of a row from the left and a column from the right. They answer different questions and are not interchangeable.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nA = np.array([[1, 2], [3, 4]])\nB = np.array([[5, 6], [7, 8]])\n\nprint(A * B)\nprint(A @ B)',
            language: "python",
            caption: "The same two matrices, two operations",
            output: "[[ 5 12]\n [21 32]]\n[[19 22]\n [43 50]]",
            runnable: true,
          },
          {
            type: "text",
            text: "For A @ B, the inner dimensions must agree. A has shape (2, 2) and B has shape (2, 2), so the result is (2, 2). If A were (4, 2) and B were (2, 3), the inner 2s would match and the result would be (4, 3).",
          },
          {
            type: "callout",
            tone: "warning",
            title: "A * B is not A @ B",
            text: "If you mean linear algebra, write @. The star operator is elementwise, even when both arrays are square matrices.",
          },
        ],
      },
      {
        id: "solving-systems",
        title: "Solving a linear system",
        blocks: [
          {
            type: "text",
            text: "A system such as A @ x = b asks for the vector x that satisfies every equation. np.linalg.solve(A, b) computes that solution directly. It is more stable and usually faster than multiplying by np.linalg.inv(A).",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nA = np.array([[2.0, 1.0], [1.0, 3.0]])\nb = np.array([5.0, 10.0])\n\nx = np.linalg.solve(A, b)\n\nprint(x)\nprint(A @ x)',
            language: "python",
            caption: "Find x, then verify the original equation",
            runnable: true,
          },
          {
            type: "text",
            text: "The verification A @ x should reproduce b, up to small floating-point differences. Keep that check in your notebook or test: it catches shape mistakes and accidental elementwise multiplication.",
          },
          {
            type: "callout",
            tone: "note",
            title: "Not every system has a unique solution",
            text: "If the equations are inconsistent or redundant, solve may raise LinAlgError or return a least-squares result depending on the function. For this lesson, the matrices are chosen to have a unique solution.",
          },
        ],
      },
      {
        id: "simulation",
        title: "A small seeded simulation",
        blocks: [
          {
            type: "text",
            text: "Randomness is useful for simulating measurements. The example below draws one hundred readings from a normal distribution, then summarizes them with the same aggregations from the previous lesson.",
          },
          {
            type: "code",
            code: 'import numpy as np\n\nrng = np.random.default_rng(2026)\nreadings = rng.normal(loc=21.0, scale=1.5, size=100)\n\nprint(readings.mean())\nprint(readings.std())\nprint(readings[readings > 22].size)',
            language: "python",
            caption: "Simulate, then summarize",
            runnable: true,
          },
          {
            type: "text",
            text: "Change the seed and the sample changes. Keep the seed fixed when you want a stable demonstration, and remove the fixed seed when you want a genuinely new sample each run.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "solve-system",
        prompt:
          "Solve A @ x = b for x using NumPy's linear algebra function. Keep x as a one-dimensional array.",
        starterCode: `import numpy as np

A = np.array([[2.0, 1.0], [1.0, 3.0]])
b = np.array([5.0, 10.0])
x = None`,
        tests: [
          {
            name: "x is a NumPy array",
            code: 'assert isinstance(x, np.ndarray), f"expected a NumPy array, got {type(x).__name__}"',
          },
          {
            name: "x has one value per unknown",
            code: 'assert x.shape == (2,), f"expected shape (2,), got {x.shape}"',
          },
          {
            name: "the solution satisfies the system",
            code: 'assert np.allclose(A @ x, b), f"A @ x is {A @ x}, expected {b}"',
          },
          {
            name: "the solution matches the unique answer",
            code: 'assert np.allclose(x, [1.0, 3.0]), f"expected [1. 3.], got {x}"',
          },
        ],
        hints: [
          "Use np.linalg.solve(A, b).",
          "You do not need to invert A or compute it by hand.",
          "After solving, A @ x should be close to b.",
        ],
        solution: `import numpy as np

A = np.array([[2.0, 1.0], [1.0, 3.0]])
b = np.array([5.0, 10.0])
x = np.linalg.solve(A, b)

print(x)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "matrix-product",
        question: "What does A @ B compute?",
        options: [
          { id: "matrix", label: "The matrix product of A and B" },
          { id: "elementwise", label: "The elementwise product of A and B" },
          { id: "transpose", label: "The transpose of A times B" },
        ],
        answerId: "matrix",
        explanation:
          "The @ operator is matrix multiplication. The * operator is elementwise, so the two can produce very different results.",
      },
      {
        id: "seed-reproducibility",
        question: "Why do two default_rng(42) generators produce the same starting values?",
        options: [
          { id: "seed", label: "The seed initializes the same deterministic stream" },
          { id: "global", label: "All generators share one global state" },
          { id: "cache", label: "NumPy caches the last random array" },
        ],
        answerId: "seed",
        explanation:
          "A seed sets the generator's initial state. Reusing the seed recreates the same stream, which is useful for repeatable experiments.",
      },
      {
        id: "product-shape",
        question: "What is the shape of a (4, 2) matrix multiplied by a (2, 3) matrix?",
        options: [
          { id: "four-three", label: "(4, 3)" },
          { id: "two-two", label: "(2, 2)" },
          { id: "error", label: "A shape error" },
        ],
        answerId: "four-three",
        explanation:
          "The inner dimensions are both 2, so they match. The outer dimensions 4 and 3 become the result shape: (4, 3).",
      },
    ],
  },
];
