"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import DailyFact from "@/app/components/DailyFact";
import BadgeScroll from "@/app/components/BadgeScroll";
import RecommendedModules from "@/app/(logged-in)/components/RecommendedModules";
import RecommendedQuizzes from "@/app/(logged-in)/components/RecommendedQuizzes";
import GuestMigrationPrompt from "@/app/components/GuestMigrationPrompt";
import { shouldShowMigrationPrompt } from "@/app/lib/guestMigration";
import { supabase } from "@/app/lib/supabaseClient";
import SafeImage from "@/app/components/SafeImage";
import {
  BookOpenIcon,
  AcademicCapIcon,
  NewspaperIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import "./styles.css";

export default function HomePage() {
  const [showMigration, setShowMigration] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkMigration = async () => {
      if (shouldShowMigrationPrompt()) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          setShowMigration(true);
        }
      }
    };
    checkMigration();
  }, []);

  return (
    <>
      {/* Guest Migration Prompt */}
      {showMigration && userId && (
        <GuestMigrationPrompt
          userId={userId}
          onComplete={() => setShowMigration(false)}
        />
      )}

      {/* Daily Scam Fact */}
      <DailyFact />

      {/* <!-- Menu -->
        <!-- Redirect users to new page each time --> */}
      <div className="menu">
        <Link className="box" id="modules" href="/learning-modules">
          <div className="box-header">
            <SafeImage
              src="/assets/images/learning.webp"
              alt="Learning Materials"
              fallbackIcon={BookOpenIcon}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="box-content">
            <h1>Learning Materials</h1>
            <p>
              This interactive learning module is specifically designed to
              educate individuals, particularly the elderly, about the dangers
              of social media ad scams and how to identify them.
            </p>
          </div>
        </Link>
        <Link className="box" id="quizzes" href="quizzes">
          <div className="box-header">
            <SafeImage
              src="/assets/images/quiz.png"
              alt="Quizzes"
              fallbackIcon={AcademicCapIcon}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="box-content">
            <h1>Quizzes</h1>
            <p>
              Test your knowledge and reinforce what you&apos;ve learned about
              social media ad scams. This quiz will help you identify the signs
              of fraudulent ads and ensure you&apos;re equipped with the right
              strategies to stay safe online. Ready to challenge yourself?
            </p>
          </div>
        </Link>
        <Link className="box" id="latestNews" href="latest-news">
          <div className="box-header">
            <SafeImage
              src="/assets/images/latest-news.webp"
              alt="Latest News"
              fallbackIcon={NewspaperIcon}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="box-content">
            <h1>Latest News</h1>
            <p>
              Stay updated with the foregoing dangers present online. The most
              updated information regarding recent social media advertisement
              and online scams.
            </p>
          </div>
        </Link>
        <Link className="box" id="support" href="/support">
          <div className="box-header">
            <SafeImage
              src="/assets/images/support.webp"
              alt="Support"
              fallbackIcon={LifebuoyIcon}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div className="box-content">
            <h1>Support</h1>
            <p>
              Need help or have questions? Our support team is here to assist
              you with any concerns about online safety, scam identification, or
              using the platform. Reach out and we&apos;ll be happy to help!
            </p>
          </div>
        </Link>
      </div>

      {/* Badge Scroll Section */}
      <BadgeScroll />

      {/* Recommended Modules Section */}
      <RecommendedModules />

      {/* Recommended Quizzes Section */}
      <RecommendedQuizzes />
    </>
  );
}
