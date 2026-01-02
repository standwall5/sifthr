# Support Page - Help & Report Scams

## Overview
This page helps users report social media scams and connect with Philippine organizations that can assist scam victims.

## Recent Changes (Backup Available)

### Backups Created
- `page.tsx.backup` - Original support page
- `support.module.css.backup` - Original styles

### What Was Updated

#### Features Added:
1. **Card-based Layout** - Uses the custom `Card` component for better visual appeal
2. **Modal System** - Click any organization card to see detailed information
3. **Contact Information** - Displays hotlines, emails, and websites
4. **Service Listings** - Shows what each organization can help with
5. **Responsive Design** - Works on mobile and desktop
6. **Clean Design** - Removed all emojis for professional appearance
7. **Custom Logos** - Created SVG logos for all organizations
8. **Natural Styling** - Redesigned modal with minimal, organic appearance

#### Organizations Included:
1. **National Privacy Commission (NPC)** - Privacy & data breach reports
2. **PNP Anti-Cybercrime Group (ACG)** - Cybercrime investigations
3. **Department of Trade and Industry (DTI)** - Consumer complaints
4. **Bangko Sentral ng Pilipinas (BSP)** - Financial scams
5. **Securities and Exchange Commission (SEC)** - Investment scams
6. **NBI Cybercrime Division** - Complex cybercrime cases

### Logo Images

**All logos are now included:**
- ✅ `/assets/images/NPC_Logo.webp` - National Privacy Commission
- ✅ `/assets/images/AGC_Logo.webp` - PNP Anti-Cybercrime Group
- ✅ `/assets/images/DTI_Logo.webp` - Department of Trade and Industry
- ✅ `/assets/images/BSP_Logo.svg` - Bangko Sentral ng Pilipinas (custom SVG)
- ✅ `/assets/images/SEC_Logo.svg` - Securities and Exchange Commission (custom SVG)
- ✅ `/assets/images/NBI_Logo.svg` - NBI Cybercrime Division (custom SVG)

### To Replace Custom SVG Logos with Official Logos:
1. Download official logos from organization websites
2. Convert to WebP format (recommended for consistency)
3. Save to `/public/assets/images/`
4. Update `imageUrl` in `page.tsx` for BSP, SEC, and NBI to point to new files

### How to Revert:
If you need to restore the original files:
```bash
# Restore original page
cp page.tsx.backup page.tsx

# Restore original styles
cp support.module.css.backup support.module.css
```

### Styling Changes Made:
- Removed bright accent colors and excessive borders
- Simplified modal layout with subtle shadows
- Changed heading styles to uppercase labels (less AI-obvious)
- Removed colorful section backgrounds
- Simplified list styling with minimal left borders
- Reorganized modal sections for better flow
- Changed "Services Provided" to "They can help with"
- Changed "Purpose" to "What they do"
- Changed "Contact Information" to "How to contact"
- Moved tip box to bottom with subtle background
- Overall cleaner, more professional appearance

### Future Enhancements:
- [ ] Add actual SMTP email functionality
- [ ] Replace custom SVG logos with official organization logos
- [ ] Add search/filter functionality
- [ ] Add "Report a Scam" form
- [ ] Add statistics on reports filed
- [ ] Add success stories/testimonials
- [ ] Multi-language support
- [ ] Add FAQ section
- [ ] Add step-by-step reporting guides

### Contact Information Sources:
All contact information was sourced from official government websites. Please verify and update if any details change.

### Notes:
- Email functionality currently opens user's email client (mailto: links)
- Phone numbers are clickable on mobile devices (tel: links)
- All organizations are legitimate Philippine government agencies