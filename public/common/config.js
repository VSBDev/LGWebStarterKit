export const CONFIG = {
  // Standard Liquid Galaxy setups often use 1080x1920 (Portrait) screens
  SCREEN_WIDTH: 1080,
  SCREEN_HEIGHT: 1920,

  // The "World" encompasses all screens side-by-side.
  // For 3 screens, this is 3240px wide.
  WORLD_WIDTH: 1080 * 3,
  WORLD_HEIGHT: 1920,

  // Auto-detect server URL for development flexibility
  SERVER_URL:
    window.location.hostname === 'localhost' ? '' : `http://${window.location.hostname}:3000`
};

/**
 * Helper to determine which screen this browser instance represents.
 * Uses the URL query parameter ?screen=X (e.g. ?screen=2)
 * Default to Screen 1 (Master/Left) if not specified.
 */
export function getScreenId() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get('screen')) || 1;
}
