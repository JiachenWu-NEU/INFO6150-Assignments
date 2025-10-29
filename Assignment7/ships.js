const q = document.getElementById('q');
const cards = [...document.querySelectorAll('.ship-card')];
q?.addEventListener('input', e => {
    const term = e.target.value.trim().toLowerCase();
    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(term) ? '' : 'none';
    });
});

const root = document.documentElement;
const btn = document.getElementById('themeToggle');
btn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});
const saved = localStorage.getItem('theme');
if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
}