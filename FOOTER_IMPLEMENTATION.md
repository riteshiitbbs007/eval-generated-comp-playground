# Gallery Footer with Onboarding Trigger - March 2, 2026

## Overview

Added a fixed footer to the gallery with:
1. **"Made with ❤️ by UXF Tooling Team • 2026"** message
2. **"View Tutorial"** button to manually restart onboarding

## Features

✅ **Fixed Footer** - Stays at bottom of viewport
✅ **Manual Onboarding Trigger** - Users can restart tutorial anytime
✅ **Responsive Design** - Stacks on mobile devices
✅ **Help Icon** - Clear visual indicator for tutorial button

---

## Implementation Details

### 1. Gallery Footer Component

**File:** `src/modules/main/gallery/gallery.html`

Added footer with two sections:
- **Left:** "Made with ❤️" message
- **Right:** "View Tutorial" button with help icon

```html
<footer class="gallery-footer">
  <div class="footer-content">
    <div class="footer-left">
      <p class="slds-text-body_small slds-text-color_weak">
        Made with ❤️ by UXF Tooling Team • 2026
      </p>
    </div>
    <div class="footer-right">
      <button class="slds-button slds-button_neutral slds-button_small" onclick={handleShowOnboarding}>
        <svg class="slds-button__icon slds-button__icon_left" aria-hidden="true">
          <use xlink:href="/public/slds/icons/utility-sprite/svg/symbols.svg#help"></use>
        </svg>
        View Tutorial
      </button>
    </div>
  </div>
</footer>
```

### 2. Gallery Event Handler

**File:** `src/modules/main/gallery/gallery.js`

Added handler to dispatch event to parent app:

```javascript
handleShowOnboarding() {
  // Dispatch event to parent app to trigger onboarding
  this.dispatchEvent(new CustomEvent('showonboarding', {
    bubbles: true,
    composed: true
  }));
}
```

### 3. App Event Listener

**File:** `src/modules/main/app/app.html`

Gallery listens for `showonboarding` event:

```html
<main-gallery
  oncomponentselect={handleComponentSelect}
  onshowonboarding={handleShowOnboarding}>
</main-gallery>
```

**File:** `src/modules/main/app/app.js`

App triggers onboarding modal:

```javascript
handleShowOnboarding() {
  // Trigger onboarding modal
  const onboardingModal = this.template.querySelector('main-onboarding-modal');
  if (onboardingModal) {
    onboardingModal.restartOnboarding();
  }
}
```

### 4. Onboarding Modal API

**File:** `src/modules/main/onboardingModal/onboardingModal.js`

Added public method to restart onboarding:

```javascript
/**
 * Public API to restart onboarding from anywhere
 */
restartOnboarding() {
  console.log('[Onboarding] Manually restarted');
  this.showModal();
}

/**
 * Show the modal (can be called programmatically)
 */
showModal() {
  console.log('[Onboarding] Setting _isOpen to true');
  this._isOpen = true;
  this.currentStepIndex = 0; // Reset to first step
  console.log('[Onboarding] Modal should be visible now, isOpen:', this.isOpen);
}
```

### 5. Footer Styling

**File:** `src/modules/main/gallery/gallery.css`

```css
/* Gallery Footer */
.gallery-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: var(--lwc-colorBackgroundAlt, #f3f2f2);
  border-top: 1px solid var(--lwc-colorBorder, #c9c7c5);
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.07);
}

.footer-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Adjust gallery content padding for footer */
.gallery-content {
  padding-bottom: 70px; /* Space for footer */
}

/* Responsive footer */
@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    text-align: center;
  }
}
```

### 6. Template Generation Script

**File:** `scripts/generate-app-templates.js`

Updated to include:
1. Onboarding modal in template
2. Event listener for `showonboarding`
3. `handleShowOnboarding()` method in app.js

This ensures footer functionality persists through template regeneration.

---

## Event Flow

```
User clicks "View Tutorial" button
         ↓
gallery.handleShowOnboarding()
         ↓
Dispatch 'showonboarding' event (bubbles: true, composed: true)
         ↓
app.handleShowOnboarding() receives event
         ↓
Query for 'main-onboarding-modal' component
         ↓
Call onboardingModal.restartOnboarding()
         ↓
Modal opens, resets to step 1
```

---

## Usage

### For Users

1. **View Gallery** - Scroll through components
2. **Need Help?** - Click "View Tutorial" in footer
3. **Restart Anytime** - Button always available, regardless of localStorage state

### For Developers

The onboarding can be triggered programmatically from any component:

```javascript
// From any child component, dispatch event
this.dispatchEvent(new CustomEvent('showonboarding', {
  bubbles: true,
  composed: true
}));

// Or directly call the modal (if you have reference)
const modal = this.template.querySelector('main-onboarding-modal');
modal.restartOnboarding();
```

---

## Responsive Behavior

**Desktop (>768px):**
- Footer content horizontal (left/right split)
- Fixed at bottom
- Full width with max-width container

**Mobile (<768px):**
- Footer content stacks vertically
- Centered text and button
- Full width

---

## Files Modified

```
src/modules/main/gallery/
  ├── gallery.html           (added footer)
  ├── gallery.js             (added handleShowOnboarding)
  └── gallery.css            (added footer styles)

src/modules/main/onboardingModal/
  └── onboardingModal.js     (added restartOnboarding API)

scripts/
  └── generate-app-templates.js  (updated to persist footer functionality)

Auto-generated:
  ├── src/modules/main/app/app.html  (added onshowonboarding listener)
  └── src/modules/main/app/app.js    (added handleShowOnboarding method)
```

---

## Testing Checklist

- [ ] Footer appears at bottom of gallery
- [ ] "Made with ❤️" message displays correctly
- [ ] "View Tutorial" button has help icon
- [ ] Click "View Tutorial" → Onboarding opens
- [ ] Onboarding starts at step 1
- [ ] Works after completing onboarding once
- [ ] Footer is responsive on mobile
- [ ] Footer doesn't cover gallery content (70px padding)
- [ ] Z-index doesn't conflict with other UI elements

---

## Summary

The gallery now has a persistent footer that:
1. ✅ Shows UXF Tooling Team branding
2. ✅ Provides quick access to tutorial
3. ✅ Works regardless of localStorage state
4. ✅ Resets onboarding to first step
5. ✅ Responsive design for all screen sizes
6. ✅ Persists through template regeneration

Users can now access the tutorial anytime without needing to clear localStorage!
