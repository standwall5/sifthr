"use client";

import React from "react";
import styles from "./RichTextRenderer.module.css";

interface RichTextRendererProps {
  content: string; // JSON string from Tiptap
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  let parsedContent;

  try {
    parsedContent = JSON.parse(content);
  } catch (e) {
    // If it's not JSON, treat it as plain text/markdown (backward compatibility)
    return <div className={styles.content}>{content}</div>;
  }

  const renderNode = (node: any, index: number): React.ReactNode => {
    const key = `${node.type}-${index}`;

    switch (node.type) {
      case "paragraph":
        return (
          <p key={key} className={styles.paragraph}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </p>
        );

      case "heading":
        const level = node.attrs.level;
        const headingContent = node.content?.map((child: any, i: number) =>
          renderNode(child, i)
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
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </ul>
        );

      case "orderedList":
        return (
          <ol key={key} className={styles.orderedList}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </ol>
        );

      case "listItem":
        return (
          <li key={key} className={styles.listItem}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </li>
        );

      case "blockquote":
        return (
          <blockquote key={key} className={styles.blockquote}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </blockquote>
        );

      case "image":
        return (
          <img
            key={key}
            src={node.attrs.src}
            alt={node.attrs.alt || ""}
            className={styles.image}
          />
        );

      case "text":
        let text: React.ReactNode = node.text;

        if (node.marks) {
          node.marks.forEach((mark: any) => {
            if (mark.type === "bold") {
              text = <strong>{text}</strong>;
            } else if (mark.type === "italic") {
              text = <em>{text}</em>;
            } else if (mark.type === "link") {
              text = (
                <a
                  href={mark.attrs.href}
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
      {parsedContent.content?.map((node: any, i: number) =>
        renderNode(node, i)
      )}
    </div>
  );
}
