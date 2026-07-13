# GenCode UI Quick Reference Guide

## 🎯 Quick Start

### Theme Switching
All templates include a dark mode toggle in the top-right corner. Users' preference is saved in localStorage:
```javascript
// Theme is automatically managed - no setup needed!
// Uses key: 'gencode-theme' in localStorage
```

### Color Customization
To change the primary colors, edit the CSS variables in the `<style>` tag of any template:
```css
:root {
  --primary: #6366f1;           /* Change main color here */
  --accent-pink: #ec4899;       /* Change accent colors */
  --accent-purple: #a855f7;
  --accent-cyan: #06b6d4;
  --accent-blue: #3b82f6;
  --accent-magenta: #d946ef;
}
```

## 📱 Template Features by File

### manage_topics.html
**Purpose**: Admin interface for managing DSA topics
**Key Sections**:
- Search/Filter sidebar
- Topic list with difficulty badges
- Detail view with statistics
- Modal dialogs for add/edit/delete
- Bulk operations (Select All, Add Selected, Remove Selected)
- GitHub sync integration

**Customization**:
```javascript
// Server data injection point (Flask template)
const topicsData = {{ topics|tojson }} || [];
```

### index.html
**Purpose**: Landing/home page
**Key Sections**:
- Hero header with animated background
- Feature cards (Practice, AI Assistant, Track Progress)
- "Why Choose GenCode?" feature grid
- Call-to-action buttons

**Add More Cards**:
```html
<div class="card">
  <div class="card-icon"><i class="fas fa-icon-name"></i></div>
  <div class="card-title">Card Title</div>
  <p class="card-description">Description text</p>
  <a href="/path" class="btn btn-primary">
    <i class="fas fa-arrow-right"></i> Action Text
  </a>
</div>
```

### recent_topics.html
**Purpose**: Show recently accessed topics
**Key Sections**:
- Header with theme toggle
- List of recent topics with metadata
- Quick action buttons (View/Practice/Share)
- Empty state message

**Server Data Format**:
```javascript
const recentTopics = [
  {
    name: "Binary Search",
    category: "Algorithms",
    difficulty: "medium",
    last_used: "2024-07-13T10:30:00Z"
  }
];
```

### error.html
**Purpose**: Display error pages
**Key Sections**:
- Error code (e.g., 404, 500)
- Error title and message
- Error details (optional)
- Action buttons (Home, Back)
- Support contact link

**Flask Integration**:
```python
@app.errorhandler(404)
def not_found(error):
    return render_template('error.html',
        error_code='404',
        error_title='Page Not Found',
        error_message='The page you are looking for does not exist.'
    ), 404
```

## 🎨 Animation Classes

### Apply to Elements
```html
<!-- Entrance animations -->
<div style="animation: slideInDown 0.6s ease-out;">Content</div>
<div style="animation: slideInUp 0.6s ease-out 0.2s backwards;">Delayed</div>

<!-- Hover effects (automatic on cards/buttons) -->
<div class="card">...</div>  <!-- Hover lifts and adds shadow -->
<button class="btn btn-primary">...</button>  <!-- Hover transforms -->

<!-- Floating effect -->
<div style="animation: float 3s ease-in-out infinite;">Icon</div>

<!-- Pulse loading state -->
<div class="pulse">Loading...</div>
```

## 🔧 Modification Examples

### Change Button Colors
```css
.btn-custom {
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
  color: white;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
}
```

### Add New Theme
```css
html.sepia {
  --primary: #d4a574;
  --accent-pink: #d4a574;
  --bg: #f5f2e9;
  --card: #fffcf2;
  --text: #3d2817;
}
```

### Modify Animations
```css
@keyframes customFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
}
```

## 📊 Data Integration Examples

### Adding Dynamic Content
```javascript
// Replace mock data with server data
const topicsData = {{ topics|tojson }} || [];

// Fetch from API
async function loadData() {
  const response = await fetch('/api/topics');
  const data = await response.json();
  renderTopics(data);
}
```

### Form Validation
```javascript
// Add validation before submission
document.getElementById('modalSaveBtn').addEventListener('click', () => {
  const name = document.getElementById('m_name').value.trim();
  if (!name) {
    alert('Name is required');
    return;
  }
  // Proceed with submission
});
```

## 📱 Responsive Testing
```css
/* Test breakpoints */
@media (max-width: 1024px) { /* Tablet */ }
@media (max-width: 768px) { /* Small tablet */ }
@media (max-width: 640px) { /* Mobile */ }
```

## ♿ Accessibility Checklist
- [x] Semantic HTML (header, main, footer, section, aside)
- [x] Focus states on interactive elements
- [x] Color contrast meets WCAG standards
- [x] Form labels associated with inputs
- [x] Icon text has aria-label or title
- [x] Keyboard navigation works
- [ ] Test with screen readers (recommended)

## 🐛 Troubleshooting

### Dark Mode Not Working
```javascript
// Ensure theme script runs before page load
initTheme(); // Call at end of script
```

### Animations Lag
- Reduce animation complexity on slower devices
- Use `will-change: transform` for GPU acceleration
- Consider `prefers-reduced-motion` media query

### Layout Breaks on Mobile
- Check `max-width` containers
- Verify `grid-template-columns` responsive values
- Test viewport meta tag is present

### Theme Not Persisting
- Check localStorage is enabled
- Verify key matches: `'gencode-theme'`
- Clear browser cache and try again

## 🚀 Performance Tips
1. Minimize CSS by removing unused animations
2. Lazy-load images and heavy content
3. Use CSS Grid over nested divs
4. Limit animation keyframes per page
5. Compress background images
6. Cache fonts locally when possible

## 📚 Resources
- Font Awesome Icons: https://fontawesome.com/icons
- Google Fonts: https://fonts.google.com
- CSS Animations: https://developer.mozilla.org/en-US/docs/Web/CSS/animation
- CSS Grid: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout

## 🔄 Deployment Checklist
- [ ] Test all templates in production environment
- [ ] Verify theme toggle works in production
- [ ] Check fonts load correctly
- [ ] Test all animations smooth
- [ ] Verify responsive layouts
- [ ] Test keyboard navigation
- [ ] Check console for errors
- [ ] Update Flask route error handlers
- [ ] Backup original templates (already done!)
- [ ] Test on mobile devices

---

**Last Updated**: July 13, 2024
**Status**: Ready for Production Use
