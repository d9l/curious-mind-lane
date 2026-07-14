import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Sigma,
  Minus,
} from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}

export function MarkdownEditor({ value, onChange, minHeight = 480 }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"edit" | "preview" | "split">("split");

  function wrap(before: string, after = before) {
    const ta = document.getElementById("md-editor") as HTMLTextAreaElement | null;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = end + before.length;
    }, 0);
  }

  function insertLine(prefix: string) {
    const ta = document.getElementById("md-editor") as HTMLTextAreaElement | null;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(next);
  }

  function insertBlock(block: string) {
    const ta = document.getElementById("md-editor") as HTMLTextAreaElement | null;
    if (!ta) return;
    const start = ta.selectionStart;
    const next = value.slice(0, start) + block + value.slice(start);
    onChange(next);
  }

  const tools = [
    { icon: Heading1, label: "H1", action: () => insertLine("# ") },
    { icon: Heading2, label: "H2", action: () => insertLine("## ") },
    { icon: Bold, label: "Bold", action: () => wrap("**") },
    { icon: Italic, label: "Italic", action: () => wrap("_") },
    { icon: List, label: "Bulleted", action: () => insertLine("- ") },
    { icon: ListOrdered, label: "Numbered", action: () => insertLine("1. ") },
    { icon: Quote, label: "Quote", action: () => insertLine("> ") },
    { icon: Code, label: "Code", action: () => wrap("`") },
    { icon: LinkIcon, label: "Link", action: () => wrap("[", "](https://)") },
    { icon: ImageIcon, label: "Image", action: () => insertBlock("![alt](https://)\n") },
    { icon: TableIcon, label: "Table", action: () => insertBlock("\n| Col | Col |\n| --- | --- |\n| A | B |\n") },
    { icon: Sigma, label: "Math", action: () => wrap("$$\n", "\n$$") },
    { icon: Minus, label: "Divider", action: () => insertBlock("\n---\n") },
  ];

  return (
    <div className="rounded-lg border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        {tools.map((t) => (
          <Button
            key={t.label}
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title={t.label}
            onClick={t.action}
          >
            <t.icon className="h-4 w-4" />
          </Button>
        ))}
        <div className="ml-auto">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="h-8">
              <TabsTrigger value="edit" className="h-7 text-xs">Edit</TabsTrigger>
              <TabsTrigger value="split" className="h-7 text-xs">Split</TabsTrigger>
              <TabsTrigger value="preview" className="h-7 text-xs">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      <div
        className={
          tab === "split"
            ? "grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x"
            : "grid grid-cols-1"
        }
      >
        {(tab === "edit" || tab === "split") && (
          <Textarea
            id="md-editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-none border-0 font-mono text-sm resize-none focus-visible:ring-0"
            style={{ minHeight }}
            placeholder="Write lesson content in Markdown…"
          />
        )}
        {(tab === "preview" || tab === "split") && (
          <div
            className="prose prose-sm md:prose-base max-w-none overflow-auto p-6"
            style={{ minHeight }}
          >
            <MarkdownPreview source={value} />
          </div>
        )}
      </div>
    </div>
  );
}

export function MarkdownPreview({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {source || "_Nothing to preview yet._"}
    </ReactMarkdown>
  );
}
