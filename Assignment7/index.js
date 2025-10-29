const root = document.documentElement;
const btn = document.getElementById('themeToggle');
btn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

const saved = localStorage.getItem('theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);