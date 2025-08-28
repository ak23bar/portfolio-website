
// Matrix Rain Effect
function createMatrixRain() {
    const matrixRain = document.getElementById('matrixRain');
    const characters = '01アカサタナハマヤラワABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789αβγδεζηθικλμνξοπρστυφχψω∞∑∫√∂∇≈≠≤≥±÷×→←↑↓∈∉∩∪∅∀∃';

    for (let i = 0; i < 30; i++) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDuration = (Math.random() * 8 + 15) + 's';
        column.style.animationDelay = Math.random() * 5 + 's';

        let columnText = '';
        for (let j = 0; j < 15; j++) {
            const char = characters[Math.floor(Math.random() * characters.length)];
            columnText += `<span class="matrix-char">${char}</span>`;
        }
        column.innerHTML = columnText;
        matrixRain.appendChild(column);
    }
}

// Matrix rain for loading screen
// Matrix rain for loading screen
function createLoadingMatrixRain() {
    // Matrix rain background for loading screen, starts instantly
    const loadingMatrixRain = document.getElementById('loading-matrix-rain');
    if (!loadingMatrixRain) return;
    loadingMatrixRain.innerHTML = '';
    const chars = '01アカバルアマンコンピュータエンジニアリングαβγδεζηθικλμνξοπρστυφχψωΔΣΩπλμθ∞∑∫√∂∇≈≠≤≥±÷×→←↑↓∈∉∩∪∅∀∃ℝℤℕℚℂ';
    const columns = Math.floor(window.innerWidth / 25);
    for (let c = 0; c < columns; c++) {
        const col = document.createElement('div');
        col.style.cssText = `
            position: absolute;
            left: ${c * 25}px;
            top: -100px;
            width: 25px;
            height: calc(100vh + 200px);
            font-family: 'Share Tech Mono', monospace;
            font-size: 14px;
            color: #00ff41;
            text-shadow: 0 0 5px #00ff41;
            animation: matrix-fall ${4 + Math.random() * 3}s linear infinite;
            animation-delay: ${Math.random() * 1.5}s;
            overflow: hidden;
            opacity: ${0.5 + Math.random() * 0.3};
            will-change: transform;
        `;
        let rain = '';
        const numChars = Math.ceil((window.innerHeight + 200) / 18);
        for (let r = 0; r < numChars; r++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            rain += char + '<br>';
        }
        col.innerHTML = rain;
        loadingMatrixRain.appendChild(col);
    }
}

// Scroll Progress
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = scrolled + '%';
}

// Section visibility animation
function checkSectionVisibility() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
            section.classList.add('visible');
        }
    });
}

// Utility functions
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function downloadResume() {
    window.open('assets/files/Akbar_Resume.pdf', '_blank');
    return 'Opening resume PDF...';
}

function toggleMobileNav() {
    const mobileNav = document.getElementById('mobileNav');
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
        mobileNav.classList.remove('open');
        document.body.classList.remove('noscroll');
    } else {
        mobileNav.classList.add('open');
        document.body.classList.add('noscroll');
    }
}

// Loading screen initialization
window.addEventListener('DOMContentLoaded', function() {
    createLoadingMatrixRain();
    window.addEventListener('resize', createLoadingMatrixRain);
});

window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    const lines = document.querySelectorAll('.loading-line');
    const matrixEnter = document.querySelector('.loading-matrix-enter');
    
    // Animate text after background is already streaming
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = 1;
        }, index * 300); // Reduced from 500ms to 300ms
    });
    
    setTimeout(() => {
        if (matrixEnter) matrixEnter.style.opacity = 1;
        setTimeout(() => {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
                document.body.style.overflow = '';
            }, 400); // Reduced from 600ms to 400ms
        }, 800); // Reduced from 1200ms to 800ms
    }, lines.length * 300 + 500); // Reduced delays accordingly

    // Fallback: Force hide loading screen after 3 seconds (reduced from 5)
    setTimeout(() => {
        if (loading && loading.style.display !== 'none') {
            loading.style.display = 'none';
            document.body.style.overflow = '';
        }
    }, 3000);

    // Ensure timeline items are clickable
    setTimeout(() => {
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => {
            item.style.pointerEvents = 'auto';
            item.style.zIndex = '10';
        });
    }, 1000);
});

// Event listeners
window.addEventListener('scroll', () => {
    updateScrollProgress();
    checkSectionVisibility();
    
    // Navbar scroll effect
    const navbar = document.querySelector('nav');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createMatrixRain();
    checkSectionVisibility();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape to close modals
        if (e.key === 'Escape') {
            document.getElementById('mobileNav').classList.remove('open');
            document.body.classList.remove('noscroll');
            // Close any open modals
            const openModals = document.querySelectorAll('.modal');
            openModals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                }
            });
        }
    });
});
