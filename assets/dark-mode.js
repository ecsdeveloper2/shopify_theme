// Check if the device is in dark mode
function applyDarkMode() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}

// Apply dark mode on page load
applyDarkMode();

// Listen for changes in the color scheme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyDarkMode);
