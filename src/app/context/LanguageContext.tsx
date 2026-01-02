"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "tl";

interface Translations {
  [key: string]: {
    en: string;
    tl: string;
  };
}

const translations: Translations = {
  "nav.modules": { en: "Modules", tl: "Mga Module" },
  "nav.quizzes": { en: "Quizzes", tl: "Mga Pagsusulit" },
  "nav.latestNews": { en: "Latest News", tl: "Pinakabagong Balita" },
  "nav.support": { en: "Support", tl: "Suporta" },
  "nav.addContent": { en: "Add Content", tl: "Magdagdag ng Nilalaman" },
  "nav.profile": { en: "Profile", tl: "Profile" },
  "nav.settings": { en: "Settings", tl: "Mga Setting" },
  "nav.signOut": { en: "Sign Out", tl: "Mag-sign Out" },
  "nav.streak": { en: "Day Streak", tl: "Sunod-sunod na Araw" },
  "settings.title": { en: "Settings", tl: "Mga Setting" },
  "settings.theme": { en: "Theme", tl: "Tema" },
  "settings.light": { en: "Light", tl: "Maliwanag" },
  "settings.dark": { en: "Dark", tl: "Madilim" },
  "settings.language": { en: "Language", tl: "Wika" },
  "settings.english": { en: "English", tl: "Ingles" },
  "settings.tagalog": { en: "Tagalog", tl: "Tagalog" },
  "settings.saveSuccess": {
    en: "Settings saved successfully",
    tl: "Matagumpay na na-save ang mga setting",
  },
  "profile.modulesCompleted": {
    en: "of Modules Completed",
    tl: "ng Mga Module na Nakumpleto",
  },
  "profile.overallGrade": {
    en: "Overall Quiz Grade",
    tl: "Kabuuang Marka sa Pagsusulit",
  },
  "profile.currentStreak": { en: "Current Streak", tl: "Kasalukuyang Streak" },
  "profile.days": { en: "days", tl: "mga araw" },
  "profile.moduleHistory": { en: "Module History", tl: "Kasaysayan ng Module" },
  "profile.quizHistory": { en: "Quiz History", tl: "Kasaysayan ng Pagsusulit" },
  "profile.noModuleHistory": {
    en: "No module history available.",
    tl: "Walang available na kasaysayan ng module.",
  },
  "profile.noQuizHistory": {
    en: "No quiz history available.",
    tl: "Walang available na kasaysayan ng pagsusulit.",
  },
  "profile.badges": { en: "Badges", tl: "Mga Badge" },
  "profile.noBadges": {
    en: "No badges earned yet.",
    tl: "Wala pang natanggap na mga badge.",
  },
  "common.loading": { en: "Loading...", tl: "Naglo-load..." },
  "common.error": { en: "Error", tl: "Error" },
  "common.save": { en: "Save", tl: "I-save" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem("sifthr-language") as Language;
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (mounted) {
      localStorage.setItem("sifthr-language", lang);
    }
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
