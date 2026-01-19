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

// Form Validation and Submission
// Generate CSRF Token
const generateCSRFToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
};

// Input Sanitization
// Enhanced Input Sanitization with XSS and Injection Protection
const sanitizeInput = (input) => {
    if (!input) return '';

    // Create a temporary div for HTML escaping
    const div = document.createElement('div');
    div.textContent = input;
    let sanitized = div.innerHTML;

    // Additional XSS protection - remove any script-like content
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, ''); // Remove event handlers like onclick=

    // SQL Injection protection - escape common SQL characters
    sanitized = sanitized.replace(/['";\\]/g, '\\$&');
    sanitized = sanitized.replace(/--/g, '');
    sanitized = sanitized.replace(/\/\*/g, '');
    sanitized = sanitized.replace(/\*\//g, '');

    // Remove any null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Trim whitespace
    return sanitized.trim();
};

// =====================================================
// CONTACT FORM API CONFIGURATION
// =====================================================
// Replace this URL with your CloudFlare Worker URL after deployment
// Example: 'https://supernova-contact-form.your-subdomain.workers.dev'
const CONTACT_API_URL = 'https://supernova-contact-form.misbahu094.workers.dev';
// =====================================================

// Rate Limiting - Check if user can submit
const checkRateLimit = () => {
    const lastSubmit = localStorage.getItem('lastFormSubmit');
    const now = Date.now();
    const cooldownPeriod = 60000; // 1 minute cooldown

    if (lastSubmit && (now - parseInt(lastSubmit)) < cooldownPeriod) {
        const remainingTime = Math.ceil((cooldownPeriod - (now - parseInt(lastSubmit))) / 1000);
        return { allowed: false, remainingTime };
    }
    return { allowed: true };
};

const initializeForm = () => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('.btn');
    const originalBtnText = 'Send Message';
    const originalBtnStyle = submitBtn.style.cssText;

    // Check if there's an active cooldown on page load
    const checkAndStartCooldown = () => {
        const rateLimitCheck = checkRateLimit();
        if (!rateLimitCheck.allowed) {
            startCooldownTimer(submitBtn, rateLimitCheck.remainingTime);
        }
    };

    // Start cooldown timer on button
    const startCooldownTimer = (btn, seconds) => {
        btn.disabled = true;
        btn.style.background = '#4a5568';
        btn.style.cursor = 'not-allowed';
        btn.style.opacity = '0.6';

        let remaining = seconds;
        btn.textContent = `Wait ${remaining}s...`;

        const countdownInterval = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
                clearInterval(countdownInterval);
                btn.disabled = false;
                btn.textContent = originalBtnText;
                btn.style.cssText = originalBtnStyle;
            } else {
                btn.textContent = `Wait ${remaining}s...`;
            }
        }, 1000);
    };

    // Check on page load
    checkAndStartCooldown();

    // Generate and set CSRF token on page load
    const csrfInput = form.querySelector('#csrf_token');
    if (csrfInput) {
        csrfInput.value = generateCSRFToken();
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check rate limiting
        const rateLimitCheck = checkRateLimit();
        if (!rateLimitCheck.allowed) {
            console.warn(`⏱️ Rate limit: Please wait ${rateLimitCheck.remainingTime} seconds before submitting again.`);
            startCooldownTimer(submitBtn, rateLimitCheck.remainingTime);
            return;
        }

        // Honeypot validation - if filled, it's likely a bot
        const honeypot = form.querySelector('input[name="website"]')?.value;
        if (honeypot) {
            console.warn('🛡️ Security: Honeypot triggered - submission blocked');
            return;
        }

        // Get and sanitize form data
        const rawFormData = {
            name: form.querySelector('input[name="name"]')?.value || '',
            email: form.querySelector('input[name="email"]')?.value || '',
            subject: form.querySelector('input[name="subject"]')?.value || '',
            service: form.querySelector('select[name="service"]')?.value || '',
            message: form.querySelector('textarea[name="message"]')?.value || '',
            csrf_token: form.querySelector('#csrf_token')?.value || ''
        };

        // Sanitize all inputs
        const formData = {
            name: sanitizeInput(rawFormData.name),
            email: sanitizeInput(rawFormData.email),
            subject: sanitizeInput(rawFormData.subject),
            service: sanitizeInput(rawFormData.service),
            message: sanitizeInput(rawFormData.message),
            csrf_token: rawFormData.csrf_token
        };

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            console.error('❌ Validation failed: Please fill in all required fields');
            alert('Please fill in all required fields.');
            return;
        }

        // Advanced email validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            console.error('❌ Validation failed: Invalid email address format');
            alert('Please enter a valid email address.');
            return;
        }

        // Name validation - no special characters or numbers
        const nameRegex = /^[a-zA-Z\s]{2,100}$/;
        if (!nameRegex.test(formData.name)) {
            console.error('❌ Validation failed: Name should only contain letters and spaces');
            alert('Name should only contain letters and spaces.');
            return;
        }

        // Message length validation
        if (formData.message.length < 10 || formData.message.length > 2000) {
            console.error('❌ Validation failed: Message must be between 10 and 2000 characters');
            alert('Message must be between 10 and 2000 characters.');
            return;
        }

        // CSRF token validation (check if exists)
        if (!formData.csrf_token || formData.csrf_token.length !== 64) {
            console.error('❌ Security validation failed: Invalid CSRF token');
            alert('Security validation failed. Please refresh the page and try again.');
            return;
        }

        // Update rate limit timestamp
        localStorage.setItem('lastFormSubmit', Date.now().toString());

        // Log form submission to console (for debugging)
        console.log('\n📧 SENDING CONTACT FORM...');
        console.log('=================================');
        console.log('Name:', formData.name);
        console.log('Email:', formData.email);
        console.log('Subject:', formData.subject);
        console.log('Service:', formData.service);
        console.log('=================================');

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';

        // Check if API URL is configured
        if (CONTACT_API_URL === 'YOUR_CLOUDFLARE_WORKER_URL_HERE') {
            // Development mode - just log to console
            console.log('\n⚠️ DEVELOPMENT MODE - API not configured');
            console.log('📝 Form data logged above. To send real emails:');
            console.log('1. Deploy CloudFlare Worker (see cloudflare-worker/SETUP_GUIDE.md)');
            console.log('2. Update CONTACT_API_URL in main.js');

            // Show success for testing purposes
            setTimeout(() => {
                submitBtn.textContent = 'Message Logged ✓';
                submitBtn.style.background = 'var(--gradient-2)';
                submitBtn.style.opacity = '1';

                alert('📧 Development Mode\n\nForm data logged to console (Press F12 to view).\n\nTo send real emails, configure CloudFlare Worker.\nSee: cloudflare-worker/SETUP_GUIDE.md');

                form.reset();
                if (csrfInput) {
                    csrfInput.value = generateCSRFToken();
                }

                setTimeout(() => {
                    startCooldownTimer(submitBtn, 60);
                }, 2000);
            }, 1000);
            return;
        }

        // Production mode - send to CloudFlare Worker API
        try {
            const response = await fetch(CONTACT_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    service: formData.service,
                    message: formData.message
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success!
                console.log('✅ Message sent successfully!');

                submitBtn.textContent = 'Message Sent! ✓';
                submitBtn.style.background = 'var(--gradient-2)';
                submitBtn.style.opacity = '1';

                alert('✅ Thank you!\n\nYour message has been sent successfully.\nWe\'ll get back to you within 24 hours.');

                // Reset form
                form.reset();

                // Regenerate CSRF token
                if (csrfInput) {
                    csrfInput.value = generateCSRFToken();
                }

                // Start cooldown after success message
                setTimeout(() => {
                    startCooldownTimer(submitBtn, 60);
                }, 2000);

            } else {
                // API returned an error
                throw new Error(result.error || 'Failed to send message');
            }

        } catch (error) {
            console.error('❌ Error sending message:', error);

            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.cssText = originalBtnStyle;

            // Show error to user
            alert('❌ Sorry, there was an error sending your message.\n\nPlease try again or email us directly at hello@supernova.agency');

            // Don't start cooldown on error - let them retry immediately
        }
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
