"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./RichTextRenderer.module.css";
import SafeImage from "@/app/components/SafeImage";

interface RichTextRendererProps {
  content: string; // JSON string from Tiptap or Markdown text
}

interface TiptapNode {
  type: string;
  content?: TiptapNode[];
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  let parsedContent;

  console.log('RichTextRenderer received content:', content?.substring(0, 200));

  try {
    parsedContent = JSON.parse(content);
    console.log('Content is JSON (Tiptap format)');
  } catch {
    console.log('Content is plain text, processing line by line...');
    // If it's not JSON, render as plain text with preserved formatting
    // Split content into lines and process each one
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let listType: 'bullet' | 'numbered' | null = null;

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'bullet') {
          elements.push(
            <ul key={`list-${elements.length}`} className={styles.bulletList}>
              {currentList.map((item, i) => (
                <li key={i} className={styles.listItem} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
        } else if (listType === 'numbered') {
          elements.push(
            <ol key={`list-${elements.length}`} className={styles.orderedList}>
              {currentList.map((item, i) => (
                <li key={i} className={styles.listItem} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ol>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    const processInlineFormatting = (text: string): string => {
      // Convert **bold** to <strong>
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      // Convert *italic* to <em>
      text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
      // Convert links [text](url) to <a>
      text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="' + styles.link + '">$1</a>');
      return text;
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check for bullet points (•, -, *, ✖️, ✅, etc.)
      const bulletMatch = trimmedLine.match(/^([•\-\*✖️✅⚠️❌🔵🟣⚫🔴🚩])\s+(.+)$/);
      const numberedMatch = trimmedLine.match(/^(\d+\.)\s+(.+)$/);

      if (bulletMatch) {
        if (listType !== 'bullet') {
          flushList();
          listType = 'bullet';
        }
        currentList.push(processInlineFormatting(bulletMatch[2]));
      } else if (numberedMatch) {
        if (listType !== 'numbered') {
          flushList();
          listType = 'numbered';
        }
        currentList.push(processInlineFormatting(numberedMatch[2]));
      } else {
        flushList();
        
        if (trimmedLine === '') {
          // Empty line - skip it, paragraph margins provide spacing
          return;
        } else {
          // Regular paragraph
          elements.push(
            <p key={`p-${index}`} className={styles.paragraph} dangerouslySetInnerHTML={{ __html: processInlineFormatting(trimmedLine) }} />
          );
        }
      }
    });

    flushList(); // Flush any remaining list items

    return <div className={styles.markdownContent}>{elements}</div>;
  }

  const renderNode = (node: TiptapNode, index: number): React.ReactNode => {
    const key = `${node.type}-${index}`;

    switch (node.type) {
      case "paragraph":
        return (
          <p key={key} className={styles.paragraph}>
            {node.content?.map((child, i: number) => renderNode(child, i))}
          </p>
        );

      case "heading":
        const level = node.attrs?.level;
        const headingContent = node.content?.map((child, i: number) =>
          renderNode(child, i),
        );

        switch (level) {
          case 1:
            return (
              <h1 key={key} className={styles.heading1}>
                {headingContent}
              </h1>
            );
          case 2:
            return (
              <h2 key={key} className={styles.heading2}>
                {headingContent}
              </h2>
            );
          case 3:
            return (
              <h3 key={key} className={styles.heading3}>
                {headingContent}
              </h3>
            );
          case 4:
            return (
              <h4 key={key} className={styles.heading4}>
                {headingContent}
              </h4>
            );
          case 5:
            return (
              <h5 key={key} className={styles.heading5}>
                {headingContent}
              </h5>
            );
          case 6:
            return (
              <h6 key={key} className={styles.heading6}>
                {headingContent}
              </h6>
            );
          default:
            return (
              <p key={key} className={styles.paragraph}>
                {headingContent}
              </p>
            );
        }

      case "bulletList":
        return (
          <ul key={key} className={styles.bulletList}>
            {node.content?.map((child, i: number) => renderNode(child, i))}
          </ul>
        );

      case "orderedList":
        return (
          <ol key={key} className={styles.orderedList}>
            {node.content?.map((child, i: number) => renderNode(child, i))}
          </ol>
        );

      case "listItem":
        return (
          <li key={key} className={styles.listItem}>
            {node.content?.map((child, i: number) => renderNode(child, i))}
          </li>
        );

      case "blockquote":
        return (
          <blockquote key={key} className={styles.blockquote}>
            {node.content?.map((child, i: number) => renderNode(child, i))}
          </blockquote>
        );

      case "image":
        return (
          <SafeImage
            key={key}
            src={(node.attrs as { src?: string })?.src}
            alt={(node.attrs as { alt?: string })?.alt || ""}
            className={styles.image}
          />
        );

      case "text":
        let text: React.ReactNode = node.text;

        if (node.marks) {
          node.marks.forEach((mark) => {
            if (mark.type === "bold") {
              text = <strong>{text}</strong>;
            } else if (mark.type === "italic") {
              text = <em>{text}</em>;
            } else if (mark.type === "link") {
              text = (
                <a
                  href={(mark.attrs as { href?: string })?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {text}
                </a>
              );
            }
          });
        }

        return <React.Fragment key={key}>{text}</React.Fragment>;

      default:
        return null;
    }
  };

  return (
    <div className={styles.richTextContent}>
      {(parsedContent as { content?: TiptapNode[] }).content?.map(
        (node, i: number) => renderNode(node, i),
      )}
    </div>
  );
}
