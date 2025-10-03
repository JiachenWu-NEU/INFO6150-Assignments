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

  const address = document.getElementById('address');
  if (address) {
    const addressMax = parseInt(address.getAttribute('maxlength') || '20', 10);
  
    const counter = document.createElement('div');
    counter.id = 'addressCounter';
    counter.style.fontSize = '0.85rem';
    counter.style.color = '#555';
    counter.style.marginTop = '6px';
    counter.textContent = `0/${addressMax} characters used`;
  
    let insertBefore = address.nextSibling;
    while (insertBefore && !(insertBefore.nodeType === 1 && insertBefore.tagName === 'BR')) {
      insertBefore = insertBefore.nextSibling;
    }
    if (insertBefore) {
      address.parentNode.insertBefore(counter, insertBefore);
    } else {
      address.parentNode.insertBefore(counter, address.nextSibling);
    }
  
    function updateAddressCounter() {
      const len = address.value.length;
      counter.textContent = `${len}/${addressMax} characters used`;
    }
  
    address.addEventListener('input', updateAddressCounter);
    updateAddressCounter();
  
    form.querySelector('input[type="Reset"]')?.addEventListener('click', () => {
      setTimeout(updateAddressCounter, 0);
    });
  }

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
  window.validateAll = validateAll;

  titleRadios.forEach(r => r.addEventListener('change', validateAll));
  firstName.addEventListener('input', () => { validateName(firstName, 'First name'); validateAll(); });
  lastName.addEventListener('input',  () => { validateName(lastName, 'Last name');  validateAll(); });
  email.addEventListener('input',     () => { validateEmail();   validateAll(); });
  phone.addEventListener('input',     () => { formatPhoneOnInput(); validatePhone(); validateAll(); });
  zipcode.addEventListener('input',   () => { validateZip();     validateAll(); });
  hearChecks.forEach(c => c.addEventListener('change', () => { validateHear(); validateAll(); }));
  comments.addEventListener('input',  () => { validateComments(); window.validateAll?.(); });

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

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const submitBtn = form.querySelector('input[type="Submit"]');
  const topic = document.getElementById('topic');
  const dyn = document.getElementById('dynamic-area');

  const ensureErrorSpan =
    window.ensureErrorSpan ||
    function(afterNode){
      let span = afterNode.nextElementSibling && afterNode.nextElementSibling.classList?.contains('error')
        ? afterNode.nextElementSibling
        : null;
      if (!span) {
        span = document.createElement('span');
        span.className = 'error';
        span.style.marginLeft = '12px';
        span.style.color = 'crimson';
        span.style.fontSize = '0.9rem';
        afterNode.parentNode.insertBefore(span, afterNode.nextSibling);
      }
      return span;
    };

  const labelMap = {
    delivery: 'Delivery fee',
    support: 'Support detail',
    billing: 'Billing detail',
    products: 'Product detail',
    other: 'Other detail'
  };

  function clearDynamic() {
    dyn.innerHTML = '';
  }

  function renderCheckbox(selectedVal) {
    clearDynamic();
    if (!selectedVal) return;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'topicCheckbox';
    cb.name = 'topicCheckbox';

    const lbl = document.createElement('label');
    lbl.htmlFor = 'topicCheckbox';
    lbl.textContent = ` ${labelMap[selectedVal] || 'Details'}`;

    dyn.appendChild(cb);
    dyn.appendChild(lbl);

    cb.addEventListener('change', () => {
      if (cb.checked) {
        renderTextField(selectedVal);
      } else {
        removeTextField();
      }
      if (typeof window.validateAll === 'function') window.validateAll();
    });
  }

  function removeTextField() {
    const wrap = document.getElementById('topicDetailWrap');
    if (wrap) wrap.remove();
  }

  function renderTextField(selectedVal) {
    removeTextField();

    const wrap = document.createElement('div');
    wrap.id = 'topicDetailWrap';
    wrap.style.marginTop = '8px';

    const lbl = document.createElement('label');
    lbl.htmlFor = 'topicDetail';
    lbl.textContent = `Details (${labelMap[selectedVal] || 'Details'})*: `;

    const inp = document.createElement('input');
    inp.type = 'text';
    inp.id = 'topicDetail';
    inp.name = 'topicDetail';
    inp.placeholder = 'Please enter details';

    const err = document.createElement('span');
    err.className = 'error';
    err.style.marginLeft = '12px';
    err.style.color = 'crimson';
    err.style.fontSize = '0.9rem';

    wrap.appendChild(lbl);
    wrap.appendChild(inp);
    wrap.appendChild(err);
    dyn.appendChild(wrap);

    inp.addEventListener('input', () => {
      validateTopicDetail();
      if (typeof window.validateAll === 'function') window.validateAll();
    });
  }

  function validateTopicDetail() {
    const cb = document.getElementById('topicCheckbox');
    const inp = document.getElementById('topicDetail');
    if (!cb || !cb.checked) return true;

    if (!inp) return false;
    const err = ensureErrorSpan(inp);
    if (inp.value.trim().length === 0) {
      err.textContent = 'This field is required.';
      return false;
    }
    err.textContent = '';
    return true;
  }

  topic?.addEventListener('change', () => {
    renderCheckbox(topic.value);
    if (typeof window.validateAll === 'function') window.validateAll();
  });

(function wrapValidateAllHybrid(){
  const form = document.querySelector('form');
  const submitBtn = form?.querySelector('input[type="Submit"]');
  const original = window.validateAll;

  function topicOK() {
    const cb  = document.getElementById('topicCheckbox');
    const inp = document.getElementById('topicDetail');

    if (!cb || !cb.checked) return true;

    if (!inp) return false;

    const ok = inp.value.trim() !== '';
    let err = inp.nextElementSibling && inp.nextElementSibling.classList?.contains('error')
      ? inp.nextElementSibling : null;
    if (!err) {
      err = document.createElement('span');
      err.className = 'error';
      err.style.marginLeft = '12px';
      err.style.color = 'crimson';
      err.style.fontSize = '0.9rem';
      inp.parentNode.insertBefore(err, inp.nextSibling);
    }
    err.textContent = ok ? '' : 'This field is required.';
    return ok;
  }

  window.validateAll = function () {
    let baseOK = true;
    if (typeof original === 'function') {
      original();
      baseOK = submitBtn ? !submitBtn.disabled : true;
    }

    const tOK = topicOK();

    const allOK = baseOK && tOK;
    if (submitBtn) submitBtn.disabled = !allOK;

    return allOK;
  };
})();

  document.getElementById('topic')?.addEventListener('change', () => {
    window.validateAll?.();
  });
  
  document.getElementById('dynamic-area')?.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'topicCheckbox') {
      window.validateAll?.();
    }
  });
  
  document.getElementById('dynamic-area')?.addEventListener('input', (e) => {
    if (e.target && e.target.id === 'topicDetail') {
      window.validateAll?.();
    }
  });

  const resetBtn = form.querySelector('input[type="Reset"]');
  resetBtn?.addEventListener('click', () => {
    setTimeout(() => {
      clearDynamic();
      if (typeof window.validateAll === 'function') window.validateAll();
      if (submitBtn) submitBtn.disabled = true;
    }, 0);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const preview = document.getElementById('submission-preview');

  if (!form || !preview) return;

  const labelMap = {
    delivery: 'Delivery fee',
    support: 'Support detail',
    billing: 'Billing detail',
    products: 'Product detail',
    other: 'Other detail'
  };

  function getRadioValue(name) {
    const node = form.querySelector(`input[name="${name}"]:checked`);
    return node ? node.value : '';
  }

  function getCheckboxValues(name) {
    return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value);
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  form.addEventListener('submit', (e) => {
    if (typeof window.validateAll === 'function' && !window.validateAll()) {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    const title = getRadioValue('title');
    const firstName = document.getElementById('firstName')?.value ?? '';
    const lastName  = document.getElementById('lastName')?.value ?? '';
    const email     = document.getElementById('emailId')?.value ?? '';
    const phone     = document.getElementById('phoneNumber')?.value ?? '';
    const zipcode   = document.getElementById('zipcode')?.value ?? '';
    const address   = document.getElementById('address')?.value ?? '';
    const sources   = getCheckboxValues('source');
    const comments  = document.getElementById('comments')?.value ?? '';

    const topicSel  = document.getElementById('topic');
    const topicVal  = topicSel ? topicSel.value : '';
    const topicText = topicSel && topicSel.selectedIndex >= 0
      ? topicSel.options[topicSel.selectedIndex].text
      : '';

    const topicCb   = document.getElementById('topicCheckbox');
    const topicCbChecked = !!(topicCb && topicCb.checked);
    const topicDetailEl  = document.getElementById('topicDetail');
    const topicDetailVal = topicDetailEl ? topicDetailEl.value : '';

    const rows = [];

    rows.push(['Name', title + '. ' + firstName + ' ' + lastName || '—']);
    rows.push(['Email', email || '—']);
    rows.push(['Phone', phone || '—']);
    rows.push(['ZipCode', zipcode || '—']);
    rows.push(['Address', address || '—']);
    rows.push(['How did you hear', sources.length ? sources.join(', ') : '—']);
    rows.push(['Comments', comments || '—']);

    if (topicVal) {
      rows.push(['Topic', topicText || topicVal]);
      rows.push([labelMap[topicVal] || 'Details checkbox', topicCbChecked ? 'Enabled' : 'Disabled']);
      rows.push(['Topic detail', topicDetailVal ? topicDetailVal : '—']);
    }

    const tableHtml = `
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse; background:#fff;">
        <thead>
          <tr>
            <th align="left">Field</th>
            <th align="left">Value</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(([k, v]) => `
            <tr>
              <td>${escapeHtml(k)}</td>
              <td>${escapeHtml(v)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    preview.innerHTML = tableHtml;

    preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
    form.reset();

    document.getElementById('dynamic-area')?.replaceChildren();

    form.querySelectorAll('.error').forEach(s => (s.textContent = ''));

    const submitBtn = form.querySelector('input[type="Submit"]');
    if (submitBtn) submitBtn.disabled = true;

    setTimeout(() => window.validateAll?.(), 0);
    const addrEl = document.getElementById('address');
    const maxLen = parseInt((addrEl && addrEl.getAttribute('maxlength')) || '20', 10);
    const counterEl = document.getElementById('addressCounter');
    if (counterEl) {
      counterEl.textContent = `0/${maxLen} characters used`;
    }

  });
});

document.addEventListener('DOMContentLoaded', () => {
  const btn   = document.getElementById('ai-assistant-btn');
  const chat  = document.getElementById('ai-chat');
  const close = document.getElementById('ai-chat-close');
  const log   = document.getElementById('ai-chat-messages');
  const input = document.getElementById('ai-chat-input');
  const send  = document.getElementById('ai-chat-send');

  if (!btn || !chat || !close || !log || !input || !send) return;

  const QA = [
    { keys: ['email','northeastern','domain'], 
      a: 'You must use your Northeastern email, e.g., student@northeastern.edu.' },
    { keys: ['phone','format','number','mobile','cell'], 
      a: 'The phone number must be in the format (XXX) XXX-XXXX (10 digits).' },
    { keys: ['zip','zipcode','postal'], 
      a: 'The zip code must be exactly 5 digits.' },
    { keys: ['required','mandatory','must','need','field'], 
      a: 'All fields are required except Street Address 2 (optional).' },
    { keys: ['address 2','street address 2','addr2','address2'], 
      a: 'Street Address 2 is optional. If left blank, it stays blank in the results table.' }
  ];
  const defaultReply = "Sorry, I don’t know that yet. Please check the instructions.";

  function addBubble(text, role){
    const div = document.createElement('div');
    div.className = `ai-bubble ${role === 'user' ? 'ai-user' : 'ai-bot'}`;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function answer(q){
    const s = q.toLowerCase();
    for (const {keys, a} of QA){
      if (keys.some(k => s.includes(k))) return a;
    }
    return defaultReply;
  }

  btn.addEventListener('click', () => {
    chat.hidden = !chat.hidden;
    if (chat.hidden) {
      log.replaceChildren();     // 清空所有聊天气泡
      input.value = '';          // 清空输入框
      delete log.dataset.greeted; // 如果你之前用过 greeted 标记，顺便清掉
    } else {
      input.focus();
    }
  });
  close.addEventListener('click', () => {
    chat.hidden = true;
    log.replaceChildren();
    input.value = '';
    delete log.dataset.greeted; }
  );

  function doSend(){
    const q = input.value.trim();
    if (!q) return;
    addBubble(q, 'user');
    addBubble(answer(q), 'bot');
    input.value = '';
    input.focus();
  }
  send.addEventListener('click', doSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); doSend(); }
  });
});

