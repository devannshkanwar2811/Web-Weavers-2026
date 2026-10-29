'use strict';
// Demo-only form: validates inputs in the browser and deliberately sends no network request.
const form = document.getElementById('contact-form');
const status = document.getElementById('contact-status');

if (form && status) {
  form.addEventListener('submit', event => {
    event.preventDefault(); // Stop the browser's normal form submission.
    if (!form.reportValidity()) return; // Use native required/type/minlength checks.

    const name = form.elements.name.value.trim();
    const message = form.elements.message.value.trim();
    if (!name || message.length < 10) {
      status.textContent = 'Please enter a name and a message of at least 10 characters.';
      return;
    }

    // Do not transmit or store the message. This confirms only that local validation passed.
    status.textContent = `Demo validated for ${name}. Nothing was sent or saved.`;
    form.reset();
  });
}
