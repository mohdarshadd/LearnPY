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
    next: {
      label: "Group rows and summarize",
      href: "/learn/pandas/grouping",
    },
  },
  {
    id: "pandas-groupby",
    library: "pandas",
    slug: "grouping",
    title: "Group rows and summarize",
    summary:
      "Split a table into groups, aggregate each one, and use transform when the group total needs to travel back to every row.",
    minutes: 11,
    level: "beginner",
    packages: ["pandas"],
    objectives: [
      "Explain the split-apply-combine model.",
      "Aggregate one or more columns with groupby.",
      "Name output columns with agg.",
      "Use transform to create group-level values on every row.",
      "Count rows without accidentally skipping missing values.",
    ],
    sections: [
      {
        id: "split-apply-combine",
        title: "Split, apply, combine",
        blocks: [
          {
            type: "text",
            text: "Grouping answers questions such as \"what was revenue by region?\" The grouping column defines the groups. pandas splits the rows by that value, applies an aggregation to each group, and combines the one-row-per-group results into a new Series or DataFrame.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West", "South", "North"],
    "product": ["A", "B", "A", "A", "B", "B"],
    "units": [12, 7, 9, 15, 5, 11],
    "price": [5.0, 8.0, 5.0, 6.5, 8.0, 5.0],
})
sales["revenue"] = sales["units"] * sales["price"]

print(sales.groupby("region")["revenue"].sum())`,
            language: "python",
            caption: "One total per region",
            output: `region
North    160.0
South     96.0
West      97.5
Name: revenue, dtype: float64`,
            runnable: true,
          },
          {
            type: "list",
            ordered: true,
            items: [
              "Split: rows are assigned to a group by the region value.",
              "Apply: the sum of revenue is computed inside each group.",
              "Combine: the per-group totals are assembled into a Series indexed by region.",
            ],
          },
        ],
      },
      {
        id: "named-aggregates",
        title: "Name your aggregates",
        blocks: [
          {
            type: "text",
            text: "A single aggregation can return a Series, but an analysis usually needs several columns at once. The named aggregation form gives each output a clear name and avoids multi-level column labels.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West", "South", "North"],
    "units": [12, 7, 9, 15, 5, 11],
    "price": [5.0, 8.0, 5.0, 6.5, 8.0, 5.0],
})
sales["revenue"] = sales["units"] * sales["price"]

summary = sales.groupby("region", as_index=False).agg(
    total_units=("units", "sum"),
    total_revenue=("revenue", "sum"),
)
print(summary)`,
            language: "python",
            caption: "Named output columns",
            output: `  region  total_units  total_revenue
0  North           32          160.0
1  South           12           96.0
2   West           15           97.5`,
            runnable: true,
          },
          {
            type: "text",
            text: "Set as_index=False when you want the grouping key to remain an ordinary column. With the default as_index=True, region becomes the index of the summary instead.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "Read the aggregation as a sentence",
            text: "total_revenue=(\"revenue\", \"sum\") means \"create a column named total_revenue by summing the revenue column.\" The tuple pairs the source column with the operation.",
          },
        ],
      },
      {
        id: "multiple-keys",
        title: "Group by more than one key",
        blocks: [
          {
            type: "text",
            text: "Passing a list of column names groups by the combination of those values. Each key becomes a level of a MultiIndex, so the resulting rows represent region-product pairs rather than regions alone.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West", "South", "North"],
    "product": ["A", "B", "A", "A", "B", "B"],
    "units": [12, 7, 9, 15, 5, 11],
})

print(sales.groupby(["region", "product"])["units"].sum())`,
            language: "python",
            caption: "Two keys produce a MultiIndex",
            output: `region  product
North   A          21
        B          11
South   B          12
West    A          15
Name: units, dtype: int64`,
            runnable: true,
          },
          {
            type: "text",
            text: "Use reset_index when a downstream step expects ordinary columns, or keep the MultiIndex when you want the hierarchy to remain visible in the result.",
          },
        ],
      },
      {
        id: "transform",
        title: "Use transform for group-level values",
        blocks: [
          {
            type: "text",
            text: "Aggregation returns one row per group. transform returns one value per original row, which is what you need when a group total should sit beside each row for comparison or for a share-of-total calculation.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West", "South", "North"],
    "units": [12, 7, 9, 15, 5, 11],
    "price": [5.0, 8.0, 5.0, 6.5, 8.0, 5.0],
})
sales["revenue"] = sales["units"] * sales["price"]

sales["region_revenue"] = sales.groupby("region")["revenue"].transform("sum")
sales["share"] = sales["revenue"] / sales["region_revenue"]
print(sales[["region", "revenue", "region_revenue", "share"]])`,
            language: "python",
            caption: "A group total repeated on every row",
            runnable: true,
          },
          {
            type: "callout",
            tone: "note",
            title: "Same length, different meaning",
            text: "After transform, the result has the same index as the original frame, so it can be assigned directly as a new column. Aggregation would have produced only one row per region.",
          },
        ],
      },
      {
        id: "count-versus-size",
        title: "Count rows, not just values",
        blocks: [
          {
            type: "text",
            text: "count counts non-missing values in each group. size counts rows, including rows with missing values. If a column can contain NaN, the two answers can differ, and the difference is often the information you need.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "North", "South"],
    "price": [5.0, None, 8.0],
})

print(sales.groupby("region").size())
print(sales.groupby("region")["price"].count())`,
            language: "python",
            caption: "Rows versus non-missing prices",
            output: `region
North    2
South    1
dtype: int64
region
North    1
South    1
Name: price, dtype: int64`,
            runnable: true,
          },
          {
            type: "text",
            text: "The North group has two rows but only one observed price. Use size for row counts and count for observed values, then be explicit about which one the question is asking for.",
          },
        ],
      },
      {
        id: "grouping-recipe",
        title: "A grouping recipe",
        blocks: [
          {
            type: "text",
            text: "For most reports: choose the grouping keys, choose the measurements, name the aggregations, and sort the final summary. Keeping those decisions separate makes the result easy to check against the raw rows.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West", "South", "North"],
    "units": [12, 7, 9, 15, 5, 11],
    "price": [5.0, 8.0, 5.0, 6.5, 8.0, 5.0],
})
sales["revenue"] = sales["units"] * sales["price"]

summary = (
    sales.groupby("region", as_index=False)
    .agg(total_units=("units", "sum"), total_revenue=("revenue", "sum"))
    .sort_values("total_revenue", ascending=False)
)
print(summary)`,
            language: "python",
            caption: "Group, name, and order",
            runnable: true,
          },
          {
            type: "text",
            text: "The next lesson joins rows from different tables. Grouping combines rows that already share a key; merging brings in columns that live in another frame.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "regional-summary",
        prompt:
          "Group sales by region and create summary with the columns total_units and total_revenue. Sort the rows by total_revenue from highest to lowest.",
        starterCode: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West", "South", "North"],
    "units": [12, 7, 9, 15, 5, 11],
    "price": [5.0, 8.0, 5.0, 6.5, 8.0, 5.0],
})
sales["revenue"] = sales["units"] * sales["price"]

# Build the sorted summary.
summary = None`,
        tests: [
          {
            name: "summary is a DataFrame",
            code: 'assert isinstance(summary, pd.DataFrame), f"expected a DataFrame, got {type(summary).__name__}"',
          },
          {
            name: "the columns are named clearly",
            code: 'assert list(summary.columns) == ["region", "total_units", "total_revenue"], f"expected named columns, got {list(summary.columns)}"',
          },
          {
            name: "the rows and totals are correct",
            code: `expected = sales.groupby("region", as_index=False).agg(total_units=("units", "sum"), total_revenue=("revenue", "sum")).sort_values("total_revenue", ascending=False)
assert summary.reset_index(drop=True).equals(expected.reset_index(drop=True)), f"expected\\n{expected}\\ngot\\n{summary}"`,
          },
        ],
        hints: [
          "Use groupby with as_index=False so region stays a column.",
          "Use named aggregations for total_units and total_revenue, then sort by total_revenue.",
        ],
        solution: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "South", "North", "West", "South", "North"],
    "units": [12, 7, 9, 15, 5, 11],
    "price": [5.0, 8.0, 5.0, 6.5, 8.0, 5.0],
})
sales["revenue"] = sales["units"] * sales["price"]

summary = (
    sales.groupby("region", as_index=False)
    .agg(total_units=("units", "sum"), total_revenue=("revenue", "sum"))
    .sort_values("total_revenue", ascending=False)
)
print(summary)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "split-apply-combine",
        question: "What are the three stages of a groupby operation?",
        options: [
          { id: "split", label: "Split, apply, combine" },
          { id: "sort", label: "Sort, filter, join" },
          { id: "read", label: "Read, write, reset" },
        ],
        answerId: "split",
        explanation:
          "groupby splits rows by key, applies the aggregation to each group, then combines the per-group results.",
      },
      {
        id: "size-count",
        question: "Which grouping result counts rows even when a value is missing?",
        options: [
          { id: "count", label: "count" },
          { id: "size", label: "size" },
          { id: "sum", label: "sum" },
        ],
        answerId: "size",
        explanation:
          "size counts rows in each group. count counts non-missing values, so it can be smaller.",
      },
      {
        id: "transform-length",
        question: "What shape does a groupby transform return?",
        options: [
          { id: "group", label: "One row per group" },
          { id: "rows", label: "The same number of rows as the original frame" },
          { id: "columns", label: "One column per group" },
        ],
        answerId: "rows",
        explanation:
          "transform broadcasts the group result back to the original rows, which is why it can be assigned as a new column.",
      },
    ],
    next: {
      label: "Join related tables",
      href: "/learn/pandas/joins",
    },
  },
  {
    id: "pandas-joins",
    library: "pandas",
    slug: "joins",
    title: "Join related tables without losing rows",
    summary:
      "Merge DataFrames on a shared key, choose how unmatched rows survive, validate the relationship, and stack tables with concat.",
    minutes: 11,
    level: "beginner",
    packages: ["pandas"],
    objectives: [
      "Merge two frames on a shared key.",
      "Choose the join direction that keeps the rows you need.",
      "Validate a many-to-one relationship.",
      "Use the merge indicator to inspect unmatched rows.",
      "Stack rows with concat when no key is involved.",
    ],
    sections: [
      {
        id: "why-merge",
        title: "Why tables need each other",
        blocks: [
          {
            type: "text",
            text: "Real data is usually split across tables. Orders know customer_id but not the customer's name; a customer table knows the name but not the orders. A merge brings both sets of columns together using the shared key.",
          },
          {
            type: "code",
            code: `import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "name": ["Ada", "Grace", "Alan"],
})
orders = pd.DataFrame({
    "order_id": [10, 11, 12, 13],
    "customer_id": [1, 1, 2, 4],
    "total": [25.0, 40.0, 15.0, 99.0],
})

print(orders.merge(customers, on="customer_id", how="left"))`,
            language: "python",
            caption: "A left merge keeps every order",
            output: `   order_id  customer_id  total   name
0        10            1   25.0    Ada
1        11            1   40.0    Ada
2        12            2   15.0  Grace
3        13            4   99.0    NaN`,
            runnable: true,
          },
          {
            type: "text",
            text: "Order 13 points at customer 4, which is not in customers. The left join keeps the order and fills the missing name with NaN. That missing value is a finding, not a formatting problem.",
          },
        ],
      },
      {
        id: "join-direction",
        title: "Choose how rows survive",
        blocks: [
          {
            type: "text",
            text: "The how argument decides which unmatched rows survive. An inner join keeps only matches, a left join keeps every row from the left frame, a right join keeps every row from the right frame, and an outer join keeps both sides.",
          },
          {
            type: "table",
            caption: "Merge directions",
            headers: ["how", "Keeps"],
            rows: [
              ["inner", "Rows with a matching key on both sides"],
              ["left", "Every row from the left frame, plus matches from the right"],
              ["right", "Every row from the right frame, plus matches from the left"],
              ["outer", "All rows from both frames"],
            ],
          },
          {
            type: "code",
            code: `import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "name": ["Ada", "Grace", "Alan"],
})
orders = pd.DataFrame({
    "order_id": [10, 11, 12, 13],
    "customer_id": [1, 1, 2, 4],
    "total": [25.0, 40.0, 15.0, 99.0],
})

print(orders.merge(customers, on="customer_id", how="inner"))`,
            language: "python",
            caption: "An inner join drops the unmatched order",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "A join can duplicate rows",
            text: "If the right frame has two rows for one key, a left join produces two output rows for every matching left row. Row counts are part of the result, so check them deliberately.",
          },
        ],
      },
      {
        id: "validate",
        title: "Validate the relationship",
        blocks: [
          {
            type: "text",
            text: "Merge accepts a validate argument that fails when the actual key relationship is not the one you expected. This turns a silent row explosion into a clear error.",
          },
          {
            type: "code",
            code: `import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "name": ["Ada", "Grace", "Alan"],
})
orders = pd.DataFrame({
    "order_id": [10, 11, 12, 13],
    "customer_id": [1, 1, 2, 4],
    "total": [25.0, 40.0, 15.0, 99.0],
})

merged = orders.merge(
    customers,
    on="customer_id",
    how="left",
    validate="many_to_one",
    indicator=True,
)
print(merged[["order_id", "name", "_merge"]])`,
            language: "python",
            caption: "Assert the relationship and expose unmatched rows",
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "many_to_one means many orders may share one customer, but each customer key is unique.",
              "one_to_one requires uniqueness on both sides.",
              "one_to_many is the reverse of many_to_one.",
              "indicator=True adds a _merge column that says both, left_only, or right_only.",
            ],
          },
        ],
      },
      {
        id: "concat",
        title: "Stack tables with concat",
        blocks: [
          {
            type: "text",
            text: "Use concat when the tables already have the same columns and you simply need more rows. It does not look for a key. Use merge when the tables need to be aligned on a shared key.",
          },
          {
            type: "code",
            code: `import pandas as pd

q1 = pd.DataFrame({"region": ["North", "South"], "revenue": [100, 80]})
q2 = pd.DataFrame({"region": ["West"], "revenue": [95]})

combined = pd.concat([q1, q2], ignore_index=True)
print(combined)`,
            language: "python",
            caption: "Stack two frames and renumber the rows",
            output: `  region  revenue
0  North      100
1  South       80
2   West       95`,
            runnable: true,
          },
          {
            type: "callout",
            tone: "note",
            title: "ignore_index gives you a clean row axis",
            text: "Without ignore_index, concat keeps the original row labels and you can get duplicate labels. That is sometimes useful, but a fresh RangeIndex is easier to reason about for a combined table.",
          },
        ],
      },
      {
        id: "join-recipe",
        title: "A join worth trusting",
        blocks: [
          {
            type: "text",
            text: "Before joining: identify the key and its expected relationship. After joining: compare row counts, inspect unmatched rows, and decide how missing values should be represented. The merge itself is the easy part.",
          },
          {
            type: "code",
            code: `import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "name": ["Ada", "Grace", "Alan"],
})
orders = pd.DataFrame({
    "order_id": [10, 11, 12, 13],
    "customer_id": [1, 1, 2, 4],
    "total": [25.0, 40.0, 15.0, 99.0],
})

merged = orders.merge(
    customers,
    on="customer_id",
    how="left",
    validate="many_to_one",
    indicator=True,
)
print(merged["_merge"].value_counts())`,
            language: "python",
            caption: "Count matches and misses",
            runnable: true,
          },
          {
            type: "text",
            text: "value_counts on the merge indicator is a quick audit: every left_only row is an order whose customer is missing. The next lesson cleans missing values and restructures the table for analysis.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "orders-with-names",
        prompt:
          "Left-merge orders with customers on customer_id so every order survives. Assign the result to merged, then replace missing names with \"Unknown\".",
        starterCode: `import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "name": ["Ada", "Grace", "Alan"],
})
orders = pd.DataFrame({
    "order_id": [10, 11, 12, 13],
    "customer_id": [1, 1, 2, 4],
    "total": [25.0, 40.0, 15.0, 99.0],
})

# Merge, then fill missing names.
merged = None`,
        tests: [
          {
            name: "merged is a DataFrame",
            code: 'assert isinstance(merged, pd.DataFrame), f"expected a DataFrame, got {type(merged).__name__}"',
          },
          {
            name: "every order survives",
            code: 'assert len(merged) == 4, f"expected 4 rows, got {len(merged)}"',
          },
          {
            name: "missing names are labeled",
            code: 'row = merged.loc[merged["order_id"] == 13]\nassert not row.empty, "order 13 is missing"\nassert row["name"].iloc[0] == "Unknown", f"expected Unknown, got {row[\'name\'].iloc[0]}"',
          },
          {
            name: "the merge values are correct",
            code: `expected = orders.merge(customers, on="customer_id", how="left")
expected["name"] = expected["name"].fillna("Unknown")
assert merged.reset_index(drop=True).equals(expected.reset_index(drop=True)), f"expected\\n{expected}\\ngot\\n{merged}"`,
          },
        ],
        hints: [
          "Use orders.merge(customers, on=\"customer_id\", how=\"left\").",
          "Assign merged[\"name\"] = merged[\"name\"].fillna(\"Unknown\").",
        ],
        solution: `import pandas as pd

customers = pd.DataFrame({
    "customer_id": [1, 2, 3],
    "name": ["Ada", "Grace", "Alan"],
})
orders = pd.DataFrame({
    "order_id": [10, 11, 12, 13],
    "customer_id": [1, 1, 2, 4],
    "total": [25.0, 40.0, 15.0, 99.0],
})

merged = orders.merge(customers, on="customer_id", how="left")
merged["name"] = merged["name"].fillna("Unknown")
print(merged)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "left-join",
        question: "Which join keeps every row from the left frame?",
        options: [
          { id: "inner", label: "inner" },
          { id: "left", label: "left" },
          { id: "right", label: "right" },
        ],
        answerId: "left",
        explanation:
          "A left join keeps the left rows even when no matching key exists on the right. Missing right-side values are filled with NaN.",
      },
      {
        id: "validate-relationship",
        question: "Orders may share customer_id, but each customer_id is unique in customers. Which validation is correct?",
        options: [
          { id: "one", label: "one_to_one" },
          { id: "many", label: "many_to_one" },
          { id: "none", label: "No validation is possible" },
        ],
        answerId: "many",
        explanation:
          "Many orders can map to one customer, so validate=\"many_to_one\" describes the relationship from the orders side.",
      },
      {
        id: "concat-versus-merge",
        question: "When should you use concat instead of merge?",
        options: [
          { id: "rows", label: "When both tables have the same columns and you need more rows" },
          { id: "key", label: "When you need to match rows on a shared key" },
          { id: "sort", label: "When you only want to sort a table" },
        ],
        answerId: "rows",
        explanation:
          "concat stacks compatible tables. merge aligns columns by a key and is the right tool for joining related data.",
      },
    ],
    next: {
      label: "Clean messy data",
      href: "/learn/pandas/cleaning",
    },
  },
  {
    id: "pandas-cleaning",
    library: "pandas",
    slug: "cleaning",
    title: "Clean messy data deliberately",
    summary:
      "Inspect missing values, remove duplicates, normalize text, and convert columns to the types your analysis actually needs.",
    minutes: 12,
    level: "beginner",
    packages: ["pandas"],
    objectives: [
      "Measure missing values and duplicate rows before changing anything.",
      "Choose between filling and dropping missing data.",
      "Normalize text and convert numeric columns safely.",
      "Remove duplicate keys while keeping the row you intend to keep.",
      "Verify the cleaned table instead of assuming the operations worked.",
    ],
    sections: [
      {
        id: "inspect-first",
        title: "Inspect before you clean",
        blocks: [
          {
            type: "text",
            text: "Cleaning is a series of decisions, not a single method call. Start by measuring what is wrong: which columns are missing values, which keys repeat, and which columns arrived as text when they should be numbers.",
          },
          {
            type: "code",
            code: `import pandas as pd

raw = pd.DataFrame({
    "order_id": [101, 102, 102, 103],
    "customer": [" Ada ", "Grace", "Grace", "Alan "],
    "amount": ["25.50", "40.00", "40.00", "bad"],
    "quantity": [2, None, None, 1],
})

print("missing:", raw.isna().sum().to_dict())
print("duplicate order ids:", raw.duplicated(subset="order_id").sum())
print(raw.dtypes)`,
            language: "python",
            caption: "Three questions before changing the table",
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Cleaning can hide information",
            text: "Filling every missing value with zero makes a chart look complete while erasing the fact that the value was never observed. Decide what missing means before choosing a fix.",
          },
        ],
      },
      {
        id: "fill-or-drop",
        title: "Fill, drop, or keep",
        blocks: [
          {
            type: "text",
            text: "dropna removes rows with missing values. fillna substitutes a value or a per-column mapping. Neither is universally correct: dropping a mostly empty column can be right, while filling a missing count with zero may be a meaningful business rule.",
          },
          {
            type: "code",
            code: `import pandas as pd

raw = pd.DataFrame({
    "order_id": [101, 102, 103],
    "amount": [25.5, None, 40.0],
    "quantity": [2, None, 1],
})

print(raw.dropna(subset=["amount"]))
print(raw.fillna({"quantity": 0}))`,
            language: "python",
            caption: "Different gaps, different decisions",
            runnable: true,
          },
          {
            type: "list",
            ordered: false,
            items: [
              "Use dropna(subset=[...]) when the row cannot be analyzed without that column.",
              "Use fillna when a known default is legitimate, such as a missing quantity meaning zero units.",
              "Inspect how many rows each choice affects before accepting the result.",
            ],
          },
        ],
      },
      {
        id: "types-and-text",
        title: "Fix types and normalize text",
        blocks: [
          {
            type: "text",
            text: "Numbers stored as text cannot be summed, and names with inconsistent whitespace create duplicate-looking groups. Normalize the representation before analyzing the values.",
          },
          {
            type: "code",
            code: `import pandas as pd

raw = pd.DataFrame({
    "order_id": [101, 102, 103],
    "customer": [" Ada ", "Grace", "Alan "],
    "amount": ["25.50", "40.00", "bad"],
    "quantity": [2, None, 1],
})

clean = raw.copy()
clean["customer"] = clean["customer"].str.strip()
clean["amount"] = pd.to_numeric(clean["amount"], errors="coerce")
clean["quantity"] = clean["quantity"].fillna(0).astype("int64")
print(clean)
print(clean.dtypes)`,
            language: "python",
            caption: "Strip, parse, and fill",
            output: `   order_id customer  amount  quantity
0       101      Ada    25.5         2
1       102    Grace    40.0         0
2       103     Alan     NaN         1
order_id      int64
customer        str
amount      float64
quantity      int64
dtype: object`,
            runnable: true,
          },
          {
            type: "text",
            text: "errors=\"coerce\" turns an unparseable value into NaN instead of raising. That is useful for an audit, but it also means you must count the new missing values and decide what they represent.",
          },
          {
            type: "callout",
            tone: "tip",
            title: "pandas 3 uses a string dtype by default",
            text: "You may see dtype str rather than object for text columns. The operations are the same; read the dtype report rather than assuming the old representation.",
          },
        ],
      },
      {
        id: "duplicates",
        title: "Remove duplicate keys carefully",
        blocks: [
          {
            type: "text",
            text: "duplicated marks rows whose key has already appeared. drop_duplicates removes them. The keep argument decides whether the first row, the last row, or no rows survive when a key repeats.",
          },
          {
            type: "code",
            code: `import pandas as pd

raw = pd.DataFrame({
    "order_id": [101, 102, 102, 103],
    "customer": ["Ada", "Grace", "Grace", "Alan"],
    "amount": ["25.50", "40.00", "40.00", "bad"],
})

clean = raw.drop_duplicates(subset="order_id", keep="first").copy()
print(clean)`,
            language: "python",
            caption: "One row per order key",
            output: `   order_id customer amount
0       101      Ada  25.50
1       102    Grace  40.00
3       103     Alan    bad`,
            runnable: true,
          },
          {
            type: "text",
            text: "Before removing a duplicate, ask why it exists. If two rows disagree on an important value, silently keeping the first one may discard the very problem you need to investigate.",
          },
        ],
      },
      {
        id: "cleaning-recipe",
        title: "A cleaning recipe",
        blocks: [
          {
            type: "text",
            text: "A reliable pass is: inspect, normalize text, parse types, handle duplicates, fill or drop with a reason, then assert the expected row count and missing-value count. The final assertions are part of the analysis.",
          },
          {
            type: "code",
            code: `import pandas as pd

raw = pd.DataFrame({
    "order_id": [101, 102, 102, 103],
    "customer": [" Ada ", "Grace", "Grace", "Alan "],
    "amount": ["25.50", "40.00", "40.00", "bad"],
    "quantity": [2, None, None, 1],
})

clean = raw.drop_duplicates(subset="order_id", keep="first").copy()
clean["customer"] = clean["customer"].str.strip()
clean["amount"] = pd.to_numeric(clean["amount"], errors="coerce")
clean["quantity"] = clean["quantity"].fillna(0).astype("int64")

assert len(clean) == 3
assert clean["amount"].isna().sum() == 1
print(clean)`,
            language: "python",
            caption: "Clean and verify in one pass",
            runnable: true,
          },
          {
            type: "text",
            text: "The next lesson treats dates as a special kind of cleaning problem: they must be parsed, ordered, and grouped on a calendar rather than as ordinary strings.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "clean-orders",
        prompt:
          "Clean the orders table: keep the first row for each order_id, strip whitespace from customer, convert amount to numbers (invalid values become missing), and fill missing quantities with 0 as integers. Assign the result to clean.",
        starterCode: `import pandas as pd

raw = pd.DataFrame({
    "order_id": [101, 102, 102, 103],
    "customer": [" Ada ", "Grace", "Grace", "Alan "],
    "amount": ["25.50", "40.00", "40.00", "bad"],
    "quantity": [2, None, None, 1],
})

# Clean the table.
clean = None`,
        tests: [
          {
            name: "duplicate orders are removed",
            code: 'assert list(clean["order_id"]) == [101, 102, 103], f"unexpected ids: {list(clean[\'order_id\'])}"',
          },
          {
            name: "names are trimmed",
            code: 'assert list(clean["customer"]) == ["Ada", "Grace", "Alan"], f"unexpected names: {list(clean[\'customer\'])}"',
          },
          {
            name: "amounts are numeric with one missing value",
            code: 'assert pd.api.types.is_numeric_dtype(clean["amount"]), f"amount dtype is {clean[\'amount\'].dtype}"\nassert clean["amount"].isna().sum() == 1, "expected one unparseable amount"\nassert clean["amount"].iloc[0] == 25.5',
          },
          {
            name: "quantities are filled integers",
            code: 'assert list(clean["quantity"]) == [2, 0, 1], f"unexpected quantities: {list(clean[\'quantity\'])}"\nassert pd.api.types.is_integer_dtype(clean["quantity"]), f"quantity dtype is {clean[\'quantity\'].dtype}"',
          },
        ],
        hints: [
          "Remove duplicates before converting the amount column.",
          "Use errors=\"coerce\" with pd.to_numeric, then fill quantity and cast it with astype(\"int64\").",
        ],
        solution: `import pandas as pd

raw = pd.DataFrame({
    "order_id": [101, 102, 102, 103],
    "customer": [" Ada ", "Grace", "Grace", "Alan "],
    "amount": ["25.50", "40.00", "40.00", "bad"],
    "quantity": [2, None, None, 1],
})

clean = raw.drop_duplicates(subset="order_id", keep="first").copy()
clean["customer"] = clean["customer"].str.strip()
clean["amount"] = pd.to_numeric(clean["amount"], errors="coerce")
clean["quantity"] = clean["quantity"].fillna(0).astype("int64")
print(clean)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "count-duplicates",
        question: "What does raw.duplicated(subset=\"order_id\").sum() measure?",
        options: [
          { id: "keys", label: "The number of repeated keys after the first occurrence" },
          { id: "rows", label: "The total number of rows in the frame" },
          { id: "nulls", label: "The number of missing order ids" },
        ],
        answerId: "keys",
        explanation:
          "duplicated marks every later row whose key already appeared. Summing the boolean result counts those repeated occurrences.",
      },
      {
        id: "coerce",
        question: "What does pd.to_numeric(..., errors=\"coerce\") do with an invalid string?",
        options: [
          { id: "nan", label: "Converts it to NaN" },
          { id: "zero", label: "Converts it to 0" },
          { id: "raise", label: "Always raises an error" },
        ],
        answerId: "nan",
        explanation:
          "Coercion turns values that cannot be parsed into missing values so you can count and handle them explicitly.",
      },
      {
        id: "fill-zero",
        question: "When is filling a missing quantity with 0 defensible?",
        options: [
          { id: "known", label: "When zero is the known business meaning of the missing value" },
          { id: "always", label: "Always, because zero preserves the row count" },
          { id: "never", label: "Never, because missing values must always be dropped" },
        ],
        answerId: "known",
        explanation:
          "Filling is only meaningful when the default is justified by the domain. Otherwise you are inventing observations.",
      },
    ],
    next: {
      label: "Work with dates and time series",
      href: "/learn/pandas/time-series",
    },
  },
  {
    id: "pandas-time-series",
    library: "pandas",
    slug: "time-series",
    title: "Work with dates and time series",
    summary:
      "Parse date strings, use a DatetimeIndex, resample calendar periods, and compute rolling windows without losing the time order.",
    minutes: 12,
    level: "beginner",
    packages: ["pandas"],
    objectives: [
      "Convert date strings with pd.to_datetime.",
      "Sort and index a table by time.",
      "Aggregate with resample over calendar periods.",
      "Compute rolling statistics on ordered observations.",
      "Use the datetime accessor to derive calendar fields.",
    ],
    sections: [
      {
        id: "parse-dates",
        title: "Parse dates into real timestamps",
        blocks: [
          {
            type: "text",
            text: "A date stored as text sorts alphabetically and has no calendar meaning. pd.to_datetime turns it into a Timestamp so pandas can order it, compare it, and extract parts such as the month or weekday.",
          },
          {
            type: "code",
            code: `import pandas as pd

daily = pd.DataFrame({
    "date": ["2026-01-28", "2026-01-29", "2026-01-30", "2026-01-31"],
    "orders": [10, 12, 9, 15],
})

daily["date"] = pd.to_datetime(daily["date"])
print(daily)
print(daily.dtypes)`,
            language: "python",
            caption: "Text becomes datetime64",
            runnable: true,
          },
          {
            type: "callout",
            tone: "tip",
            title: "Pass a format when the input is ambiguous",
            text: "If the source uses a fixed layout, format=\"%Y-%m-%d\" is faster and avoids guessing between day-first and month-first dates.",
          },
        ],
      },
      {
        id: "datetime-index",
        title: "Make time the index",
        blocks: [
          {
            type: "text",
            text: "Setting the parsed date as the index and sorting it gives you a time-ordered frame. Every time-series operation after this point can rely on that order.",
          },
          {
            type: "code",
            code: `import pandas as pd

daily = pd.DataFrame({
    "date": ["2026-01-31", "2026-01-28", "2026-01-29", "2026-01-30"],
    "orders": [15, 10, 12, 9],
})
daily["date"] = pd.to_datetime(daily["date"])
daily = daily.set_index("date").sort_index()
print(daily)`,
            language: "python",
            caption: "Sorted by time, not by arrival order",
            runnable: true,
          },
          {
            type: "text",
            text: "Once the DatetimeIndex exists, daily.loc[\"2026-02\"] selects a calendar month. Without a datetime index, that label lookup will not work.",
          },
        ],
      },
      {
        id: "resample",
        title: "Resample calendar periods",
        blocks: [
          {
            type: "text",
            text: "resample groups observations into fixed time periods. Use MS for the start of a month and ME for the end of a month. The aggregation then decides what happens inside each period.",
          },
          {
            type: "code",
            code: `import pandas as pd

daily = pd.DataFrame({
    "date": ["2026-01-28", "2026-01-29", "2026-01-30", "2026-01-31",
             "2026-02-01", "2026-02-02", "2026-02-03", "2026-02-04",
             "2026-02-05", "2026-02-06"],
    "orders": [10, 12, 9, 15, 18, 14, 20, 16, 11, 13],
})
daily["date"] = pd.to_datetime(daily["date"])
daily = daily.set_index("date").sort_index()

monthly = daily["orders"].resample("MS").sum()
print(monthly)`,
            language: "python",
            caption: "Monthly totals",
            output: `date
2026-01-01    46
2026-02-01    92
Freq: MS, Name: orders, dtype: int64`,
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "Resampling creates empty periods",
            text: "If a month has no rows, resample still produces that period with a zero for sum or NaN for mean. That can be correct, but check whether an empty month means zero activity or missing data.",
          },
        ],
      },
      {
        id: "rolling",
        title: "Rolling windows",
        blocks: [
          {
            type: "text",
            text: "A rolling window computes a statistic over a fixed number of observations. The first rows are NaN until the window has enough points. The index must be ordered, otherwise the window mixes the wrong days.",
          },
          {
            type: "code",
            code: `import pandas as pd

daily = pd.DataFrame({
    "date": ["2026-01-28", "2026-01-29", "2026-01-30", "2026-01-31",
             "2026-02-01", "2026-02-02", "2026-02-03", "2026-02-04",
             "2026-02-05", "2026-02-06"],
    "orders": [10, 12, 9, 15, 18, 14, 20, 16, 11, 13],
})
daily["date"] = pd.to_datetime(daily["date"])
daily = daily.set_index("date").sort_index()

daily["rolling_7"] = daily["orders"].rolling(7).mean()
print(daily.tail(4))`,
            language: "python",
            caption: "A seven-observation moving average",
            output: `            orders  rolling_7
date                         
2026-02-03      20  14.000000
2026-02-04      16  14.857143
2026-02-05      11  14.714286
2026-02-06      13  15.285714`,
            runnable: true,
          },
          {
            type: "text",
            text: "rolling(7) counts observations, not calendar days. With a complete daily series those are the same thing; with gaps they are not, so decide which meaning your question requires.",
          },
        ],
      },
      {
        id: "calendar-fields",
        title: "Derive calendar fields",
        blocks: [
          {
            type: "text",
            text: "The .dt accessor exposes parts of each timestamp. These derived fields are useful for grouping by weekday, filtering a month, or labeling a chart.",
          },
          {
            type: "code",
            code: `import pandas as pd

dates = pd.Series(pd.to_datetime(["2026-01-01", "2026-01-02", "2026-01-03"]))

print(dates.dt.day_name())
print(dates.dt.month)`,
            language: "python",
            caption: "Calendar parts without string parsing",
            runnable: true,
          },
          {
            type: "text",
            text: "The next lesson changes the shape of the table itself. Time-based aggregation groups rows; pivoting moves values between rows and columns.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "monthly-orders",
        prompt:
          "Parse the date column, set it as the index, sort the rows by time, then resample orders by month start and sum. Assign the Series to monthly.",
        starterCode: `import pandas as pd

daily = pd.DataFrame({
    "date": ["2026-01-28", "2026-01-29", "2026-01-30", "2026-01-31",
             "2026-02-01", "2026-02-02", "2026-02-03", "2026-02-04",
             "2026-02-05", "2026-02-06"],
    "orders": [10, 12, 9, 15, 18, 14, 20, 16, 11, 13],
})

# Parse, index, sort, and resample.
monthly = None`,
        tests: [
          {
            name: "monthly is a Series indexed by month starts",
            code: 'assert isinstance(monthly, pd.Series), f"expected a Series, got {type(monthly).__name__}"\nassert isinstance(monthly.index, pd.DatetimeIndex), "expected a DatetimeIndex"',
          },
          {
            name: "the monthly totals are correct",
            code: 'assert list(monthly.index) == [pd.Timestamp("2026-01-01"), pd.Timestamp("2026-02-01")], f"unexpected periods: {list(monthly.index)}"\nassert list(monthly) == [46, 92], f"unexpected totals: {list(monthly)}"',
          },
        ],
        hints: [
          "Use pd.to_datetime on the date column, then set_index(\"date\") and sort_index().",
          "Call daily[\"orders\"].resample(\"MS\").sum().",
        ],
        solution: `import pandas as pd

daily = pd.DataFrame({
    "date": ["2026-01-28", "2026-01-29", "2026-01-30", "2026-01-31",
             "2026-02-01", "2026-02-02", "2026-02-03", "2026-02-04",
             "2026-02-05", "2026-02-06"],
    "orders": [10, 12, 9, 15, 18, 14, 20, 16, 11, 13],
})

daily["date"] = pd.to_datetime(daily["date"])
daily = daily.set_index("date").sort_index()
monthly = daily["orders"].resample("MS").sum()
print(monthly)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "datetime-index",
        question: "Why set the parsed date as the index?",
        options: [
          { id: "time", label: "It enables time-aware sorting, slicing, and resampling" },
          { id: "memory", label: "It removes missing values automatically" },
          { id: "string", label: "It converts every column to text" },
        ],
        answerId: "time",
        explanation:
          "A DatetimeIndex gives pandas calendar semantics, including month slicing and resample periods.",
      },
      {
        id: "month-start",
        question: "Which resample alias represents the start of each month?",
        options: [
          { id: "ms", label: "MS" },
          { id: "me", label: "ME" },
          { id: "w", label: "W" },
        ],
        answerId: "ms",
        explanation:
          "MS is month start; ME is month end. The alias determines the label of each output period.",
      },
      {
        id: "rolling-count",
        question: "What does rolling(7) count?",
        options: [
          { id: "days", label: "Exactly seven calendar days" },
          { id: "obs", label: "Seven observations in the ordered series" },
          { id: "columns", label: "Seven columns" },
        ],
        answerId: "obs",
        explanation:
          "rolling counts observations. If the series has gaps, seven observations may span more than seven calendar days.",
      },
    ],
    next: {
      label: "Reshape wide and long tables",
      href: "/learn/pandas/reshaping",
    },
  },
  {
    id: "pandas-reshaping",
    library: "pandas",
    slug: "reshaping",
    title: "Reshape wide and long tables",
    summary:
      "Move values between rows and columns with pivot and melt, and use pivot_table when the same cell appears more than once.",
    minutes: 11,
    level: "beginner",
    packages: ["pandas"],
    objectives: [
      "Describe the difference between wide and long data.",
      "Pivot unique rows into columns.",
      "Melt columns back into tidy rows.",
      "Aggregate duplicates with pivot_table.",
      "Choose a shape based on the next operation, not appearance alone.",
    ],
    sections: [
      {
        id: "wide-versus-long",
        title: "Wide versus long",
        blocks: [
          {
            type: "text",
            text: "Long data has one observation per row: a region, a quarter, and a revenue value. Wide data spreads one of those dimensions across columns: one row per region, with a column for each quarter. Both can be correct; the useful shape depends on the question and the tool.",
          },
          {
            type: "table",
            caption: "The same values, two shapes",
            headers: ["Shape", "Rows", "Columns"],
            rows: [
              ["Long", "One row per region-quarter", "region, quarter, revenue"],
              ["Wide", "One row per region", "region, Q1, Q2"],
            ],
          },
          {
            type: "callout",
            tone: "tip",
            title: "Tidy data is a default, not a rule",
            text: "Long data is usually easier to group, filter, and plot. Wide data is sometimes easier to read or feed to a model. Reshape when the next step needs the other layout.",
          },
        ],
      },
      {
        id: "pivot",
        title: "Pivot long data into columns",
        blocks: [
          {
            type: "text",
            text: "pivot takes an index column, a columns column, and a values column. It requires each index-columns pair to be unique; if a pair repeats, pivot does not know which value belongs in the cell.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "North", "South", "South"],
    "quarter": ["Q1", "Q2", "Q1", "Q2"],
    "revenue": [100, 120, 80, 95],
})

wide = sales.pivot(index="region", columns="quarter", values="revenue")
print(wide)`,
            language: "python",
            caption: "One row per region",
            output: `quarter   Q1   Q2
region           
North    100  120
South     80   95`,
            runnable: true,
          },
          {
            type: "text",
            text: "The output index is region and the output columns come from quarter. The name quarter remains attached to the column axis, which matters when you melt the frame back.",
          },
        ],
      },
      {
        id: "melt",
        title: "Melt wide data back to rows",
        blocks: [
          {
            type: "text",
            text: "melt is the inverse operation for the identifier columns: it turns wide columns into a pair of variable and value columns. Reset the index first so the region labels become ordinary data again.",
          },
          {
            type: "code",
            code: `import pandas as pd

sales = pd.DataFrame({
    "region": ["North", "North", "South", "South"],
    "quarter": ["Q1", "Q2", "Q1", "Q2"],
    "revenue": [100, 120, 80, 95],
})
wide = sales.pivot(index="region", columns="quarter", values="revenue")

tidy = (
    wide.reset_index()
    .melt(id_vars="region", var_name="quarter", value_name="revenue")
    .sort_values(["region", "quarter"])
    .reset_index(drop=True)
)
print(tidy)`,
            language: "python",
            caption: "Back to one observation per row",
            output: `  region quarter  revenue
0  North      Q1      100
1  North      Q2      120
2  South      Q1       80
3  South      Q2       95`,
            runnable: true,
          },
          {
            type: "text",
            text: "Without reset_index, the region index would not be available as an id_vars column. Without sort_values, melt follows the column order rather than a tidy region-quarter order.",
          },
        ],
      },
      {
        id: "pivot-table",
        title: "Pivot tables handle duplicates",
        blocks: [
          {
            type: "text",
            text: "pivot_table is the aggregation-aware version. When an index-columns pair repeats, it combines the values with aggfunc instead of failing. fill_value decides what appears for an empty cell.",
          },
          {
            type: "code",
            code: `import pandas as pd

long = pd.DataFrame({
    "region": ["North", "North", "South", "South", "North", "South"],
    "quarter": ["Q1", "Q2", "Q1", "Q2", "Q1", "Q2"],
    "revenue": [100, 120, 80, 95, 10, 20],
})

summary = long.pivot_table(
    index="region",
    columns="quarter",
    values="revenue",
    aggfunc="sum",
    fill_value=0,
)
print(summary)`,
            language: "python",
            caption: "Duplicate cells are summed",
            output: `quarter   Q1   Q2
region           
North    110  120
South     80  115`,
            runnable: true,
          },
          {
            type: "callout",
            tone: "warning",
            title: "pivot_table can hide a duplicate problem",
            text: "Summing duplicate cells is valid only if the duplicates are additive measures. If each row is an order, summing is sensible; if each row is a status snapshot, you probably need a different aggregation or a cleanup step.",
          },
        ],
      },
      {
        id: "reshaping-recipe",
        title: "Choose the shape for the next step",
        blocks: [
          {
            type: "text",
            text: "Before reshaping, name the observation, the identifier columns, and the measurement. After reshaping, check the index, columns, and one known cell against the long input. A reshape that runs without error can still put the wrong values in the wrong cells.",
          },
          {
            type: "code",
            code: `import pandas as pd

long = pd.DataFrame({
    "region": ["North", "North", "South", "South"],
    "quarter": ["Q1", "Q2", "Q1", "Q2"],
    "revenue": [100, 120, 80, 95],
})

wide = long.pivot(index="region", columns="quarter", values="revenue")
assert wide.loc["North", "Q2"] == 120
assert list(wide.columns) == ["Q1", "Q2"]
print(wide)`,
            language: "python",
            caption: "Reshape and verify one cell",
            runnable: true,
          },
          {
            type: "text",
            text: "This completes the pandas core. The Matplotlib track turns these tables into charts, starting with the anatomy of a figure and the relationship between figures and axes.",
          },
        ],
      },
    ],
    exercises: [
      {
        id: "pivot-and-melt",
        prompt:
          "Pivot long sales into wide with region as the index and quarter as the columns. Assign that to wide. Then melt wide back into a tidy frame with columns region, quarter, and revenue, sorted by region and quarter. Assign that to tidy.",
        starterCode: `import pandas as pd

long = pd.DataFrame({
    "region": ["North", "North", "South", "South"],
    "quarter": ["Q1", "Q2", "Q1", "Q2"],
    "revenue": [100, 120, 80, 95],
})

# Build both shapes.
wide = None
tidy = None`,
        tests: [
          {
            name: "wide has one row per region",
            code: 'assert isinstance(wide, pd.DataFrame), f"expected a DataFrame, got {type(wide).__name__}"\nassert list(wide.index) == ["North", "South"], f"unexpected regions: {list(wide.index)}"\nassert list(wide.columns) == ["Q1", "Q2"], f"unexpected quarters: {list(wide.columns)}"',
          },
          {
            name: "wide has the correct cells",
            code: 'assert wide.loc["North", "Q2"] == 120\nassert wide.loc["South", "Q1"] == 80',
          },
          {
            name: "tidy is back to one observation per row",
            code: 'assert list(tidy.columns) == ["region", "quarter", "revenue"], f"unexpected columns: {list(tidy.columns)}"\nexpected = long.sort_values(["region", "quarter"]).reset_index(drop=True)\nassert tidy.reset_index(drop=True).equals(expected), f"expected\\n{expected}\\ngot\\n{tidy}"',
          },
        ],
        hints: [
          "Use long.pivot(index=\"region\", columns=\"quarter\", values=\"revenue\").",
          "For tidy, reset the wide index, melt with id_vars=\"region\", then sort and reset the index.",
        ],
        solution: `import pandas as pd

long = pd.DataFrame({
    "region": ["North", "North", "South", "South"],
    "quarter": ["Q1", "Q2", "Q1", "Q2"],
    "revenue": [100, 120, 80, 95],
})

wide = long.pivot(index="region", columns="quarter", values="revenue")
tidy = (
    wide.reset_index()
    .melt(id_vars="region", var_name="quarter", value_name="revenue")
    .sort_values(["region", "quarter"])
    .reset_index(drop=True)
)
print(wide)
print(tidy)`,
        packages: [],
      },
    ],
    quiz: [
      {
        id: "long-data",
        question: "What does long data usually have?",
        options: [
          { id: "one", label: "One observation per row" },
          { id: "many", label: "One row per identifier with measurements spread across columns" },
          { id: "none", label: "No identifier columns" },
        ],
        answerId: "one",
        explanation:
          "Long or tidy data records one observation per row, with columns describing its identifiers and measurements.",
      },
      {
        id: "pivot-unique",
        question: "What does pivot require for each index-columns pair?",
        options: [
          { id: "unique", label: "A unique value" },
          { id: "sum", label: "At least two values to sum" },
          { id: "missing", label: "A missing value" },
        ],
        answerId: "unique",
        explanation:
          "pivot places one value in each cell, so repeated pairs are ambiguous. Use pivot_table when aggregation is needed.",
      },
      {
        id: "melt",
        question: "What does melt do?",
        options: [
          { id: "wide", label: "Turns wide columns into variable-value rows" },
          { id: "sort", label: "Sorts rows by the index" },
          { id: "join", label: "Joins two frames on a key" },
        ],
        answerId: "wide",
        explanation:
          "melt converts wide measurement columns into a variable column and a value column, producing long data.",
      },
    ],
  },
];
