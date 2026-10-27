import type { Reference } from "@/content/schema";

export const pandasReferences: Reference[] = [
  {
    id: "pandas-dataframe",
    library: "pandas",
    slug: "dataframe",
    symbol: "pd.DataFrame",
    signature: "pd.DataFrame(data=None, index=None, columns=None)",
    summary: "Build a two-dimensional labeled table.",
    description:
      "A DataFrame stores columns that can have different dtypes while sharing one row index. You can construct one from a dictionary of columns, a list of records, or another table.",
    parameters: [
      {
        name: "data",
        type: "dict, list, ndarray, or Series, optional",
        description: "The values that become the table.",
        optional: true,
      },
      {
        name: "index",
        type: "Index or array_like, optional",
        description: "Row labels. A default RangeIndex is used if omitted.",
        optional: true,
      },
      {
        name: "columns",
        type: "Index or array_like, optional",
        description: "Column labels, useful when data has no names.",
        optional: true,
      },
    ],
    returns: "DataFrame",
    example: {
      code: `import pandas as pd

df = pd.DataFrame({
    "team": ["red", "blue", "red"],
    "score": [10, 12, 8],
})
print(df)`,
      output: "   team  score\n0   red     10\n1  blue     12\n2   red      8",
    },
    pitfalls: [
      "A dictionary of scalars needs an index; without one, pandas raises a ValueError.",
      "Column names are labels, not positions; use .iloc when you mean positions.",
    ],
    related: ["pandas-read-csv", "pandas-head"],
  },
  {
    id: "pandas-read-csv",
    library: "pandas",
    slug: "read-csv",
    symbol: "pd.read_csv",
    signature: "pd.read_csv(filepath_or_buffer, sep=',', header='infer')",
    summary: "Load a comma-separated file into a DataFrame.",
    description:
      "read_csv parses a delimited text file and infers column names and dtypes. It accepts local paths, URLs, and file-like objects. Arguments such as usecols, dtype, and parse_dates let you control the import.",
    parameters: [
      {
        name: "filepath_or_buffer",
        type: "str, path, or file-like",
        description: "The CSV source to read.",
      },
      {
        name: "sep",
        type: "str, optional",
        description: "Field delimiter. Defaults to a comma.",
        optional: true,
      },
      {
        name: "header",
        type: "int or None, optional",
        description: "Row number to use as column names.",
        optional: true,
      },
    ],
    returns: "DataFrame",
    example: {
      code: `import pandas as pd

df = pd.read_csv("scores.csv")
print(df.head())`,
    },
    pitfalls: [
      "Leading spaces in column names create labels you cannot select with a plain name.",
      "Dates often arrive as strings; pass parse_dates when you need datetime operations.",
    ],
    related: ["pandas-dataframe", "pandas-head"],
  },
  {
    id: "pandas-head",
    library: "pandas",
    slug: "head",
    symbol: "DataFrame.head",
    signature: "DataFrame.head(n=5)",
    summary: "Return the first rows of a DataFrame or Series.",
    description:
      "head is a quick inspection tool. It returns a new object containing the first n rows and leaves the original unchanged. Use tail for the last rows.",
    parameters: [
      {
        name: "n",
        type: "int, optional",
        description: "Number of rows to return. Defaults to 5.",
        optional: true,
      },
    ],
    returns: "DataFrame or Series",
    example: {
      code: `import pandas as pd

df = pd.DataFrame({"score": [10, 12, 8, 15, 9, 11]})
print(df.head(2))`,
      output: "   score\n0     10\n1     12",
    },
    pitfalls: [
      "head prints a preview but does not modify the DataFrame.",
      "A negative n returns every row except the last |n| rows, which is rarely what you want.",
    ],
    related: ["pandas-dataframe", "pandas-loc"],
  },
  {
    id: "pandas-loc",
    library: "pandas",
    slug: "loc",
    symbol: "DataFrame.loc",
    signature: "DataFrame.loc[row_indexer, column_indexer]",
    summary: "Select rows and columns by label.",
    description:
      ".loc uses labels, including boolean arrays, slices with inclusive endpoints, and lists of column names. It is the clearest choice when your index carries meaning.",
    parameters: [
      {
        name: "row_indexer",
        type: "label, slice, list, or boolean array",
        description: "Rows to select by label or condition.",
      },
      {
        name: "column_indexer",
        type: "label, slice, list, or boolean array",
        description: "Columns to select by label.",
      },
    ],
    returns: "Series or DataFrame",
    example: {
      code: `import pandas as pd

df = pd.DataFrame({
    "team": ["red", "blue", "red"],
    "score": [10, 12, 8],
}, index=["a", "b", "c"])

print(df.loc["b", "score"])
print(df.loc[df["score"] > 9, ["team", "score"]])`,
    },
    pitfalls: [
      "Label slices include the stop label, unlike Python list slices.",
      ".loc is label-based; use .iloc for integer positions.",
    ],
    related: ["pandas-head", "pandas-groupby"],
  },
  {
    id: "pandas-groupby",
    library: "pandas",
    slug: "groupby",
    symbol: "DataFrame.groupby",
    signature: "DataFrame.groupby(by, as_index=True)",
    summary: "Split rows into groups for aggregation.",
    description:
      "groupby separates rows that share a key, applies an aggregation or transformation, and combines the results. Selecting one column before aggregating keeps the output focused.",
    parameters: [
      {
        name: "by",
        type: "label, list, or array",
        description: "The column or columns that define each group.",
      },
      {
        name: "as_index",
        type: "bool, optional",
        description: "Whether grouping keys become the result index.",
        optional: true,
      },
    ],
    returns: "DataFrameGroupBy",
    example: {
      code: `import pandas as pd

df = pd.DataFrame({
    "team": ["red", "blue", "red"],
    "score": [10, 12, 8],
})
print(df.groupby("team")["score"].mean())`,
      output: "team\nblue    12.0\nred      9.0\nName: score, dtype: float64",
    },
    pitfalls: [
      "Selecting a column after grouping avoids aggregating unrelated numeric columns.",
      "Group keys with missing values are dropped by default; pass dropna=False to keep them.",
    ],
    related: ["pandas-loc", "pandas-merge"],
  },
  {
    id: "pandas-merge",
    library: "pandas",
    slug: "merge",
    symbol: "DataFrame.merge",
    signature: "DataFrame.merge(right, how='inner', on=None)",
    summary: "Combine two DataFrames on shared keys.",
    description:
      "merge is the pandas join operation. The how argument chooses which keys survive: inner keeps matches, left keeps all left rows, right keeps all right rows, and outer keeps everything.",
    parameters: [
      {
        name: "right",
        type: "DataFrame",
        description: "The table to join with.",
      },
      {
        name: "how",
        type: "str, optional",
        description: "Join type: inner, left, right, or outer.",
        optional: true,
      },
      {
        name: "on",
        type: "label or list, optional",
        description: "Shared key column or columns.",
        optional: true,
      },
    ],
    returns: "DataFrame",
    example: {
      code: `import pandas as pd

scores = pd.DataFrame({"id": [1, 2], "score": [10, 12]})
teams = pd.DataFrame({"id": [1, 2], "team": ["red", "blue"]})
print(scores.merge(teams, on="id"))`,
      output: "   id  score  team\n0   1     10   red\n1   2     12  blue",
    },
    pitfalls: [
      "Duplicate keys create multiple output rows; check key uniqueness first.",
      "Inspect the row count before and after a join to catch accidental fan-out.",
    ],
    related: ["pandas-groupby", "pandas-dataframe"],
  },
];
