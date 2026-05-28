"use client";

import type { ComponentProps } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

import CodeBlock from "./CodeBlock";

type SyntaxHighlighterProps = ComponentProps<typeof SyntaxHighlighter>;

type Props = {
  language: string;
  title?: string;
  code: string;
  highlighterProps?: Partial<SyntaxHighlighterProps>;
};

export default function MarkdownCodeBlock({ language, title, code, highlighterProps }: Props) {
  return (
    <CodeBlock title={title}>
      <SyntaxHighlighter
        style={tomorrow as any}
        language={language}
        PreTag="div"
        customStyle={{
          fontSize: "13px",
          lineHeight: "1.4",
          borderRadius: "0px",
          background: "transparent",
          border: "none",
          margin: 0,
          padding: 0,
        }}
        {...(highlighterProps as SyntaxHighlighterProps)}
      >
        {code}
      </SyntaxHighlighter>
    </CodeBlock>
  );
}
