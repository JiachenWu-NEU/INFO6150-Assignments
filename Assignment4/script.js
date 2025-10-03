document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const submitBtn = form.querySelector('input[type="Submit"]');
  submitBtn.disabled = true;

  const titleRadios = [...form.querySelectorAll('input[name="title"]')];
  const firstName = document.getElementById('firstName');
  const lastName  = document.getElementById('lastName');
  const email     = document.getElementById('emailId');
  const phone     = document.getElementById('phoneNumber');
  const zipcode   = document.getElementById('zipcode');
  const hearChecks= [...form.querySelectorAll('input[name="source"]')];
  const comments  = document.getElementById('comments');

  function ensureErrorSpan(afterNode) {
    let span = afterNode.nextElementSibling && afterNode.nextElementSibling.classList?.contains('error')
      ? afterNode.nextElementSibling
      : null;

    if (!span) {
      span = document.createElement('span');
      span.className = 'error';
      span.style.marginLeft = '12px';
      span.style.color = 'crimson';
      span.style.fontSize = '0.9rem';

      let insertBefore = afterNode.nextSibling;
      while (insertBefore && !(insertBefore.nodeType === 1 && insertBefore.tagName === 'BR')) {
        insertBefore = insertBefore.nextSibling;
      }
      if (insertBefore) {
        form.insertBefore(span, insertBefore);
      } else {
        afterNode.parentNode.insertBefore(span, afterNode.nextSibling);
      }
    }
    return span;
  }

  const titleAnchor = titleRadios[titleRadios.length - 1];
  const hearAnchor  = hearChecks[hearChecks.length - 1];

  const nameAllowed = /^[A-Za-z][A-Za-z' -]*$/;
  const nameMin = 2, nameMax = 20;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@northeastern\.edu$/i;

  const phoneDigitsOnly = /^\d{10}$/;

  const zipRegex = /^\d{5,6}$/;

  const commentsForbidden = /[<>^$*{}[\]|\\]/; 
  const commentsMin = 10, commentsMax = 500;

  function validateName(inputEl, label) {
    const val = inputEl.value.trim();
    const err = ensureErrorSpan(inputEl);
    if (val.length === 0) {
      err.textContent = `${label} is required.`;
      return false;
    }
    if (val.length < nameMin) {
      err.textContent = `${label} must be at least ${nameMin} characters.`;
      return false;
    }
    if (val.length > nameMax) {
      err.textContent = `${label} must be at most ${nameMax} characters.`;
      return false;
    }
    if (!nameAllowed.test(val)) {
      err.textContent = `${label} cannot contain special characters (letters, space, -, ' only).`;
      return false;
    }
    err.textContent = '';
    return true;
  }

  function validateTitle() {
    const err = ensureErrorSpan(titleAnchor);
    const ok = titleRadios.some(r => r.checked);
    err.textContent = ok ? '' : 'Please choose a title.';
    return ok;
  }

  function validateEmail() {
    const val = email.value.trim();
    const err = ensureErrorSpan(email);
    if (val.length === 0) { err.textContent = 'Email is required.'; return false; }
    if (val.length < 6)   { err.textContent = 'Email seems too short.'; return false; }
    if (val.length > 100) { err.textContent = 'Email is too long.'; return false; }
    if (!emailRegex.test(val)) {
      err.textContent = 'Email must be @northeastern.edu.';
      return false;
    }
    err.textContent = '';
    return true;
  }

  function formatPhoneOnInput() {
    let digits = phone.value.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 10) {
      const part1 = digits.slice(0,3);
      const part2 = digits.slice(3,6);
      const part3 = digits.slice(6);
      phone.value = `(${part1})${part2}-${part3}`;
    } else {
      phone.value = digits;
    }
  }

  function validatePhone() {
    const err = ensureErrorSpan(phone);
    const digits = phone.value.replace(/\D/g, '');
    if (digits.length === 0) { err.textContent = 'Phone number is required.'; return false; }
    if (!phoneDigitsOnly.test(digits)) { err.textContent = 'Phone must be exactly 10 digits.'; return false; }
    if (!/^\(\d{3}\)\d{3}-\d{4}$/.test(phone.value)) {
      const part1 = digits.slice(0,3);
      const part2 = digits.slice(3,6);
      const part3 = digits.slice(6);
      phone.value = `(${part1})${part2}-${part3}`;
    }
    err.textContent = '';
    return true;
  }

  function validateZip() {
    const val = zipcode.value.trim();
    const err = ensureErrorSpan(zipcode);
    if (val.length === 0) { err.textContent = 'Zip code is required.'; return false; }
    if (!zipRegex.test(val)) {
      err.textContent = 'Zip must be 5 or 6 digits.';
      return false;
    }
    err.textContent = '';
    return true;
  }

  function validateHear() {
    const err = ensureErrorSpan(hearAnchor);
    const ok = hearChecks.some(c => c.checked);
    err.textContent = ok ? '' : 'Please select at least one source.';
    return ok;
  }

  function validateComments() {
    const val = comments.value;
    const err = ensureErrorSpan(comments);
    if (val.trim().length === 0) { err.textContent = 'Comments are required.'; return false; }
    if (val.length < commentsMin) { err.textContent = `Comments must be at least ${commentsMin} characters.`; return false; }
    if (val.length > commentsMax) { err.textContent = `Comments must be at most ${commentsMax} characters.`; return false; }
    if (commentsForbidden.test(val)) { err.textContent = 'Comments contain forbidden special characters.'; return false; }
    err.textContent = '';
    return true;
  }

  function validateAll() {
    const v1 = validateTitle();
    const v2 = validateName(firstName, 'First name');
    const v3 = validateName(lastName, 'Last name');
    const v4 = validateEmail();
    const v5 = validatePhone();
    const v6 = validateZip();
    const v7 = validateHear();
    const v8 = validateComments();
    const allOk = v1 && v2 && v3 && v4 && v5 && v6 && v7 && v8;
    submitBtn.disabled = !allOk;
    return allOk;
  }

  titleRadios.forEach(r => r.addEventListener('change', validateAll));
  firstName.addEventListener('input', () => { validateName(firstName, 'First name'); validateAll(); });
  lastName.addEventListener('input',  () => { validateName(lastName, 'Last name');  validateAll(); });
  email.addEventListener('input',     () => { validateEmail();   validateAll(); });
  phone.addEventListener('input',     () => { formatPhoneOnInput(); validatePhone(); validateAll(); });
  zipcode.addEventListener('input',   () => { validateZip();     validateAll(); });
  hearChecks.forEach(c => c.addEventListener('change', () => { validateHear(); validateAll(); }));
  comments.addEventListener('input',  () => { validateComments(); validateAll(); });

  validateAll();

  form.addEventListener('submit', (e) => {
    if (!validateAll()) {
      e.preventDefault();
    }
  });

  const resetBtn = form.querySelector('input[type="Reset"]');
  resetBtn.addEventListener('click', () => {
    setTimeout(() => {
        validateAll();

        phone.value = '';
        submitBtn.disabled = true;
    }, 0);
  });
});