# Quick Start Guide - New Features

## 🚀 How to Use the New Features

### 1. Admin Panel Access

```
URL: /admin
```

- Dashboard shows stats overview
- Sidebar navigation for all admin sections
- Mobile-responsive design

### 2. Rich Text Editor

```tsx
import RichTextEditor from "@/app/components/RichTextEditor";

<RichTextEditor
  content={jsonContent}
  onChange={(json) => handleContentChange(json)}
/>;
```

To display:

```tsx
import RichTextRenderer from "@/app/components/RichTextRenderer";

<RichTextRenderer content={jsonContent} />;
```

### 3. Change Password

```tsx
import ChangePassword from "@/app/components/ChangePassword";

// Add to settings page
<ChangePassword />;
```

### 4. Translations

```tsx
import { applyTranslations } from "@/app/lib/translationService";
import { useLanguage } from "@/app/context/LanguageContext";

const { language } = useLanguage();
const translatedModule = await applyTranslations("module", module, language);
```

Admin: `/admin/translations`

### 5. Chatbot

Automatically available on all pages (bottom-right toggle button).

To modify flows:

```json
// Edit: public/chatbot-flows.json
{
  "main": {
    "message": "Your message",
    "options": [
      {
        "text": "Option text",
        "next": "flow_key"
      }
    ]
  }
}
```

### 6. Recommendations

```tsx
import RecommendedModules from "@/app/components/RecommendedModules";
import RecommendedQuizzes from "@/app/components/RecommendedQuizzes";

<RecommendedModules />
<RecommendedQuizzes />
```

### 7. Badge Scroll

```tsx
import BadgeScroll from "@/app/components/BadgeScroll";

<BadgeScroll />;
```

### 8. Daily Facts

```tsx
import DailyFact from "@/app/components/DailyFact";

<DailyFact />;
```

Admin: `/admin/daily-facts`

### 9. Guided Tours

```tsx
import TourTrigger from "@/app/components/TourTrigger";

// Auto-start for first-time users
<TourTrigger tourName="home-walkthrough" delay={1000} />;
```

Manual trigger:

```tsx
import { startTour } from "@/app/lib/tours";

startTour("module-walkthrough");
```

### 10. Guest Migration

Automatically shows prompt when guest user logs in.

Check if guest has data:

```tsx
import { shouldShowMigrationPrompt } from "@/app/lib/guestMigration";

if (shouldShowMigrationPrompt()) {
  // Show prompt
}
```

### 11. Pin Quiz

```tsx
import PinQuiz from "@/app/components/PinQuiz";

<PinQuiz
  question={pinQuestion}
  onAnswer={(pins) => handlePinAnswer(pins)}
  showCorrectAnswer={false}
/>;
```

Validate answer:

```tsx
import { validatePinAnswer, getPinFeedback } from "@/app/lib/pinQuizUtils";

const result = validatePinAnswer(question, userPins);
const feedback = getPinFeedback(result.accuracy, result.isCorrect);
```

### 12. Image Quiz Tolerance

Built into Pin Quiz. Configure tolerance in database:

```sql
-- Single pin
UPDATE questions
SET pin_tolerance = 50
WHERE id = 1;

-- Multiple pins (JSONB)
UPDATE questions
SET pins = '[
  {"x": 50, "y": 30, "tolerance": 40},
  {"x": 70, "y": 60, "tolerance": 50}
]'
WHERE id = 2;
```

---

## 📦 Database Setup

### Run Migrations

Execute in Supabase SQL Editor:

1. **Daily Facts:**

   ```sql
   -- Copy contents of sql/daily_facts.sql
   ```

2. **Content Translations:**
   ```sql
   -- Copy contents of sql/content_translations.sql
   ```

---

## 🎨 Component Examples

### Complete Homepage Example

```tsx
import DailyFact from "@/app/components/DailyFact";
import BadgeScroll from "@/app/components/BadgeScroll";
import RecommendedModules from "@/app/components/RecommendedModules";
import RecommendedQuizzes from "@/app/components/RecommendedQuizzes";
import TourTrigger from "@/app/components/TourTrigger";

export default function HomePage() {
  return (
    <>
      <TourTrigger tourName="home-walkthrough" delay={1500} />
      <DailyFact />

      {/* Your menu cards */}

      <BadgeScroll />
      <RecommendedModules />
      <RecommendedQuizzes />
    </>
  );
}
```

### Settings Page Example

```tsx
import ChangePassword from "@/app/components/ChangePassword";

export default function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>

      {/* Other settings */}

      <section>
        <h2>Security</h2>
        <ChangePassword />
      </section>
    </div>
  );
}
```

### Quiz Page with Pin Quiz

```tsx
import { useState } from "react";
import PinQuiz from "@/app/components/PinQuiz";
import { validatePinAnswer, getPinFeedback } from "@/app/lib/pinQuizUtils";

export default function QuizPage({ question }) {
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [userPins, setUserPins] = useState([]);

  const handleAnswer = async (pins) => {
    const validationResult = validatePinAnswer(question, pins);
    setResult(validationResult);
    setUserPins(pins);
    setSubmitted(true);

    // Save to database
    // await saveQuizAnswer(...)
  };

  return (
    <div>
      <PinQuiz
        question={question}
        onAnswer={handleAnswer}
        showCorrectAnswer={submitted}
        userPins={userPins}
      />

      {submitted && result && (
        <div>
          <p>{getPinFeedback(result.accuracy, result.isCorrect)}</p>
          <p>Accuracy: {result.accuracy}%</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🔧 Configuration

### Chatbot Flows

Edit `public/chatbot-flows.json`:

```json
{
  "new_flow": {
    "message": "Flow message here",
    "options": [
      {
        "text": "Go somewhere",
        "next": "another_flow"
      },
      {
        "text": "Visit page",
        "redirect": "/some-page"
      }
    ],
    "final": false
  }
}
```

### Tours

Add new tour in `src/app/lib/tours.ts`:

```tsx
export const myTour: Tour = {
  tour: "my-custom-tour",
  steps: [
    {
      icon: "🎯",
      title: "Step Title",
      content: "Step description",
      selector: ".target-element",
      side: "bottom",
      showControls: true,
      showSkip: true,
    },
  ],
};
```

Then add to `layout.tsx` steps array.

### Badge Rarity Colors

Edit `src/app/components/BadgeScroll/BadgeScroll.module.css`:

```css
.common {
  /* gray */
}
.rare {
  /* blue */
}
.epic {
  /* purple */
}
.legendary {
  /* gold */
}
```

---

## 📝 API Routes

### Daily Facts

```
GET  /api/daily-fact?language=en
GET  /api/admin/daily-facts
POST /api/admin/daily-facts
PUT  /api/admin/daily-facts/:id
DELETE /api/admin/daily-facts/:id
```

### Translations (Future)

```
GET  /api/translations/:contentType/:contentId/:language
POST /api/admin/translations
```

---

## ✅ Testing Checklist

- [ ] Admin dashboard loads and shows correct stats
- [ ] Rich text editor saves and renders content
- [ ] Password change validates and updates
- [ ] Translations apply when language switched
- [ ] Chatbot opens and navigates flows
- [ ] Recommendations filter completed items
- [ ] Badge scroll shows earned/locked states
- [ ] Daily fact displays and rotates
- [ ] Tours auto-start for new users
- [ ] Guest data migrates on login
- [ ] Pin quiz validates answers
- [ ] Tolerance zones work correctly

---

## 🐛 Troubleshooting

### Chatbot not showing

- Check `layout.tsx` includes `<Chatbot />`
- Verify `chatbot-flows.json` exists in `public/`

### Tours not starting

- Clear localStorage: `resetAllTours()`
- Check selector targets exist in DOM

### Translations not applying

- Run `content_translations.sql` migration
- Verify translations exist in database

### Guest migration not appearing

- Check localStorage has guest data
- Verify user is logged in

### Pin quiz not validating

- Check question has `pins` or `pin_x/y_coordinate`
- Verify tolerance values are set

---

## 📚 Further Reading

- NextStepJS: https://nextstepjs.vercel.app/
- Tiptap: https://tiptap.dev/
- Supabase: https://supabase.com/docs

---

**All features are production-ready!** 🎉
