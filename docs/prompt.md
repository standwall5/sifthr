1. Admin UI Improvements

Goal: Improve clarity, consistency, and usability of the admin interface.

Create a unified Admin layout (sidebar navigation, top bar, content container).

Standardize UI elements: buttons, tables, forms, modals, empty states, loading states.

Refactor admin pages to follow a clear pattern:

List view → Detail view → Edit view

Improve content management UX for modules, quizzes, images, and translations.

2. Rich Text Support for Learning Modules

Goal: Allow admins to create formatted module content.

Integrate a rich text editor (e.g., Tiptap or Lexical).

Supported formatting:

Headings

Bold, italic, underline

Bullet and numbered lists

Links

Images

Blockquotes / callouts

Store content as structured JSON (not raw HTML).

Ensure proper rendering on the user side.

3. User Change Password Feature

Goal: Allow authenticated users to change their password.

Add a “Change Password” option in user settings.

Validate new password (confirmation + strength).

Handle re-authentication if required by the auth provider.

Provide proper success and error feedback.

4. Full Site Translation Including Dynamic Content

Goal: Support multilingual content across the entire platform.

Translate:

UI text

Module content

Quiz content

Daily facts

Use a translation table/model:

Language-neutral base record

Language-specific content records

Support admin-managed translations (manual or assisted).

Ensure language switching updates all dynamic content.

5. Non-AI Chatbot (Guided Help System)

Goal: Provide scam education and victim guidance without using AI/LLMs.

Chatbot UI with SIFTHR mascot.

Implement a decision-tree / scripted chatbot:

Predefined conversation flows stored as JSON.

User selects quick-reply options instead of free-form AI responses.

Core flows:

“Is this ad fake?”

“I clicked a suspicious link”

“I gave my personal information”

“I sent money”

“How do I report a scam?”

Each flow should:

Provide clear step-by-step guidance

Link to relevant learning modules

Optional: keyword-based FAQ search using existing content.

6. Logged-In Homepage Recommendations

Goal: Personalize the homepage experience.

On scroll, reveal:

Recommended module section

Recommended quiz section

Recommendations based on:

User progress

Difficulty (start with easiest unfinished)

Modules and quizzes displayed in separate vertical sections.

7. Badge System (Horizontal Scroll)

Goal: Encourage progression and motivation.

Add a horizontal scroll section for badges.

Badges sorted by difficulty (easiest → hardest by default).

Add a toggle to reverse sorting.

Each badge shows:

Icon

Description

Locked / unlocked state

8. Daily Scam Fact Feature

Goal: Provide short, recurring educational content.

Display one daily fact about fake social media ads on the homepage.

Fact delivered by the SIFTHR mascot.

Store facts in a database (multilingual support).

Rotate daily (date-based or randomized with tracking).

9. Guided Site Walkthrough

Goal: Help first-time users understand the platform.

Use NextStepJS (or similar).

Walkthrough starts after login.

Covers:

Modules

Quizzes

Badges

Chatbot

Track completion or skip status per user (or localStorage for guests).

10. Guest Mode Progress Persistence

Goal: Allow meaningful use without an account.

Save guest progress in localStorage:

Module completion

Quiz progress

Badges

Use the same progress schema as authenticated users.

Optional: migrate guest progress when a user registers/logs in.

11. Image-Based “Pin” Quiz Game

Goal: Teach users to visually identify scam indicators.

User Side

User is shown an image of a fake ad.

User clicks on areas they think indicate a scam.

Correct click:

Display a pin marker

Increment found counter

Incorrect click:

Display an X marker

Show progress counter: “X out of Y indicators found”.

Admin Side

Admin uploads an image of a fake ad.

Admin can crop the image.

Admin enters “Pin Mode”:

Clicks on image to place correct answer zones.

Each zone is stored as a circular area (center + radius).

Use normalized coordinates (relative to image size) to allow responsive scaling.

Zones are matched using distance-based hit detection.

12. Image Quiz Tolerance Handling

Goal: Prevent pixel-perfect frustration.

Use circular hit zones instead of exact coordinates.

Prevent duplicate hits on the same zone.

Allow adjustable radius per pin or a global default.

Implementation Notes

Avoid AI / LLM dependencies entirely.

Focus on reliability, clarity, and educational accuracy.

Guest and authenticated flows should share logic where possible.

All content-related features must support multilingual data.
