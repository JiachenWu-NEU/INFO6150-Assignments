document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  // ---------- 样式：错误提示 & 聊窗 ----------
  const style = document.createElement('style');
  style.textContent = `
    .error { color:#c53030; font-size:12px; margin-left:8px; }
    .invalid { outline: 2px solid #c53030; }
    .hint { color:#64748b; font-size:12px; margin-left:8px; }
    #results { margin: 24px 0 48px; width:100%; overflow:auto;}
    #results table { width:100%; border-collapse: collapse; background:white;}
    #results th, #results td { border:1px solid #ddd; padding:8px; text-align:left;}
    #results th { background:#f3f4f6; }
    /* Chat UI */
    #ai-btn { position: absolute; right: 24px; top: 16px; }
    #chat-win { position: fixed; right: 24px; bottom: 24px; width: 320px; background: #fff;
                border: 1px solid #e5e7eb; border-radius: 10px; box-shadow: 0 6px 20px rgba(0,0,0,.15);
                display: none; flex-direction: column; overflow: hidden; }
    #chat-head { padding: 10px 12px; background: #111827; color: #fff; font-weight: 600; display:flex; justify-content:space-between; align-items:center;}
    #chat-body { padding: 10px 12px; height: 260px; overflow-y: auto; font-size: 14px; }
    #chat-body .q { margin: 6px 0; text-align: right; }
    #chat-body .q span { display:inline-block; background:#e5f0ff; padding:6px 8px; border-radius:8px; }
    #chat-body .a { margin: 6px 0; text-align: left; }
    #chat-body .a span { display:inline-block; background:#f3f4f6; padding:6px 8px; border-radius:8px; }
    #chat-input { display:flex; border-top:1px solid #e5e7eb; }
    #chat-input input { flex:1; border:0; padding:10px 12px; }
    #chat-input button { border:0; padding:10px 14px; cursor:pointer; background:#2563eb; color:#fff; }
  `;
  document.head.appendChild(style);

  // ---------- 在表单上方插入 AI Assistant 按钮 ----------
  const aiBtn = document.createElement('button');
  aiBtn.id = 'ai-btn';
  aiBtn.type = 'button';
  aiBtn.textContent = 'AI Assistant';
  form.parentElement.insertBefore(aiBtn, form);

  // ---------- 聊窗 DOM ----------
  const chat = document.createElement('div');
  chat.id = 'chat-win';
  chat.innerHTML = `
    <div id="chat-head">Form Helper <button id="chat-close" style="background:transparent;color:#fff;border:0;cursor:pointer;">✕</button></div>
    <div id="chat-body"></div>
    <div id="chat-input">
      <input id="chat-text" placeholder="Ask about email / phone / zip / required / address..." />
      <button id="chat-send">Send</button>
    </div>
  `;
  document.body.appendChild(chat);
  aiBtn.addEventListener('click', () => { chat.style.display = 'flex'; });
  chat.querySelector('#chat-close').addEventListener('click', () => { chat.style.display = 'none'; });

  // ---------- FAQ 关键字匹配 ----------
  const faq = [
    {keys:['email','northeastern'], ans:'You must use your Northeastern email (example: student@northeastern.edu).'},
    {keys:['phone','format'], ans:'The phone number must be in the format (XXX) XXX-XXXX.'},
    {keys:['zip','zipcode','postal'], ans:'The zip code must be exactly 5 digits.'},
    {keys:['required','mandatory','must'], ans:'All fields are required except Street Address 2.'},
    {keys:['address 2','street address 2','addr2'], ans:'Street Address 2 is optional. If left blank, it stays empty in the results table.'}
  ];
  function chatAppend(type, text) {
    const row = document.createElement('div');
    row.className = type;
    const span = document.createElement('span');
    span.textContent = text;
    row.appendChild(span);
    chat.querySelector('#chat-body').appendChild(row);
    chat.querySelector('#chat-body').scrollTop = chat.querySelector('#chat-body').scrollHeight;
  }
  function chatAnswer(q) {
    const lower = q.toLowerCase();
    const hit = faq.find(f => f.keys.some(k => lower.includes(k)));
    return hit ? hit.ans : 'Sorry, I don’t know that yet. Please check the instructions.';
  }
  function doSend() {
    const inp = chat.querySelector('#chat-text');
    const val = inp.value.trim();
    if (!val) return;
    chatAppend('q', val);
    chatAppend('a', chatAnswer(val));
    inp.value = '';
  }
  chat.querySelector('#chat-send').addEventListener('click', doSend);
  chat.querySelector('#chat-text').addEventListener('keydown', e => { if (e.key === 'Enter') doSend(); });

  // ---------- 插入 Address 2（可选，带计数器） ----------
  // 在 ZipCode 行之前插入 Address 2
  const zipLabel = document.querySelector('label[for="zipcode"]');
  const addr2Wrap = document.createElement('div');
  addr2Wrap.innerHTML = `
    <label for="address2">Street Address 2 (optional):</label>
    <input type="text" id="address2" name="address2" placeholder="Apt / Unit / Suite" maxlength="20" />
    <span id="address2-count" class="hint">0/20</span>
    <br><br>
  `;
  zipLabel.parentElement.insertBefore(addr2Wrap, zipLabel);

  const address2 = document.getElementById('address2');
  const addr2Count = document.getElementById('address2-count');
  address2.addEventListener('input', () => {
    addr2Count.textContent = `${address2.value.length}/20`;
  });

  // ---------- 在 “How did you hear*” 下面插入 单选下拉框 + 动态复选框 + 动态必填文本 ----------
  const hearLabel = Array.from(document.querySelectorAll('label')).find(l => l.textContent.includes('How did you hear'));
  const dynamicWrap = document.createElement('div');
  dynamicWrap.style.margin = '8px 0';
  dynamicWrap.innerHTML = `
    <label for="topicList">Topic*:</label>
    <select id="topicList" name="topicList" required>
      <option value="">-- Please Select --</option>
      <option value="support">Support</option>
      <option value="billing">Billing</option>
      <option value="feature">Feature Request</option>
      <option value="bug">Bug Report</option>
      <option value="other">Other</option>
    </select>
    <span class="error" id="topicList_err"></span>
    <div id="dynArea" style="margin-left:150px; margin-top:6px;"></div>
    <br><br>
  `;
  hearLabel.parentElement.insertBefore(dynamicWrap, hearLabel.nextSibling.nextSibling); // 在复选框行后面

  const topicList = document.getElementById('topicList');
  const dynArea = document.getElementById('dynArea');
  let dynTextInput = null;
  topicList.addEventListener('change', () => {
    dynArea.innerHTML = '';
    if (!topicList.value) return;
    const cbId = 'enable_' + topicList.value;
    const labelTxt = `Enable ${topicList.selectedOptions[0].text} details`;
    dynArea.innerHTML = `
      <label style="width:auto; float:none;">
        <input type="checkbox" id="${cbId}"> ${labelTxt}
      </label>
      <span class="error" id="dyn_err"></span>
    `;
    const cb = document.getElementById(cbId);
    cb.addEventListener('change', () => {
      const old = dynArea.querySelector('.dyn-text');
      if (cb.checked) {
        const wrap = document.createElement('div');
        wrap.style.marginTop = '6px';
        wrap.innerHTML = `
          <input class="dyn-text" type="text" id="dyn_text" placeholder="Provide details..." />
          <span class="error" id="dyn_text_err"></span>
        `;
        dynArea.appendChild(wrap);
        dynTextInput = wrap.querySelector('#dyn_text');
        dynTextInput.addEventListener('input', () => validateDynText());
      } else {
        if (old) old.parentElement.remove();
        dynTextInput = null;
        clearError('dyn_text');
      }
      validateAll();
    });
  });

  // ---------- 错误提示帮助函数 ----------
  function getField(id) { return document.getElementById(id); }
  function ensureErrorSpanAfter(el, idSuffix='_err') {
    const id = el.id + idSuffix;
    let span = document.getElementById(id);
    if (!span) {
      span = document.createElement('span');
      span.id = id;
      span.className = 'error';
      el.insertAdjacentElement('afterend', span);
    }
    return span;
  }
  function showError(id, msg) {
    const el = getField(id);
    const span = document.getElementById(id + '_err') || ensureErrorSpanAfter(el);
    span.textContent = msg || '';
    if (msg) el.classList.add('invalid'); else el.classList.remove('invalid');
  }
  function clearError(id) { showError(id, ''); }

  // ---------- 取 DOM 引用 ----------
  const firstName = getField('firstName');
  const lastName  = getField('lastName');
  const email     = getField('emailId');
  const phone     = getField('phoneNumber');
  const zipcode   = getField('zipcode');
  const comments  = getField('comments');
  const submitBtn = form.querySelector('input[type="Submit"]');

  // 给每个输入后面预置一个 error span，便于布局稳定
  [firstName,lastName,email,phone,zipcode,comments,topicList,address2].forEach(el => ensureErrorSpanAfter(el));

  // ---------- 校验规则 ----------
  const reName = /^[a-zA-Z][a-zA-Z\s'-]{1,29}$/; // 字母开头，允许空格/连字符/撇号，2~30
  const reEmailNEU = /^[a-zA-Z0-9._%+-]+@northeastern\.edu$/i;
  const reZip5 = /^\d{5}$/;

  function digitsOnly(str) { return (str || '').replace(/\D/g,''); }

  // 手机号输入掩码 & 校验
  function maskPhone(e) {
    let d = digitsOnly(e.target.value).slice(0,10);
    let out = d;
    if (d.length > 6) out = `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
    else if (d.length > 3) out = `(${d.slice(0,3)}) ${d.slice(3)}`;
    else if (d.length > 0) out = `(${d}`;
    e.target.value = out;
  }
  function validPhone() {
    const d = digitsOnly(phone.value);
    if (d.length !== 10) { showError('phoneNumber','Phone must be 10 digits (format: (XXX) XXX-XXXX)'); return false; }
    clearError('phoneNumber'); return true;
  }

  function notEmpty(val) { return val && val.trim().length > 0; }

  function validateFirst() {
    if (!notEmpty(firstName.value)) { showError('firstName','Required'); return false; }
    if (firstName.value.length < 2) { showError('firstName','Min length: 2'); return false; }
    if (firstName.value.length > 30){ showError('firstName','Max length: 30'); return false; }
    if (!reName.test(firstName.value)) { showError('firstName','Letters/spaces only'); return false; }
    clearError('firstName'); return true;
  }
  function validateLast() {
    if (!notEmpty(lastName.value)) { showError('lastName','Required'); return false; }
    if (lastName.value.length < 2) { showError('lastName','Min length: 2'); return false; }
    if (lastName.value.length > 30){ showError('lastName','Max length: 30'); return false; }
    if (!reName.test(lastName.value)) { showError('lastName','Letters/spaces only'); return false; }
    clearError('lastName'); return true;
  }
  function validateEmail() {
    if (!notEmpty(email.value)) { showError('emailId','Required'); return false; }
    if (!reEmailNEU.test(email.value.trim())) { showError('emailId','Use Northeastern email (…@northeastern.edu)'); return false; }
    clearError('emailId'); return true;
  }
  function validateZip() {
    if (!notEmpty(zipcode.value)) { showError('zipcode','Required'); return false; }
    if (!reZip5.test(zipcode.value.trim())) { showError('zipcode','Zip must be 5 digits'); return false; }
    clearError('zipcode'); return true;
  }
  function validateComments() {
    const v = comments.value;
    if (!notEmpty(v)) { showError('comments','Required'); return false; }
    if (v.length < 5) { showError('comments','Min length: 5'); return false; }
    if (v.length > 500){ showError('comments','Max length: 500'); return false; }
    clearError('comments'); return true;
  }
  function validateTitle() {
    const any = ['miss','mr','mrs'].some(id => getField(id).checked);
    const id = 'title_group';
    let span = document.getElementById(id);
    if (!span) {
      span = document.createElement('span'); span.id = id; span.className='error';
      // 放在三个 radio 组的最后
      const mrs = getField('mrs');
      mrs.insertAdjacentElement('afterend', span);
    }
    if (!any) { span.textContent = 'Required'; return false; }
    span.textContent = ''; return true;
  }
  function validateTopic() {
    if (!topicList.value) { document.getElementById('topicList_err').textContent='Required'; topicList.classList.add('invalid'); return false; }
    document.getElementById('topicList_err').textContent=''; topicList.classList.remove('invalid'); return true;
  }
  function validateDynText() {
    if (!dynTextInput) { document.getElementById('dyn_err').textContent=''; return true; }
    const v = dynTextInput.value;
    if (!notEmpty(v)) { document.getElementById('dyn_text_err').textContent='Required'; dynTextInput.classList.add('invalid'); return false; }
    if (v.length < 3) { document.getElementById('dyn_text_err').textContent='Min length: 3'; dynTextInput.classList.add('invalid'); return false; }
    if (v.length > 100){ document.getElementById('dyn_text_err').textContent='Max length: 100'; dynTextInput.classList.add('invalid'); return false; }
    document.getElementById('dyn_text_err').textContent=''; dynTextInput.classList.remove('invalid'); return true;
  }

  // “来源”三个复选框至少选一个（按“必填”理解）
  const sources = Array.from(document.querySelectorAll('input[name="source"]'));
  function validateSources() {
    const ok = sources.some(s => s.checked);
    let span = document.getElementById('source_err');
    if (!span) {
      span = document.createElement('span'); span.id = 'source_err'; span.className='error';
      sources[sources.length-1].insertAdjacentElement('afterend', span);
    }
    span.textContent = ok ? '' : 'Select at least one';
    return ok;
  }

  // Address2 可选：不需要错误，但演示“字母数字不含特殊”限制
  const reAlnumSpace = /^[a-zA-Z0-9\s-]*$/;
  function validateAddress2() {
    const v = address2.value;
    if (!v) { clearError('address2'); return true; }
    if (!reAlnumSpace.test(v)) { showError('address2','Only letters, numbers, spaces, -'); return false; }
    clearError('address2'); return true;
  }

  // 绑定键盘/输入事件（作业要求：key events 实时校验）
  firstName.addEventListener('input', validateFirst);
  lastName .addEventListener('input', validateLast);
  email    .addEventListener('input', validateEmail);
  phone    .addEventListener('input', (e)=>{ maskPhone(e); validPhone(); });
  zipcode  .addEventListener('input', validateZip);
  comments .addEventListener('input', validateComments);
  sources.forEach(cb => cb.addEventListener('change', validateSources));
  topicList.addEventListener('change', validateTopic);
  address2.addEventListener('input', validateAddress2);

  function validateAll() {
    const ok =
      validateTitle() &
      validateFirst() &
      validateLast() &
      validateEmail() &
      validPhone() &
      validateZip() &
      validateSources() &
      validateTopic() &
      validateDynText() &
      validateComments() &
      validateAddress2();
    submitBtn.disabled = !ok;
    return !!ok;
  }

  // 初始禁用提交
  submitBtn.disabled = true;

  // ---------- 累计结果表 ----------
  const resultsDiv = document.createElement('div');
  resultsDiv.id = 'results';
  form.parentElement.appendChild(resultsDiv);
  const submissions = []; // 累计历史

  function renderTable() {
    if (!submissions.length) { resultsDiv.innerHTML = ''; return; }
    const headers = [
      'Title','First Name','Last Name','Email','Phone','Zip','Sources','Topic','Topic Detail','Address 2','Comments','Submitted At'
    ];
    let html = '<table><thead><tr>' + headers.map(h=>`<th>${h}</th>`).join('') + '</tr></thead><tbody>';
    html += submissions.map(row => `<tr>${
      headers.map(h=>`<td>${(row[h] ?? '')}</td>`).join('')
    }</tr>`).join('');
    html += '</tbody></table>';
    resultsDiv.innerHTML = html;
  }

  function getTitleValue() {
    if (getField('miss').checked) return 'Miss';
    if (getField('mr').checked) return 'Mr.';
    if (getField('mrs').checked) return 'Mrs.';
    return '';
    }

  // ---------- 提交 ----------
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    const topicDetail = dynTextInput ? dynTextInput.value.trim() : '';
    const row = {
      'Title': getTitleValue(),
      'First Name': firstName.value.trim(),
      'Last Name':  lastName.value.trim(),
      'Email':      email.value.trim(),
      'Phone':      phone.value.trim(),
      'Zip':        zipcode.value.trim(),
      'Sources':    sources.filter(s=>s.checked).map(s=>s.value).join(', '),
      'Topic':      topicList.selectedOptions[0]?.text || '',
      'Topic Detail': topicDetail,
      'Address 2':  address2.value.trim(), // 可为空则在表格中留空（作业要求）
      'Comments':   comments.value.trim(),
      'Submitted At': new Date().toLocaleString()
    };
    submissions.push(row);
    renderTable();

    // 清空表单（作业要求）
    form.reset();
    address2.value = '';
    addr2Count.textContent = '0/20';
    dynArea.innerHTML = '';
    dynTextInput = null;

    // 清空错误与禁用按钮
    ['firstName','lastName','emailId','phoneNumber','zipcode','comments','address2','topicList']
      .forEach(id => clearError(id));
    const titleSpan = document.getElementById('title_group'); if (titleSpan) titleSpan.textContent='';
    const srcErr = document.getElementById('source_err'); if (srcErr) srcErr.textContent='';
    submitBtn.disabled = true;
  });
  validateAll();
});