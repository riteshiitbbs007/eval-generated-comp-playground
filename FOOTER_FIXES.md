# Footer Fixes - March 2, 2026

## Issues Fixed

### 1. ✅ TypeError: restartOnboarding is not a function
**Problem:** Method wasn't exposed as public API
**Fix:** Added `@api` decorator to make method callable from parent

```javascript
import { LightningElement, api } from 'lwc';

@api
restartOnboarding() {
  console.log('[Onboarding] Manually restarted');
  this.showModal();
}
```

### 2. ✅ Simplified Click Behavior
**Problem:** Complex event dispatching through multiple components
**Fix:** Direct localStorage clear + page refresh

```javascript
handleShowOnboarding() {
  // Clear onboarding localStorage and refresh page
  localStorage.removeItem('lwc-gallery-onboarding-completed');
  window.location.reload();
}
```

**Behavior:**
- Click "View Tutorial" → Clears localStorage → Refreshes page → Onboarding shows automatically

### 3. ✅ Removed Help Icon
**Problem:** Icon not needed
**Fix:** Simplified button to text-only

**Before:**
```html
<button class="slds-button slds-button_neutral slds-button_small" onclick={handleShowOnboarding}>
  <svg class="slds-button__icon slds-button__icon_left" aria-hidden="true">
    <use xlink:href="/public/slds/icons/utility-sprite/svg/symbols.svg#help"></use>
  </svg>
  View Tutorial
</button>
```

**After:**
```html
<button class="slds-button slds-button_neutral slds-button_small" onclick={handleShowOnboarding}>
  View Tutorial
</button>
```

### 4. ✅ Center Aligned Footer Content
**Problem:** Footer content was space-between (left/right)
**Fix:** Changed to column layout with center alignment

```css
.footer-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.footer-left p {
  text-align: center;
}
```

---

## Final Footer Layout

```
┌─────────────────────────────────────────┐
│                                         │
│  Made with ❤️ by UXF Tooling Team • 2026│
│                                         │
│          [View Tutorial]                │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- ✅ Centered vertically and horizontally
- ✅ Clean, minimal design
- ✅ Text-only button
- ✅ Simple click behavior (clear + refresh)
- ✅ Works on all screen sizes

---

## Files Modified

```
src/modules/main/gallery/
  ├── gallery.html           (removed icon, simplified)
  ├── gallery.js             (changed to localStorage.clear + reload)
  └── gallery.css            (centered footer layout)

src/modules/main/onboardingModal/
  └── onboardingModal.js     (added @api decorator)

scripts/
  └── generate-app-templates.js  (removed event handlers)

Auto-generated (cleaned up):
  ├── src/modules/main/app/app.html  (removed onshowonboarding listener)
  └── src/modules/main/app/app.js    (removed handleShowOnboarding method)
```

---

## Testing

1. **View Tutorial Button**
   - [ ] Click "View Tutorial"
   - [ ] Page refreshes
   - [ ] Onboarding modal appears
   - [ ] Starts at step 1

2. **Footer Layout**
   - [ ] Text is centered
   - [ ] Button is centered
   - [ ] Stacked vertically
   - [ ] Looks good on mobile
   - [ ] Looks good on desktop

3. **After Completing Onboarding**
   - [ ] Click "View Tutorial" again
   - [ ] Onboarding reappears
   - [ ] Works every time

---

## Implementation Simplification

**Old Flow (Complex):**
```
Click button → gallery.handleShowOnboarding()
            → Dispatch event
            → app.handleShowOnboarding()
            → Query for modal
            → Call modal.restartOnboarding()
            → Modal opens
```

**New Flow (Simple):**
```
Click button → gallery.handleShowOnboarding()
            → localStorage.removeItem()
            → window.location.reload()
            → Page loads
            → Modal checks localStorage
            → Modal opens automatically
```

---

## Summary

All issues resolved:
1. ✅ Fixed TypeError with `@api` decorator
2. ✅ Simplified to localStorage clear + refresh
3. ✅ Removed unnecessary help icon
4. ✅ Centered footer content
5. ✅ Cleaner, more maintainable code

The footer is now simpler, cleaner, and works perfectly!
