/** Accessible lightbox built on the native <dialog> element (focus trap + Esc handled by the browser). */
export function initLightbox(root: HTMLElement): void {
  const dialog = root.querySelector('dialog');
  const img = root.querySelector<HTMLImageElement>('[data-image]');
  const caption = root.querySelector<HTMLElement>('[data-caption]');
  const counter = root.querySelector<HTMLElement>('[data-counter]');
  const triggers = [...root.querySelectorAll<HTMLButtonElement>('button[data-full]')];
  if (!dialog || !img || !caption || !counter || triggers.length === 0) return;

  let current = 0;
  let opener: HTMLButtonElement | undefined;

  const show = (index: number): void => {
    current = (index + triggers.length) % triggers.length;
    const t = triggers[current];
    if (!t) return;
    img.src = t.dataset['full'] ?? '';
    img.alt = t.dataset['alt'] ?? '';
    caption.textContent = t.dataset['alt'] ?? '';
    counter.textContent = `${current + 1} / ${triggers.length}`;
    // Warm the cache for the next image
    const next = triggers[(current + 1) % triggers.length]?.dataset['full'];
    if (next) new Image().src = next;
  };

  triggers.forEach((t, i) =>
    t.addEventListener('click', () => {
      opener = t;
      show(i);
      dialog.showModal();
      document.documentElement.classList.add('overflow-hidden');
    }),
  );

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('overflow-hidden');
    opener?.focus();
  });
  root.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
  root.querySelector('[data-prev]')?.addEventListener('click', () => show(current - 1));
  root.querySelector('[data-next]')?.addEventListener('click', () => show(current + 1));

  // Click on the backdrop/empty area closes
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || (e.target instanceof HTMLElement && e.target.tagName === 'FIGURE')) dialog.close();
  });

  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Swipe on touch devices
  let startX = 0;
  dialog.addEventListener('touchstart', (e) => (startX = e.changedTouches[0]?.clientX ?? 0), { passive: true });
  dialog.addEventListener(
    'touchend',
    (e) => {
      const dx = (e.changedTouches[0]?.clientX ?? 0) - startX;
      if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );
}
