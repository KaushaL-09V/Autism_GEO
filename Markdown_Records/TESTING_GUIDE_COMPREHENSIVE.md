# COMPREHENSIVE TESTING GUIDE

**Autism Prediction Healthcare Application**
**QA & Accessibility Testing Procedures**

---

## TABLE OF CONTENTS

1. [Accessibility Testing](#accessibility-testing)
2. [Responsive Design Testing](#responsive-design-testing)
3. [Performance Testing](#performance-testing)
4. [Cross-Browser Testing](#cross-browser-testing)
5. [Healthcare Compliance Testing](#healthcare-compliance-testing)
6. [Manual Feature Testing](#manual-feature-testing)
7. [Automated Testing Setup](#automated-testing-setup)

---

## 1️⃣ ACCESSIBILITY TESTING

### 1.1 Keyboard Navigation Testing

**What to Test**: Can you navigate the entire app using only Tab, Enter, and Escape keys (no mouse)?

#### Procedure:

1. **Launch the app**:

   ```bash
   cd frontend
   npm run dev
   # Open http://localhost:5173
   ```

2. **Test Tab Navigation**:
   - Press `Tab` key repeatedly
   - Verify focus moves through elements left-to-right, top-to-bottom
   - **Expected**: See clear focus outline (2px ring) on every focusable element

3. **Test on HomePage**:
   - [ ] Tab through header navigation
   - [ ] Tab through CTA buttons ("Get Started", "Learn More")
   - [ ] Tab through feature cards
   - [ ] All buttons have visible focus ring

4. **Test on UploadPage**:
   - [ ] Tab to file input
   - [ ] Tab to upload button
   - [ ] Tab to FAQ link at bottom
   - [ ] All elements reachable

5. **Test Escape Key**:
   - [ ] Open mobile menu (mobile view)
   - [ ] Press Escape
   - [ ] Menu should close

6. **Test Skip Link**:
   - [ ] Reload page
   - [ ] Press Tab immediately
   - [ ] **First element** should be "Skip to main content" link
   - [ ] Click it → Focus moves to `<main>` content
   - [ ] You can now start interacting with page content

#### Checklist:

```
[ ] No focus traps (can Tab through entire page)
[ ] Focus order is logical (not jumping around)
[ ] All interactive elements focusable (buttons, links, inputs)
[ ] Focus indicator visible on ALL browsers
[ ] Skip link works correctly
[ ] Mobile menu Escape key works
[ ] Modal focus trap works (Tab stays in modal)
[ ] Modal Escape key closes modal
```

---

### 1.2 Screen Reader Testing (NVDA on Windows)

**What to Test**: Screen reader user can understand page content and navigate.

#### Setup (First Time):

1. Download NVDA (free): https://www.nvaccess.org/download/
2. Install and launch
3. Open app in Firefox (best screen reader compatibility)

#### Testing Procedure:

**HomePage Test**:

1. Start NVDA (Ctrl+Alt+N)
2. Press **H** to list headings:
   ```
   Expected:
   - h1: "Gene Expression Analysis for Autism Characterization"
   - h2: "Why Choose Our Tool?"
   - h2: "How It Works"
   - h2: "Ready to Get Started?"
   ```
3. Press **B** to list buttons:
   ```
   Expected:
   - "Get Started"
   - "Learn More"
   - "Get Started" (in footer)
   ```
4. Press **K** to list links
5. Press **F** to jump to form inputs (none on home page - OK)

**UploadPage Test**:

1. NVDA announces page heading
2. [ ] Disclaimer is announced
3. [ ] File input label associated
4. [ ] Upload button labeled
5. [ ] Error messages announced if present

**ResultsPage Test**:

1. [ ] Prediction result announced
2. [ ] Probability/confidence number readable
3. [ ] Chart description available
4. [ ] All buttons accessible

#### Checklist:

```
[ ] Page title announced correctly
[ ] Heading hierarchy correct (h1 → h2 → h3, no jumps)
[ ] All form inputs labeled
[ ] Form labels associated (clicking label focuses input)
[ ] Error messages announced
[ ] Charts have text descriptions
[ ] Images have alt text (or marked decorative)
[ ] Navigation links have descriptive text
[ ] Status messages announced (loading, success, error)
[ ] No weird list structures
[ ] Images in content not marked skip (have alt text)
```

---

### 1.3 Color Contrast Testing

**What to Test**: Text is readable by people with color blindness/low vision.

#### Online Tools:

1. **TPGI Contrast Checker**: https://www.tpgi.com/color-contrast-checker/
2. **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
3. **Colordot**: https://color.hailpixel.com/ (colorblind simulation)

#### Test All Button States:

```
Button: "Get Started" (primary)
- Normal: #4A9B8E text on white → Need to check
- Hover: #3a8076 text on white → Need to check
- Focus: white text on #4A9B8E → Need to check
- Active: white text on #2f6961 → Need to check
- Disabled: should be obvious (lower opacity)

WCAG Requirement: 4.5:1 for normal text, 3:1 for large text
Large Text = 18pt+ or 14pt+ bold
```

#### Procedure:

1. Open https://www.tpgi.com/color-contrast-checker/
2. For each button state:
   - Foreground color: CSS color value
   - Background color: CSS color value
   - Check ratio: Should be ≥ 4.5:1 ✅

3. Test in browser:
   - Open DevTools → Color picker
   - Click on button text to get color
   - Click on button background to get color
   - Record the values

#### Critical Elements to Check:

- [ ] Button text (normal state): 4.5:1+
- [ ] Button text (hover state): 4.5:1+
- [ ] Button text (focus state): 4.5:1+
- [ ] Form input borders: 3:1+
- [ ] Links in text: 4.5:1+
- [ ] Confidence % number: 4.5:1+
- [ ] Success message: 4.5:1+
- [ ] Error message: 4.5:1+

---

### 1.4 Automated Accessibility Testing (axe DevTools)

**What to Test**: Automated tool finds accessibility errors.

#### Setup:

1. Install axe DevTools browser extension
   - **Chrome**: https://chromewebstore.google.com/detail/axe-devtools/lhdoppojpmngadmnkpklempisson
   - **Firefox**: https://addons.mozilla.org/en-US/firefox/addon/axe-devtools/

2. Launch app in browser
3. Open DevTools (F12)
4. Look for "axe DevTools" tab

#### Testing:

1. Click "Scan THIS PAGE"
2. Review results:
   - **Violations** (red) = MUST fix
   - **Warnings** (orange) = Should check
   - **Best Practices** (blue) = Nice to have

#### Expected Results After Fixes:

```
Violations: 0 (no errors)
Warnings: <5 (minor issues OK)
```

#### All Pages to Test:

- [ ] HomePage
- [ ] UploadPage
- [ ] ResultsPage
- [ ] AboutPage
- [ ] FAQPage

---

## 2️⃣ RESPONSIVE DESIGN TESTING

### 2.1 Mobile Device Testing (Multiple Sizes)

**What to Test**: Does the app work on phones and tablets?

#### Using Browser DevTools:

```bash
1. Open app in browser
2. Press F12 (DevTools)
3. Click device icon (top-left of DevTools)
4. Press Ctrl+Shift+M to toggle device toolbar
```

#### Test These Viewport Sizes:

| Device                | Width  | Height | Test Items         |
| --------------------- | ------ | ------ | ------------------ |
| **iPhone SE**         | 320px  | 568px  | Smallest phone     |
| **iPhone 12**         | 390px  | 844px  | Standard phone     |
| **iPhone 14 Pro Max** | 430px  | 932px  | Large phone        |
| **iPad**              | 768px  | 1024px | Tablet (portrait)  |
| **iPad Pro**          | 1024px | 1366px | Tablet (landscape) |
| **Desktop**           | 1440px | 900px  | Normal desktop     |
| **Large Desktop**     | 1920px | 1080px | Large monitor      |

#### Mobile Testing Checklist:

```
At 320px (Smallest):
[ ] Text readable without zooming
[ ] Buttons don't wrap awkwardly
[ ] Hero headline fits without overflow
[ ] No horizontal scroll
[ ] Padding/margins look reasonable
[ ] Images scale properly

At 375px (Standard Phone):
[ ] All content visible
[ ] Buttons easy to tap (44px+ height)
[ ] Navigation menu toggles to mobile
[ ] Links don't overlap

At 480px:
[ ] Same checks as above
[ ] Desktop nav still hidden
[ ] Cards stack properly

At 768px (Tablet):
[ ] Desktop nav starts appearing
[ ] Two-column layouts work
[ ] Still touch-friendly

At 1024px+ (Desktop):
[ ] Desktop navigation visible
[ ] Full-width features work
[ ] Content max-width respected
[ ] No weird stretching
```

---

### 2.2 Touch Target Testing

**What to Test**: Are buttons/links at least 44×44 pixels (finger-friendly)?

#### Procedure:

1. **Open DevTools Inspector** (F12)
2. **Click element inspection tool** (arrow icon, top-left)
3. **Select button/interactive element**
4. **Look at size** in properties panel

#### Check These Elements:

```
Button: "Get Started"
- Expected: At least 44px tall × 96px wide
- CSS: min-h-[44px], px-4, py-2.5

Button: "sm" variant
- Check: Should be padded to 44px minimum

Mobile menu toggle
- Expected: 44px × 44px minimum
- Current: size={24} icon + padding = ~40px

Navigation links (mobile)
- Expected: 44px tall minimum
- Current: py-2.5 = 10px padding × 2 = 40px actual touch area
```

#### How to Fix Too-Small Targets:

```javascript
// Add padding or min-height
<button className="min-h-[44px] px-4 py-2.5">
  Click me
</button>

// Or increase padding
<button className="px-6 py-3">
  Large button
</button>
```

---

### 2.3 Zoom & Text Resize Testing

**What to Test**: Does app work when user zooms to 200%?

#### Procedure:

1. Press Ctrl++ (plus) multiple times to zoom browser
2. At 150% zoom:
   - [ ] Content still readable
   - [ ] No horizontal scroll needed
   - [ ] Buttons still clickable

3. At 200% zoom:
   - [ ] Content still readable
   - [ ] Layout reflows properly
   - [ ] All text visible

4. In OS Settings (Windows):
   - Accessibility → Display → Text size
   - Increase to 150%
   - [ ] App text adjusts
   - [ ] Layout doesn't break

---

## 3️⃣ PERFORMANCE TESTING

### 3.1 Lighthouse Audit

**What to Test**: Overall performance, accessibility, best practices scores.

#### Setup & Run:

```bash
# Build production
cd frontend
npm run build

# Install Lighthouse globally
npm install -g lighthouse

# Run audit
lighthouse http://localhost:5173 --view

# Or use Chrome DevTools
# 1. Open DevTools (F12)
# 2. Click "Lighthouse" tab
# 3. Click "Analyze page load"
```

#### Expected Scores (Target):

```
✅ Performance: ≥ 85/100
✅ Accessibility: ≥ 90/100
✅ Best Practices: ≥ 90/100
✅ SEO: ≥ 85/100
✅ PWA: N/A (not required)
```

#### Review Recommendations:

- [ ] Fix any "Errors" (red)
- [ ] Address "Warnings" (orange) if possible
- [ ] Note "Opportunities" for optimization

---

### 3.2 Core Web Vitals Testing

**What to Test**: Real user experience metrics (Google's measures).

#### Using Chrome DevTools:

1. Open DevTools (F12)
2. Click "Performance" tab (not Lighthouse)
3. Click record (red circle)
4. Interact with page (scroll, click, wait)
5. Stop recording

#### Metrics to Check:

```
FCP (First Contentful Paint): < 1.8 seconds ✅
LCP (Largest Contentful Paint): < 2.5 seconds ✅
CLS (Cumulative Layout Shift): < 0.1 ✅
INP (Interaction to Next Paint): < 100ms ✅
```

#### How to Simulate Slow Network:

1. DevTools → Network tab
2. Throttling dropdown (top)
3. Select "Fast 3G" or "Slow 3G"
4. Reload page
5. Check if still performant

---

### 3.3 Bundle Size Analysis

**What to Test**: Is the JavaScript bundle too large?

```bash
# Install analyzer
npm install -D rollup-plugin-visualizer

# Add to vite.config.js:
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,  // Opens visualization after build
    })
  ]
});

# Build
npm run build

# Browser opens with visualization
# Shows which packages use most space
```

#### Expected Bundle Size:

```
Target: < 200KB gzipped (should take < 3s on 3G)

Breakdown estimate:
- React + React-DOM: ~45KB
- Tailwind CSS: ~20KB (with purging)
- Framer Motion: ~50KB
- Recharts: ~45KB
- Axios + Papaparse: ~15KB
- Other: ~25KB
─────────────────────
Total: ~200KB
```

---

## 4️⃣ CROSS-BROWSER TESTING

### 4.1 Browser Compatibility Matrix

**What to Test**: Does app work on all major browsers?

| Browser        | Version | Windows | Mac     | Linux   | Status    |
| -------------- | ------- | ------- | ------- | ------- | --------- |
| Chrome         | Latest  | ✅ Test | ✅ Test | ✅ Test | Primary   |
| Firefox        | Latest  | ✅ Test | ✅ Test | ✅ Test | Required  |
| Safari         | Latest  | —       | ✅ Test | —       | Important |
| Edge           | Latest  | ✅ Test | ✅ Test | ✅ Test | Chromium  |
| Mobile Safari  | iOS 14+ | —       | ✅ Test | —       | Critical  |
| Chrome Android | Latest  | ✅ Test | —       | —       | Critical  |

### 4.2 Testing Procedure per Browser:

#### For Each Browser:

```
1. Open http://localhost:5173 (or production URL)
2. Load HomePage
   [ ] Layout correct
   [ ] Animations smooth
   [ ] Colors correct
   [ ] No console errors (F12 → Console)

3. Upload Page
   [ ] File drag-drop works
   [ ] File input works
   [ ] Validation messages appear

4. Results Page
   [ ] Prediction displays
   [ ] Chart renders
   [ ] Numbers readable
   [ ] Colors correct

5. Keyboard Test
   [ ] Tab navigation works
   [ ] Skip-to-main works
   [ ] Mobile menu toggle works

6. Screen Reader Test
   [ ] Page structure understandable
   [ ] Form labels clear

7. Mobile View (if applicable)
   [ ] Responsive layout works
   [ ] Touch targets large enough
   [ ] No horizontal scroll

8. Console Check
   [ ] No errors (red)
   [ ] No warnings (orange)
```

### 4.3 Known Issues & Workarounds:

```
ISSUE: Chrome - Scrollbar styling
STATUS: Works correctly (Tailwind handles it)

ISSUE: Firefox - Some CSS properties
STATUS: Already using fallbacks

ISSUE: Safari < 15 - prefers-reduced-motion
STATUS: Already have fallback

ISSUE: Mobile Safari - Touch events
STATUS: Test thoroughly on actual iOS device
```

---

## 5️⃣ HEALTHCARE COMPLIANCE TESTING

### 5.1 HIPAA Compliance Checklist

**What to Test**: Is the app compliant with healthcare privacy requirements?

```
HIPAA Requirement Checklist:
---

DATA PRIVACY:
[ ] No patient names stored
[ ] No medical record numbers stored
[ ] No dates of birth stored
[ ] No genetic information stored
[ ] No lab results stored with identification

SECURITY:
[ ] HTTPS enforced (no HTTP)
[ ] Data encrypted in transit
[ ] No unencrypted logs
[ ] Backend CORS restricted (not open to all)

AUDIT TRAIL:
[ ] No tracking of individual predictions
[ ] No "who uploaded what" logging
[ ] Predictions not linked to users

DISCLAIMER VISIBLE:
[ ] "NOT HIPAA Compliant" stated
[ ] "NOT for diagnostic use" stated
[ ] "Not a medical device" stated
[ ] Privacy policy present
```

### 5.2 Content Compliance Testing

**What to Test**: Is medical information accurate and responsible?

#### Medical Accuracy:

```
[ ] Gene descriptions factually correct
[ ] Diagnostic limitations clearly stated
[ ] No claims of diagnosis capability
[ ] No medical advice given
[ ] Sources cited for medical claims
```

#### Tone & Empathy:

```
[ ] Language is neurodiversity-affirming
[ ] No stigmatizing terminology
[ ] Respectful tone throughout
[ ] Patient privacy emphasized
[ ] Clear explanation of limitations
```

---

## 6️⃣ MANUAL FEATURE TESTING

### 6.1 Complete User Journey Testing

**Scenario**: New user uploads data and sees results.

#### Step-by-Step:

```
1. LANDING PAGE
   [ ] App loads in < 3 seconds
   [ ] Page looks professional
   [ ] No missing images/fonts
   [ ] Text readable
   [ ] "Get Started" button visible

2. CLICK "GET STARTED"
   [ ] Navigates to Upload page
   [ ] URL changes (if using routing)
   [ ] Page transitions smoothly
   [ ] No console errors

3. UPLOAD PAGE FIRST VISIT
   [ ] Disclaimer visible
   [ ] HIPAA warning visible
   [ ] File upload area visible
   [ ] Instructions clear
   [ ] Drag-and-drop feedback visible

4. UPLOAD CSV FILE
   [ ] Can click to select file
   [ ] Can drag file to drop zone
   [ ] File selected feedback shown
   [ ] Upload button appears/activates

5. PROCESSING
   [ ] Loading indicator appears
   [ ] "Processing..." message shows
   [ ] Cannot click upload again
   [ ] After < 10 seconds: Results appear

6. RESULTS PAGE
   [ ] Consent modal appears (new)
   [ ] Must accept before viewing results
   [ ] After accepting:
       - Prediction displayed
       - Confidence/probability shown
       - Gene chart visible
       - All readable

7. RESULTS ACTIONS
   [ ] "Analyze New Data" button works
   [ ] Clicking it goes back to Upload
   [ ] Can upload new file
   [ ] New results replace old ones

8. FOOTER LINKS
   [ ] About page link works
   [ ] FAQ page link works
   [ ] Contact page link works
   [ ] All pages have footer
```

### 6.2 Error Scenario Testing

**What to Test**: How does app handle errors?

#### Scenario 1: Invalid File

```
Step: Upload non-CSV file
Expected:
[ ] Error message displays
[ ] Message is clear
[ ] Can try again
[ ] Original page state preserved
```

#### Scenario 2: Empty File

```
Step: Upload empty CSV
Expected:
[ ] Error message displays
[ ] Explains what went wrong
[ ] Can try again
```

#### Scenario 3: Component Crash

```
Step: (Manually trigger error if possible)
Expected:
[ ] Error Boundary catches it
[ ] User-friendly error page shows
[ ] Refresh button available
[ ] Can recover gracefully
```

---

## 7️⃣ AUTOMATED TESTING SETUP

### 7.1 WCAG Testing with WAVE

**Tool**: WAVE Browser Extension
**URL**: https://wave.webaim.org/extension/

#### Setup:

1. Install WAVE extension
2. Open app page
3. Click WAVE icon
4. Review errors and warnings

#### Expected Results:

```
Errors: 0 (no violations)
Contrast Errors: 0
Warnings: < 5
```

---

### 7.2 Accessibility Testing with axe

Already covered above (see Accessibility Testing section).

---

### 7.3 Performance Testing with WebPageTest

**Website**: https://www.webpagetest.org/

```
1. Go to https://www.webpagetest.org/
2. Enter your URL (production)
3. Select location and browser
4. Click "Start Test"

Review:
[ ] First Byte Time (TTFB): < 600ms
[ ] First Contentful Paint (FCP): < 1.8s
[ ] Largest Contentful Paint (LCP): < 2.5s
[ ] Cumulative Layout Shift (CLS): < 0.1
```

---

## TEST RESULTS DOCUMENTATION

### After Each Test Session:

Create a file: `TEST_RESULTS_[DATE].md`

```markdown
# Test Results - April 2, 2026

## Device & Environment

- Browser: Chrome 125
- OS: Windows 11
- Device: Desktop (1920×1080)
- Network: WiFi

## Test Results

### Accessibility

- Keyboard navigation: PASS ✅
- Screen reader (NVDA): PASS ✅
- Color contrast: PASS ✅
- Skip link: PASS ✅

### Responsive

- Mobile 320px: PASS ✅
- Mobile 375px: PASS ✅
- Tablet 768px: PASS ✅
- Desktop 1440px: PASS ✅

### Performance

- Lighthouse: 92/100 ✅
- FCP: 1.2s ✅
- LCP: 2.1s ✅
- CLS: 0.08 ✅

### Features

- Upload CSV: PASS ✅
- Predictions: PASS ✅
- Results display: PASS ✅
- Navigation: PASS ✅

## Issues Found

(If any)

## Notes
```

---

## FINAL SIGN-OFF

Use this checklist for final QA approval:

```
✅ ACCESSIBILITY
[ ] Lighthouse Accessibility score ≥ 90
[ ] axe DevTools found 0 violations
[ ] Keyboard navigation works throughout
[ ] Screen reader-friendly
[ ] Skip link functional

✅ PERFORMANCE
[ ] Lighthouse Performance score ≥ 85
[ ] Page load < 3s (3G throttled)
[ ] No sourcemaps in production
[ ] Core Web Vitals meet targets

✅ RESPONSIVE
[ ] Works on 320px mobile
[ ] Works on 768px tablet
[ ] Works on 1440px desktop
[ ] Touch targets ≥ 44×44px
[ ] No horizontal scroll

✅ CROSS-BROWSER
[ ] Chrome: ✅ Tested
[ ] Firefox: ✅ Tested
[ ] Safari: ✅ Tested
[ ] Mobile Safari: ✅ Tested
[ ] Chrome Android: ✅ Tested

✅ FEATURES
[ ] File upload works
[ ] CSV parsing succeeds
[ ] Predictions display
[ ] Consent modal works
[ ] All navigation functional
[ ] No console errors

✅ HEALTHCARE
[ ] HIPAA disclaimer visible
[ ] Consent required before results
[ ] Medical accuracy verified
[ ] No PII in logs
[ ] Privacy policy present

✅ FINAL
[ ] All critical fixes applied
[ ] All high-priority fixes applied
[ ] Testing complete
[ ] Ready for deployment
```

---

**End of Testing Guide**

For any questions, refer to the QA_REPORT_COMPREHENSIVE.md for detailed explanations.
