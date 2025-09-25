function greenArrowSVG() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" class="arrow" focusable="false">
      <path fill="#10b981" d="M8 5l8 7-8 7V5z"></path>
    </svg>
  `;
}

const tbody = document.getElementById('tableBody');
const addBtn = document.getElementById('addBtn');
const submitBtn = document.getElementById('submitBtn');
const summaryCell = document.getElementById('summaryCell');

const editDialog = document.getElementById('editDialog');
const editTitle = document.getElementById('editTitle');
const editInput = document.getElementById('editInput');
const editOkBtn = document.getElementById('editOkBtn');

let currentEditingStudent = null;

function normalizeArrows() {
  const rows = Array.from(tbody.querySelectorAll('tr.row'));
  for (const tr of rows) {
    const details = tr.nextElementSibling && tr.nextElementSibling.classList.contains('details-row')
      ? tr.nextElementSibling : null;
    if (details) {
        details.hidden = true;
    }
    const btn = tr.querySelector('.expand-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ['1','2','3'].forEach(num => addStudentRow(parseInt(num, 10), false));
  normalizeArrows();
  updateSummary();
});

function nextStudentNumber() {
  const used = new Set(
    [...tbody.querySelectorAll('tr.row')].map(tr => Number(tr.dataset.num))
  );
  let n = 1;
  while (used.has(n)) n++;
  return n;
}

function addStudentRow(num, showAlertOnSuccess = true) {
  try {
    const tr = document.createElement('tr');
    tr.className = 'row';
    tr.dataset.num = String(num);

    const tdExpand = document.createElement('td');
    tdExpand.className = 'col-expand';
    const expandBtn = document.createElement('button');
    expandBtn.className = 'icon-btn expand-btn';
    expandBtn.setAttribute('aria-expanded', 'false');
    expandBtn.innerHTML = greenArrowSVG();
    expandBtn.addEventListener('click', () => toggleDetails(tr, detailsTr, expandBtn));
    tdExpand.appendChild(expandBtn);

    const tdSelect = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => onToggleSelect(tr, checkbox));
    tdSelect.appendChild(checkbox);

    const tdStudent = document.createElement('td');
    tdStudent.textContent = `Student ${num}`;

    const tdTeacher = document.createElement('td');
    tdTeacher.textContent = `Teacher ${num}`;

    const tdAssignment = document.createElement('td');
    tdAssignment.textContent = `Assignment ${num}`;

    const tdScore = document.createElement('td');
    tdScore.textContent = `${Math.min(100, 60 + num)}`;

    const tdEdit = document.createElement('td');
    const tdDelete = document.createElement('td');

    const detailsTr = document.createElement('tr');
    detailsTr.className = 'details-row';
    detailsTr.hidden = true;
    const detailsTd = document.createElement('td');
    detailsTd.colSpan = 8;
    detailsTd.innerHTML = `
      <div class="details">
        <div><strong>Student:</strong> Student ${num}</div>
        <div><strong>Teacher:</strong> Teacher ${num}</div>
        <div><strong>Assignment:</strong> Assignment ${num}</div>
        <div><strong>Score:</strong> ${Math.min(100, 60 + num)}</div>
        <div><strong>Notes:</strong> Click EDIT to add a note.</div>
      </div>
    `;
    detailsTr.appendChild(detailsTd);

    tr.appendChild(tdExpand);
    tr.appendChild(tdSelect);
    tr.appendChild(tdStudent);
    tr.appendChild(tdTeacher);
    tr.appendChild(tdAssignment);
    tr.appendChild(tdScore);
    tr.appendChild(tdEdit);
    tr.appendChild(tdDelete);

    tbody.appendChild(tr);
    tbody.appendChild(detailsTr);
    sortTableByStudentNumber();

    if (showAlertOnSuccess) {
      alert(`Student ${num} Record added successfully`);
    }
    updateSummary();
  } catch (e) {
    console.error(e);
    alert('Error: Record addition failed');
  }
}

function sortTableByStudentNumber() {
  const rows = [];
  const all = Array.from(tbody.children);
  for (let i = 0; i < all.length; i++) {
    const tr = all[i];
    if (tr.classList.contains('row')) {
      const details = all[i + 1] && all[i + 1].classList.contains('details-row') ? all[i + 1] : null;
      rows.push([tr, details]);
    }
  }
  rows.sort((a, b) => Number(a[0].dataset.num) - Number(b[0].dataset.num));

  tbody.innerHTML = '';
  for (const [main, details] of rows) {
    tbody.appendChild(main);
    if (details) tbody.appendChild(details);
  }
}

function onToggleSelect(tr, checkbox) {
  const selected = checkbox.checked;
  tr.classList.toggle('selected', selected);

  const tdEdit = tr.children[6];
  const tdDelete = tr.children[7];
  tdEdit.innerHTML = '';
  tdDelete.innerHTML = '';

  if (selected) {
    const editBtn = document.createElement('button');
    editBtn.className = 'btn btn-edit';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => openEditDialog(tr));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn btn-delete';
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => deleteRow(tr));

    tdEdit.appendChild(editBtn);
    tdDelete.appendChild(delBtn);
  }

  updateSubmitState();
}

function updateSubmitState() {
  const anyChecked = !!tbody.querySelector('tr.row input[type="checkbox"]:checked');
  submitBtn.disabled = !anyChecked;
  submitBtn.classList.toggle('enabled', anyChecked);
}

function toggleDetails(mainTr, detailsTr, expandBtn) {
  const isOpen = expandBtn.getAttribute('aria-expanded') === 'true';
  const nextState = !isOpen;
  expandBtn.setAttribute('aria-expanded', String(nextState));
  detailsTr.hidden = !nextState;
}

function deleteRow(mainTr) {
  const num = Number(mainTr.dataset.num) || '?';
  const detailsTr = mainTr.nextElementSibling && mainTr.nextElementSibling.classList.contains('details-row')
    ? mainTr.nextElementSibling
    : null;

  mainTr.remove();
  if (detailsTr) detailsTr.remove();

  alert(`Student ${num} Record deleted successfully`);

  updateSubmitState();
  updateSummary();
}

function openEditDialog(mainTr) {
  const num = Number(mainTr.dataset.num);
  currentEditingStudent = num;
  editTitle.textContent = `Edit details of Student ${num}`;
  editInput.value = '';

  if (typeof editDialog.showModal === 'function') {
    editDialog.showModal();
  } else {
    const val = prompt(`Edit details of Student ${num}`, '');
    if (val && val.trim()) {
      alert(`Student ${num} data updated successfully`);
    }
    return;
  }
}

editOkBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const val = editInput.value.trim();
  if (val) {
    alert(`Student ${currentEditingStudent} data updated successfully`);
    editDialog.close();
  } else {
    editDialog.close();
  }
});

addBtn.addEventListener('click', () => {
  const n = nextStudentNumber();
  addStudentRow(n, true);
  updateSubmitState();
});

submitBtn.addEventListener('click', () => {
  if (submitBtn.disabled) return;
  const selected = [...tbody.querySelectorAll('tr.row input[type="checkbox"]:checked')]
    .map(cb => cb.closest('tr.row'))
    .map(tr => Number(tr.dataset.num));
  alert(`Submitting ${selected.length} selected record(s): ${selected.join(', ')}`);
});

function updateSummary() {
  const count = tbody.querySelectorAll('tr.row').length;
  summaryCell.textContent = `${count} record(s)`;
}
