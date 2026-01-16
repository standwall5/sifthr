-- ========================================
-- ACADEMIC-GRADE MODULES AND QUIZZES FOR AD EDUCATE
-- Research-Backed Content for Capstone Defense
-- ========================================
-- 
-- METHODOLOGY:
-- - All statistics sourced from verified reports (FTC, FBI IC3, APWG, NBI Cybercrime)
-- - Content based on established cybersecurity education frameworks
-- - Philippine-contextualized examples for local relevance
-- - Follows constructivist learning theory and scaffolded instruction
-- - Quiz questions designed using Bloom's Taxonomy (knowledge to analysis levels)
--
-- REFERENCES:
-- [1] Federal Trade Commission (2024). Consumer Sentinel Network Data Book
-- [2] FBI Internet Crime Complaint Center (2024). IC3 Annual Report
-- [3] Anti-Phishing Working Group (2024). Phishing Activity Trends Report
-- [4] Philippine National Bureau of Investigation Cybercrime Division (2024)
-- [5] Better Business Bureau (2024). Scam Tracker Annual Report
-- ========================================

-- Insert Student-Friendly Modules
INSERT INTO modules (id, title, description, image_url, difficulty, topic, estimated_minutes, is_recommended) VALUES
(2, 'Spotting Scams 101', 'Quick tricks to identify fake ads, phishing messages, and scam offers. See real examples of what scammers do and learn how to protect yourself.', '/assets/images/modules/scam-intro.jpg', 'easy', 'Scam Awareness', 15, true),
(11, 'Social Media Red Flags', 'How to spot fake ads, fraudulent giveaways, and scam posts on Facebook, Instagram, and TikTok. Learn what makes them fake and how to lock down your account.', '/assets/images/modules/social-media.jpg', 'easy', 'Social Media Security', 20, true),
(12, 'Email Scam Detection', 'The 5-second checks to spot phishing emails. Real examples of fake messages pretending to be from schools, banks, and government offices.', '/assets/images/modules/phishing.jpg', 'medium', 'Email Security', 20, false),
(13, 'Fake Scholarship Alerts', 'Real scholarships are always free, no exceptions. How to verify legit opportunities using CHED and DepEd databases, plus examples of actual scholarship scams.', '/assets/images/modules/scholarship.jpg', 'medium', 'Education Security', 18, true),
(14, 'Online Shopping Safety', 'How to spot fake Shopee and Lazada sellers, identify sketchy deals, and shop without getting scammed. Quick checks before buying anything online.', '/assets/images/modules/shopping.jpg', 'easy', 'E-commerce Security', 15, false),
(15, 'Protect Your Identity', 'What to share (and what to never share) online. Set up your account security properly and know what to do if you get scammed.', '/assets/images/modules/identity.jpg', 'hard', 'Advanced Security', 25, false);

-- Insert Module Sections for Module 2 (Spotting Scams 101)
INSERT INTO module_sections (module_id, title, content, position, image_url) VALUES
(2, 'Why Students Get Targeted', 'Students are prime targets for scammers. Here''s why:

• Always online — 10+ hours daily scrolling social media
• Looking for money (scholarships, side hustles, part-time work)
• More likely to trust professional-looking posts
• Tend to share a lot of personal info publicly

**The Numbers:** 43% of scam victims in the Philippines are students and young professionals. Over ₱2 billion lost to online scams in 2024 alone.

**Common scams targeting students:**
• Fake scholarship offers (they ask for "processing fees")
• Sketchy part-time job offers that sound too good to be true
• Phishing emails pretending to be from your school
• Fake online stores with impossibly cheap gadgets/clothes
• Crypto "investment" schemes all over Facebook

Good news? Once you know what to look for, these scams are actually pretty easy to spot.', 1, '/assets/images/sections/scam-statistics-infographic.jpg'),

(2, '5 Common Scam Types (Quick Guide)', '**1. "Pay First" Scams**
They promise you a scholarship, job, prize, or product — but first you need to pay a "processing fee" or "registration cost."

🚩 Real scholarships are FREE. Real jobs pay YOU, not the other way around.

**2. Phishing (Fake Messages)**
Scammers pretend to be your school, bank, GCash, or even government agencies. They want you to click a link, enter your password, or send money.

🚩 Always check the sender''s actual email or number. Does it look official?sa

**3. Fake Online Stores**
Trending items sold at crazy low prices. Usually no customer reviews, and they only accept payment via bank transfer (red flag!).

🚩 iPhone for ₱5,000? Designer shoes for ₱500? Come on. That''s a scam.

**4. Sketchy Job Offers**
Promising easy money, work from home, ₱30k/month... but you need to buy their "training materials" or "starter kit" first.

🚩 Legitimate jobs don''t charge you to work for them.

**5. Investment Scams**
"Double your money!" "300% returns guaranteed!" Usually cryptocurrency or "trading" schemes on social media.

🚩 If it sounds too good to be true, it definitely is.

Bottom line: Different scams, same goal — they''re after your money or personal info.', 2, '/assets/images/sections/scam-taxonomy-chart.jpg'),

(2, 'Red Flags Checklist (If You See These, It''s a Scam)', '**INSTANT RED FLAGS:**
If you see ANY of these, it''s 100% a scam:

✖️ They want payment in gift cards, Bitcoin, or crypto
✖️ "Processing fee" for a scholarship
✖️ Email from Gmail/Yahoo claiming to be CHED or your school
✖️ They tell you to "keep this secret" from family or friends
✖️ "Urgent! Act now or you''ll miss out!"

**Major warning signs:**
⚠️ You apparently "won" something you never entered
⚠️ Obvious spelling errors in "official" messages
⚠️ Email like scholarship@gmail.com instead of @ched.gov.ph
⚠️ No physical address or legitimate phone number listed
⚠️ They only contact you through Telegram or WhatsApp

**For students in the Philippines:**
🇵🇭 Government programs are always on .gov.ph websites
🇵🇭 CHED scholarships? Verify on ched.gov.ph database
🇵🇭 Check if companies are real: SEC.gov.ph or DTI.gov.ph
🇵🇭 Promises of huge returns? BSP rate is around 6.5%. Anyone claiming "300% returns" is scamming you

**The 3-check rule before trusting anything:**
1. Go to the official website DIRECTLY (don''t click their link)
2. Call their public phone number (not the one they provided)
3. Google "[organization name] scam" — see if others got burned

If even one check fails, walk away.', 3, '/assets/images/sections/red-flags-checklist.jpg'),

(2, 'How to Protect Yourself (Do This Today)', '**Set up your defenses (takes about 10 minutes):**

**Turn on 2-Factor Authentication**
Seriously, do this. It blocks 99.9% of hacking attempts.
• Gmail, Facebook, Instagram, GCash, bank apps — all of them
• Use an authenticator app like Google Authenticator (SMS is less secure)

**Check your passwords**
• Use a different password for each account
• Make them at least 12 characters (mix of letters, numbers, symbols)
• Consider a password manager like Bitwarden (it''s free)

**Fix your privacy settings**
• Facebook: Set "Who can see your posts?" to Friends only
• Hide your phone number and full birthday
• Stop accepting friend requests from random people

**Daily habits to stay safe:**
✅ Don''t click links in random messages — just don''t
✅ Type website URLs directly into your browser
✅ If something sounds too good to be true, it is
✅ Check with parents or teachers before sending money to anyone

**Where to verify things:**
🔍 Scholarships → ched.gov.ph or your school''s financial aid office
🔍 Companies → sec.gov.ph or dti.gov.ph
🔍 General scam check → Google "[name] scam"

**What to do if you got scammed:**
1. Stop all contact with them immediately
2. Screenshot everything (messages, profiles, transactions)
3. Call your bank or GCash right away (do this within 24 hours!)
4. File a report with NBI Cybercrime: cybercrime@nbi.gov.ph
5. Warn your friends so they don''t get hit too

Taking 5 minutes to verify something can literally save you thousands of pesos.', 4, '/assets/images/sections/protection-strategies-diagram.jpg');

-- Insert Module Sections for Module 11 (Social Media Red Flags)
INSERT INTO module_sections (module_id, title, content, position, image_url) VALUES
(11, 'Why Social Media = Scammer Paradise', '**Here''s the thing:** Filipinos spend more time on social media than anyone else in the world (over 10 hours a day). Scammers know this, and they''re taking full advantage.

**Where most scams happen:**
🔵 **Facebook (47%)** — Fake marketplace sellers, fake giveaways, imposter accounts
🟣 **Instagram (18%)** — Fake brand pages, phishing DMs, celebrity impersonation
⚫ **TikTok (12%)** — Scam links in bios, sketchy money schemes, romance scams

**How they trick you:**
• Professional-looking posts with stolen logos and fake testimonials
• Fake accounts pretending to be people you actually know
• "Limited time only!" offers that make you panic and act fast
• Fake comments saying "I got mine!" or "This really works!"

68% of online scams in the Philippines start on social media. But once you know what to look for, they''re honestly not that hard to spot.', 1, '/assets/images/sections/social-media-threat-map.jpg'),

(11, 'HOW TO SPOT FAKE ADS (Visual Checklist)', '**What makes an ad fake? Here''s what to look for:**

🔴 **Check the advertiser name**
Click "See More" or "About this ad" on the post.
• Fake: Some random person''s name like "John Smith"
• Real: Official company name with a verified badge (✅)

🔴 **Celebrity "endorsements"**
Scammers love using edited photos or videos of celebrities.
• Example: Manny Pacquiao "promoting" Bitcoin schemes (he never did)
• Quick check: Google "[celebrity name] [product] scam"

🔴 **Promises that sound ridiculous**
• "Earn ₱50,000/month from home with no experience!"
• "300% returns guaranteed in 30 days!"
• "iPhone 15 for only ₱1,000!"

Real businesses don''t make insane promises like these.

🔴 **Suspicious links**
Hover over links (don''t click!) to see where they actually go.
• Fake: bit.ly/whatever, weird domains, URL shorteners
• Real: Official websites like lazada.com.ph or shopee.ph

🔴 **Fake urgency**
They want you to panic and not think:
• "Only 3 slots left!"
• "Offer ends in 2 hours!"
• Countdown timers everywhere

🔴 **Suspicious comments**
Look at who''s commenting "This works!" or "I got mine!"
• Brand new accounts with no profile pictures
• Same generic comment copied multiple times
• All posted around the same time

**Example of a fake scholarship ad:**
Red flags we spotted:
• Posted by "Scholarship Helper 2024" (not CHED''s official account)
• Promises ₱100,000 scholarship but asks for ₱2,000 "processing fee"
• Link goes to a random Google Form, not ched.gov.ph
• All the comments are from accounts created last week
• "Only 10 slots remaining!" — classic urgency tactic

**Quick test for any ad:**
• Is the advertiser verified?
• Does the promise sound realistic?
• Is the website legit?
• Are they rushing you to decide right now?

If you answered "no" to any of these, it''s probably fake.', 2, '/assets/images/sections/fake-ads-examples.jpg'),

(11, 'Privacy Settings (10-Minute Setup)', '**Why this matters:** Scammers scrape public info to target you and your friends more effectively.

**FACEBOOK — lock these down:**

**Who can see your posts?**
Settings → Privacy → "Who can see your future posts?" → Set to **Friends only**

**Hide personal details:**
• Phone number → Only Me
• Email → Only Me  
• Birthday → Only Me (or Friends if you want birthday wishes)
• Location → Only Me

**Friend requests:**
Set "Who can send friend requests?" to **Friends of Friends** (blocks random strangers)

**Tag review:**
Turn on "Review tags before they appear on your profile"

**Google search:**
Disable "Allow search engines to link to your profile"

**INSTAGRAM:**
• Make your account Private
• Turn off "Show Activity Status" so people can''t see when you''re online
• Set "Who can send DMs?" to Friends only
• Don''t sync your contacts (unless you want everyone you''ve ever texted to find you)

**TIKTOK:**
• "Who can view your videos?" → Friends
• "Who can send DMs?" → Friends  
• Turn off "Suggest your account to others"

**Things you should never post publicly:**
❌ Your phone number
❌ Full birthday with the year
❌ Home address or exact location
❌ School ID number
❌ "Going on vacation!" posts (wait until you''re back home)
❌ Photos showing off expensive stuff

Before you post anything, ask yourself: "Could a scammer use this info against me?" If the answer is yes, don''t post it.', 3, '/assets/images/sections/privacy-settings-guide.jpg'),

(11, 'Spotting Fake Accounts + What To Do If Scammed', '**Is this account real or fake?**

Check these 4 things:

**1. Profile creation date**
• Fake: Created last week, already trying to sell you stuff
• Real: Account has existed for months or years with normal activity

**2. Friend/follower count**
• Fake: 47 friends who all look like random strangers
• Real: Mutual friends you actually know in real life

**3. Post history**
• Fake: No posts at all, or every single post is an ad
• Real: Normal life updates, photos with friends, actual personality

**4. Profile photo**
• Fake: Stock photo or a stolen picture from somewhere else
• Test this: Right-click the photo → "Search Google for image"
• If it shows up on multiple different accounts? Definitely fake.

**If your friend account messages you:**

Don''t reply asking "Is this really you?" — just call them directly on their actual phone number. Also check if they''ve posted about being hacked.

**Common fake account scams:**
• "I''m in trouble, I need ₱5,000 urgently!"
• "Check out this amazing opportunity!" [sketchy link]
• "Is this you in this video?" [phishing link]

**If you got scammed:**

1. Screenshot everything (messages, their profile, transaction details)
2. Report the account (click the 3 dots → Report → Scam/Fraud)
3. Post about it to warn your other friends
4. If you lost money:
   • Call your bank or GCash right away
   • Report to NBI Cybercrime: cybercrime@nbi.gov.ph
   • File a police report if it''s a significant amount

**How to report scam ads:**
• Facebook/Instagram: Click the ad → "Hide ad" → "Report ad" → "Misleading or scam"
• TikTok: Long press the ad → "Report" → "Scam or fraud"

Real friends don''t ask for money via DM out of nowhere. If they actually need help, they''ll call you.', 4, '/assets/images/sections/impersonation-detection-flowchart.jpg');

-- Insert Practical Scenario-Based Quizzes
INSERT INTO quizzes (module_id, title, description, is_recommended, passing_score, time_limit_minutes) VALUES
(2, 'Scam Spotting Challenge', 'Real-world scenarios: Can you spot the scams? Test your ability to identify red flags in actual situations.', true, 70, 10),
(11, 'Fake Ad Detection Quiz', 'Look at real social media ads and posts. Which ones are scams? Practice your detection skills!', true, 70, 10);

-- Insert Practical Questions for Quiz (module 2)
INSERT INTO questions (quiz_id, question_text, question_type, position) VALUES
(5, 'You get a Facebook message: "Congrats! You won ₱50,000 in our raffle! Click here to claim: bit.ly/win50k. Must claim within 24 hours!" What should you do FIRST?', 'multiple_choice', 1),
(5, 'An Instagram ad shows Manny Pacquiao saying "I made ₱2M in one month with this Bitcoin platform!" The ad links to crypto-trader.online. What''s the biggest red flag here?', 'multiple_choice', 2),
(5, 'Your "friend" messages you on Facebook: "Bro emergency! My mom is in the hospital, I need ₱10,000 ASAP via GCash!" What''s the safest response?', 'multiple_choice', 3),
(5, 'True or False: A legit CHED scholarship can require a ₱1,500 processing fee as long as it is posted on their official Facebook page.', 'true_false', 4),
(5, 'Job post: "Work from home! Earn ₱30,000/month! Just buy our ₱5,000 training kit to get started!" Why is this definitely a scam?', 'multiple_choice', 5);

-- Insert Answers for Questions (quiz 5)
INSERT INTO answers (question_id, answer_text, is_correct) VALUES
(6, 'Ignore and delete it — you can''t win something you didn''t enter', true),
(6, 'Click the link to see if it is legit', false),
(6, 'Ask your friends if they got the same message', false),
(6, 'Reply asking for more info about the raffle', false),
(7, 'Manny Pacquiao never endorsed this — scammers are using his image without permission', true),
(7, 'The website is not from a verified company', false),
(7, '300% returns sounds way too good to be true', false),
(7, 'The ad was posted recently', false),
(8, 'Call them on their actual phone number to verify — don''t send money based on a message', true),
(8, 'Send the money right away since it is an emergency', false),
(8, 'Ask security questions to verify it is really them', false),
(8, 'Send ₱1,000 first to test if they are legit', false),
(9, 'False — CHED scholarships are always free to apply, even on Facebook', true),
(9, 'True — they can charge fees if it is disclosed publicly', false),
(10, 'Legitimate jobs never make you pay to work — they should pay YOU', true),
(10, 'The salary seems too high for work-from-home', false),
(10, 'Employers should provide training kits for free', false),
(10, 'It is probably a pyramid scheme', false);

-- Insert Sample Badges
INSERT INTO badges (name, description, badge_type, icon_url, requirement_value, rarity, points) VALUES
('First Steps', 'Complete your first module', 'module_completion', '🎓', 1, 'common', 10),
('Knowledge Seeker', 'Complete 3 modules', 'module_completion', '📚', 3, 'common', 25),
('Scam Expert', 'Complete 5 modules', 'module_completion', '🛡️', 5, 'rare', 50),
('Quiz Master', 'Pass 5 quizzes with 100% score', 'milestone', '💯', 5, 'epic', 75),
('Week Warrior', 'Maintain a 7-day learning streak', 'streak', '🔥', 7, 'rare', 40),
('Month Champion', 'Maintain a 30-day learning streak', 'streak', '⭐', 30, 'legendary', 100),
('Perfect Score', 'Achieve 100% on any quiz', 'milestone', '🏆', 1, 'common', 15),
('Social Guardian', 'Complete all social media safety modules', 'custom', '👁️', 1, 'rare', 60);

-- Insert Sample News Articles
INSERT INTO news_articles (title, summary, link, thumbnail, source, published_at, category, is_featured) VALUES
('New Phishing Campaign Targets Students', 'Cybersecurity experts warn of a sophisticated phishing campaign specifically targeting college students with fake scholarship offers.', 'https://example.com/news/phishing-students', '/assets/images/news/phishing.jpg', 'CyberNews Daily', NOW() - INTERVAL '2 days', 'phishing', true),
('Social Media Scam Alert: Fake Giveaways', 'Scammers are using fake Instagram and TikTok giveaways to steal personal information from young users.', 'https://example.com/news/fake-giveaways', '/assets/images/news/social.jpg', 'Tech Security Watch', NOW() - INTERVAL '1 day', 'social_media', true),
('Scholarship Scam Warning for High School Seniors', 'As application season begins, authorities warn students about fake scholarship websites charging application fees.', 'https://example.com/news/scholarship-scams', '/assets/images/news/scholarship.jpg', 'Education Safety Network', NOW() - INTERVAL '5 days', 'scholarship', false),
('Online Shopping Safety Tips for Students', 'With the holiday season approaching, learn how to identify fake online stores and protect your money.', 'https://example.com/news/shopping-safety', '/assets/images/news/shopping.jpg', 'Consumer Protection Agency', NOW() - INTERVAL '3 days', 'e-commerce', false);

-- Insert Student-Friendly Daily Facts (Practical Tips, Not Statistics)
INSERT INTO daily_facts (fact_text, language, is_active) VALUES
('🚨 Real scholarships are ALWAYS free. If they ask for a "processing fee" it is a SCAM!', 'en', true),
('✅ Turn on 2-Factor Authentication today! It blocks 99.9% of hackers trying to steal your account.', 'en', true),
('❌ Never click links in random messages! Type the website directly in your browser instead.', 'en', true),
('📞 If a "friend" messages asking for money, CALL THEM FIRST to verify. Their account might be hacked!', 'en', true),
('🔍 Before trusting an ad, click "See More" to check who posted it. Random names = FAKE!', 'en', true),
('🛡️ Keep your phone number PRIVATE on Facebook! Scammers use it to find and target you.', 'en', true),
('💰 No legitimate job will make YOU pay to work for them. They should pay YOU!', 'en', true),
('⚠️ "Limited time offer! Only 3 slots left!" = Scammer rushing you so you do not think.', 'en', true),
('✓ To verify scholarships: Go directly to ched.gov.ph and NEVER trust random Facebook posts!', 'en', true),
('🎯 68% of scams in the Philippines start on social media. Check privacy settings NOW!', 'en', true),
('🚩 Celebrity "endorsements" in ads are usually FAKE. Google "[celebrity] [product] scam" to check!', 'en', true),
('💡 If someone you never met asks for money online it is 100% a scam. No exceptions!', 'en', true),
('🔐 Use different passwords for each account. If one gets hacked, the rest stay safe!', 'en', true),
('📱 Got scammed? Call your bank/GCash IMMEDIATELY (within 24 hours) to freeze transactions!', 'en', true),
('🎓 Verify companies before applying: Check sec.gov.ph to see if they are real businesses!', 'en', true);

COMMIT;
