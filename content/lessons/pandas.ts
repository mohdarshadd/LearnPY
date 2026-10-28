import type { Lesson } from "@/content/schema";

export const pandasLessons: Lesson[] = [
  {
    id: "pandas-dataframes",
    library: "pandas",
    slug: "dataframes",
    title: "pandas DataFrames: labeled tables that compute",
    summary:
      "Build a DataFrame, add calculated columns, inspect its shape and dtypes, and load the same structure from CSV text.",
    minutes: 10,
    level: "beginner",
    packages: ["pandas"],
    objectives: [
      "Explain how a DataFrame relates to named Series columns.",
      "Create a DataFrame from a Python dictionary.",
      "Add a calculated column without writing a loop.",
      "Inspect shape, columns, dtypes, and summary statistics.",
      "Read comma-separated text into a DataFrame.",
    ],
    sections: [
      {
        id: "tables-with-names",
        title: "Tables with names",
        blocks: [
          {
            type: "text",
            text: "A pandas DataFrame is a two-dimensional table with row labels and column labels. Each column is a Series: a one-dimensional array with an index. NumPy gives you fast numeric blocks; pandas adds names, alignment, and table-shaped operations on top.",
          },
          {
            type: "code",
            code: `import pandas as pd

units = pd.Series([12, 7, 9, 15], name="units")
print(units)
print(units.sum())`,
            language: "python",
            caption: "A Series is one named column",
            output: `0    12
1     7
2     9
3    15
Name: units, dtype: int64
43`,
            runnable: true,
          },
          {
            type: "text",
            text: "The numbers on the left are index labels, not values. By default pandas creates a RangeIndex starting at 0. The values on the right are the data. A DataFrame stacks several Series that share the same index.",
          },
          {
            type: "callout",
            tone: "note",
            title: "Rows and columns both have labels",
            text: "Use df.index for row labels and df.columns for column labels. Label-based selection stays correct even after rows are filtered or reordered, which is why pandas code rarely depends on raw positions.",
          },
        ],
      },
      {
        id: "build-a-frame",
        title: "Build a frame from a dictionary",
        blocks: [
          {
            type: "text",
            text: "The most direct way to create a small DataFrame is a dictionary of equal-length lists. Each key becomes a column name. Once the frame exists, arithmetic between columns is vectorized, just like NumPy.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West"],
    "units": [12, 7, 9, 15],
    "price": [5.0, 8.0, 5.0, 6.5],
})

sales["revenue"] = sales["units"] * sales["price"]
print(sales)`,
            language: "python",
            caption: "Create a table, then add a calculated column",
            output: `  region  units  price  revenue
0  North     12    5.0     60.0
1  South      7    8.0     56.0
2  North      9    5.0     45.0
3   West     15    6.5     97.5`,
            runnable: true,
          },
          {
            type: "list",
            ordered: true,
            items: [
              "The dictionary keys become column labels.",
              "Each list supplies the values for one column, in row order.",
              "Assigning sales[\"revenue\"] creates a new column aligned by row index.",
              "The multiplication runs across the whole column at once.",
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Prefer column expressions",
            text: "If you catch yourself looping over DataFrame rows to calculate a column, stop and check whether the operation can be written as arithmetic between columns. Vectorized expressions are shorter and usually much faster.",
          },
        ],
      },
      {
        id: "inspect",
        title: "Inspect before you trust",
        blocks: [
          {
            type: "text",
            text: "Real tables arrive with surprises: missing values, numbers stored as text, duplicated rows, or columns you did not expect. Start with a small set of checks rather than jumping straight to a chart.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West"],
    "units": [12, 7, 9, 15],
    "price": [5.0, 8.0, 5.0, 6.5],
})

print(sales.shape)
print(sales.columns.tolist())
print(sales.dtypes)
print(sales.head(2))`,
            language: "python",
            caption: "Four quick checks",
            runnable: true,
          },
          {
            type: "table",
            caption: "What each check tells you",
            headers: ["Expression", "Question it answers"],
            rows: [
              ["sales.shape", "How many rows and columns are there?"],
              ["sales.columns", "What are the column names?"],
              ["sales.dtypes", "Is each column numeric, text, boolean, or datetime?"],
              ["sales.head()", "What do the first rows actually look like?"],
              ["sales.describe()", "What are the numeric ranges, centers, and spreads?"],
            ],
          },
          {
            type: "text",
            text: "describe is a quick numeric summary, not a data-quality audit. It reports count, mean, standard deviation, quartiles, and extremes for numeric columns. A count below the number of rows is a clue that values are missing.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Text numbers do not add",
            text: "If a price column has dtype str or object, arithmetic may fail or concatenate text. Inspect dtypes early and convert deliberately with pd.to_numeric when a column should be numeric.",
          },
        ],
      },
      {
        id: "read-csv",
        title: "Read the same shape from CSV",
        blocks: [
          {
            type: "text",
            text: "In practice, most tables come from files or URLs rather than dictionaries. pd.read_csv parses delimited text into a DataFrame and infers column types. The StringIO example below keeps the lesson runnable without a local file.",
          },
          {
            type: "code",
            code: `from io import StringIO
import pandas as pd

csv = """region,units,price
North,12,5.0
South,7,8.0
North,9,5.0
West,15,6.5
"""

sales = pd.read_csv(StringIO(csv))
print(sales)
print(sales["units"].sum())`,
            language: "python",
            caption: "Parse CSV text into a DataFrame",
            output: `  region  units  price
0  North     12    5.0
1  South      7    8.0
2  North      9    5.0
3   West     15    6.5
43`,
            runnable: true,
          },
          {
            type: "text",
            text: "read_csv returns a new DataFrame. It does not modify the file. Useful starting arguments include sep for a different delimiter, usecols to keep only selected columns, and dtype to control how a column is parsed.",
          },
          {
            type: "callout",
            tone: "note",
            title: "Check the inferred dtypes",
            text: "CSV files have no type information. pandas infers types from the text it sees, so a column with one stray label can become text. Run dtypes after loading and fix the types you rely on.",
          },
        ],
      },
      {
        id: "row-labels",
        title: "Row labels and new columns",
        blocks: [
          {
            type: "text",
            text: "Columns are selected with brackets. A single string returns a Series; a list of strings returns a DataFrame with those columns. New columns are created by assigning a Series or a scalar to a name that does not exist yet.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West"],
    "units": [12, 7, 9, 15],
    "price": [5.0, 8.0, 5.0, 6.5],
})

sales["revenue"] = sales["units"] * sales["price"]
sales["bulk"] = sales["units"] >= 10
print(sales[["region", "revenue", "bulk"]])`,
            language: "python",
            caption: "Keep only the columns you need",
            output: `  region  revenue   bulk
0  North     60.0   True
1  South     56.0  False
2  North     45.0  False
3   West     97.5   True`,
            runnable: true,
          },
          {
            type: "text",
            text: "The row labels stayed 0 through 3 because this frame uses the default index. Filtering later keeps the original labels, which is useful for traceability but can look surprising until you reset the index deliberately.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "book-inventory",
        prompt:
          "Create a DataFrame named books with the supplied title, copies, and price data. Add a column named value that multiplies copies by price.",
        starterCode: `import pandas as pd

books = pd.DataFrame({
    "title": ["Dune", "Emma", "The Hobbit"],
    "copies": [4, 2, 6],
    "price": [9.0, 7.5, 12.0],
})

# Add a calculated value column.
`,
        tests: [
          {
            name: "books is a DataFrame",
            code: 'assert isinstance(books, pd.DataFrame), f"expected a DataFrame, got {type(books).__name__}"',
          },
          {
            name: "value is a new column",
            code: 'assert "value" in books.columns, "expected a column named value"',
          },
          {
            name: "value multiplies copies by price",
            code: 'expected = books["copies"] * books["price"]\nassert (books["value"] == expected).all(), f"expected {expected.tolist()}, got {books[\'value\'].tolist()}"',
          },
          {
            name: "the table still has three rows",
            code: 'assert len(books) == 3, f"expected 3 rows, got {len(books)}"',
          },
        ],
        hints: [
          "Assign to books[\"value\"].",
          "Multiply the copies Series by the price Series.",
        ],
        solution: `import pandas as pd

books = pd.DataFrame({
    "title": ["Dune", "Emma", "The Hobbit"],
    "copies": [4, 2, 6],
    "price": [9.0, 7.5, 12.0],
})

books["value"] = books["copies"] * books["price"]
print(books)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "series-or-frame",
        question: "What does sales[\"units\"] return when sales is a DataFrame?",
        options: [
          { id: "series", label: "A Series for that one column" },
          { id: "frame", label: "A DataFrame with one column" },
          { id: "list", label: "A Python list of values" },
        ],
        answerId: "series",
        explanation:
          "A single string selects one column and returns a Series. Passing a list such as sales[[\"units\"]] returns a DataFrame instead.",
      },
      {
        id: "shape-check",
        question: "A DataFrame has 120 rows and 5 columns. What is df.shape?",
        options: [
          { id: "five", label: "(5, 120)" },
          { id: "correct", label: "(120, 5)" },
          { id: "rows", label: "120" },
        ],
        answerId: "correct",
        explanation:
          "Shape is always (rows, columns), so the row count comes first.",
      },
      {
        id: "dtype-clue",
        question: "A price column reports dtype str. What should you suspect?",
        options: [
          { id: "numeric", label: "The values are numeric and ready for arithmetic" },
          { id: "text", label: "At least some values were loaded as text" },
          { id: "missing", label: "Every value is missing" },
        ],
        answerId: "text",
        explanation:
          "A string dtype means pandas saw text in that column. Convert it deliberately, for example with pd.to_numeric, before doing arithmetic.",
      },
    ],
    next: {
      label: "Select rows and columns",
      href: "/learn/pandas/selection",
    },
  },
  {
    id: "pandas-selection",
    library: "pandas",
    slug: "selection",
    title: "Selecting rows and columns with confidence",
    summary:
      "Use brackets, loc, iloc, boolean masks, and query to pull out exactly the rows and columns you mean.",
    minutes: 11,
    level: "beginner",
    packages: ["pandas"],
    objectives: [
      "Select one column or several columns with brackets.",
      "Use loc for label-based selection and iloc for position-based selection.",
      "Combine conditions with boolean masks.",
      "Write readable filters with query.",
      "Sort results and assign new values without chained indexing.",
    ],
    sections: [
      {
        id: "columns-first",
        title: "Columns first",
        blocks: [
          {
            type: "text",
            text: "Most selection starts with columns. A single column name returns a Series; a list of names returns a DataFrame. Keeping that distinction straight prevents a lot of confusing shape errors.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West"],
    "units": [12, 7, 9, 15],
    "price": [5.0, 8.0, 5.0, 6.5],
})
sales["revenue"] = sales["units"] * sales["price"]

print(sales["units"])
print(sales[["region", "revenue"]])`,
            language: "python",
            caption: "One column versus a column list",
            runnable: true,
          },
          {
            type: "callout",
            tone: "note",
            title: "Two brackets, two meanings",
            text: "The outer brackets perform the selection; the inner brackets build a list of column names. sales[[\"region\", \"revenue\"]] means \"select these two columns.\"",
          },
        ],
      },
      {
        id: "loc",
        title: ".loc selects by label",
        blocks: [
          {
            type: "text",
            text: "loc uses row and column labels. The syntax is df.loc[row_selector, column_selector]. Both selectors can be a single label, a list of labels, a slice, or a boolean Series.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West"],
    "units": [12, 7, 9, 15],
    "price": [5.0, 8.0, 5.0, 6.5],
})
sales["revenue"] = sales["units"] * sales["price"]

print(sales.loc[0, "units"])
print(sales.loc[sales["region"] == "North", ["region", "revenue"]])`,
            language: "python",
            caption: "A label and a label-based filter",
            output: `12
  region  revenue
0  North     60.0
2  North     45.0`,
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "sales.loc[0, \"units\"] selects the row labeled 0 and the column named units.",
              "The row selector can be a boolean Series, which keeps only the True rows.",
              "The column selector can be a list, which keeps only those columns.",
              "A slice in loc includes its ending label, unlike a normal Python slice.",
            ],
          },
        ],
      },
      {
        id: "iloc",
        title: ".iloc selects by position",
        blocks: [
          {
            type: "text",
            text: "iloc ignores labels and uses integer positions, like a NumPy array. It is useful when you want the first three rows or columns regardless of what they are called. Positions are zero-based and slices exclude the stop.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West"],
    "units": [12, 7, 9, 15],
    "price": [5.0, 8.0, 5.0, 6.5],
})

print(sales.iloc[0])
print(sales.iloc[1:3, 0:2])`,
            language: "python",
            caption: "A row by position and a rectangular slice",
            output: `region    North
units        12
price       5.0
Name: 0, dtype: object
  region  units
1  South      7
2  North      9`,
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Do not mix loc and iloc",
            text: "sales.loc[1:3] includes the row labeled 3. sales.iloc[1:3] stops before position 3. The difference matters as soon as a filtered frame has non-consecutive labels.",
          },
        ],
      },
      {
        id: "masks",
        title: "Boolean masks and query",
        blocks: [
          {
            type: "text",
            text: "A comparison on a column produces a boolean Series. Pass that mask inside brackets to keep the True rows. Combine conditions with & for and, | for or, and ~ for not; wrap each comparison in parentheses.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West"],
    "units": [12, 7, 9, 15],
    "price": [5.0, 8.0, 5.0, 6.5],
})
sales["revenue"] = sales["units"] * sales["price"]

big = sales[(sales["units"] >= 10) & (sales["price"] < 7)]
print(big)
print(sales.query("region == 'North' and units >= 10"))`,
            language: "python",
            caption: "Two conditions, two spellings",
            output: `  region  units  price  revenue
0  North     12    5.0     60.0
3   West     15    6.5     97.5
  region  units  price  revenue
0  North     12    5.0     60.0`,
            runnable: true,
          },
          {
            type: "text",
            text: "query is a readable alternative that refers to column names as if they were variables. It is handy for multi-condition filters, though ordinary boolean masks are often clearer when the conditions are built dynamically.",
          },
          {
            type: "callout",
            tone: "warning",
            title: "Wrap every comparison",
            text: "Without parentheses, Python evaluates parts of the expression in the wrong order. Write (sales[\"units\"] >= 10) & (sales[\"price\"] < 7), not sales[\"units\"] >= 10 & sales[\"price\"] < 7.",
          },
        ],
      },
      {
        id: "sort-and-assign",
        title: "Sort, then assign safely",
        blocks: [
          {
            type: "text",
            text: "sort_values returns a new frame in the requested order. Sorting is usually the last step before displaying a result. To change values, assign to a column directly rather than chaining selection and assignment across two indexing operations.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West"],
    "units": [12, 7, 9, 15],
    "price": [5.0, 8.0, 5.0, 6.5],
})
sales["revenue"] = sales["units"] * sales["price"]

top = sales.sort_values("revenue", ascending=False).head(3)
sales["discounted"] = sales["price"] * 0.9
print(top)
print(sales[["region", "price", "discounted"]].head(2))`,
            language: "python",
            caption: "Sort a copy, then add a column to the original",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Avoid chained assignment",
            text: "A pattern such as sales[sales[\"units\"] > 10][\"price\"] = 0 often writes to a temporary object and may warn or silently miss the original frame. Assign back to the filtered rows in one deliberate step instead.",
          },
        ],
      },
      {
        id: "selection-recipe",
        title: "A selection recipe",
        blocks: [
          {
            type: "text",
            text: "The order below keeps mistakes visible: filter rows first, then keep the columns you need, then sort for presentation. You can inspect the intermediate frame at any point instead of hiding the whole chain in one enormous expression.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West"],
    "units": [12, 7, 9, 15],
    "price": [5.0, 8.0, 5.0, 6.5],
})
sales["revenue"] = sales["units"] * sales["price"]

result = (
    sales[sales["units"] >= 10]
    .loc[:, ["region", "units", "revenue"]]
    .sort_values("revenue", ascending=False)
)
print(result)`,
            language: "python",
            caption: "Filter, project, and order",
            runnable: true,
          },
          {
            type: "text",
            text: "This recipe uses a boolean mask for rows, loc with a colon to keep every row and a column list to choose fields, and sort_values to order the output. The next lesson groups rows rather than selecting them.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "north-revenue",
        prompt:
          "Filter sales to North region rows with at least 10 units. Keep only the region and revenue columns, then sort by revenue from highest to lowest and assign the result to result.",
        starterCode: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West"],
    "units": [12, 7, 9, 15],
    "price": [5.0, 8.0, 5.0, 6.5],
})
sales["revenue"] = sales["units"] * sales["price"]

# Filter, select, and sort into result.
result = None`,
        tests: [
          {
            name: "result is a DataFrame",
            code: 'assert isinstance(result, pd.DataFrame), f"expected a DataFrame, got {type(result).__name__}"',
          },
          {
            name: "the columns are region and revenue",
            code: 'assert list(result.columns) == ["region", "revenue"], f"expected [\'region\', \'revenue\'], got {list(result.columns)}"',
          },
          {
            name: "the rows match the filter",
            code: `expected = sales[(sales["region"] == "North") & (sales["units"] >= 10)][["region", "revenue"]].sort_values("revenue", ascending=False)
assert result.reset_index(drop=True).equals(expected.reset_index(drop=True)), f"expected\\n{expected}\\ngot\\n{result}"`,
          },
        ],
        hints: [
          "Build a boolean mask for the region and the unit threshold.",
          "Select the two columns with a list, then call sort_values with ascending=False.",
        ],
        solution: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West"],
    "units": [12, 7, 9, 15],
    "price": [5.0, 8.0, 5.0, 6.5],
})
sales["revenue"] = sales["units"] * sales["price"]

result = (
    sales[(sales["region"] == "North") & (sales["units"] >= 10)]
    .loc[:, ["region", "revenue"]]
    .sort_values("revenue", ascending=False)
)
print(result)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "loc-or-iloc",
        question: "Which selector uses row and column labels?",
        options: [
          { id: "loc", label: ".loc" },
          { id: "iloc", label: ".iloc" },
          { id: "both", label: "Both use labels" },
        ],
        answerId: "loc",
        explanation:
          ".loc works with labels; .iloc works with integer positions. A positional slice also excludes its stop, while a label slice in loc includes it.",
      },
      {
        id: "combine-masks",
        question: "How do you combine two boolean masks with logical AND?",
        options: [
          { id: "and", label: "mask1 and mask2" },
          { id: "amp", label: "mask1 & mask2, with each comparison in parentheses" },
          { id: "plus", label: "mask1 + mask2" },
        ],
        answerId: "amp",
        explanation:
          "Use the bitwise & operator with parenthesized comparisons. The Python and keyword does not work elementwise on a Series.",
      },
      {
        id: "chained-warning",
        question: "Why is chained assignment risky?",
        options: [
          { id: "temp", label: "It can write to a temporary object instead of the original frame" },
          { id: "slow", label: "It always raises a SyntaxError" },
          { id: "copy", label: "It automatically converts the frame to NumPy" },
        ],
        answerId: "temp",
        explanation:
          "Intermediate boolean selection can return a copy. Assign through one clear indexing operation, or update the original frame deliberately.",
      },
    ],
  },
];
