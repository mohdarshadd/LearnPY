"use client";

import { python } from "@codemirror/lang-python";
import dynamic from "next/dynamic";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[240px] items-center justify-center font-mono text-xs text-paper/45">
      Loading editor&hellip;
    </div>
  ),
});

const editorExtensions = [python()];

const editorSetup = {
  lineNumbers: true,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,
  foldGutter: false,
  autocompletion: false,
};

type PythonEditorProps = {
  ariaLabel?: string;
  height?: number;
  onChange: (value: string) => void;
  readOnly?: boolean;
  value: string;
};

export function PythonEditor({
  ariaLabel = "Python code editor",
  height = 240,
  onChange,
  readOnly = false,
  value,
}: PythonEditorProps) {
  return (
    <CodeMirror
      aria-label={ariaLabel}
      basicSetup={editorSetup}
      extensions={editorExtensions}
      height={`${height}px`}
      onChange={onChange}
      readOnly={readOnly}
      spellCheck={false}
      theme="dark"
      value={value}
    />
  );
}
