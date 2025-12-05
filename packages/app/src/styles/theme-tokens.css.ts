import { css } from "lit";

export const themeTokens = css`
  :host {
    /* Color Palette - High Contrast Nature Theme */
    --color-primary: #0D4F3C;
    /* Deep forest green */
    --color-primary-light: #1B6B47;
    /* Medium forest green */
    --color-primary-dark: #062D23;
    /* Very dark forest green */
    --color-accent: #FF6B35;
    /* Bright orange (trail marker) */
    --color-accent-hover: #E55A2B;
    /* Darker orange on hover */

    /* Text Colors */
    --color-text: #1A1A1A;
    /* Near black for maximum contrast */
    --color-text-light: #2D2D2D;
    /* Dark gray for secondary text */
    --color-text-inverted: #FFFFFF;
    /* Pure white for dark backgrounds */
    --color-text-muted: #666666;
    /* Medium gray for muted text */

    /* Background Colors */
    --color-background-page: #FFFFFF;
    /* Pure white page background */
    --color-background-header: var(--color-primary);
    /* Dark green header */
    --color-background-section: #FFFFFF;
    /* White sections */
    --color-background-card: #F8F9FA;
    /* Secondary background (used for messages, highlights) */
    --color-background-secondary: #F5F7FA;
    /* Light gray cards */
    --color-background-anchor-highlight: var(--color-accent);

    /* Border Colors */
    --color-border: #C0C0C0;
    /* Medium gray borders */
    --color-border-accent: var(--color-accent);
    /* Orange accent borders */
    --color-border-light: #E8E8E8;
    /* Light gray borders */

    /* Link Colors */
    --color-link: #8B4513;
    /* Brown links */
    --color-link-hover: #FF6B35;
    /* Orange on hover */
    --color-link-visited: var(--color-primary-light);
    /* Lighter green for visited links */

    /* Status Colors */
    --color-success: #28A745;
    /* Standard success green */
    --color-warning: #FFC107;
    /* Standard warning yellow */
    --color-error: #DC3545;
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
    --font-family-display: 'Knewave', cursive;
    --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
    --shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.20);
  }

  :host(.dark-mode),
  :host-context(body.dark-mode) {
    /* Dark Mode Color Palette - Nature Theme */
    --color-primary: #2E8B57;
    /* Medium sea green for better contrast */
    --color-primary-light: #3CB371;
    /* Lighter medium sea green */
    --color-primary-dark: #1E5A3A;
    /* Darker green for depth */
    --color-accent: #FF6B35;
    /* Bright orange (trail marker) */
    --color-accent-hover: #E55A2B;
    /* Darker orange on hover */

    /* Text Colors */
    --color-text: #F8F9FA;
    /* Light gray for maximum contrast on dark backgrounds */
    --color-text-light: #E9ECEF;
    /* Muted gray for secondary text */
    --color-text-inverted: #000000;
    /* Black for inverted text on light elements */
    --color-text-muted: #6C757D;
    /* Muted gray */

    /* Background Colors */
    --color-background-page: #0F1419;
    /* Dark charcoal page background */
    --color-background-header: var(--color-primary);
    /* Deep green header */
    --color-background-section: #1A1E23;
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
    --color-border-light: #343A40;
    /* Lighter dark borders */

    /* Link Colors */
    --color-link: var(--color-accent);
    /* Orange links for visibility */
    --color-link-hover: var(--color-accent-hover);
    /* Darker orange on hover */
    --color-link-visited: var(--color-primary-light);
    /* Lighter green for visited links */

    /* Status Colors */
    --color-success: #28A745;
    /* Standard success green */
    --color-warning: #FFC107;
    /* Standard warning yellow */
    --color-error: #DC3545;
    /* Standard error red */

    /* Icon Color */
    --color-icon: var(--color-text);
    --color-icon-muted: var(--color-text-muted);

    /* Spacing, Typography, Border Radius, Shadows remain the same */
  }
`;