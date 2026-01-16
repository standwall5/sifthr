/**
 * Tour Definitions - Guided walkthroughs for new users
 */

import type { Tour } from "nextstepjs";
import { HandRaisedIcon, BookOpenIcon, CheckCircleIcon, NewspaperIcon, LightBulbIcon, TrophyIcon, CheckBadgeIcon, AcademicCapIcon, StarIcon, ClockIcon, SparklesIcon, ChartBarIcon, ShieldCheckIcon, ArrowPathIcon, UserIcon, ChartPieIcon, ChatBubbleLeftRightIcon, CpuChipIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

export const homeTour: Tour = {
  tour: "home-walkthrough",
  steps: [
    {
      icon: <HandRaisedIcon className="w-6 h-6" />,
      title: "Welcome to SIFTHR!",
      content:
        "Let's take a quick tour of the platform to help you get started with learning about online scam prevention.",
      selector: ".menu",
      side: "top",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <BookOpenIcon className="w-6 h-6" />,
      title: "Learning Materials",
      content:
        "Start here to learn about different types of scams and how to identify them. Each module includes interactive content and real-world examples.",
      selector: "#modules",
      side: "right",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <CheckCircleIcon className="w-6 h-6" />,
      title: "Test Your Knowledge",
      content:
        "Take quizzes to reinforce what you've learned. You'll earn points and badges for completing quizzes successfully!",
      selector: "#quizzes",
      side: "right",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <NewspaperIcon className="w-6 h-6" />,
      title: "Stay Updated",
      content:
        "Check the latest news about online scams and security threats. Knowledge is your best defense!",
      selector: "#latestNews",
      side: "right",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <LightBulbIcon className="w-6 h-6" />,
      title: "Daily Scam Facts",
      content:
        "Learn a new scam prevention tip every day! These quick facts help you stay vigilant.",
      selector: ".daily-fact-container",
      side: "bottom",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <TrophyIcon className="w-6 h-6" />,
      title: "Your Achievements",
      content:
        "Earn badges by completing modules and quizzes. Track your progress and become a scam detection expert!",
      selector: ".badge-scroll-section",
      side: "top",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <CheckBadgeIcon className="w-6 h-6" />,
      title: "You're All Set!",
      content:
        "You're ready to start learning! Begin with a module or take a quiz to test your current knowledge. Stay safe online!",
      selector: ".menu",
      side: "top",
      showControls: true,
      showSkip: true,
    },
  ],
};

export const moduleTour: Tour = {
  tour: "module-walkthrough",
  steps: [
    {
      icon: <AcademicCapIcon className="w-6 h-6" />,
      title: "Learning Modules",
      content:
        "Each module covers a specific topic about online scams. Choose a difficulty level that matches your experience.",
      selector: ".modules-list",
      side: "top",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <StarIcon className="w-6 h-6" />,
      title: "Difficulty Levels",
      content:
        "Modules are marked as Easy, Medium, or Hard. Start with easy modules if you're new to online safety!",
      selector: ".difficulty-badge",
      side: "bottom",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <ClockIcon className="w-6 h-6" />,
      title: "Time Estimate",
      content:
        "Each module shows an estimated completion time so you can plan your learning sessions.",
      selector: ".estimated-time",
      side: "bottom",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: "Track Your Progress",
      content:
        "Completed modules will be marked with a checkmark. You can revisit them anytime!",
      selector: ".module-card",
      side: "right",
      showControls: true,
      showSkip: true,
    },
  ],
};

export const quizTour: Tour = {
  tour: "quiz-walkthrough",
  steps: [
    {
      icon: <CheckBadgeIcon className="w-6 h-6" />,
      title: "Test Your Knowledge",
      content:
        "Quizzes help reinforce what you've learned. You can retake them as many times as you want!",
      selector: ".quiz-container",
      side: "top",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: "Quiz Types",
      content:
        "We have multiple choice, true/false, and image-based pin quizzes. Each tests different aspects of scam detection.",
      selector: ".quiz-info",
      side: "right",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: "Scoring",
      content:
        "Your scores are saved and you can see your progress over time. Aim for 100% mastery!",
      selector: ".quiz-score",
      side: "bottom",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <ArrowPathIcon className="w-6 h-6" />,
      title: "Multiple Attempts",
      content:
        "Don't worry about mistakes! You can retake quizzes to improve your score and understanding.",
      selector: ".quiz-actions",
      side: "bottom",
      showControls: true,
      showSkip: true,
    },
  ],
};

export const profileTour: Tour = {
  tour: "profile-walkthrough",
  steps: [
    {
      icon: <UserIcon className="w-6 h-6" />,
      title: "Your Profile",
      content:
        "Track your learning journey! Your profile shows all your achievements and progress.",
      selector: ".profile-stats",
      side: "top",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <ChartPieIcon className="w-6 h-6" />,
      title: "Statistics",
      content:
        "View your completion rate, quiz scores, and learning streak. Watch these numbers grow!",
      selector: ".stats-cards",
      side: "bottom",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <TrophyIcon className="w-6 h-6" />,
      title: "Badge Collection",
      content:
        "All your earned badges are displayed here. Collect them all to become a scam prevention expert!",
      selector: ".badge-collection",
      side: "bottom",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <BookOpenIcon className="w-6 h-6" />,
      title: "Learning History",
      content:
        "Review your completed modules and quiz attempts. See how far you've come!",
      selector: ".history-section",
      side: "top",
      showControls: true,
      showSkip: true,
    },
  ],
};

export const chatbotTour: Tour = {
  tour: "chatbot-walkthrough",
  steps: [
    {
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6" />,
      title: "Get Help Anytime",
      content:
        "Click this button to open the help chatbot. It's available on every page!",
      selector: ".chatbot-toggle",
      side: "left",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <CpuChipIcon className="w-6 h-6" />,
      title: "Interactive Guidance",
      content:
        "The chatbot will guide you through common scam scenarios and help you understand what to do if you've been targeted.",
      selector: ".chatbot-window",
      side: "left",
      showControls: true,
      showSkip: true,
    },
    {
      icon: <ClipboardDocumentListIcon className="w-6 h-6" />,
      title: "Helpful Resources",
      content:
        "Get links to reporting agencies, safety tips, and immediate action steps all in one place.",
      selector: ".chatbot-options",
      side: "top",
      showControls: true,
      showSkip: true,
    },
  ],
};

// Helper function to start a tour
export function startTour(tourName: string): void {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("nextstep:start-tour", {
      detail: { tour: tourName },
    });
    window.dispatchEvent(event);
  }
}

// Helper function to check if user has seen a tour
export function hasSeenTour(tourName: string): boolean {
  if (typeof localStorage === "undefined") return true;
  return localStorage.getItem(`tour_completed_${tourName}`) === "true";
}

// Helper function to mark tour as seen
export function markTourAsSeen(tourName: string): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(`tour_completed_${tourName}`, "true");
}

// Helper function to reset all tours
export function resetAllTours(): void {
  if (typeof localStorage === "undefined") return;
  const tours = [
    "home-walkthrough",
    "module-walkthrough",
    "quiz-walkthrough",
    "profile-walkthrough",
    "chatbot-walkthrough",
  ];
  tours.forEach((tour) => {
    localStorage.removeItem(`tour_completed_${tour}`);
  });
}
