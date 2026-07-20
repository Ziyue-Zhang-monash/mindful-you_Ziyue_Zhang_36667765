# Mindful You Vue 3 Website Design

## 1. Goal

Build the first working version of the Mindful You mental health support website in the `mindful-you` folder. The implementation must satisfy the business requirements shown in the assessment material:

- The application uses Vue 3.
- The application is responsive and works on desktop, tablet, and mobile screens.

The website will follow the existing development style in `D:\zzhang-library`: Vite, Vue single-file components, `<script setup>`, Bootstrap utility classes, simple Vue directives, and small focused component files.

## 2. User-approved scope

The first version creates the complete top-level website structure:

1. Home
2. Learn
3. Self-Assessment
4. Get Help
5. Self-Help
6. For Family
7. About Us

The Home and Get Help pages contain the main design content from the A1 wireframes. The other five pages are clear, navigable placeholder pages so the application structure is ready for later work.

The first version does not include a backend, user accounts, a real assessment scoring system, online chat, appointment booking, service-location search, or real external crisis-service integration.

### Wireframe fidelity update

The two provided wireframes are the source of truth for the current Home and Get Help layouts. The implementation keeps their section order, visible English text, placeholders, navigation labels, button labels, and footer headings. The hand-drawn borders and line style are not treated as visual requirements. Areas that are not confirmed by the wireframes remain empty instead of receiving additional explanatory copy.

## 3. Technical approach

Use the following simple project foundation:

- Vue 3 with Vite.
- Bootstrap 5 for responsive layout and common controls.
- Vue component state for page switching and the mobile menu.
- No Vue Router in the first version. The existing `zzhang-library` project does not use Vue Router, and the assessment requirements do not require URL-based routing. A future version can add it if real browser routes are needed.
- No PrimeVue in the first version. The website does not need data tables or complex widgets, so Bootstrap and basic Vue components are easier to understand.
- No backend and no external API calls.

This approach keeps the implementation close to the student's existing code while still giving the website a clear component structure.

## 4. Proposed project structure

```text
mindful-you/
├─ package.json
├─ package-lock.json
├─ vite.config.js
├─ index.html
├─ docs/
│  └─ superpowers/
│     └─ specs/
│        └─ 2026-07-20-mindful-you-design.md
└─ src/
   ├─ App.vue
   ├─ main.js
   ├─ style.css
   ├─ assets/
   │  └─ main.css
   └─ components/
      ├─ SiteHeader.vue
      ├─ SiteFooter.vue
      ├─ FeatureCard.vue
      ├─ EmergencyBanner.vue
      ├─ PlaceholderPage.vue
      └─ pages/
         ├─ HomePage.vue
         ├─ LearnPage.vue
         ├─ AssessmentPage.vue
         ├─ GetHelpPage.vue
         ├─ SelfHelpPage.vue
         ├─ FamilyPage.vue
         └─ AboutPage.vue
```

Each component has one clear responsibility. The page components own page content, the shared components own repeated layout, and `App.vue` owns the current-page state.

## 5. Component and data design

### `main.js`

Follow the library project pattern:

- Create the Vue application with `createApp`.
- Import Bootstrap CSS.
- Import the project stylesheet.
- Mount the app to `#app`.

Comments in this file will explain why each global stylesheet is imported.

### `App.vue`

`App.vue` will use one simple `ref` value named `activePage`.

- `activePage` starts as `home`.
- `SiteHeader` emits a page name when a navigation item is clicked.
- `App.vue` updates `activePage`.
- A readable `v-if` / `v-else-if` chain displays the selected page component.
- The same navigation function is used by the homepage call-to-action buttons and the emergency-help banner.

The explicit conditional page display is intentional. It is easier for a beginner to follow than a dynamic component registry or a complex routing abstraction.

### `SiteHeader.vue`

Responsibilities:

- Display the Mindful You brand.
- Display the seven navigation items.
- Display the always-visible Emergency Help button.
- Collapse the navigation on narrow screens.

The component will use a small local `ref` for the mobile menu state. Selecting a page will close the mobile menu. No Bootstrap JavaScript bundle is required.

### `FeatureCard.vue`

Responsibilities:

- Receive a title, short description, action label, and target page through props.
- Render a consistent Bootstrap card.
- Emit a page-selection event when its action is clicked.

The component will not contain page-specific business logic.

### `EmergencyBanner.vue`

Responsibilities:

- Make the urgent-help message prominent.
- Explain that the website is not an emergency service.
- Send the user to the Get Help page when the action button is clicked.

No fake phone number or fake charity service will be presented as a real resource. Real Australian crisis contacts can be added later after they are verified.

### `SiteFooter.vue`

Responsibilities:

- Display the charity name and short mission statement.
- Display quick navigation labels.
- Display placeholder contact details clearly marked as demonstration content if contact details are shown.

### Page components

`HomePage.vue` will reproduce the main A1 wireframe structure:

- Hero section with the message “Mental Health Support Starts Here”.
- Primary actions for self-assessment and getting help.
- Six feature cards for Learn, Self-Assessment, Get Help, Self-Help, For Family, and About Us.
- Emergency support banner.

`GetHelpPage.vue` will reproduce the second A1 wireframe structure:

- Immediate crisis-support panel.
- Online counselling card.
- Local services card.
- Appointment card.
- “Not sure where to begin?” guidance panel.

The remaining page components will use `PlaceholderPage.vue` with page-specific titles, descriptions, and a clear message about the next planned content.

## 6. Responsive design

Use Bootstrap’s standard responsive classes instead of writing a large custom layout system:

- `.container` for readable page width.
- `.row` and `.col-12 col-md-6 col-lg-4` for cards.
- Stacked hero content on small screens and two-column content on larger screens.
- Full-width buttons on small screens where needed.
- A Vue-controlled collapsed menu for mobile navigation.

Custom CSS will only handle Mindful You branding, spacing, colours, focus states, and small breakpoint adjustments that Bootstrap does not provide directly.

Every page must remain readable at narrow mobile widths. No fixed-width content, horizontal overflow, or hover-only interaction will be used.

## 7. Coding style and comments

The code will follow these rules:

- Use basic JavaScript syntax and Vue directives.
- Prefer `const`, `ref`, props, and small event handlers.
- Avoid unnecessary abstractions, generic fallback components, and defensive branches for states that cannot occur in this static first version.
- Keep each component short and focused.
- Use descriptive names such as `activePage`, `selectPage`, `featureCards`, and `mobileMenuOpen`.
- Add detailed English comments before important sections of script and template code. Comments will explain purpose and interaction, not merely repeat the HTML tag name.
- Keep user-visible text in plain English and avoid presenting the site as a medical diagnosis service.

## 8. Validation plan

After implementation:

1. Run `npm install` in `D:\FIT5032\mindful-you`.
2. Run `npm run build` and fix build errors.
3. Run the development server and manually check all seven navigation choices.
4. Check the homepage and Get Help page at desktop, tablet, and mobile widths.
5. Check that the mobile menu opens, closes after selection, and does not create horizontal scrolling.
6. Check that homepage cards, call-to-action buttons, and the emergency-help banner select the expected page.

## 9. Success criteria

The design is complete when:

- The project starts as a Vue 3 Vite application.
- Bootstrap 5 is used for the main responsive layout.
- All seven top-level pages can be selected from the navigation.
- The Home and Get Help pages visibly match the A1 wireframe hierarchy.
- The site is usable on mobile, tablet, and desktop widths.
- The code is organized into small Vue components with detailed English comments.
- The build completes successfully without unnecessary fallback logic.
