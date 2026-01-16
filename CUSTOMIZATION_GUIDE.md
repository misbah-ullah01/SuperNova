# Synapse Website - Customization Guide

## 🎨 Quick Customizations

### 1. Change Brand Name

**File**: `All HTML files`

Find and replace:
```html
<!-- Change from -->
<div class="logo">SYNAPSE</div>

<!-- To -->
<div class="logo">YOUR_BRAND</div>
```

### 2. Update Contact Information

**File**: `contact.html`

```html
<!-- Email -->
<a href="mailto:hello@synapse.agency">hello@synapse.agency</a>

<!-- Phone -->
<a href="tel:+14155552368">+1 (415) 555-2368</a>

<!-- Address -->
<div class="contact-value">
  123 Creative Avenue<br>
  San Francisco, CA 94105<br>
  United States
</div>
```

### 3. Change Color Theme

**File**: `css/style.css` - Root variables

```css
:root {
  /* Change primary colors */
  --primary-dark: #0a1f3a;
  --primary-light: #1a3a52;
  
  /* Change accent colors */
  --accent-blue: #2563eb;
  --accent-sky: #3b82f6;
  --accent-light: #60a5fa;
  
  /* Update gradients */
  --gradient-1: linear-gradient(135deg, #0a1f3a 0%, #1a3a52 50%, #2563eb 100%);
  --gradient-2: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
}
```

### 4. Update Services & Pricing

**File**: `services.html`

```html
<div class="package-card">
  <h3 class="package-name">Starter Pack</h3>
  <div class="package-price">$799</div>
  
  <ul class="package-features">
    <li>Your feature here</li>
    <li>Another feature</li>
  </ul>
</div>
```

### 5. Update Team Members

**File**: `about.html`

```html
<div class="team-member">
  <div class="team-member-avatar">AC</div>
  <div class="team-member-name">Your Name</div>
  <div class="team-member-role">Your Role</div>
  <div class="team-member-bio">
    Your bio here
  </div>
</div>
```

### 6. Update Portfolio Projects

**File**: `portfolio.html`

```html
<div class="portfolio-item" data-category="branding">
  <div class="portfolio-content">
    <div class="portfolio-category">Category</div>
    <div class="portfolio-title">Project Title</div>
  </div>
</div>
```

### 7. Add Real Images

**Replace Emojis**:
```html
<!-- Change from -->
<div style="font-size: 3rem;">📸</div>

<!-- To -->
<img src="assets/your-image.jpg" alt="Description">
```

### 8. Update Social Media Links

**File**: All HTML files (Footer section)

```html
<div class="social-links">
  <a href="https://instagram.com/yourhandle" class="social-link" title="Instagram">📷</a>
  <a href="https://twitter.com/yourhandle" class="social-link" title="Twitter">𝕏</a>
  <a href="https://linkedin.com/company/yourname" class="social-link" title="LinkedIn">💼</a>
  <a href="https://facebook.com/yourpage" class="social-link" title="Facebook">f</a>
</div>
```

### 9. Update Navigation Links

**File**: All HTML files (Navbar)

```html
<ul class="nav-links">
  <li><a href="index.html">Home</a></li>
  <li><a href="services.html">Services</a></li>
  <li><a href="portfolio.html">Portfolio</a></li>
  <li><a href="about.html">About</a></li>
  <li><a href="contact.html">Contact</a></li>
  <!-- Add more pages as needed -->
</ul>
```

### 10. Update Testimonials

**File**: `portfolio.html`

```html
<div class="card">
  <div style="margin-bottom: var(--spacing-md); color: #fbbf24; font-size: 1.25rem;">⭐⭐⭐⭐⭐</div>
  <p style="margin-bottom: var(--spacing-md); font-style: italic;">
    "Your testimonial here"
  </p>
  <div style="display: flex; align-items: center; gap: var(--spacing-md);">
    <div style="width: 50px; height: 50px; border-radius: 50%; background: var(--gradient-2); display: flex; align-items: center; justify-content: center; font-weight: 700;">XX</div>
    <div>
      <div style="font-weight: 600; color: var(--text-primary);">Name</div>
      <div style="color: var(--text-muted); font-size: 0.85rem;">Title</div>
    </div>
  </div>
</div>
```

---

## 🔧 Advanced Customizations

### Add New Page

1. **Create new HTML file**: `newpage.html`
2. **Copy navbar from existing page**
3. **Copy footer from existing page**
4. **Add content between navbar and footer**
5. **Add link to navbar**: `<li><a href="newpage.html">New Page</a></li>`

### Change Font

**File**: `css/style.css`

```css
:root {
  /* Change these fonts */
  --font-primary: 'Your Font', sans-serif;
  --font-heading: 'Your Heading Font', sans-serif;
}
```

**Update HTML head**:
```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap" rel="stylesheet">
```

### Create New Animation

**Add to CSS**:
```css
@keyframes myAnimation {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: myAnimation 0.6s ease-out;
}
```

### Modify Responsive Breakpoints

**File**: `css/style.css` - Media queries section

```css
/* Change these breakpoints */
@media (max-width: 1024px) {
  /* Tablet styles */
}

@media (max-width: 768px) {
  /* Mobile styles */
}

@media (max-width: 480px) {
  /* Small mobile styles */
}
```

---

## 📝 Content Updates Checklist

- [ ] Company/brand name
- [ ] Logo (if using image instead of text)
- [ ] Contact email addresses
- [ ] Phone numbers
- [ ] Physical address
- [ ] Business hours
- [ ] Service descriptions
- [ ] Service prices
- [ ] Team member names and roles
- [ ] Team member photos/avatars
- [ ] Portfolio projects and descriptions
- [ ] Testimonials and client names
- [ ] Social media links
- [ ] Meta descriptions in HTML head
- [ ] Page titles

---

## 🎨 Color Customization Examples

### Modern Teal Theme
```css
--primary-dark: #0a2f2f;
--accent-blue: #0d9488;
--accent-sky: #14b8a6;
--accent-light: #2dd4bf;
```

### Professional Purple Theme
```css
--primary-dark: #2d1b4e;
--accent-blue: #7c3aed;
--accent-sky: #a78bfa;
--accent-light: #ddd6fe;
```

### Vibrant Orange Theme
```css
--primary-dark: #3f1f1f;
--accent-blue: #ea580c;
--accent-sky: #f97316;
--accent-light: #fdba74;
```

---

## 🚀 Deployment Checklist

### Before Going Live
- [ ] Update all contact information
- [ ] Replace all placeholder images
- [ ] Update all brand names and colors
- [ ] Test all links work
- [ ] Check mobile responsiveness
- [ ] Verify forms work
- [ ] Update meta descriptions
- [ ] Add favicon (if desired)
- [ ] Test on multiple browsers
- [ ] Check page load speed
- [ ] Enable GZIP compression
- [ ] Set up 404 page
- [ ] Add sitemap
- [ ] Enable analytics
- [ ] Set up email forwarding for contact forms
- [ ] Test email notifications

---

## 📱 Mobile Testing

Test the website on:
- iPhone (Safari)
- Android (Chrome)
- Tablet (iPad, Android tablet)
- Small mobile (< 480px)
- Desktop (1920px, 1440px, 1024px)

Check for:
- Text readability
- Button clickability
- Image scaling
- Form usability
- Navigation accessibility

---

## ⚡ Performance Optimization

### Image Optimization
```html
<!-- Use optimized images -->
<img src="image.webp" alt="Description" loading="lazy">
```

### CSS Optimization
- Minify CSS for production
- Remove unused styles
- Combine media queries

### JavaScript Optimization
- Minify JS for production
- Remove console logs
- Use efficient selectors

### Server Optimization
- Enable GZIP compression
- Set cache headers
- Use CDN for assets
- Minimize redirects

---

## 🔒 Security Tips

1. **Form Validation**: Always validate on server
2. **HTTPS**: Use SSL certificate
3. **Input Sanitization**: Clean user inputs
4. **Rate Limiting**: Prevent form spam
5. **Content Security Policy**: Restrict resources
6. **Regular Backups**: Keep backups safe

---

## 🐛 Troubleshooting

### Navigation links not working?
- Check file paths are correct
- Ensure .html extensions match
- Test relative vs absolute paths

### Animations not smooth?
- Check browser console for errors
- Verify GPU acceleration enabled
- Test on different devices
- Check animation timing values

### Mobile menu not closing?
- Check JavaScript errors
- Verify click handlers
- Test on mobile device

### Form not submitting?
- Check field names
- Verify email validation
- Test in different browsers
- Check browser console

---

## 📚 Resources

- Google Fonts: https://fonts.google.com
- Color Picker: https://colorpicker.com
- Icon Library: https://www.flaticon.com
- Image Compression: https://tinypng.com
- Responsive Testing: https://responsively.app

---

## 🎓 Learning Resources

- CSS Animations: https://web.dev/animations/
- Intersection Observer: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
- Responsive Design: https://web.dev/responsive-web-design-basics/
- Web Performance: https://web.dev/performance/

---

**Need help? Check the README.md and ANIMATION_GUIDE.md files for more information.**
