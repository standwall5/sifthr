"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  // Process content to ensure proper markdown formatting
  const processedContent = content
    .replace(/•/g, "-") // Convert bullet points to markdown bullets
    .replace(/\n/g, "  \n") // Ensure line breaks are recognized
    .trim();

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Headings
          h1: ({ ...props }) => (
            <h1
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginTop: "1.5rem",
                marginBottom: "1rem",
                color: "var(--text)",
              }}
              {...props}
            />
          ),
          h2: ({ ...props }) => (
            <h2
              style={{
                fontSize: "1.75rem",
                fontWeight: "bold",
                marginTop: "1.25rem",
                marginBottom: "0.875rem",
                color: "var(--text)",
              }}
              {...props}
            />
          ),
          h3: ({ ...props }) => (
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                marginTop: "1rem",
                marginBottom: "0.75rem",
                color: "var(--text)",
              }}
              {...props}
            />
          ),
          h4: ({ ...props }) => (
            <h4
              style={{
                fontSize: "1.25rem",
                fontWeight: "600",
                marginTop: "0.875rem",
                marginBottom: "0.625rem",
                color: "var(--text)",
              }}
              {...props}
            />
          ),
          h5: ({ ...props }) => (
            <h5
              style={{
                fontSize: "1.125rem",
                fontWeight: "600",
                marginTop: "0.75rem",
                marginBottom: "0.5rem",
                color: "var(--text)",
              }}
              {...props}
            />
          ),
          h6: ({ ...props }) => (
            <h6
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginTop: "0.625rem",
                marginBottom: "0.5rem",
                color: "var(--text)",
              }}
              {...props}
            />
          ),

          // Paragraphs
          p: ({ ...props }) => (
            <p
              style={{
                marginBottom: "1rem",
                lineHeight: "1.75",
                color: "var(--text)",
                fontSize: "1rem",
              }}
              {...props}
            />
          ),

          // Unordered Lists
          ul: ({ ...props }) => (
            <ul
              style={{
                marginLeft: "1.5rem",
                marginBottom: "1rem",
                listStyleType: "disc",
                lineHeight: "1.75",
                color: "var(--text)",
              }}
              {...props}
            />
          ),

          // Ordered Lists
          ol: ({ ...props }) => (
            <ol
              style={{
                marginLeft: "1.5rem",
                marginBottom: "1rem",
                listStyleType: "decimal",
                lineHeight: "1.75",
                color: "var(--text)",
              }}
              {...props}
            />
          ),

          // List Items
          li: ({ ...props }) => (
            <li
              style={{
                marginBottom: "0.5rem",
                paddingLeft: "0.5rem",
                color: "var(--text)",
              }}
              {...props}
            />
          ),

          // Links
          a: ({ ...props }) => (
            <a
              style={{
                color: "var(--purple)",
                textDecoration: "underline",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--lime)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--purple)";
              }}
              {...props}
            />
          ),

          // Blockquotes
          blockquote: ({ ...props }) => (
            <blockquote
              style={{
                borderLeft: "4px solid var(--purple)",
                paddingLeft: "1rem",
                marginLeft: "0",
                marginBottom: "1rem",
                fontStyle: "italic",
                color: "var(--text-secondary)",
                backgroundColor: "var(--card-bg-highlight)",
                padding: "1rem",
                borderRadius: "0.5rem",
              }}
              {...props}
            />
          ),

          // Code blocks
          code: ({ className, ...props }) => {
            const isInline = !className?.includes("language-");
            return isInline ? (
              <code
                style={{
                  backgroundColor: "var(--card-bg-highlight)",
                  padding: "0.125rem 0.375rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  color: "var(--purple)",
                }}
                {...props}
              />
            ) : (
              <code
                style={{
                  display: "block",
                  backgroundColor: "var(--card-bg-highlight)",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontFamily: "monospace",
                  color: "var(--text)",
                  overflowX: "auto",
                  marginBottom: "1rem",
                }}
                {...props}
              />
            );
          },

          // Pre (for code blocks)
          pre: ({ ...props }) => (
            <pre
              style={{
                backgroundColor: "var(--card-bg-highlight)",
                padding: "1rem",
                borderRadius: "0.5rem",
                overflowX: "auto",
                marginBottom: "1rem",
                border: "1px solid var(--border-color)",
              }}
              {...props}
            />
          ),

          // Horizontal Rule
          hr: ({ ...props }) => (
            <hr
              style={{
                border: "none",
                borderTop: "2px solid var(--border-color)",
                marginTop: "2rem",
                marginBottom: "2rem",
              }}
              {...props}
            />
          ),

          // Images
          img: ({ ...props }) => (
            <img
              alt=""
              style={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "0.5rem",
                marginTop: "1rem",
                marginBottom: "1rem",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              {...props}
            />
          ),

          // Tables
          table: ({ ...props }) => (
            <div style={{ overflowX: "auto", marginBottom: "1rem" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid var(--border-color)",
                }}
                {...props}
              />
            </div>
          ),

          thead: ({ ...props }) => (
            <thead
              style={{
                backgroundColor: "var(--card-bg-highlight)",
              }}
              {...props}
            />
          ),

          th: ({ ...props }) => (
            <th
              style={{
                padding: "0.75rem",
                textAlign: "left",
                fontWeight: "600",
                color: "var(--text)",
                border: "1px solid var(--border-color)",
              }}
              {...props}
            />
          ),

          td: ({ ...props }) => (
            <td
              style={{
                padding: "0.75rem",
                color: "var(--text)",
                border: "1px solid var(--border-color)",
              }}
              {...props}
            />
          ),

          // Strong/Bold
          strong: ({ ...props }) => (
            <strong
              style={{
                fontWeight: "700",
                color: "var(--text)",
              }}
              {...props}
            />
          ),

          // Emphasis/Italic
          em: ({ ...props }) => (
            <em
              style={{
                fontStyle: "italic",
                color: "var(--text)",
              }}
              {...props}
            />
          ),

          // Strikethrough
          del: ({ ...props }) => (
            <del
              style={{
                textDecoration: "line-through",
                color: "var(--text-secondary)",
              }}
              {...props}
            />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
