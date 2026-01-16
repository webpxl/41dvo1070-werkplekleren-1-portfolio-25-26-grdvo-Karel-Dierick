// Generate Stars
const starContainer = document.getElementById('stars');
const starCount = 150;

for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    // Random size
    const size = Math.random() * 2 + 0.5;

    // Random color (white, slight blue, slight coral)
    const colors = ['#ffffff', '#656FBB', '#EE7263'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.backgroundColor = color;
    star.style.opacity = Math.random() * 0.9 + 0.1;

    starContainer.appendChild(star);
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll-to-top rocket button behavior (enhanced: nav height, footer observer, responsive)
(function(){
    const btn = document.getElementById('scrollTopBtn');
    const hero = document.getElementById('home');
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('.footer');
    if (!btn || !hero || !navbar) return;

    // set CSS variable for nav height so body padding-top matches
    function updateNavHeight(){
        const h = navbar.getBoundingClientRect().height || 80;
        document.documentElement.style.setProperty('--nav-height', `${h}px`);
    }

    // show/hide button when scrolled past hero
    function onScroll(){
        const heroBottom = hero.getBoundingClientRect().bottom;
        if (heroBottom <= 0) btn.classList.add('visible');
        else btn.classList.remove('visible');
    }

    // observe footer intersection to lift button above footer
    let footerObserver = null;
    if (footer) {
        footerObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) btn.classList.add('above-footer');
                else btn.classList.remove('above-footer');
            });
        }, { root: null, threshold: 0 });
        footerObserver.observe(footer);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        updateNavHeight();
        onScroll();
    });

    btn.addEventListener('click', ()=>{
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // initial check
    onScroll();
})();
