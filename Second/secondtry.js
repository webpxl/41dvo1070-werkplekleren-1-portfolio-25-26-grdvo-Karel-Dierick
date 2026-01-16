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

// Explanation: Add hamburger toggle logic: toggles body.nav-open and updates aria-expanded on the hamburger button.
(function(){
    const hamburger = document.getElementById('hamburger');
    if (!hamburger) return;
    hamburger.addEventListener('click', ()=>{
        const isOpen = document.body.classList.toggle('nav-open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });
})();

// Twinkling stars: randomly dim and restore some stars to create a subtle twinkle effect
// Explanation: Increase the twinkle selection so each cycle will twinkle a random unique subset between half the stars and all of them. Use a Fisher–Yates shuffle to pick unique stars.
(function(){
    const starContainer = document.getElementById('stars');
    if (!starContainer) return;

    // collect stars and remember their base opacity
    const stars = Array.from(starContainer.querySelectorAll('.star'));
    if (!stars.length) return;

    stars.forEach(s => {
        // normalize initial opacity to a value between 0.1 and 0.9
        s.dataset.baseOpacity = parseFloat(getComputedStyle(s).opacity) || 0.5;
    });

    function randomRange(min, max){ return Math.random() * (max - min) + min; }

    function twinkleOnce(){
        // choose how many stars to twinkle this cycle: between half and all
        const minCount = Math.max(1, Math.floor(stars.length / 2));
        const maxCount = stars.length;
        const count = Math.floor(randomRange(minCount, maxCount + 1));

        // pick 'count' unique random stars via Fisher–Yates on indices
        const indices = stars.map((_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = indices[i]; indices[i] = indices[j]; indices[j] = tmp;
        }

        for (let k = 0; k < count; k++) {
            const s = stars[indices[k]];
            if(!s) continue;
            // skip if currently dimmed
            if (s.dataset.twinkling === '1') continue;
            s.dataset.twinkling = '1';

            const base = parseFloat(s.dataset.baseOpacity) || 0.5;
            // target dim opacity (small random dimming)
            const dim = randomRange(Math.max(0.02, base * 0.02), Math.max(0.05, base * 0.4));
            const hold = randomRange(150, 900); // ms to keep dim (slightly quicker for many stars)

            // apply dim
            s.style.opacity = String(dim);

            // restore after hold + small random fade-in delay
            setTimeout(()=>{
                s.style.opacity = String(base);
                // clear twinkle flag after transition time
                setTimeout(()=>{ s.dataset.twinkling = '0'; }, 950);
            }, hold);
        }
    }

    // schedule periodic twinkles with some jitter
    let twinkleInterval = setInterval(twinkleOnce, 700);

    // make interval adapt to visibility and resize
    function updateInterval(){
        clearInterval(twinkleInterval);
        // slower on small screens
        const interval = window.innerWidth < 600 ? 900 : 700;
        twinkleInterval = setInterval(twinkleOnce, interval);
    }

    window.addEventListener('resize', updateInterval);
    document.addEventListener('visibilitychange', ()=>{
        if (document.hidden) clearInterval(twinkleInterval);
        else updateInterval();
    });

    // initial
    updateInterval();
})();
