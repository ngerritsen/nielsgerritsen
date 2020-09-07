/**
 * @param {string} selector
 * @returns {Node[]}
 */
export function queryAll(selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector));
}

/**
 * @param {Function} fn
 */
export function ready(fn) {
  if (
    document.attachEvent
      ? document.readyState === 'complete'
      : document.readyState !== 'loading'
  ) {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
