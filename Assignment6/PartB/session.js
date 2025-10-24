(() => {
    const pad2 = (n) => String(n).padStart(2, '0');
    const toHMS = (secs) => {
        const s = Math.max(0, Math.floor(secs));
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const r = s % 60;
        return `${pad2(h)}:${pad2(m)}:${pad2(r)}`;
    };
    const nowISODate = () => new Date().toISOString().slice(0,10);
    const storageKey = 'stopwatchSessions_v1';  
    const notice = document.getElementById('notice');
    let noticeTimer = null;
    function showNotice(msg) {
        notice.textContent = msg;
        notice.classList.add('show');
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => notice.classList.remove('show'), 2200);
    }   
    const el = {
        timer: document.getElementById('timerDisplay'),
        date: document.getElementById('dateInput'),
        name: document.getElementById('nameInput'),
        dateError: document.getElementById('dateError'),
        nameError: document.getElementById('nameError'),
        start: document.getElementById('btnStart'),
        pause: document.getElementById('btnPause'),
        stop: document.getElementById('btnStop'),
        reset: document.getElementById('btnReset'),
        clearHistory: document.getElementById('btnClearHistory'),
        filterDate: document.getElementById('filterDate'),
        clearFilter: document.getElementById('btnClearFilter'),
        history: document.getElementById('history'),
        statCount: document.getElementById('statCount'),
        statTime: document.getElementById('statTime'),
        statScope: document.getElementById('statScope'),
        modalBackdrop: document.getElementById('modalBackdrop'),
        modalTitle: document.getElementById('modalTitle'),
        modalMsg: document.getElementById('modalMsg'),
        modalCancel: document.getElementById('modalCancel'),
        modalConfirm: document.getElementById('modalConfirm'),
    };  
    let running = false;
    let paused = false;
    let startEpoch = 0;
    let elapsedBase = 0;
    let tickHandle = null;  
    const readSessions = () => {
        try{
            return JSON.parse(localStorage.getItem(storageKey)) || [];
        } catch {
            return [];
        }
    };
    const writeSessions = (arr) => localStorage.setItem(storageKey, JSON.stringify(arr));   
    const saveSession = async (session) => {
        return new Promise((resolve) => {
            setTimeout(() => {
              const all = readSessions();
              all.push(session);
              all.sort((a,b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
              writeSessions(all);
              resolve(true);
            }, 0);
        });
    };  
    function renderHistory() {
        const all = readSessions();
        const f = el.filterDate.value;
        const list = f ? all.filter(s => s.date === f) : all; 
        const totalSecs = list.reduce((sum, s) => sum + (s.durationSecs||0), 0);
        el.statCount.textContent = `Total Sessions: ${list.length}`;
        el.statTime.textContent = `Total Time: ${toHMS(totalSecs)}`;
        el.statScope.textContent = `Scope: ${f ? `Date ${f}` : 'All'}`;   
        el.history.innerHTML = '';
        if(list.length === 0){
            const div = document.createElement('div');
            div.className = 'empty';
            div.textContent = 'No sessions recorded yet';
            el.history.appendChild(div);
            return;
        } 
        for(const s of list) {
            const row = document.createElement('div');
            row.className = 'item';
            row.innerHTML = `
              <div class="date">${s.date}</div>
              <div class="name">${s.name}</div>
              <div class="dur">${toHMS(s.durationSecs || 0)}</div>
            `;
            el.history.appendChild(row);
        }
    }   
    function setInputsDisabled(disabled) {
        el.date.disabled = disabled;
        el.name.disabled = disabled;
    }   
    function setButtonsState(state) {
        if(state === 'idle'){
            el.start.disabled = false;
            el.pause.disabled = true;
            el.stop.disabled = true;
            el.reset.disabled = true;
        } else if(state === 'running'){
            el.start.disabled = true;
            el.pause.disabled = false; el.pause.textContent = 'Pause';
            el.stop.disabled = false;
            el.reset.disabled = false;
        } else if(state === 'paused'){
            el.start.disabled = true;
            el.pause.disabled = false; el.pause.textContent = 'Resume';
            el.stop.disabled = false;
            el.reset.disabled = false;
        }
    }   
    function startTick() {
        clearInterval(tickHandle);
        tickHandle = setInterval(() => {
            const now = Date.now();
            const diffSecs = Math.floor((now - startEpoch)/1000) + elapsedBase;
            el.timer.textContent = toHMS(diffSecs);
        }, 1000);
    }   
    async function onStart() {
        if(!validateForm()) {
            return;
        }
        setInputsDisabled(true);  
        running = true; paused = false;
        startEpoch = Date.now();
        startTick();
        setButtonsState('running');
    }   
    function onPauseResume() {
        if(!running) {
            return;
        }
        const nowSecs = Math.floor((Date.now() - startEpoch)/1000);
        if(!paused) {
            paused = true; running = true;
            elapsedBase += nowSecs;
            clearInterval(tickHandle);
            setButtonsState('paused');
        } else {
            paused = false;
            startEpoch = Date.now();
            startTick();
            setButtonsState('running');
        }
    }   
    async function onStopSave() {
        if(!running && !paused) {
          return;
        }
        clearInterval(tickHandle);
        const add = Math.floor((Date.now() - startEpoch)/1000);
        const durationSecs = (paused ? elapsedBase : elapsedBase + add);  
        const session = {
          date: el.date.value,
          name: el.name.value.trim(),
          durationSecs,
          savedAt: new Date().toISOString(),
        };    
        running = false;
        paused = false;
        elapsedBase = 0;
        startEpoch = 0;
        el.timer.textContent = '00:00:00';
        setInputsDisabled(false);
        setButtonsState('idle');  
        await saveSession(session);
        renderHistory();
        showNotice('Session saved');
    }   
    function confirmAction(title, msg) {
        return new Promise((resolve) => {
            el.modalTitle.textContent = title;
            el.modalMsg.textContent = msg;
            el.modalBackdrop.classList.add('show'); 
            const onCancel = () => {
                cleanup();
                resolve(false);
            };
            const onConfirm = () => {
                cleanup();
                resolve(true);
            };
            function cleanup() {
                el.modalBackdrop.classList.remove('show');
                el.modalCancel.removeEventListener('click', onCancel);
                el.modalConfirm.removeEventListener('click', onConfirm);
            }
            el.modalCancel.addEventListener('click', onCancel);
            el.modalConfirm.addEventListener('click', onConfirm);
        });
    }   
    async function onReset() {
        if(!(running || paused)) {
            return;
        }
        const ok = await confirmAction('Reset Timer', 'This will clear the current timer without saving. Continue?');
        if(!ok) {
            return;
        }   
        clearInterval(tickHandle);
        running = false;
        paused = false;
        elapsedBase = 0;
        startEpoch = 0;
        el.timer.textContent = '00:00:00';
        setInputsDisabled(false);
        setButtonsState('idle');
        showNotice('Timer reset');
    }   
    async function onClearHistory() {
        const ok = await confirmAction('Clear History', 'Delete all saved sessions? This cannot be undone.');
        if(!ok) {
            return;
        }
        writeSessions([]);
        renderHistory();
        showNotice('History cleared');
    }   

    const nameRegex = /^[A-Za-z0-9\s\-']+$/;    
    function clearErrors() {
        $('#dateError').text('');
        $('#nameError').text('');
    }   
    function validateForm() {
        clearErrors();
        let ok = true;    
        const dateVal = $('#dateInput').val();
        const nameVal = $('#nameInput').val().trim(); 
        if(!dateVal) {
            $('#dateError').text('Please select a date');
            ok = false;
        }
        if(nameVal.length === 0) {
            $('#nameError').text('Event name is required');
            ok = false;
        } else if (nameVal.length < 3) {
            $('#nameError').text('Event name must be at least 3 characters');
            ok = false;
        } else if (nameVal.length > 100) {
            $('#nameError').text('Event name too long (max 100 characters)');
            ok = false;
        } else if (!nameRegex.test(nameVal)) {
            $('#nameError').text('Event name contains invalid characters');
            ok = false;
        } 
        return ok;
    }   
    $('#dateInput').on('focus input', () => $('#dateError').text(''));
    $('#nameInput').on('focus input', () => $('#nameError').text(''));  
    el.date.value = nowISODate();
    renderHistory();
    setButtonsState('idle');    
    el.start.addEventListener('click', onStart);
    el.pause.addEventListener('click', onPauseResume);
    el.stop.addEventListener('click', onStopSave);
    el.reset.addEventListener('click', onReset);
    el.clearHistory.addEventListener('click', onClearHistory);  
    el.filterDate.addEventListener('change', renderHistory);
    el.clearFilter.addEventListener('click', () => {
        el.filterDate.value = '';
        renderHistory();
    });
})();