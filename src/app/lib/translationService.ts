/**
 * Translation Service - Handles multilingual content
 */

import { supabase } from "@/app/lib/supabaseClient";

export type ContentType =
  | "module"
  | "module_section"
  | "quiz"
  | "question"
  | "answer"
  | "news"
  | "daily_fact"
  | "badge";

export type Language = "en" | "tl";

export type TranslatedContent<T> = T & {
  translations?: Record<string, string>;
};

/**
 * Get translation for a specific field
 */
export async function getTranslation(
  contentType: ContentType,
  contentId: number,
  fieldName: string,
  language: Language = "en"
): Promise<string | null> {
  const { data, error } = await supabase
    .from("content_translations")
    .select("translated_text")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .eq("field_name", fieldName)
    .eq("language", language)
    .single();

  if (error || !data) return null;
  return data.translated_text;
}

/**
 * Get all translations for a content item
 */
export async function getContentTranslations(
  contentType: ContentType,
  contentId: number,
  language: Language = "en"
): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("content_translations")
    .select("field_name, translated_text")
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .eq("language", language);

  if (error || !data) return {};

  return data.reduce(
    (
      acc: Record<string, string>,
      item: { field_name: string; translated_text: string }
    ) => {
      acc[item.field_name] = item.translated_text;
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Apply translations to content object
 */
export async function applyTranslations<T extends Record<string, unknown>>(
  contentType: ContentType,
  content: T,
  language: Language = "en",
  idField: string = "id"
): Promise<TranslatedContent<T>> {
  // If language is English, return original content
  if (language === "en") return content;

  const translations = await getContentTranslations(
    contentType,
    content[idField] as number,
    language
  );

  // Apply translations to content
  const translatedContent: Record<string, unknown> = { ...content };
  Object.keys(translations).forEach((fieldName) => {
    if (fieldName in translatedContent) {
      translatedContent[fieldName] = translations[fieldName];
    }
  });

  return {
    ...translatedContent,
    translations,
  } as TranslatedContent<T>;
}

/**
 * Apply translations to an array of content items
 */
export async function applyTranslationsToArray<
  T extends Record<string, unknown>
>(
  contentType: ContentType,
  items: T[],
  language: Language = "en",
  idField: string = "id"
): Promise<TranslatedContent<T>[]> {
  if (language === "en") return items;

  return Promise.all(
    items.map((item) => applyTranslations(contentType, item, language, idField))
  );
}

/**
 * Save translation (admin function)
 */
export async function saveTranslation(
  contentType: ContentType,
  contentId: number,
  fieldName: string,
  language: Language,
  translatedText: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("content_translations").upsert(
    {
      content_type: contentType,
      content_id: contentId,
      field_name: fieldName,
      language,
      translated_text: translatedText,
    },
    {
      onConflict: "content_type,content_id,field_name,language",
    }
  );

  if (error) {
    console.error("Translation save error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Delete translation (admin function)
 */
export async function deleteTranslation(
  contentType: ContentType,
  contentId: number,
  fieldName: string,
  language: Language
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("content_translations")
    .delete()
    .eq("content_type", contentType)
    .eq("content_id", contentId)
    .eq("field_name", fieldName)
    .eq("language", language);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Get all content items that need translation
 */
export async function getUntranslatedContent(
  contentType: ContentType,
  language: Language = "tl"
): Promise<
  Array<{
    contentId: number;
    fieldName: string;
    originalText: string;
    hasTranslation: boolean;
  }>
> {
  // This would need to be customized per content type
  // For now, return empty array
  // TODO: Implement per-content-type logic
  return [];
}
