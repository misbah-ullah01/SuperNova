/* =====================================================
   SUPERNOVA - COSMIC HERO ANIMATIONS
   Dynamic Star Field, Typing Effect & Visual Effects
   ===================================================== */

// ============================================
// COSMIC STAR FIELD GENERATOR
// ============================================

class CosmicStarField {
    constructor(container) {
        this.container = container;
        this.stars = [];
        this.shootingStars = [];
        this.init();
    }

    init() {
        this.createStars(150); // Regular stars
        this.createShootingStars(5); // Shooting stars
        this.startShootingStarCycle();
    }

    createStars(count) {
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';

            // Random size class
            const sizeClass = Math.random() < 0.6 ? 'small' : (Math.random() < 0.8 ? 'medium' : 'large');
            star.classList.add(sizeClass);

            // Random position
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';

            // Random animation properties
            star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
            star.style.setProperty('--delay', Math.random() * 5 + 's');

            this.container.appendChild(star);
            this.stars.push(star);
        }
    }

    createShootingStars(count) {
        for (let i = 0; i < count; i++) {
            const shootingStar = document.createElement('div');
            shootingStar.className = 'shooting-star';

            // Random starting position (top area)
            shootingStar.style.left = Math.random() * 70 + '%';
            shootingStar.style.top = Math.random() * 30 + '%';

            // Random timing
            shootingStar.style.setProperty('--shoot-duration', (Math.random() * 2 + 3) + 's');
            shootingStar.style.setProperty('--shoot-delay', (Math.random() * 10 + 5) + 's');

            this.container.appendChild(shootingStar);
            this.shootingStars.push(shootingStar);
        }
    }

    startShootingStarCycle() {
        // Randomly trigger shooting stars
        setInterval(() => {
            const star = this.shootingStars[Math.floor(Math.random() * this.shootingStars.length)];
            if (star) {
                star.style.left = Math.random() * 70 + '%';
                star.style.top = Math.random() * 30 + '%';
            }
        }, 8000);
    }
}

// ============================================
// PARTICLE CANVAS ANIMATION (Three.js-like)
// ============================================

class CosmicParticleCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles(100);
        this.setupEventListeners();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor()
            });
        }
    }

    getRandomColor() {
        const colors = [
            'rgba(34, 211, 238, ',  // Cyan
            'rgba(59, 130, 246, ',  // Blue
            'rgba(96, 165, 250, ',  // Light blue
            'rgba(255, 255, 255, '  // White
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles(100);
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Mouse interaction
            if (this.mouse.x !== null) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    particle.x += dx * force * 0.03;
                    particle.y += dy * force * 0.03;
                }
            }

            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + particle.opacity + ')';
            this.ctx.fill();

            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// TYPING EFFECT FOR SUPERNOVA TITLE
// ============================================

class TypingEffect {
    constructor(element, text, options = {}) {
        this.element = element;
        this.text = text;
        this.speed = options.speed || 100;
        this.delay = options.delay || 500;
        this.showCursor = options.showCursor !== false;
        this.onComplete = options.onComplete || (() => { });

        this.currentIndex = 0;
        this.cursor = null;
    }

    start() {
        this.element.textContent = '';

        if (this.showCursor) {
            this.cursor = document.createElement('span');
            this.cursor.className = 'typing-cursor';
            this.element.appendChild(this.cursor);
        }

        setTimeout(() => {
            this.type();
        }, this.delay);
    }

    type() {
        if (this.currentIndex < this.text.length) {
            // Insert character before cursor
            if (this.cursor) {
                this.element.insertBefore(
                    document.createTextNode(this.text[this.currentIndex]),
                    this.cursor
                );
            } else {
                this.element.textContent += this.text[this.currentIndex];
            }

            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else {
            // Typing complete
            setTimeout(() => {
                if (this.cursor) {
                    this.cursor.remove();
                }
                this.onComplete();
            }, 500);
        }
    }
}

// ============================================
// FADE IN ANIMATION HELPER
// ============================================

class FadeInSequence {
    constructor(elements, options = {}) {
        this.elements = elements;
        this.delay = options.delay || 0;
        this.stagger = options.stagger || 300;
    }

    start() {
        this.elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate');
            }, this.delay + (index * this.stagger));
        });
    }
}

// ============================================
// SUPERNOVA HERO INITIALIZATION
// ============================================

const initSupernovaHero = () => {
    const heroSection = document.querySelector('.hero-cosmic');
    if (!heroSection) return;

    // Initialize star field
    const starsContainer = heroSection.querySelector('.stars-container');
    if (starsContainer) {
        new CosmicStarField(starsContainer);
    }

    // Initialize particle canvas
    const particleCanvas = new CosmicParticleCanvas('cosmic-canvas');

    // Initialize typing effect for title
    const titleElement = heroSection.querySelector('.supernova-title');
    if (titleElement) {
        const titleText = titleElement.dataset.text || 'SuperNova';
        titleElement.textContent = '';

        const typing = new TypingEffect(titleElement, titleText, {
            speed: 120,
            delay: 800,
            showCursor: true,
            onComplete: () => {
                // Trigger slogan and underline animations
                triggerSequentialAnimations();
            }
        });

        typing.start();
    }

    // Trigger animations after typing completes
    function triggerSequentialAnimations() {
        const slogan = heroSection.querySelector('.supernova-slogan');
        const underline = heroSection.querySelector('.animated-underline');
        const dot = heroSection.querySelector('.animated-dot');
        const subtitle = heroSection.querySelector('.hero-cosmic-subtitle');
        const buttons = heroSection.querySelector('.hero-cosmic-buttons');

        if (slogan) {
            setTimeout(() => slogan.classList.add('animate'), 200);
        }
        if (underline) {
            setTimeout(() => underline.classList.add('animate'), 600);
        }
        if (dot) {
            setTimeout(() => dot.classList.add('animate'), 600);
        }
        if (subtitle) {
            setTimeout(() => subtitle.classList.add('animate'), 1000);
        }
        if (buttons) {
            setTimeout(() => buttons.classList.add('animate'), 1200);
        }
    }

    // Parallax effect for orbs
    initCosmicParallax(heroSection);
};

// ============================================
// COSMIC PARALLAX EFFECT
// ============================================

const initCosmicParallax = (container) => {
    const orbs = container.querySelectorAll('.cosmic-orb');

    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 10;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
};

// ============================================
// SMOOTH NAVBAR SCROLL EFFECT
// ============================================

const initSupernovaNavbar = () => {
    const navbar = document.querySelector('.navbar-supernova, .navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
};

// ============================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================

const initScrollReveal = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        observer.observe(el);
    });
};

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

const initSmoothScrollLinks = () => {
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
// GLOW EFFECT ON MOUSE MOVE
// ============================================

const initGlowEffect = () => {
    const hero = document.querySelector('.hero-cosmic');
    if (!hero) return;

    const glowElement = document.createElement('div');
    glowElement.className = 'mouse-glow';
    glowElement.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%);
        pointer-events: none;
        z-index: 5;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    hero.appendChild(glowElement);

    hero.addEventListener('mousemove', (e) => {
        glowElement.style.left = e.clientX + 'px';
        glowElement.style.top = e.clientY + 'px';
        glowElement.style.opacity = '1';
    });

    hero.addEventListener('mouseleave', () => {
        glowElement.style.opacity = '0';
    });
};

// ============================================
// INITIALIZE ALL SUPERNOVA EFFECTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize hero section
    initSupernovaHero();

    // Initialize navbar
    initSupernovaNavbar();

    // Initialize scroll reveal
    initScrollReveal();

    // Initialize smooth scroll
    initSmoothScrollLinks();

    // Initialize glow effect
    initGlowEffect();

    console.log('🌟 SuperNova Cosmic Effects Loaded');
});

// Export for external use
window.SuperNovaEffects = {
    CosmicStarField,
    CosmicParticleCanvas,
    TypingEffect,
    initSupernovaHero
};
