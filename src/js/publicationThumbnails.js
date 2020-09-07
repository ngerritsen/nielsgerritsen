import { queryAll } from './domUtils';

export default function initPublicationThumbnails() {
  queryAll('[data-publication]').forEach(initPublicationThumbnail);
}

/**
 * @param {Element} el
 */
function initPublicationThumbnail(el) {
  const toggleEl = el.querySelector('[data-publication-toggle]');
  const activeClass = el.getAttribute('data-publication-active-class');
  const metaEl = el.querySelector('[data-publication-meta]');
  const activeToggleContent = toggleEl.getAttribute(
    'data-publication-toggle-active-content'
  );
  const initialToggleContent = toggleEl.innerHTML;

  toggleEl.addEventListener('click', () => {
    if (!metaEl.classList.contains(activeClass)) {
      metaEl.classList.add(activeClass);
      toggleEl.innerHTML = activeToggleContent;
      return;
    }

    metaEl.classList.remove(activeClass);
    toggleEl.innerHTML = initialToggleContent;
  });
}
