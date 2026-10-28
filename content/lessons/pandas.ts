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
  },
];
