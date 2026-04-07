# Frontend Component Testing & Implementation Guide

## Quick Start

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

# Visit http://localhost:5173
```

## Component Documentation

### ✅ Common Components (Reusable Building Blocks)

#### Button Component

```tsx
import Button from "./components/Common/Button";

<Button variant="primary" size="md" onClick={() => {}}>
  Click me
</Button>;

// Props:
// - variant: 'primary' | 'secondary' | 'outline' | 'ghost'
// - size: 'sm' | 'md' | 'lg'
// - isLoading: boolean
// - disabled: boolean
// - type: 'button' | 'submit' | 'reset'
```

**Testing**: Click the buttons on HomePage - try hover, focus, and disabled states

#### Card Component

```tsx
import Card from "./components/Common/Card";

<Card variant="elevated">
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>;

// Props:
// - variant: 'default' | 'elevated' | 'outlined'
```

**Testing**: Check Cards on ResultsPage - notice shadow elevation and hovering effects

#### Modal Component

```tsx
import Modal from "./components/Common/Modal";

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="Are you sure?"
>
  Modal content
</Modal>;

// Features:
// - ESC key closes modal
// - Click backdrop to close
// - Focus trap (focus stays inside)
// - Keyboard navigation
```

**Testing**: The Modal is ready but not used yet - Agent 3 can integrate it

#### LoadingSpinner

```tsx
import LoadingSpinner from "./components/Common/LoadingSpinner";

<LoadingSpinner size="md" label="Loading..." />;

// Props:
// - size: 'sm' | 'md' | 'lg'
// - color: Tailwind color class
// - label: string
```

**Testing**: Upload a CSV file - spinner appears during processing

---

### ✅ Layout Components (App Structure)

#### Header

- **Location**: Top of every page
- **Features**:
  - Logo and branding
  - Desktop navigation (hidden on mobile)
  - Mobile menu toggle
  - Current page highlighting
- **Testing**: Navigate between pages - see Header changes

#### Footer

- **Location**: Bottom of every page
- **Contains**: Links, social media, clinical disclaimer
- **Testing**: Scroll to bottom - Footer is sticky and visible

#### Navigation

- **Used by**: Header component
- **Variants**: Horizontal (desktop) and vertical (mobile)
- **Testing**: Resize browser - navigation switches from horizontal to vertical

---

### ✅ Page Components (Full Pages)

#### HomePage

- **Sections**: Hero, features, how-it-works, CTA
- **Testing**:
  1. Click "Get Started" button → goes to UploadPage
  2. Click "Learn More" button → goes to AboutPage
  3. Check responsive design (mobile, tablet, desktop)

#### UploadPage

- **Features**: Drag-and-drop, file input, CSV parsing
- **Testing**:
  1. Drag a CSV file onto upload area
  2. Or click "Choose File" and select CSV
  3. See validation messages
  4. See gene data preview
  5. Try uploading → Results page
- **Sample CSV**:

```csv
Gene,Value
NLGN1,0.85
CNTNAP2,0.72
PTEN,0.65
```

#### ResultsPage

- **Displays**: Prediction result, confidence, gene bar chart
- **Testing**:
  1. Complete an upload → Results page shows
  2. Check prediction card (color changes based on result)
  3. View confidence level and probability
  4. Scroll through gene expressions
  5. Click "Analyze New Data" → UploadPage
- **Note**: Buttons (Export, Share) are placeholders for Agent 3

#### AboutPage

- **Sections**: What it is, methodology, usage, privacy, biomarkers, limitations
- **Testing**:
  1. Read through all sections
  2. Check biomarker grid layout
  3. Test responsive design
  4. Click links to other pages

#### FAQPage

- **Features**: Expandable Q&A items grouped by category
- **Testing**:
  1. Click Q&A items to expand/collapse
  2. Click "Contact Us" link → Contact page
  3. Check category organization

---

## API Integration Testing

### Backend Requirements

The Flask backend must have:

```python
@app.route('/predict', methods=['POST'])
def predict():
    # Expects: { "csv": "Gene,Value\nNLGN1,0.85\n..." }
    # Returns: {
    #   "success": true,
    #   "data": {
    #     "prediction": "Autism" or "Control",
    #     "probability": 0.85,
    #     "confidence": 0.85
    #   }
    # }
```

### Testing the API Connection

1. **Ensure backend is running**:

   ```bash
   cd backend
   python app.py
   # Should run on http://127.0.0.1:5000
   ```

2. **Test from frontend**:
   - Go to UploadPage
   - Select a CSV file
   - Should show "Predicting..." spinner
   - Then show results

3. **If connection fails**:
   - Check browser console (F12)
   - Look for CORS or "Network connection error" messages
   - Ensure backend is running
   - Check API_BASE_URL in services/constants.ts

---

## TypeScript Type System

All components are fully typed. Hover over props to see type definitions:

```tsx
// Example: Button component
import { ButtonProps } from "./types";
import Button from "./components/Common/Button";

// TypeScript knows these props:
<Button
  variant="primary" // ✅ Type-checked
  size="md" // ✅ Autocomplete suggests: 'sm' | 'md' | 'lg'
  onClick={() => {}}
  isLoading={false}
  disabled={false}
>
  Click
</Button>;
```

### Key Type Files

- `src/types/index.ts` - All interfaces defined here
- `src/services/api.ts` - Uses types for API calls
- `src/hooks/usePredictor.ts` - Returns typed data

---

## Styling System (Tailwind CSS)

### Custom Colors Available

```tsx
// Primary teal (main color)
<div className="bg-primary-600 text-white">Primary</div>

// Secondary blue
<div className="bg-secondary-600 text-white">Secondary</div>

// Accent sage green
<div className="bg-accent-600 text-white">Accent</div>

// Neutral off-white/gray
<div className="bg-neutral-100 text-neutral-900">Neutral</div>

// Status colors
<div className="bg-success-600 text-white">Success</div>
<div className="bg-warning-600 text-white">Warning</div>
<div className="bg-error-600 text-white">Error</div>
```

### Using Tailwind Classes

```tsx
// Layout
<div className="px-4 py-6 sm:px-6 lg:px-8">Responsive padding</div>

// Colors
<p className="text-primary-600">Primary text</p>

// Sizing
<button className="h-10 w-10">Icon button</button>

// Responsive
<div className="grid md:grid-cols-2 gap-4">Responsive grid</div>

// Animations (from Tailwind config)
<div className="animate-breathing">Breathing effect</div>
<div className="animate-slide-up">Slide up</div>
```

---

## Accessibility Checklist

### For Testing

- [ ] **Keyboard Navigation**: Tab to all buttons, links, and form inputs
- [ ] **Focus Visible**: See blue outline on focused elements
- [ ] **Screen Reader**: Use NVDA (Windows) or VoiceOver (Mac)
  - Headings should be properly announced
  - Buttons should announce their purpose
  - Form labels should be associated
- [ ] **Color Contrast**: Use Chrome DevTools to check ratios (need 4.5:1)
- [ ] **Responsive**: Test on mobile, tablet, desktop
- [ ] **Motion**: No flashing or rapid animations
- [ ] **Language**: All English is clear and non-technical where possible

### Built-In Accessibility Features

- ✅ Semantic HTML (buttons, nav, main, footer)
- ✅ ARIA labels on icons
- ✅ Focus management in modals
- ✅ Skip to content link (press Tab on page load)
- ✅ Color contrast meets WCAG AA standards
- ✅ Form inputs with associated labels

---

## Common Tasks

### Add a New Component

1. Create file: `src/components/Common/NewComponent.tsx`
2. Import necessary dependencies and types
3. Write component with TypeScript
4. Export as default
5. Use in pages

### Add a New Page

1. Create file: `src/components/Pages/NewPage.tsx`
2. Implement page component
3. Add navigation item in `services/constants.ts`
4. Update `App.tsx` to handle new page
5. Link from other pages

### Modify Styling

1. Edit `tailwind.config.js` for colors/spacing
2. Edit `src/index.css` for global styles
3. Use Tailwind classes in components
4. Changes auto-reload in dev server

### Connect to New API Endpoint

1. Add method to `src/services/api.ts`
2. Define types in `src/types/index.ts`
3. Use in components or hooks
4. Error handling is automatic

---

## Debugging Tips

### 1. **Browser DevTools (F12)**

- **Console**: Shows errors and logs
- **Network**: Shows API requests
- **Elements**: Check HTML structure
- **Accessibility Tree**: Check ARIA implementation

### 2. **React DevTools**

- Install "React Developer Tools" extension
- Inspect component props and state
- Trace re-renders

### 3. **TypeScript Errors**

- Hover over squiggly lines
- Check `src/types/index.ts` for interface
- Ensure types match component requirements

### 4. **Styling Issues**

- Check if Tailwind class is correct
- Verify color names in config
- Use `px-` `py-` `m-` `p-` `w-` `h-` correctly
- Check responsive breakpoints: `sm:` `md:` `lg:`

### 5. **API Connection Issues**

- Check browser console for errors
- Verify backend is running: `http://127.0.0.1:5000/health`
- Check `VITE_API_BASE_URL` in `.env`
- Look at Network tab in DevTools

---

## Performance Notes

### Code Splitting

- Each page component is ready for lazy loading
- Main vendor chunk separate from app code
- Utils chunk for shared dependencies

### Optimization Tips

- Use React.memo() for expensive components
- Avoid inline functions in render
- Use useCallback for event handlers
- Images should be optimized before upload

---

## Common Issues & Solutions

| Issue                     | Solution                                        |
| ------------------------- | ----------------------------------------------- |
| Page doesn't load         | Clear cache: Ctrl+Shift+Delete, or reload       |
| Styling broken            | Delete `node_modules`, run `npm install`        |
| API error "network error" | Check backend is running on port 5000           |
| TypeScript errors         | Hover over red squiggle, check `types/index.ts` |
| Buttons not clickable     | Check z-index if covered by other elements      |
| Mobile menu doesn't work  | Clear browser cache, test in different browser  |

---

## What's Ready for Agent 3

### Animations (Ready for Framer Motion)

- Page transitions
- Button hover/click effects
- Card stagger animations
- Modal entrance animations
- Loading spinner enhancements
- Breathing effect on result cards

### Polish Features (Ready for Implementation)

- Page transition animations
- Hover effects on interactive elements
- Micro-interactions (button press, etc.)
- Smooth scrolling
- Glassmorphism effects
- Data visualization with Recharts

---

## Resources

- **Tailwind Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Lucide React Icons**: https://lucide.dev
- **Vite Docs**: https://vitejs.dev

---

**Architecture designed for scalability and maintainability.**
Ready for Agent 3 to add animations and polish! 🚀
