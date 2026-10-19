/** Client-side validation for the contact form. Submission is disabled until a backend endpoint is configured. */
export function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('#contact-form');
  const status = document.querySelector<HTMLElement>('#form-status');
  if (!form || !status) return;

  const setStatus = (text: string, tone: 'error' | 'info'): void => {
    status.textContent = text;
    status.classList.toggle('text-red-600', tone === 'error');
    status.classList.toggle('text-muted', tone === 'info');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea')];
    let firstInvalid: HTMLElement | undefined;
    for (const f of fields) {
      const ok = f.checkValidity();
      f.setAttribute('aria-invalid', String(!ok));
      f.classList.toggle('border-red-500', !ok);
      if (!ok && !firstInvalid) firstInvalid = f;
    }
    if (firstInvalid) {
      setStatus('Please check the highlighted fields.', 'error');
      firstInvalid.focus();
      return;
    }

    const data = new FormData(form);
    if (data.get('website')) return; // honeypot tripped — silently drop

    if (!form.dataset['endpoint']) {
      setStatus('Online enquiries are coming soon. Thank you for your patience!', 'info');
      return;
    }
    // TODO: POST `data` to form.dataset.endpoint once a form backend is chosen.
  });

  form.addEventListener('input', (e) => {
    const t = e.target;
    if (t instanceof HTMLElement && t.getAttribute('aria-invalid') === 'true' && 'checkValidity' in t) {
      const ok = (t as HTMLInputElement).checkValidity();
      t.setAttribute('aria-invalid', String(!ok));
      t.classList.toggle('border-red-500', !ok);
    }
  });
}
