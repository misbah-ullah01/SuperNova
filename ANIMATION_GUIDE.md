/* =====================================================
   ANIMATION GUIDE - SYNAPSE WEBSITE
   ===================================================== */

/**
 * ANIMATION TYPES IMPLEMENTED
 */

/* 1. FADE-IN ON SCROLL
 * Elements fade in and slide up as they enter the viewport
 * Applied to: cards, packages, portfolio items, team members
 * Trigger: Intersection Observer at 10% visibility
 */
.card, .package-card, .portfolio-item, .team-member {
  animation: slideUp 0.8s ease-out;
}

/* 2. HOVER EFFECTS
 * Cards lift and glow when hovered
 * Smooth transform and shadow transitions
 */
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(37, 99, 235, 0.2);
}

/* 3. HERO ANIMATIONS
 * Staggered animations for hero elements
 */
.hero-subtitle {
  animation: slideDown 0.8s ease-out;
}

.hero-title {
  animation: slideUp 0.8s ease-out 0.1s both;
}

.hero-description {
  animation: slideUp 0.8s ease-out 0.2s both;
}

/* 4. NAVIGATION EFFECTS
 * Animated underline on hover/active links
 */
.nav-links a::after {
  transition: width var(--transition-smooth);
}

.nav-links a:hover::after {
  width: 100%;
}

/* 5. BUTTON EFFECTS
 * Smooth color transitions and gradient overlays
 */
.btn {
  transition: all var(--transition-smooth);
}

.btn::before {
  transition: left var(--transition-fast);
}

.btn:hover::before {
  left: 0;
}

/* 6. BACKGROUND ANIMATIONS
 * Subtle floating motion in hero section
 */
.animated-bg {
  animation: bgShift 15s ease-in-out infinite;
}

@keyframes bgShift {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, -30px);
  }
}

/* 7. NAVBAR SCROLL EFFECT
 * Navbar changes appearance on scroll
 * Uses JavaScript to add .scrolled class
 */
.navbar {
  transition: all var(--transition-fast);
}

.navbar.scrolled {
  background: rgba(3, 13, 26, 0.95);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

/* 8. PORTFOLIO HOVER EFFECTS
 * Content slides up from bottom on hover
 */
.portfolio-content {
  transform: translateY(30px);
  transition: transform var(--transition-smooth);
}

.portfolio-item:hover .portfolio-content {
  transform: translateY(0);
}

/* 9. FORM FOCUS EFFECTS
 * Input fields glow when focused
 */
.form-input:focus,
.form-textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--accent-sky);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.2);
}

/* 10. PAGE TRANSITIONS
 * Smooth fade-in when pages load
 */
.barba-container {
  animation: pageIn 0.5s ease-out;
}

@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/**
 * JAVASCRIPT ANIMATIONS
 */

/* 1. RIPPLE EFFECT ON BUTTONS
 * Click animation with expanding ripple
 * Implementation: JavaScript adds/removes ripple span
 */

/* 2. SCROLL ANIMATIONS
 * Number counters animate from 0 to target
 * Parallax effect on hero background
 * Staggered element reveals on scroll
 */

/* 3. MOBILE MENU ANIMATION
 * Hamburger menu transforms on click
 * Smooth slide-down of menu items
 */

/* 4. FORM VALIDATION
 * Visual feedback on submission
 */


/**
 * TIMING & EASING
 */

:root {
  /* Fast - 0.2s - Quick feedback for interactions */
  --transition-fast: 0.2s ease-out;
  
  /* Smooth - 0.4s - Smooth, bouncy feel */
  --transition-smooth: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Slow - 0.6s - Elegant, deliberate transitions */
  --transition-slow: 0.6s ease-in-out;
}


/**
 * ANIMATION OPTIMIZATION TIPS
 */

/*
 * 1. GPU ACCELERATION
 *    - Use transform and opacity for best performance
 *    - Avoid animating width/height frequently
 */

/*
 * 2. DEBOUNCING
 *    - Scroll events are debounced (150ms delay)
 *    - Prevents animation lag on slow devices
 */

/*
 * 3. WILL-CHANGE
 *    - Use sparingly for elements that animate
 *    - Helps browser optimize rendering
 */

/*
 * 4. INTERSECTION OBSERVER
 *    - Efficiently detects visible elements
 *    - Triggers animations only when needed
 */

/*
 * 5. MOBILE PERFORMANCE
 *    - Reduced animations on smaller screens
 *    - Touch-friendly timing
 */


/**
 * CUSTOM ANIMATION EXAMPLES
 */

/* To add more animations, follow this pattern: */

@keyframes customAnimation {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.element {
  animation: customAnimation 0.6s ease-out;
}


/**
 * STAGGERED ANIMATION PATTERN
 */

/* Apply to parent with children */
.parent {
  display: grid;
  gap: var(--spacing-lg);
}

.parent > :nth-child(1) {
  animation: slideUp 0.8s ease-out 0s;
}

.parent > :nth-child(2) {
  animation: slideUp 0.8s ease-out 0.1s;
}

.parent > :nth-child(3) {
  animation: slideUp 0.8s ease-out 0.2s;
}


/**
 * PREFERS-REDUCED-MOTION SUPPORT
 * For accessibility - respects user preferences
 */

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}


/**
 * EASTER EGGS & BONUS ANIMATIONS
 */

/* Scroll to top button animation */
.scroll-to-top {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scroll-to-top.show {
  opacity: 1;
}

/* Active portfolio filter button */
.portfolio-filter-btn.active {
  transform: scale(1.05);
}

/* Logo hover effect */
.logo:hover {
  transform: scale(1.05);
  filter: brightness(1.2);
}

/* Team member avatar on hover */
.team-member:hover .team-member-avatar {
  transform: scale(1.1);
  animation: pulse 0.5s ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1.1);
  }
}


/**
 * ANIMATION PERFORMANCE CHECKLIST
 */

/*
 * ✓ Use transform and opacity
 * ✓ Debounce scroll events
 * ✓ Use Intersection Observer
 * ✓ Hardware acceleration with will-change
 * ✓ Optimize for mobile
 * ✓ Respect prefers-reduced-motion
 * ✓ Test on various devices
 * ✓ Monitor performance (60fps target)
 * ✓ Use CSS animations over JS when possible
 * ✓ Group animations to reduce repaints
 */

/**
 * COMMON ANIMATION TIMINGS
 */

/* Micro-interactions: 0.15 - 0.3s */
/* Transitions: 0.3 - 0.5s */
/* Animations: 0.5 - 1s */
/* Complex animations: 1 - 2s */
/* Page transitions: 0.3 - 0.6s */
