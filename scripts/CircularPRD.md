# Complete PRD: SVG Circular Progress Animation with GSAP

## Executive Summary

Based on the SVG analysis and GSAP research, this PRD outlines the implementation of an animated circular progress indicator using the "rotating-lines" element from the provided SVG code. The animation will progress from 0% to 70% completion with sophisticated reveal animations for all elements, leveraging GSAP's newly free premium plugins[^1][^2].

## SVG Structure Analysis

### Main Container Properties

- **Dimensions**: 680px × 679px
- **ViewBox**: "0 0 680 679"
- **Center Point**: (339.621, 338.994)
- **Design Style**: Dark theme with purple/blue gradient accents


### Element Hierarchy

#### 1. Outer Concentric Rings (10 layers)

The SVG contains 10 concentric circles forming the outer decorative rings:

- **Outermost Ring**: radius 338.5px, stroke "\#11101B"
- **Ring Layers**: radii ranging from 295.079px to 338.5px
- **Stroke Width**: 3px consistently across all rings
- **Blend Mode**: `mix-blend-mode: lighten`


#### 2. Rotating Progress Element

- **Element ID**: `rotating-lines`
- **Type**: Conic gradient circle with angular animation capability
- **Radius**: 290px
- **Colors**: Purple gradient (\#9972FA, \#4E3CA6, \#100E19)
- **Animation Target**: This is the primary element for the 0-70% progress animation


#### 3. Inner Content Area

- **Main Circle**: radius 224px, fill "\#0F0E17"
- **Text Elements**: "Baseline Profit" and "Profit with Revomo AI"
- **Progress Indicators**: Dashed lines showing different profit levels


## Animation Strategy

### Progress Calculation

For the 70% animation target:

- **Circle Circumference**: 2π × 290 = 1,822.12px
- **70% Progress Distance**: 1,275.49px
- **Animation Method**: stroke-dasharray and stroke-dashoffset manipulation[^3][^4]


### GSAP Implementation Approach

#### Core Libraries Required

Since GSAP is now completely free including premium plugins[^1][^2]:

- **GSAP Core**: Main animation engine
- **ScrollTrigger**: For scroll-based reveals[^5]
- **Timeline**: For sequenced animations[^6]
- **DrawSVG**: For path and stroke animations (premium plugin now free)[^7]


## Detailed Implementation Plan

### Phase 1: HTML Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revomo AI Progress Animation</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="animation-container">
        <!-- SVG content will be embedded here -->
        <svg width="680" height="679" viewBox="0 0 680 679" class="main-svg">
            <!-- Complete SVG structure as provided -->
        </svg>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/DrawSVGPlugin.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
```


### Phase 2: CSS Styling and Centering

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    background-color: #0A0A0F;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Inter', sans-serif;
}

.animation-container {
    position: relative;
    width: 680px;
    height: 679px;
}

.main-svg {
    width: 100%;
    height: 100%;
    max-width: 680px;
}

/* Initial states for animations */
.outer-rings {
    opacity: 0;
    transform: scale(0.8);
}

.text-elements {
    opacity: 0;
    transform: translateY(20px);
}

#rotating-lines {
    stroke-dasharray: 1822;
    stroke-dashoffset: 1822;
    transform-origin: 339.621px 338.994px;
}
```


### Phase 3: JavaScript Animation Implementation

#### Reveal Animation Types[^8][^9]

Based on the element hierarchy, the optimal reveal sequence:

1. **Outer Rings**: Staggered scale and fade-in[^10]
2. **Main Container**: Scale from center with ease
3. **Text Elements**: Slide up with stagger
4. **Progress Circle**: Stroke drawing animation[^3][^4]
```javascript
// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

// Main timeline
const masterTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: ".animation-container",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
    }
});

// Phase 1: Outer rings staggered reveal
masterTimeline.to(".outer-rings circle", {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    stagger: {
        each: 0.1,
        from: "center",
        ease: "power2.out"
    },
    ease: "back.out(1.7)"
});

// Phase 2: Main container reveal
masterTimeline.to(".main-circle", {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "elastic.out(1, 0.5)"
}, "-=0.4");

// Phase 3: Text elements reveal
masterTimeline.to(".text-elements", {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "power3.out"
}, "-=0.3");

// Phase 4: Progress animation (0 to 70%)
masterTimeline.to("#rotating-lines", {
    strokeDashoffset: 546.51, // 70% of circumference
    duration: 2.5,
    ease: "power2.inOut"
}, "-=0.2");
```


### Phase 4: Advanced Progress Animation

#### Stroke-Based Progress Implementation[^3][^4]

```javascript
// Calculate progress values
const circumference = 2 * Math.PI * 290; // 1822.12
const progressPercent = 0.7; // 70%
const targetOffset = circumference * (1 - progressPercent);

// Enhanced progress animation with callbacks
const progressAnimation = gsap.to("#rotating-lines", {
    strokeDashoffset: targetOffset,
    duration: 3,
    ease: "power2.inOut",
    onUpdate: function() {
        const progress = this.progress();
        const currentPercent = Math.round(progress * 70);
        // Update percentage display if needed
        console.log(`Progress: ${currentPercent}%`);
    }
});
```


### Phase 5: Responsive Design Considerations[^11]

```css
/* Responsive scaling */
@media (max-width: 768px) {
    .animation-container {
        width: 90vw;
        height: auto;
        aspect-ratio: 680/679;
    }

    .main-svg {
        width: 100%;
        height: auto;
    }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .main-svg {
        shape-rendering: geometricPrecision;
    }
}
```


## Performance Optimization

### Animation Performance Best Practices[^12]

1. **GPU Acceleration**: Use `will-change: transform` for animated elements
2. **Composite Layers**: Leverage `transform3d(0,0,0)` for hardware acceleration
3. **Cleanup**: Implement proper animation cleanup with GSAP's `kill()` method
```javascript
// Performance optimization
gsap.set("#rotating-lines", {
    willChange: "transform, stroke-dashoffset"
});

// Cleanup on completion
masterTimeline.eventCallback("onComplete", function() {
    gsap.set("#rotating-lines", {
        willChange: "auto"
    });
});
```


## Testing and Quality Assurance

### Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile Support**: iOS Safari 12+, Chrome Mobile 60+
- **Fallbacks**: CSS-only animations for older browsers


### Performance Metrics

- **Target FPS**: 60fps consistent animation
- **Load Time**: <500ms for initial render
- **Memory Usage**: <50MB during animation


## Deployment Considerations

### CDN Integration

Utilize GSAP's official CDN for optimal performance[^13]:

```html
<!-- GSAP Core (Free) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

<!-- Premium plugins (Now Free) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/DrawSVGPlugin.min.js"></script>
```


### Progressive Enhancement

Implement graceful degradation for users with reduced motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
    #rotating-lines {
        animation: none;
        stroke-dashoffset: 546.51; /* Show final state immediately */
    }
}
```

This comprehensive implementation leverages GSAP's newly free premium plugins[^1][^2] to create a sophisticated, performant animation that transforms the static SVG into an engaging progress indicator with smooth 0-70% circular progress animation and elegant reveal sequences for all visual elements.

<div style="text-align: center">⁂</div>

[^1]: https://gsap.com/pricing/

[^2]: https://webflow.com/blog/gsap-becomes-free

[^3]: https://gsap.com/community/forums/topic/35744-animating-stroke-dashoffset-works-fine-in-css-animation-stagger-with-gsap/

[^4]: https://fjolt.com/article/css-animate-svg-paths/

[^5]: https://marmelab.com/blog/2024/04/11/trigger-animations-on-scroll-with-gsap-scrolltrigger.html

[^6]: https://gsap.com/docs/v3/GSAP/gsap.timeline()/

[^7]: https://www.youtube.com/watch?v=-FxVERXtkP0

[^8]: https://gsap.com/community/forums/topic/39561-text-reveal-effect-using-scrolltrigger/

[^9]: https://www.flowbase.co/booster/gsap-text-reveal

[^10]: https://gsap.com/resources/getting-started/Staggers/

[^11]: https://tailkits.com/blog/how-to-set-svg-widt/

[^12]: https://gsap.com/community/forums/topic/39943-looking-for-best-practices-when-it-comes-to-the-performance-of-multiple-reveal-animations-using-scrolltrigger/

[^13]: https://gsap.com/docs/v3/Plugins/

[^14]: paste.txt

[^15]: Screenshot-2025-06-18-at-4.11.32-AM.jpg

[^16]: https://www.pluralsight.com/courses/gsap-javascript-animation

[^17]: https://stackoverflow.com/questions/33343510/gsap-preserve-previous-transformations-when-animating-svg

[^18]: https://dev.to/takaneichinose/upload-progress-animation-microinteraction-with-gsap-4ga3

[^19]: https://www.reddit.com/r/webdev/comments/1kcxtew/gsap_is_free_now_including_all_their_plugins/

[^20]: https://smashingthingstogether.com/designing-a-circular-progress-bar/index.html

[^21]: https://www.youtube.com/watch?v=exgRLvzYMHQ

[^22]: https://blog.logrocket.com/build-svg-circular-progress-component-react-hooks/

[^23]: https://gsap.com/community/forums/topic/42067-rotate-elements-based-on-scroll-speed-adjusting-rotation-to-scroll-velocity/

[^24]: https://javascript.plainenglish.io/how-to-animate-svg-circle-with-javascript-8e8c720ee3a2

[^25]: https://dev.to/singhshemona/animated-progress-bar-with-only-svgs-2k0j

[^26]: https://gsap.com/community/forums/topic/38923-transformorigin-on-svg-element-doesnt-apply-as-expected/

[^27]: https://tympanus.net/codrops/2014/04/09/how-to-create-a-circular-progress-button/

[^28]: https://www.sitepoint.com/css-center-position-absolute-div/

[^29]: https://www.youtube.com/watch?v=va1RrFr-gms

[^30]: https://gsap.com/community/forums/topic/41234-make-a-circular-svg-rotate-snap-to-specific-group-inside-the-svg-on-scroll/

[^31]: https://gsap.com/community/forums/topic/34433-animating-svg-gradients-dynamically-using-gsap/

[^32]: https://www.youtube.com/watch?v=jplHMfmSzO8

[^33]: https://gsap.com/community/forums/topic/25057-premium-plugins-available-for-everyone-on-this-link/

[^34]: https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/

[^35]: https://www.youtube.com/watch?v=H2HYccAGR00

[^36]: https://stackoverflow.com/questions/66990496/simple-svg-css-progress-circle

[^37]: https://gsap.com/community/forums/topic/26374-simple-fade-out-fade-in/

[^38]: https://gsap.com/community/forums/topic/34216-fade-in-fade-out-effect-for-sections-with-scrolltrigger/

[^39]: https://gsap.com/community/forums/topic/33049-banner-text-animation-full-sentence-fade-in/

[^40]: https://gsap.com/community/forums/topic/16417-animating-svg-circle-strokes-from-the-12-oclock-position-with-drawsvg/

[^41]: https://gsap.com/community/forums/topic/25367-animating-stroke-dasharray/

[^42]: https://gsap.com/community/forums/topic/35628-drawsvg-looping-stroke-animation-around-circle-slight-jump-at-end-of-loop/
