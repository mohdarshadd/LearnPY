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
  {
    id: "pandas-fillna",
    library: "pandas",
    slug: "fillna",
    symbol: "DataFrame.fillna",
    signature: "DataFrame.fillna(value=None, *, method=None, axis=None, inplace=False)",
    summary: "Replace missing values with a constant or computed value.",
    description:
      "fillna returns a copy with missing values replaced. Prefer fitting the replacement value on training data, especially when the value is a mean or median, so the test set does not influence preprocessing.",
    parameters: [
      {
        name: "value",
        type: "scalar, dict, Series, or DataFrame",
        description: "Replacement value or per-column mapping.",
      },
      {
        name: "method",
        type: "str, optional",
        description: "Fill forward or backward instead of using a value.",
        optional: true,
      },
      {
        name: "inplace",
        type: "bool, optional",
        description: "Mutate the DataFrame instead of returning a copy.",
        optional: true,
      },
    ],
    returns: "DataFrame or None",
    example: {
      code: `import pandas as pd
import numpy as np

df = pd.DataFrame({"score": [10.0, np.nan, 14.0]})
print(df.fillna({"score": df["score"].mean()}))`,
      output: "   score\n0   10.0\n1   12.0\n2   14.0",
    },
    pitfalls: [
      "Computing the fill value on all rows leaks test information into training.",
      "A single constant can hide why a value was missing; consider a missing indicator.",
    ],
    related: ["pandas-dataframe", "pandas-groupby"],
  },
  {
    id: "pandas-cut",
    library: "pandas",
    slug: "cut",
    symbol: "pd.cut",
    signature: "pd.cut(x, bins, right=True, labels=None)",
    summary: "Bin continuous values into discrete intervals.",
    description:
      "pd.cut turns a numeric column into ordered bins. Equal-width bins are easy to explain, while quantile bins keep group sizes balanced; pass explicit edges when the boundaries have real meaning.",
    parameters: [
      {
        name: "x",
        type: "array_like",
        description: "Values to bin.",
      },
      {
        name: "bins",
        type: "int, sequence, or IntervalIndex",
        description: "Number of equal-width bins or explicit edges.",
      },
      {
        name: "labels",
        type: "array_like, optional",
        description: "Names for the resulting categories.",
        optional: true,
      },
    ],
    returns: "Categorical",
    example: {
      code: `import pandas as pd

age = pd.Series([18, 25, 41, 67])
print(pd.cut(age, bins=[0, 30, 60, 100], labels=["young", "mid", "senior"]))`,
      output: "0     young\n1     young\n2       mid\n3    senior\ndtype: category",
    },
    pitfalls: [
      "The right edge is included by default; check the boundary rows.",
      "Bins derived from the full dataset should be reused on test data, not recomputed.",
    ],
    related: ["pandas-value-counts", "pandas-groupby"],
  },
  {
    id: "pandas-astype",
    library: "pandas",
    slug: "astype",
    symbol: "DataFrame.astype",
    signature: "DataFrame.astype(dtype, copy=True)",
    summary: "Convert columns to another dtype.",
    description:
      "astype casts values to a chosen type. Convert category codes to numeric types before models that require numbers, and use nullable pandas dtypes such as Int64 when missing values must survive an integer conversion.",
    parameters: [
      {
        name: "dtype",
        type: "dtype or dict",
        description: "Target dtype or a mapping from column to dtype.",
      },
      {
        name: "copy",
        type: "bool, optional",
        description: "Return a copy even when no conversion is needed.",
        optional: true,
      },
    ],
    returns: "DataFrame",
    example: {
      code: `import pandas as pd

df = pd.DataFrame({"code": ["1", "2", "3"]})
print(df.astype({"code": "int64"}).dtypes)`,
      output: "code    int64\ndtype: object",
    },
    pitfalls: [
      "astype fails on missing values when the target is a plain int dtype.",
      "Casting a category to int uses the category codes, not the label text.",
    ],
    related: ["pandas-dataframe", "pandas-get-dummies"],
  },
  {
    id: "pandas-value-counts",
    library: "pandas",
    slug: "value-counts",
    symbol: "Series.value_counts",
    signature: "Series.value_counts(normalize=False, sort=True, dropna=True)",
    summary: "Count how often each value appears.",
    description:
      "value_counts is the quickest way to audit class balance, inspect category frequencies, and decide whether a column is too rare to encode. Use normalize=True to read proportions instead of counts.",
    parameters: [
      {
        name: "normalize",
        type: "bool, optional",
        description: "Return proportions instead of counts.",
        optional: true,
      },
      {
        name: "sort",
        type: "bool, optional",
        description: "Order by descending count.",
        optional: true,
      },
      {
        name: "dropna",
        type: "bool, optional",
        description: "Exclude missing values.",
        optional: true,
      },
    ],
    returns: "Series",
    example: {
      code: `import pandas as pd

labels = pd.Series(["cat", "dog", "dog", "cat", "dog"])
print(labels.value_counts(normalize=True))`,
      output: "dog    0.6\ncat    0.4\nName: proportion, dtype: float64",
    },
    pitfalls: [
      "The result is sorted by count, not by category order.",
      "Class imbalance is easier to see with normalize=True on the training labels only.",
    ],
    related: ["pandas-groupby", "pandas-cut"],
  },
  {
    id: "pandas-get-dummies",
    library: "pandas",
    slug: "get-dummies",
    symbol: "pd.get_dummies",
    signature: "pd.get_dummies(data, columns=None, drop_first=False, dtype=None)",
    summary: "Create indicator columns for categorical values.",
    description:
      "get_dummies is a fast pandas shortcut for one-hot encoding. For production pipelines prefer scikit-learn OneHotEncoder so the training categories, unknown handling, and column order are stored with the model.",
    parameters: [
      {
        name: "data",
        type: "DataFrame or Series",
        description: "Data containing categorical columns.",
      },
      {
        name: "columns",
        type: "list, optional",
        description: "Columns to encode; default encodes every categorical column.",
        optional: true,
      },
      {
        name: "drop_first",
        type: "bool, optional",
        description: "Drop one level to avoid perfect collinearity.",
        optional: true,
      },
    ],
    returns: "DataFrame",
    example: {
      code: `import pandas as pd

df = pd.DataFrame({"team": ["red", "blue", "red"]})
print(pd.get_dummies(df, columns=["team"]))`,
      output: "   team_blue  team_red\n0      False      True\n1       True     False\n2      False      True",
    },
    pitfalls: [
      "Encoding train and test separately can produce different columns.",
      "drop_first changes interpretation; keep it consistent between fit and inference.",
    ],
    related: ["pandas-astype", "pandas-dataframe"],
  },
];
