/* =====================================================
   MAIN JAVASCRIPT - ANIMATIONS & INTERACTIONS
   ===================================================== */

// Navbar Scroll Effect
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = 0;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger
            const spans = mobileMenuBtn.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(10px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-10px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu on link click
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = mobileMenuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // Active link highlighting
    const updateActiveLink = () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    updateActiveLink();
});

// Smooth Scroll Animations with Intersection Observer
const animateElementsOnScroll = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    document.querySelectorAll('.card, .package-card, .portfolio-item, .team-member, .value-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
};

// Stagger animation for multiple elements
const staggerAnimation = (container, delay = 100) => {
    const children = container.querySelectorAll('> *');
    children.forEach((child, index) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.animation = `slideUp 0.8s ease-out ${(index * delay) / 1000}s forwards`;
    });
};

// Number Counter Animation
const animateNumbers = () => {
    const counters = document.querySelectorAll('.stat-number');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent) || 0;
        const increment = target / 60;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + (target > 100 ? '+' : '');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + (target > 100 ? '+' : '');
            }
        }, 30);
    });
};

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on scroll
    animateElementsOnScroll();

    // Start number animations when stats section is in view
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }
});


// =====================================================
// CONTACT FORM - Using FormSubmit.co (No backend needed)
// =====================================================

const initializeForm = () => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    // Simple form validation before submission
    form.addEventListener('submit', (e) => {
        const name = form.querySelector('input[name="name"]');
        const email = form.querySelector('input[name="email"]');
        const message = form.querySelector('textarea[name="message"]');

        // Basic validation
        if (!name || !name.value || name.value.trim().length < 2) {
            e.preventDefault();
            alert('Please enter your name (at least 2 characters).');
            return;
        }

        // Email validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailRegex.test(email.value.trim())) {
            e.preventDefault();
            alert('Please enter a valid email address.');
            return;
        }

        // Message validation
        if (!message || !message.value || message.value.trim().length < 10) {
            e.preventDefault();
            alert('Please enter a message (at least 10 characters).');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';

        console.log('Submitting form to FormSubmit.co...');
    });
};

document.addEventListener('DOMContentLoaded', initializeForm);

// Parallax scroll effect for hero section
const initParallax = () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const parallaxElements = hero.querySelectorAll('[data-parallax]');

        parallaxElements.forEach(el => {
            const speed = el.dataset.parallax || 0.5;
            el.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    });
};

document.addEventListener('DOMContentLoaded', initParallax);

// Scroll to top button functionality
const initScrollToTop = () => {
    const scrollBtn = document.querySelector('.scroll-to-top');
    if (!scrollBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.pointerEvents = 'auto';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.pointerEvents = 'none';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

document.addEventListener('DOMContentLoaded', initScrollToTop);

// Button ripple effect
const initRippleEffect = () => {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');

            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
};

document.addEventListener('DOMContentLoaded', initRippleEffect);

// Add ripple animation CSS dynamically
const addRippleStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
    .btn {
      position: relative;
      overflow: hidden;
    }
    
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.5);
      transform: scale(0);
      animation: rippleAnimation 0.6s ease-out;
      pointer-events: none;
    }
    
    @keyframes rippleAnimation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
    document.head.appendChild(style);
};

document.addEventListener('DOMContentLoaded', addRippleStyles);

// Dark mode preference (optional)
const initDarkMode = () => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
        document.documentElement.style.colorScheme = 'dark';
    }
};

document.addEventListener('DOMContentLoaded', initDarkMode);

// Lazy load images
const initLazyLoading = () => {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

document.addEventListener('DOMContentLoaded', initLazyLoading);

// Portfolio filter functionality
const initPortfolioFilter = () => {
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Update active button - remove btn-secondary and add btn-primary
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'btn-primary');
                btn.classList.add('btn-secondary');
            });
            button.classList.remove('btn-secondary');
            button.classList.add('active', 'btn-primary');

            // Filter portfolio items
            portfolioItems.forEach(item => {
                const category = item.dataset.category;
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioFilter);
} else {
    initPortfolioFilter();
}

// Add touch support for mobile
const initTouchSupport = () => {
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swiped left
        }
        if (touchEndX > touchStartX + 50) {
            // Swiped right
        }
    }
};

document.addEventListener('DOMContentLoaded', initTouchSupport);

// Performance optimization - debounce scroll events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimize scroll performance
let scrollHandler = debounce(() => {
    animateElementsOnScroll();
}, 150);

window.addEventListener('scroll', scrollHandler);

console.log('✓ Agency Website - Main JS Loaded Successfully');
