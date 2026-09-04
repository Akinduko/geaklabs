"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { cn } from "@geaklabs/ui";

function ToolbarButton({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded px-2.5 py-1 font-display text-sm transition-colors",
        active ? "bg-ink-900 text-paper" : "text-ink-600 hover:bg-ink-100",
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-ink-200 bg-ink-50 px-2 py-1.5">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive("heading", { level: 2 })}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive("heading", { level: 3 })}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive("blockquote")}
      >
        &ldquo; &rdquo;
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
      >
        1. List
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        —
      </ToolbarButton>
    </div>
  );
}

/**
 * Rich text editor. Renders a hidden input named `contentHtml` so the parent
 * <form> submits the current HTML via a plain server action.
 */
export function RichEditor({ name, initialHtml }: { name: string; initialHtml?: string }) {
  const [html, setHtml] = useState(initialHtml ?? "");

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialHtml ?? "<p></p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-editorial min-h-[320px] max-w-none px-4 py-4 focus:outline-none [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-6 [&_p]:mt-4",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-ink-200 bg-paper">
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
