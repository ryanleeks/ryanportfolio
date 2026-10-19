/** Sticky header state + accessible mobile menu toggle. */
export function initHeader(): void {
  const header = document.getElementById('site-header');
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!header || !toggle || !menu) return;

  const onScroll = (): void => {
    header.toggleAttribute('data-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setOpen = (open: boolean): void => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('hidden', !open);
    toggle.querySelector('.menu-open')?.classList.toggle('hidden', open);
    toggle.querySelector('.menu-close')?.classList.toggle('hidden', !open);
    // Solid header while the menu is open, even over a hero
    header.toggleAttribute('data-scrolled', open || window.scrollY > 24);
    document.documentElement.classList.toggle('overflow-hidden', open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}
