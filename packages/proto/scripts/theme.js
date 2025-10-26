// Theme toggle functionality
function relayEvent(eventType, data) {
  const event = new CustomEvent(eventType, {
    detail: data,
    bubbles: true
  });
  document.dispatchEvent(event);
}

// Apply theme from localStorage on page load
function applyTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Sync checkbox state across all pages
function syncCheckbox() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  if (darkModeToggle) {
    const savedTheme = localStorage.getItem('theme');
    darkModeToggle.checked = savedTheme === 'dark';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Apply saved theme immediately
  applyTheme();
  syncCheckbox();

  const darkModeToggle = document.getElementById('dark-mode-toggle');

  if (darkModeToggle) {
    // Listen for change events on the checkbox
    darkModeToggle.addEventListener('change', (event) => {
      // Use relayEvent to send a custom event instead of 'change'
      relayEvent('themeToggle', { checked: event.target.checked });

      if (event.target.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    });
  }
});

// Listen for storage changes to sync theme across tabs/windows
window.addEventListener('storage', (event) => {
  if (event.key === 'theme') {
    applyTheme();
    syncCheckbox();
  }
});