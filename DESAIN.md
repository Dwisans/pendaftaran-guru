Act as a Senior Frontend UI/UX Architect specializing in React.js and modern web aesthetics. Your task is to completely refactor and polish the design UI of an existing Recruitment Website for "English Cafe" (a learning center environment). The core logic and routing are already done—focus ONLY on visual design enhancement, responsiveness, SEO-friendly layout semantics, modern loading indicators, and clean glassmorphism/flat-ui popups.

### 1. BRANDING & STYLE REFINEMENTS
Strictly apply this color system throughout the components:
- Primary Color: #7E262E (Cafe Maroon)
- Accent/CTA Color: #F58633 (Cafe Orange)
- Secondary Color: #B54D34 (Cafe Brick)
- Urgent Alert/Danger Color: #ED3338 (Cafe Red)
- Background Canvas: Off-white (#FAFAFA) and deep slate for dark footers.
- Local Logo Path: "recruitmen-ui/src/assets/logo.png"

Typography: Use elegant, crisp, highly legible sans-serif fonts (e.g., Plus Jakarta Sans, Inter, or Montserrat) with proper letter-spacing and clean line heights.

### 2. LANDING PAGE DESIGN REFACTOR (SEO-FRIENDLY)
- Transform the current layout into a premium, corporate-yet-friendly educational hub.
- Use Semantic HTML5 elements (<header>, <nav>, <section>, <article>, <footer>) to make it highly indexable by search engine bots.
- Hero Section: Update typography with a clear <h1> using premium SEO phrases. Make the Primary CTA ("Daftar Sekarang") stand out with #F58633, subtle rounded-xl borders, and a smooth scale-up hover animation.
- Job Listing Interface: Redesign cards with clean borders, micro-shadows, and specific category badges using #B54D34. Ensure heading structure uses <h2> for job titles to maximize SEO crawlability.

### 3. DASHBOARD DESIGN REFACTOR (MODERN & MINIMALIST)
- Sidebar Layout: Redesign into a sleek sidebar using a solid #7E262E background. Navigation items should feature clean text, minimal modern icons, and an active indicator block utilizing #F58633.
- Main Workspace: Maintain a lot of clean whitespace (generous padding like p-6 or p-8). 
- Cards & Widgets: Apply modern soft shadows, sharp grid alignments, and unified card components. 
- Datatables (Admin Dashboard): Clean up the borders. Header row should be bold and dark. Status badges must use the brand palette (e.g., Orange for Pending, Maroon for Under Review, Green/Brick for Accepted).

### 4. REACT LOADING COMPONENTS (SKELETONS & SPINNERS)
Provide high-end React loading micro-interactions so the UI feels fast and premium:
- Page-Level Spinner: A minimalist full-screen or absolute center layout featuring a modern animated dual-ring spinner using #7E262E and an accent dot of #F58633.
- Skeleton Screen Loaders: Create shimmering placeholder cards for the Job Listings and Dashboard Table Rows. Use a smooth CSS animation linear-gradient loop over a light grey base so the user sees content structure before it loads.

### 5. POPUP / MODAL REACT COMPONENTS
Redesign all modal windows and alert boxes to fit the new aesthetic:
- Base Modal Backdrop: Soft blur background (backdrop-blur-sm) with a translucent dark overlay.
- Modal Body: Crisp white background, smooth ease-out entry animation, rounded-2xl or rounded-xl corners.
- Success Popup: Modern tick icon with soft green/orange accent background, clear action button using #7E262E.
- Confirmation/Action Modal: Distinct header, clear contrast buttons (Cancel button uses minimal grey outline, Action button uses solid #F58633 or #7E262E depending on urgency).

Ensure all redesigned components are highly responsive, accessible (WCAG AA text contrast), and use clean CSS/Tailwind transitions. Do not add or change any backend state logic.