# Semantic Accessible Portfolio

## Project Overview
This project is a multi-page personal portfolio built using modern semantic HTML5 and accessibility best practices. It is designed to present a professional online identity while prioritizing usability for keyboard users, screen readers, and search engines. The site includes a home page, an about page, and a contact page, all styled with responsive CSS and enhanced with lightweight JavaScript for navigation and form interaction.

## Objectives
The project focuses on the following key goals:

- Semantic HTML5: Use meaningful structural elements such as header, nav, main, section, article, and footer to create a clear document outline.
- WCAG accessibility: Follow accessibility guidelines to improve readability, usability, and inclusion for diverse users.
- Keyboard navigation: Ensure all interactive elements can be reached and used without a mouse.
- Screen-reader support: Provide labels, landmarks, and semantic relationships that help assistive technologies interpret content correctly.
- SEO optimization: Improve discoverability through well-structured content, metadata, and semantic headings.
- Responsive design: Deliver a consistent experience across mobile, tablet, and desktop devices.

## Technologies
This project uses the following web technologies:

- HTML5
## Project Overview

This repository contains a multi-page personal portfolio website built with semantic HTML5, modern CSS3, and vanilla JavaScript. The project emphasizes accessibility (WCAG principles), search engine optimization (SEO), and responsive design across devices. It was developed as part of a Web Development internship project.

## Features

- Semantic HTML5 structure (header, nav, main, section, article, footer)
- WCAG-focused accessibility patterns
- Keyboard navigation throughout the site
- Skip-to-content link for quick keyboard access
- Accessible contact form with labels and progressive enhancement validation
- Proper form labels and error messaging
- Responsive layout for mobile, tablet, and desktop
- SEO-friendly metadata (titles, descriptions, viewport)
- Accessible navigation and screen-reader-friendly structure
- Lighthouse-tested during development

## Technologies

- HTML5
- CSS3
- JavaScript (vanilla)
- Google Fonts: the project uses web fonts loaded from Google Fonts (Syne, Manrope, IBM Plex Mono) — loaded selectively to optimize performance.

## Pages

### Home

The home page introduces the portfolio owner, highlights primary projects and skills, and provides quick access to key sections such as projects and contact.

### About

The about page describes the developer's academic background, technical skills, and achievements in a structured, readable layout.

### Contact

The contact page includes an accessible contact form with clear labels, validation, and a live region for success/error feedback. Form behavior is progressively enhanced with JavaScript while remaining usable without scripts.

## Accessibility

Implemented accessibility techniques:

- Semantic landmarks: `header`, `nav`, `main`, `section`, `article`, and `footer` are used to create a clear document outline.
- Heading hierarchy: logical, single `h1` per page with nested `h2`/`h3` sections.
- Keyboard navigation: all interactive elements are reachable and operable with keyboard only.
- Visible focus states: `:focus-visible` styles and visible outlines are preserved for keyboard users.
- Skip navigation: an accessible skip-to-content link is provided at the top of each page.
- Alternative text: decorative graphics are hidden from screen readers (`aria-hidden="true"`) and informative images/figures include descriptive text or `figcaption`.
- Accessible form labels: all form inputs use `<label for="...">` associations and HTML5 validation attributes.
- Appropriate ARIA usage: ARIA attributes are used sparingly to enhance screen-reader announcements (e.g., `aria-live`, `aria-current`, `aria-controls`, `aria-expanded`).
- Color contrast: color choices were validated during design changes to maintain readable contrast for normal and large text; focus rings and borders are retained for non-color state changes.

## SEO

Implemented SEO techniques:

- Unique page titles per page
- Meta descriptions included on each page
- Viewport metadata for mobile rendering
- Semantic HTML elements that improve content structure
- Descriptive anchor link text and ARIA labels where helpful
- Canonical URLs and Open Graph metadata are present as placeholders; update these to your production domain before publishing to ensure accurate social previews and canonicalization.

## Lighthouse Results

These scores were recorded during development using Lighthouse; re-run locally to verify in your environment.

- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Project Structure

The repository contains the following files and folders:

```
semantic-accessible-portfolio/
├── index.html
├── about.html
├── contact.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   └── ...
├── README.md
└── .gitignore
```

Only files required for the static site are included in the repository root and the folders above.

## Running Locally

This is a static HTML/CSS/JS project. The simplest way to run it locally is to serve the folder with a lightweight local server.

Using Python 3 (built-in):

```bash
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

Alternatively, use the VS Code Live Server extension for a convenient development workflow.

## GitHub Pages

This project can be published using GitHub Pages. For a project site (username.github.io/repo), enable Pages in the repository settings and point the source to the `main` branch (or `gh-pages` branch if preferred). Update canonical and Open Graph URLs in the HTML head to reflect your production URL before sharing.

## Author

Name: Malekar Sai Ganesh

Education: B.Tech – Computer Science and Engineering

---

If you want any section expanded (for example, more details on accessibility testing or deployment steps), tell me which part and I will update the README accordingly.
