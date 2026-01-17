import { CONFIG } from './config.js';

/**
 * Applies a CSS transform to scale the content to fit the current window
 * while maintaining the correct Liquid Galaxy aspect ratio and resolution.
 * @param {HTMLElement} element - The DOM element to scale (usually Canvas)
 */
export function fitToWindow(element) {
  // 1. Force the internal resolution to match the LG Config
  // This ensures coordinate systems are 1:1 with production
  if (element.tagName === 'CANVAS') {
    // We set attributes directly for Canvas to avoid bitmap scaling artifacts
    // For Three.js, the renderer handles this, but setting style helps.
    element.style.width = `${CONFIG.SCREEN_WIDTH}px`;
    element.style.height = `${CONFIG.SCREEN_HEIGHT}px`;
  }

  function updateScale() {
    const availableWidth = window.innerWidth;
    const availableHeight = window.innerHeight;

    const scaleX = availableWidth / CONFIG.SCREEN_WIDTH;
    const scaleY = availableHeight / CONFIG.SCREEN_HEIGHT;

    // Fit contained (show entire LG screen in window)
    const scale = Math.min(scaleX, scaleY);

    element.style.transformOrigin = '0 0';
    element.style.transform = `scale(${scale})`;

    // Optional: Center horizontally if there's space
    if (scaleX > scaleY) {
      const extraSpace = availableWidth - CONFIG.SCREEN_WIDTH * scale;
      element.style.marginLeft = `${extraSpace / 2}px`;
    } else {
      element.style.marginLeft = `0px`;
    }
  }

  window.addEventListener('resize', updateScale);
  updateScale(); // Initial call
}
