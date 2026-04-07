# Autism Prediction Tool - Frontend

Modern, production-ready React/Vite frontend for the Autism Prediction Tool with TypeScript, Tailwind CSS, and comprehensive accessibility features.

## Features

- 🎨 **Modern Design**: Low-arousal healthcare aesthetic with soft teal, calm blue, and sage green color palette
- ♿ **Accessible**: WCAG 2.1 AA compliant with semantic HTML and ARIA support
- 📱 **Responsive**: Mobile-first design that works seamlessly on all screen sizes
- ⚡ **Performance**: Code splitting, lazy loading, and optimized bundle size
- 🔒 **Secure**: Privacy-first design with no permanent data storage
- 📊 **Data Visualization**: Gene expression charts and prediction visualizations
- 🎯 **Type Safe**: Full TypeScript support throughout

## Project Structure

```
src/
├── components/
│   ├── Common/
│   │   ├── Button.tsx           # Reusable button with variants
│   │   ├── Card.tsx             # Flexible card container
│   │   ├── Modal.tsx            # Accessible modal dialog
│   │   └── LoadingSpinner.tsx   # Loading indicator
│   ├── Layout/
│   │   ├── Header.tsx           # App header with navigation
│   │   ├── Footer.tsx           # Footer with links
│   │   └── Navigation.tsx       # Navigation component
│   └── Pages/
│       ├── HomePage.tsx         # Landing page
│       ├── UploadPage.tsx       # CSV upload interface
│       ├── ResultsPage.tsx      # Prediction results
│       ├── AboutPage.tsx        # Information page
│       └── FAQPage.tsx          # FAQ section
├── services/
│   ├── api.ts                   # Backend API client
│   └── constants.ts             # App configuration
├── hooks/
│   └── usePredictor.ts          # Prediction logic hook
├── types/
│   └── index.ts                 # TypeScript type definitions
├── lib/
│   └── cn.ts                    # Utility functions
├── App.tsx                      # Root component
├── main.tsx                     # Entry point
└── index.css                    # Global styles

```

## Setup & Installation

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://127.0.0.1:5000`

### Installation

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env
   ```

4. **Update environment variables** (if needed)
   ```
   VITE_API_BASE_URL=http://127.0.0.1:5000
   ```

## Development

### Start Development Server

```bash
npm run dev
```

The app will run at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Type Checking

```bash
npm run type-check
```

## Architecture

### Component System

**Common Components:**

- `Button` - Multiple variants, sizes, and loading states
- `Card` - Flexible container with elevation and outline variants
- `Modal` - Accessible dialog with focus management
- `LoadingSpinner` - Customizable loading indicator

**Layout Components:**

- `Header` - Sticky header with responsive navigation
- `Footer` - Footer with links and compliance info
- `Navigation` - Flexible horizontal/vertical nav

**Page Components:**

- `HomePage` - Landing page with features and CTA
- `UploadPage` - CSV upload with drag-and-drop
- `ResultsPage` - Prediction results and visualizations
- `AboutPage` - Tool information and methodology
- `FAQPage` - Frequently asked questions

### Custom Hooks

**usePredictor**

- Manages prediction workflow
- Handles gene data parsing and validation
- Manages loading states and errors

### API Client

The `api.ts` service provides:

- Type-safe API communication
- Automatic retry logic
- Comprehensive error handling
- Request/response interceptors

## Styling

### Tailwind Configuration

```javascript
// Custom color palette
colors: {
  primary: '#4a9b8e',     // Soft teal
  secondary: '#5b8dbe',   // Calm blue
  accent: '#7ba98e',      // Sage green
  neutral: '#f9f9f7',     // Off-white
}
```

### Global Styles

- CSS Resets
- Typography scales
- Accessibility-focused focus states
- Animation utilities
- Print styles

## Key Features

### 1. **CSV Upload**

- Drag-and-drop support
- File validation
- Real-time parsing
- Error feedback

### 2. **Prediction**

- Gene data validation
- Neural network analysis
- Confidence scoring
- Result visualization

### 3. **Accessibility**

- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Color contrast compliance
- Screen reader support

### 4. **Performance**

- Code splitting
- Lazy loading
- Image optimization
- Bundle analysis

## API Integration

### Backend Requirements

Backend must provide `/predict` endpoint:

```
POST /predict
Content-Type: application/json

{
  "csv": "Gene,Value\nNLGN1,0.85\nCNTNAP2,0.72"
}

Response:
{
  "success": true,
  "data": {
    "prediction": "Autism" | "Control",
    "probability": 0.85,
    "confidence": 0.85
  }
}
```

## Environment Variables

```bash
# Required
VITE_API_BASE_URL=http://127.0.0.1:5000

# Optional
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=false
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## Accessibility

The application follows WCAG 2.1 AA guidelines:

- ✅ Semantic HTML
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Color contrast (4.5:1 for text)
- ✅ Focus visible states
- ✅ Screen reader support
- ✅ Low-arousal design

### Skip to Content

Users can skip to main content using `Tab` key:

```html
<a href="#main-content" class="skip-to-main">Skip to main content</a>
```

## Error Handling

The application includes comprehensive error handling:

- Network errors with retry logic
- Validation errors with helpful messages
- Server errors with fallback UI
- File upload errors with file size/type validation

## Performance Optimization

- **Code Splitting**: Separate vendor chunks
- **Lazy Loading**: Components loaded on-demand
- **Image Optimization**: Responsive images
- **CSS**: Tailwind's tree-shaking
- **Bundle Analysis**: Source maps included

## Styling Notes

### Color Palette

```
Primary (Teal):      #4a9b8e
Secondary (Blue):    #5b8dbe
Accent (Sage):       #7ba98e
Neutral (Off-white): #f9f9f7
Light Gray:          #e8e8e5
```

### Typography

System font stack:

- `-apple-system`
- `BlinkMacSystemFont`
- `Segoe UI`
- `Roboto`
- `Helvetica Neue`
- `Arial`

### Spacing Scale

0 → 1 → 2 → 3 → 4 → 5 → 6 → 8 → 10 → 12 → 16 → 20 → 24 → 32 → 48

## Testing

### End-to-End Tests

```bash
npm run test:e2e
```

### Unit Tests

```bash
npm run test
```

## Deployment

### Build Optimization

```bash
npm run build
# Analyze bundle size
npm run build -- --analyze
```

### Production Environment

```bash
# Set production API URL
VITE_API_BASE_URL=https://api.example.com npm run build
```

## Troubleshooting

### Common Issues

**Issue**: CORS errors when uploading

- **Solution**: Ensure backend has CORS enabled and is running on `http://127.0.0.1:5000`

**Issue**: Page not loading

- **Solution**: Check browser console for errors, ensure `npm run dev` is running

**Issue**: Styling not applied

- **Solution**: Clear node_modules and reinstall: `npm ci`

## Contributing

When contributing to the frontend:

1. **Follow component structure** - Keep components modular and reusable
2. **Add TypeScript types** - Ensure all components are fully typed
3. **Test accessibility** - Check keyboard navigation and screen readers
4. **Update stories** - Add component stories for new components
5. **Document changes** - Update this README if needed

## License

This project is part of the Autism Prediction Research Initiative.

## Support

For issues, questions, or contributions, please contact:

📧 Email: contact@autismpredictor.org

---

**Built with care for accessibility and inclusivity.**
