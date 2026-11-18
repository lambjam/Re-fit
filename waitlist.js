(() => {
  const form = document.querySelector('.beta-waitlist');
  const contact = document.getElementById('waitlist-contact');
  const notesStep = document.getElementById('waitlist-notes-step');
  const status = document.getElementById('waitlist-status');
  const button = form.querySelector('button');
  const revealNotes = () => { if (contact.value.trim()) notesStep.hidden = false; };
  contact.addEventListener('input', revealNotes);
  contact.addEventListener('change', revealNotes);
  revealNotes();
  let submitting = false;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!contact.value.trim()) { contact.setCustomValidity('Enter your email or Instagram handle.'); contact.reportValidity(); return; }
    if (notesStep.hidden) { revealNotes(); document.getElementById('waitlist-notes').focus(); return; }
    submitting = true;
    button.disabled = true;
    button.textContent = 'Joining…';
    status.textContent = '';
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact: contact.value, notes: document.getElementById('waitlist-notes').value }),
        signal: AbortSignal.timeout(20000)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      form.querySelector('.waitlist-fields').hidden = true;
      status.textContent = result.message;
      status.focus();
    } catch (error) {
      status.textContent = error.name === 'TimeoutError' || error.name === 'TypeError' ? 'We could not confirm your signup. Please check your connection and try again.' : error.message;
      button.disabled = false;
      button.textContent = 'Join the waitlist';
      submitting = false;
    }
  });
  contact.addEventListener('input', () => contact.setCustomValidity(''));
})();
