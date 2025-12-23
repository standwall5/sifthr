import { useEffect, useState } from "react";
import type { NewsArticle } from "@/lib/models/types";
import { supabase } from "@/app/lib/supabaseClient";

export function useArticles() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadArticles = async () => {
      setLoading(true);

      // Load existing articles immediately
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch articles:", error.message);
      } else if (isMounted) {
        setArticles((data ?? []) as NewsArticle[]);
      }

      if (isMounted) setLoading(false);

      // Fetch new articles in background (don't block UI)
      fetch("/api/news/fetch-and-save")
        .then(() => {
          // Quietly reload articles after background fetch completes
          return supabase
            .from("news_articles")
            .select("*")
            .order("published_at", { ascending: false });
        })
        .then(({ data: newData }) => {
          if (isMounted && newData) {
            setArticles(newData as NewsArticle[]);
          }
        })
        .catch((err) => console.error("Background fetch failed:", err));
    };

    loadArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  return { articles, loading };
}
