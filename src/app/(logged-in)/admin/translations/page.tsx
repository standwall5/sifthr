"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import {
  saveTranslation,
  type ContentType,
  type Language,
} from "@/app/lib/translationService";
import styles from "./adminPage.module.css";

type ContentItem = {
  id: number;
  title?: string;
  description?: string;
  content?: string;
  question_text?: string;
  answer_text?: string;
  fact_text?: string;
  name?: string;
};

type Translation = {
  content_id: number;
  field_name: string;
  translated_text: string;
};

export default function AdminTranslationsPage() {
  const [contentType, setContentType] = useState<ContentType>("module");
  const [language, setLanguage] = useState<Language>("tl");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);

  const contentTypes: Array<{
    value: ContentType;
    label: string;
    table: string;
    fields: string[];
  }> = [
    {
      value: "module",
      label: "Modules",
      table: "modules",
      fields: ["title", "description"],
    },
    {
      value: "quiz",
      label: "Quizzes",
      table: "quizzes",
      fields: ["title", "description"],
    },
    {
      value: "daily_fact",
      label: "Daily Facts",
      table: "daily_facts",
      fields: ["fact_text"],
    },
    {
      value: "badge",
      label: "Badges",
      table: "badges",
      fields: ["name", "description"],
    },
    {
      value: "news",
      label: "News Articles",
      table: "news_articles",
      fields: ["title", "summary"],
    },
  ];

  const currentConfig = contentTypes.find((ct) => ct.value === contentType);

  useEffect(() => {
    loadContent();
  }, [contentType]);

  const loadContent = async () => {
    if (!currentConfig) return;

    setLoading(true);

    try {
      // Load content items
      const { data: contentData, error: contentError } = await supabase
        .from(currentConfig.table)
        .select("*")
        .order("id");

      if (contentError) throw contentError;
      setItems(contentData || []);

      // Load existing translations
      const { data: translationData, error: translationError } = await supabase
        .from("content_translations")
        .select("content_id, field_name, translated_text")
        .eq("content_type", contentType)
        .eq("language", language);

      if (translationError) throw translationError;

      const translationMap: Record<string, string> = {};
      (translationData || []).forEach((t: Translation) => {
        translationMap[`${t.content_id}_${t.field_name}`] = t.translated_text;
      });
      setTranslations(translationMap);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (
    contentId: number,
    fieldName: string,
    value: string
  ) => {
    const key = `${contentId}_${fieldName}`;
    setSaving(key);

    try {
      const result = await saveTranslation(
        contentType,
        contentId,
        fieldName,
        language,
        value
      );

      if (result.success) {
        setTranslations((prev) => ({ ...prev, [key]: value }));
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save translation");
    } finally {
      setSaving(null);
    }
  };

  const getFieldValue = (item: ContentItem, fieldName: string): string => {
    return ((item as Record<string, unknown>)[fieldName] as string) || "";
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1>Translation Management</h1>
        <p>Manage multilingual content for modules, quizzes, and more</p>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <label>Content Type:</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value as ContentType)}
            className={styles.select}
          >
            {contentTypes.map((ct) => (
              <option key={ct.value} value={ct.value}>
                {ct.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Target Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className={styles.select}
          >
            <option value="tl">Tagalog</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className={styles.content}>
        {loading ? (
          <p className={styles.placeholder}>Loading...</p>
        ) : items.length === 0 ? (
          <p className={styles.placeholder}>
            No {currentConfig?.label.toLowerCase()} found
          </p>
        ) : (
          <div className={styles.translationList}>
            {items.map((item) => (
              <div key={item.id} className={styles.translationItem}>
                <div className={styles.itemHeader}>
                  <strong>
                    ID: {item.id} -{" "}
                    {getFieldValue(item, currentConfig?.fields[0] || "title")}
                  </strong>
                </div>

                {currentConfig?.fields.map((fieldName) => (
                  <div key={fieldName} className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>
                      {fieldName
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                      :
                    </label>

                    <div className={styles.translationRow}>
                      <div className={styles.originalText}>
                        <small>Original (EN):</small>
                        <p>{getFieldValue(item, fieldName)}</p>
                      </div>

                      <div className={styles.translatedText}>
                        <small>Translation ({language.toUpperCase()}):</small>
                        <textarea
                          value={translations[`${item.id}_${fieldName}`] || ""}
                          onChange={(e) =>
                            setTranslations((prev) => ({
                              ...prev,
                              [`${item.id}_${fieldName}`]: e.target.value,
                            }))
                          }
                          className={styles.textarea}
                          rows={3}
                          placeholder={`Enter ${language} translation...`}
                        />
                        <button
                          className={styles.saveButton}
                          onClick={() =>
                            handleSave(
                              item.id,
                              fieldName,
                              translations[`${item.id}_${fieldName}`] || ""
                            )
                          }
                          disabled={
                            saving === `${item.id}_${fieldName}` ||
                            !translations[`${item.id}_${fieldName}`]
                          }
                        >
                          {saving === `${item.id}_${fieldName}`
                            ? "Saving..."
                            : "Save Translation"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
