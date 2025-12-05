import { css } from "lit";

export const pageStyles = [
  css`
    @import url("https://fonts.googleapis.com/css2?family=Knewave&display=swap");
    @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
  `,
  // Include all the CSS from the original files
  css`
    :root {
      /* Color Palette - High Contrast Nature Theme */
      --color-primary: #0d4f3c;
      /* Deep forest green */
      --color-primary-light: #1b6b47;
      /* Medium forest green */
      --color-primary-dark: #062d23;
      /* Very dark forest green */
      --color-accent: #ff6b35;
      /* Bright orange (trail marker) */
      --color-accent-hover: #e55a2b;
      /* Darker orange on hover */

      /* Text Colors */
      --color-text: #1a1a1a;
      /* Near black for maximum contrast */
      --color-text-light: #2d2d2d;
      /* Dark gray for secondary text */
      --color-text-inverted: #ffffff;
      /* Pure white for dark backgrounds */
      --color-text-muted: #666666;
      /* Medium gray for muted text */

      /* Background Colors */
      --color-background-page: #ffffff;
      /* Pure white page background */
      --color-background-header: var(--color-primary);
      /* Dark green header */
      --color-background-section: #ffffff;
      /* White sections */
      --color-background-card: #f8f9fa;
      /* Secondary background (used for messages, highlights) */
      --color-background-secondary: #f5f7fa;
      /* Light gray cards */
      --color-background-anchor-highlight: var(--color-accent);

      /* Border Colors */
      --color-border: #c0c0c0;
      /* Medium gray borders */
      --color-border-accent: var(--color-accent);
      /* Orange accent borders */
      --color-border-light: #e8e8e8;
      /* Light gray borders */

      /* Link Colors */
      --color-link: #8b4513;
      /* Brown links */
      --color-link-hover: #ff6b35;
      /* Orange on hover */
      --color-link-visited: var(--color-primary-light);
      /* Lighter green for visited links */

      /* Status Colors */
      --color-success: #28a745;
      /* Standard success green */
      --color-warning: #ffc107;
      /* Standard warning yellow */
      --color-error: #dc3545;
      /* Standard error red */

      /* Icon Color */
      --color-icon: var(--color-text);
      --color-icon-muted: var(--color-text-muted);

      /* Spacing */
      --spacing-xs: 4px;
      --spacing-sm: 8px;
      --spacing-md: 16px;
      --spacing-lg: 24px;
      --spacing-xl: 32px;
      --spacing-xxl: 48px;

      /* Typography */
      --font-family-display: "Knewave", cursive;
      --font-family-primary: "Inter", -apple-system, BlinkMacSystemFont,
        "Segoe UI", Roboto, sans-serif;
      --font-size-sm: 0.875rem;
      --font-size-base: 1rem;
      --font-size-lg: 1.125rem;
      --font-size-xl: 1.375rem;
      --font-size-xxl: 1.75rem;
      --font-size-xxxl: 2.25rem;
      --font-weight-normal: 400;
      --font-weight-medium: 500;
      --font-weight-semibold: 600;
      --font-weight-bold: 700;
      --line-height-tight: 1.2;
      --line-height-base: 1.5;
      --line-height-loose: 1.7;

      /* Border Radius */
      --radius-sm: 6px;
      --radius-md: 12px;
      --radius-lg: 16px;

      /* Shadows */
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
      --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
      --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
  `,
  css`
    body.dark-mode {
      /* Dark Mode Color Palette - Nature Theme */
      --color-primary: #2e8b57;
      /* Medium sea green for better contrast */
      --color-primary-light: #3cb371;
      /* Lighter medium sea green */
      --color-primary-dark: #1e5a3a;
      /* Darker green for depth */
      --color-accent: #ff6b35;
      /* Bright orange (trail marker) */
      --color-accent-hover: #e55a2b;
      /* Darker orange on hover */

      /* Text Colors */
      --color-text: #f8f9fa;
      /* Light gray for maximum contrast on dark backgrounds */
      --color-text-light: #e9ecef;
      /* Muted gray for secondary text */
      --color-text-inverted: #000000;
      /* Black for inverted text on light elements */
      --color-text-muted: #6c757d;
      /* Muted gray */

      /* Background Colors */
      --color-background-page: #0f1419;
      /* Dark charcoal page background */
      --color-background-header: var(--color-primary);
      /* Deep green header */
      --color-background-section: #1a1e23;
      /* Dark slate sections */
      --color-background-card: #212529;
      /* Secondary background for dark mode (messages, subtle panels) */
      --color-background-secondary: #0f1417;
      /* Dark gray cards */
      --color-background-anchor-highlight: var(--color-accent);

      /* Border Colors */
      --color-border: #495057;
      /* Medium dark gray borders */
      --color-border-accent: var(--color-accent);
      /* Orange accent borders */
      --color-border-light: #343a40;
      /* Lighter dark borders */

      /* Link Colors */
      --color-link: var(--color-accent);
      /* Orange links for visibility */
      --color-link-hover: var(--color-accent-hover);
      /* Darker orange on hover */
      --color-link-visited: var(--color-primary-light);
      /* Lighter green for visited links */

      /* Status Colors */
      --color-success: #28a745;
      /* Standard success green */
      --color-warning: #ffc107;
      /* Standard warning yellow */
      --color-error: #dc3545;
      /* Standard error red */

      /* Icon Color */
      --color-icon: var(--color-text);
      --color-icon-muted: var(--color-text-muted);

      /* Spacing, Typography, Border Radius, Shadows remain the same */
    }
  `,
  css`
    @media (prefers-color-scheme: dark) {
      body:not(.light-mode) {
        /* Apply dark mode by default if system prefers dark, unless explicitly set to light */
        /* Ensure browser uses dark color rendering for form controls, scrollbars, etc. */
        color-scheme: dark;
      }
    }
  `,
  css`
    html {
      scroll-behavior: smooth;
    }

    body {
      background-color: var(--color-background-page);
      color: var(--color-text);
      font-family: var(--font-family-primary);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-normal);
      line-height: var(--line-height-base);
      margin: 0;
    }

    /* Navigation styling */
    nav-element {
      display: block;
      width: 100%;
      margin: 0 0 var(--spacing-xl) 0;
      grid-column: 1 / -1;
    }

    /* Typography */
    h1 {
      color: var(--color-primary);
      font-family: var(--font-family-display);
      font-size: 3rem;
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      margin-bottom: var(--spacing-xxl);
      margin-top: 0;
      text-align: center;
      border-bottom: 3px solid var(--color-accent);
      padding-bottom: var(--spacing-lg);
    }

    h2 {
      color: var(--color-primary);
      font-family: var(--font-family-display);
      font-size: 2rem;
      font-weight: var(--font-weight-bold);
      line-height: var(--line-height-tight);
      margin-top: 0;
      margin-bottom: var(--spacing-xl);
      padding-left: var(--spacing-md);
      border-left: 4px solid var(--color-accent);
    }

    /* Article and section styling */
    article {
      background-color: var(--color-background-section);
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
      box-shadow: var(--shadow-md);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--spacing-lg);
      padding: 0 var(--spacing-lg);
    }

    article > h1,
    article > p {
      grid-column: 1 / -1;
    }

    section {
      background-color: var(--color-background-card);
      padding: var(--spacing-lg);
      margin: var(--spacing-sm) 0;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-md);
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }

    /* Card component specific styles */
    card-grid {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-bottom: var(--spacing-xl);
    }

    card-element {
      display: block;
      box-sizing: border-box;
    }

    /* Flexbox Layout System for Sparse Content */
    .flex-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .flex-section.flex-row {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: stretch;
    }

    .flex-section.flex-center {
      align-items: center;
    }

    .flex-item {
      flex: 1;
      min-width: 320px;
      max-width: 100%;
    }

    .flex-item.flex-shrink {
      flex: 0 1 auto;
    }

    .flex-item.flex-fixed {
      flex: 0 0 auto;
    }

    /* Responsive flex adjustments */
    @media (max-width: 768px) {
      .flex-section.flex-row {
        flex-direction: column;
      }

      .flex-item {
        min-width: 100%;
      }
    }

    li strong {
      color: var(--color-accent);
      font-weight: var(--font-weight-semibold);
    }

    /* Link styling */
    a {
      color: var(--color-link);
      text-decoration: underline;
      text-decoration-color: var(--color-link);
      text-underline-offset: 2px;
      font-weight: var(--font-weight-semibold);
      transition: all 0.2s ease;
    }

    a:hover {
      color: var(--color-link-hover);
      text-decoration-color: var(--color-link-hover);
    }

    a:visited {
      color: var(--color-link-visited);
    }

    /* Card-style links for camping types */
    section p a,
    section article h3 a {
      display: block;
      background-color: var(--color-background-section);
      padding: var(--spacing-lg) var(--spacing-xl);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      margin: var(--spacing-lg) 0;
      transition: all 0.2s ease;
      text-decoration: none;
      color: var(--color-link);
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    section p a:hover,
    section article h3 a:hover {
      border-color: var(--color-accent);
      background-color: var(--color-background-card);
      text-decoration: none;
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }

    section p a strong,
    section article h3 a strong {
      color: var(--color-primary);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      display: block;
      margin-bottom: var(--spacing-sm);
    }

    section p a em,
    section article h3 a em {
      color: var(--color-text-light);
      font-style: italic;
      font-size: var(--font-size-sm);
      display: block;
    }

    /* Anchor target highlighting */
    section:target {
      background-color: var(--color-background-anchor-highlight);
      border-color: var(--color-accent);
      animation: anchor-highlight 1.5s ease-out;
    }

    @keyframes anchor-highlight {
      0% {
        background-color: var(--color-background-anchor-highlight);
      }

      100% {
        background-color: var(--color-background-card);
      }
    }

    /* SVG Icon Classes */
    .icon {
      fill: var(--color-icon);
      vertical-align: middle;
      display: inline-block;
      flex-shrink: 0;
    }

    .icon-sm {
      width: 16px;
      height: 16px;
    }

    .icon-md {
      width: 24px;
      height: 16px;
    }

    .icon-lg {
      width: 32px;
      height: 24px;
    }

    .icon-xl {
      width: 64px;
      height: 32px;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
      body {
        padding: var(--spacing-lg);
      }
    }

    /* Card list styles - applies to all cards with lists */
    [class*="-card"] ul,
    section ul {
      list-style-type: disc;
      margin-left: var(--spacing-lg);
      padding-left: var(--spacing-sm);
    }

    [class*="-card"] li,
    section li {
      margin-bottom: var(--spacing-xs);
    }

    /* Authentication message styling */
    .auth-message {
      margin: var(--spacing-lg) 0;
      text-align: left;
    }

    .auth-message p {
      margin: 0;
      color: var(--color-text);
    }

    .auth-message .login-link {
      color: var(--color-link);
      text-decoration: underline;
      font-weight: var(--font-weight-semibold);
      border: none;
      background: none;
      padding: 0;
      margin: 0;
      display: inline;
    }

    .auth-message .login-link:hover {
      color: var(--color-link-hover);
    }

    /* Form styling */
    form {
      width: 100%;
    }

    .auth-form {
      max-width: 400px;
      margin: 0 auto;
    }

    .auth-form * {
      text-align: left;
    }

    form label {
      display: block;
      margin-bottom: var(--spacing-lg);
    }

    form label span {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text);
      text-align: left;
    }

    form label input {
      width: 100%;
      padding: var(--spacing-md);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      font-family: var(--font-family-primary);
      background-color: var(--color-background-page);
      color: var(--color-text);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      box-sizing: border-box;
    }

    form label input:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    form label input::placeholder {
      color: var(--color-text-muted);
    }

    form button[type="submit"] {
      background-color: var(--color-accent);
      color: var(--color-text-inverted);
      border: none;
      padding: var(--spacing-md) var(--spacing-xl);
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      font-family: var(--font-family-primary);
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;
      margin-top: var(--spacing-lg);
    }

    form button[type="submit"]:hover:not(:disabled) {
      background-color: var(--color-accent-hover);
      transform: translateY(-1px);
    }

    form button[type="submit"]:disabled {
      background-color: var(--color-border);
      cursor: not-allowed;
      transform: none;
    }

    form .error:not(:empty) {
      color: var(--color-error);
      border: 1px solid var(--color-error);
      background-color: rgba(220, 53, 69, 0.1);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      margin-top: var(--spacing-lg);
      font-size: var(--font-size-sm);
    }

    /* Auth message styling */
    .auth-message {
      text-align: center;
      padding: var(--spacing-xxl);
      background-color: var(--color-background-card);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-lg);
      margin: var(--spacing-xl) 0;
    }

    .auth-message p {
      font-size: var(--font-size-lg);
      color: var(--color-text);
      margin: 0;
    }

    .login-link {
      color: var(--color-accent);
      text-decoration: none;
      font-weight: var(--font-weight-semibold);
      padding: var(--spacing-sm) var(--spacing-md);
      border: 2px solid var(--color-accent);
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
      display: inline-block;
      margin-left: var(--spacing-sm);
    }

    .login-link:hover {
      background-color: var(--color-accent);
      color: var(--color-text-inverted);
      transform: translateY(-1px);
    }
  `,
];
