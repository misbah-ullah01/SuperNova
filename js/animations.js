/* =====================================================
   PREMIUM ANIMATIONS - GSAP-STYLE EFFECTS
   Advanced Page Transitions, Scroll Animations & Micro-interactions
   ===================================================== */

// ============================================
// ANIMATION UTILITIES
// ============================================

// Easing functions for smooth animations
const Easing = {
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
    easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutElastic: (t) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    },
    easeOutBack: (t) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
};

// Custom animation function (GSAP-like)
const animate = (element, properties, duration = 600, easing = 'easeOutCubic', delay = 0) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const startTime = performance.now();
            const startValues = {};
            const endValues = {};

            // Parse properties
            for (const prop in properties) {
                if (prop === 'opacity') {
                    startValues[prop] = parseFloat(getComputedStyle(element).opacity) || 0;
                    endValues[prop] = properties[prop];
                } else if (prop === 'transform') {
                    startValues[prop] = element.style.transform || 'translateY(0) scale(1) rotate(0deg)';
                    endValues[prop] = properties[prop];
                } else if (prop === 'y') {
                    startValues.translateY = parseFloat(element.dataset.startY) || 50;
                    endValues.translateY = properties[prop];
                } else if (prop === 'x') {
                    startValues.translateX = parseFloat(element.dataset.startX) || 0;
                    endValues.translateX = properties[prop];
                } else if (prop === 'scale') {
                    startValues.scale = parseFloat(element.dataset.startScale) || 0.95;
                    endValues.scale = properties[prop];
                } else if (prop === 'rotation') {
                    startValues.rotation = parseFloat(element.dataset.startRotation) || 0;
                    endValues.rotation = properties[prop];
                }
            }

            const tick = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = Easing[easing](progress);

                // Apply opacity
                if ('opacity' in startValues) {
                    element.style.opacity = startValues.opacity + (endValues.opacity - startValues.opacity) * easedProgress;
                }

                // Build transform string
                let transform = '';
                if ('translateY' in startValues) {
                    const y = startValues.translateY + (endValues.translateY - startValues.translateY) * easedProgress;
                    transform += `translateY(${y}px) `;
                }
                if ('translateX' in startValues) {
                    const x = startValues.translateX + (endValues.translateX - startValues.translateX) * easedProgress;
                    transform += `translateX(${x}px) `;
                }
                if ('scale' in startValues) {
                    const s = startValues.scale + (endValues.scale - startValues.scale) * easedProgress;
                    transform += `scale(${s}) `;
                }
                if ('rotation' in startValues) {
                    const r = startValues.rotation + (endValues.rotation - startValues.rotation) * easedProgress;
                    transform += `rotate(${r}deg) `;
                }

                if (transform) {
                    element.style.transform = transform.trim();
                }

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    resolve();
                }
            };

            requestAnimationFrame(tick);
        }, delay);
    });
};

// ============================================
// PAGE TRANSITION SYSTEM (Barba.js-style)
// ============================================

class PageTransition {
    constructor() {
        this.isAnimating = false;
        this.overlay = null;
        this.init();
    }

    init() {
        // Create transition overlay
        this.createOverlay();

        // Intercept all internal links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && this.isInternalLink(link)) {
                e.preventDefault();
                this.navigateTo(link.href);
            }
        });

        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.loadPage(window.location.href, false);
        });

        // Animate current page on load
        this.animatePageIn();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'page-transition-overlay';
        this.overlay.innerHTML = `
            <div class="transition-content">
                <div class="transition-logo">SYNAPSE</div>
                <div class="transition-loader">
                    <div class="loader-bar"></div>
                </div>
            </div>
        `;
        document.body.appendChild(this.overlay);
    }

    isInternalLink(link) {
        return link.hostname === window.location.hostname &&
            link.href.endsWith('.html') &&
            !link.hasAttribute('data-no-transition');
    }

    async navigateTo(url) {
        if (this.isAnimating || url === window.location.href) return;

        this.isAnimating = true;

        // Animate out
        await this.animatePageOut();

        // Load new page
        await this.loadPage(url, true);

        this.isAnimating = false;
    }

    async animatePageOut() {
        // Fade out current content
        const main = document.querySelector('main') || document.body;
        main.style.transition = 'opacity 0.3s ease-out';
        main.style.opacity = '0';

        // Show overlay
        this.overlay.classList.add('active');

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    async animatePageIn() {
        // Hide overlay
        this.overlay.classList.remove('active');

        // Wait for overlay to hide
        await new Promise(resolve => setTimeout(resolve, 100));

        // Animate hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const children = heroContent.children;
            Array.from(children).forEach((child, index) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(30px)';
                child.dataset.startY = '30';

                setTimeout(() => {
                    animate(child, { opacity: 1, y: 0 }, 800, 'easeOutCubic');
                }, 100 + index * 100);
            });
        }

        // Animate navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.opacity = '0';
            navbar.style.transform = 'translateY(-20px)';
            navbar.dataset.startY = '-20';
            animate(navbar, { opacity: 1, y: 0 }, 600, 'easeOutCubic');
        }

        // Initialize scroll animations
        initScrollAnimations();
    }

    async loadPage(url, pushState = true) {
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Update content
            document.body.innerHTML = doc.body.innerHTML;
            document.title = doc.title;

            // Recreate overlay
            this.createOverlay();

            // Update history
            if (pushState) {
                history.pushState(null, '', url);
            }

            // Reinitialize all scripts
            this.reinitialize();

            // Animate in
            await this.animatePageIn();

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'instant' });

        } catch (error) {
            console.error('Page transition error:', error);
            window.location.href = url;
        }
    }

    reinitialize() {
        // Reinitialize all event listeners and animations
        if (typeof initializeForm === 'function') initializeForm();
        if (typeof initPortfolioFilter === 'function') initPortfolioFilter();
        initScrollAnimations();
        initHoverEffects();
        initTypingEffect();
        initParticleBackground();
        initMagneticButtons();
        initCursorEffects();
    }
}

// ============================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================

const initScrollAnimations = () => {
    // Elements to animate
    const animateElements = document.querySelectorAll(`
        .card, .package-card, .portfolio-item, .team-member, 
        .value-card, .stat, .section-title, .about-intro-text,
        .contact-method, .grid-2 > *, .grid-3 > *, .grid-4 > *
    `);

    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.dataset.animDelay) || (index * 50);

                el.dataset.startY = '40';
                el.dataset.startScale = '0.95';
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px) scale(0.95)';

                setTimeout(() => {
                    animate(el, { opacity: 1, y: 0, scale: 1 }, 700, 'easeOutCubic');
                }, delay);

                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.dataset.animDelay = index * 80;
        observer.observe(el);
    });

    // Parallax effect for hero backgrounds
    initParallaxEffect();
};

// ============================================
// PARALLAX SCROLLING
// ============================================

const initParallaxEffect = () => {
    const parallaxElements = document.querySelectorAll('.animated-bg, [data-parallax]');

    if (parallaxElements.length === 0) return;

    let ticking = false;

    const updateParallax = () => {
        const scrollY = window.scrollY;

        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            const yPos = -(scrollY * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
};

// ============================================
// HOVER EFFECTS & MICRO-INTERACTIONS
// ============================================

const initHoverEffects = () => {
    // Card hover effect (removed 3D tilt - looks bad on large cards)
    const cards = document.querySelectorAll('.card, .package-card, .portfolio-item');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
        });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';

            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Link underline animation
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const underline = document.createElement('span');
        underline.className = 'link-underline';
        link.appendChild(underline);
    });
};

// ============================================
// MAGNETIC BUTTONS
// ============================================

const initMagneticButtons = () => {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
};

// ============================================
// TYPING EFFECT FOR HERO
// ============================================

const initTypingEffect = () => {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle || heroTitle.dataset.typed) return;

    heroTitle.dataset.typed = 'true';
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.opacity = '1';

    let charIndex = 0;
    const typingSpeed = 30;

    const typeChar = () => {
        if (charIndex < text.length) {
            heroTitle.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(typeChar, typingSpeed);
        }
    };

    setTimeout(typeChar, 500);
};

// ============================================
// ANIMATED PARTICLE BACKGROUND
// ============================================

const initParticleBackground = () => {
    const animatedBg = document.querySelector('.animated-bg');
    if (!animatedBg || animatedBg.querySelector('.particles')) return;

    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';

    // Create floating particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particleContainer.appendChild(particle);
    }

    animatedBg.appendChild(particleContainer);
};

// ============================================
// CUSTOM CURSOR EFFECTS
// ============================================

const initCursorEffects = () => {
    // Only on desktop
    if (window.matchMedia('(pointer: coarse)').matches) return;

    // Check if cursor already exists
    if (document.querySelector('.custom-cursor')) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';

    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    const animateCursor = () => {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        requestAnimationFrame(animateCursor);
    };

    animateCursor();

    // Scale cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .card, .portfolio-item');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
};

// ============================================
// NUMBER COUNTER WITH SCROLL TRIGGER
// ============================================

const initNumberCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const text = counter.textContent;
                const hasPlus = text.includes('+');
                const hasM = text.includes('M');
                const hasK = text.includes('K');

                let target = parseFloat(text.replace(/[^\d.]/g, ''));

                if (hasM) target = target;
                else if (hasK) target = target;

                let current = 0;
                const increment = target / 50;
                const duration = 2000;
                const stepTime = duration / 50;

                const updateCounter = () => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + (hasM ? 'M' : hasK ? 'K' : '') + (hasPlus ? '+' : '');
                    } else {
                        counter.textContent = Math.floor(current * 10) / 10 + (hasM ? 'M' : hasK ? 'K' : '') + (hasPlus ? '+' : '');
                        setTimeout(updateCounter, stepTime);
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
};

// ============================================
// SMOOTH SCROLL LINKS
// ============================================

const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// ============================================
// LOADING SCREEN
// ============================================

const initLoadingScreen = () => {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-logo">SYNAPSE</div>
            <div class="loader-progress">
                <div class="loader-progress-bar"></div>
            </div>
        </div>
    `;
    document.body.appendChild(loader);

    // Simulate loading
    let progress = 0;
    const progressBar = loader.querySelector('.loader-progress-bar');

    const updateProgress = () => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';

        if (progress < 100) {
            setTimeout(updateProgress, 100);
        } else {
            setTimeout(() => {
                loader.classList.add('loaded');
                setTimeout(() => loader.remove(), 500);
            }, 200);
        }
    };

    updateProgress();
};

// ============================================
// INITIALIZE ALL ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen
    // initLoadingScreen(); // Uncomment for loading screen

    // Initialize page transitions
    // const pageTransition = new PageTransition(); // Uncomment for page transitions

    // Initialize all animations
    setTimeout(() => {
        initScrollAnimations();
        initHoverEffects();
        initMagneticButtons();
        initParticleBackground();
        initCursorEffects();
        initNumberCounters();
        initSmoothScroll();

        // Animate hero on load
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const children = heroContent.children;
            Array.from(children).forEach((child, index) => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(30px)';
                child.dataset.startY = '30';

                setTimeout(() => {
                    animate(child, { opacity: 1, y: 0 }, 800, 'easeOutCubic');
                }, 200 + index * 150);
            });
        }
    }, 100);
});

// Export for external use
window.SynapseAnimations = {
    animate,
    Easing,
    initScrollAnimations,
    initHoverEffects,
    initMagneticButtons,
    initParticleBackground
};

console.log('✨ Synapse Premium Animations Loaded');
