"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import styles from "./RichTextEditor.module.css";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  ListBulletIcon,
  NumberedListIcon,
  LinkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing...",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-purple-600 underline",
        },
      }),
      Image,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange(JSON.stringify(json));
    },
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
    },
  });

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className={styles.editorContainer}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        {/* Headings */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`${styles.toolbarButton} ${
              editor.isActive("heading", { level: 1 }) ? styles.active : ""
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`${styles.toolbarButton} ${
              editor.isActive("heading", { level: 2 }) ? styles.active : ""
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`${styles.toolbarButton} ${
              editor.isActive("heading", { level: 3 }) ? styles.active : ""
            }`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        <div className={styles.divider} />

        {/* Text Formatting */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive("bold") ? styles.active : ""
            }`}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive("italic") ? styles.active : ""
            }`}
            title="Italic"
          >
            <em>I</em>
          </button>
        </div>

        <div className={styles.divider} />

        {/* Lists */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive("bulletList") ? styles.active : ""
            }`}
            title="Bullet List"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive("orderedList") ? styles.active : ""
            }`}
            title="Numbered List"
          >
            1.
          </button>
        </div>

        <div className={styles.divider} />

        {/* Links & Images */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={addLink}
            className={`${styles.toolbarButton} ${
              editor.isActive("link") ? styles.active : ""
            }`}
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={addImage}
            className={styles.toolbarButton}
            title="Add Image"
          >
            <PhotoIcon className="w-4 h-4" />
          </button>
        </div>

        <div className={styles.divider} />

        {/* Blockquote */}
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${styles.toolbarButton} ${
              editor.isActive("blockquote") ? styles.active : ""
            }`}
            title="Blockquote"
          >
            &quot;&quot;
          </button>
        </div>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
