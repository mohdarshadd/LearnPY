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
  },
];
