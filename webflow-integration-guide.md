# Webflow Integration Guide: Shimmering Pixel-Grid Background

## Overview
This guide will help you integrate the shimmering pixel-grid animation into your Webflow project as a background element inside any container.

## Step 1: Prepare Your Webflow Project

1. **Open your Webflow project** and navigate to the page where you want to add the background
2. **Identify the container** where you want the background to appear
3. **Set the container's position** to `Relative` in the Style panel (this is important for absolute positioning)

## Step 2: Add the Background Container

1. **Inside your target container**, add a new `Div Block`
2. **Give it a class name** like `pixel-grid-background`
3. **Set the following styles** for this div:
   - Position: `Absolute`
   - Top: `0px`
   - Left: `0px`
   - Right: `0px`
   - Bottom: `0px`
   - Z-index: `-1` (to keep it behind other content)
   - Width: `100%`
   - Height: `100%`

## Step 3: Add Custom Code

### Option A: Using Webflow's Custom Code (Recommended)

1. **Go to your page settings** or site settings
2. **Navigate to the Custom Code section**
3. **In the "Before </body> tag" section**, add the following code:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.4.0/pixi.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script type="module">
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the pixel grid background
    function initPixelGrid() {
        const container = document.querySelector('.pixel-grid-background');
        if (!container) return;

        const app = new PIXI.Application({
            width: container.clientWidth,
            height: container.clientHeight,
            backgroundColor: 0x0D0C14,
            backgroundAlpha: 1,
            antialias: true,
            autoDensity: true,
            resolution: window.devicePixelRatio,
        });

        container.appendChild(app.view);

        const fragmentShader = `
            precision mediump float;
            varying vec2 vTextureCoord;
            uniform vec2 uResolution;
            uniform float uGridSize;
            uniform float uTime;
            uniform float uRevealProgress;

            void main() {
                vec2 coord = vTextureCoord * uResolution;

                // Global circle mask setup
                vec2 canvasCenter = uResolution / 2.5;
                float circleRadius = min(uResolution.x, uResolution.y) * 0.3 * uRevealProgress;
                float circleEdge = circleRadius * 0.7;
                float distToCenter = length(coord - canvasCenter);
                float circleMask = smoothstep(circleRadius, circleRadius - circleEdge, distToCenter);

                // Grid calculations
                float gridSize = uGridSize;
                float squareSize = 1.5;
                float gap = (gridSize - squareSize) / 2.0;
                float radius = squareSize / 2.0;
                vec2 cell = floor(coord / gridSize);
                vec2 posInCell = mod(coord, gridSize);
                vec2 center = vec2(gridSize / 2.0, gridSize / 2.0);
                float dist = length(posInCell - center);
                float edge = 0.2;
                float mask = smoothstep(radius + edge, radius - edge, dist);
                float random = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
                float opacity = 0.5 + 0.5 * sin(uTime * 2.0 + random * 6.28318);

                                 // Colors
                 vec3 bgColor = vec3(13.0/255.0, 12.0/255.0, 20.0/255.0);
                 vec3 dotColor = vec3(126.0/255.0, 101.0/255.0, 187.0/255.0);
                vec3 innerColor = mix(bgColor, dotColor, mask * opacity);
                vec3 color = mix(bgColor, innerColor, circleMask);

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        const uniforms = {
            uGridSize: 2.0,
            uResolution: [app.screen.width, app.screen.height],
            uTime: 0.0,
            uRevealProgress: 0.0,
        };

                 const filter = new PIXI.Filter(undefined, fragmentShader, uniforms);
         const rect = new PIXI.Graphics();
         rect.beginFill(0x0D0C14);
         rect.drawRect(0, 0, app.screen.width, app.screen.height);
        rect.endFill();
        rect.filters = [filter];
        app.stage.addChild(rect);

        // Handle resize
        function handleResize() {
            app.renderer.resize(container.clientWidth, container.clientHeight);
            uniforms.uResolution = [app.screen.width, app.screen.height];
            rect.width = app.screen.width;
            rect.height = app.screen.height;
        }

        window.addEventListener('resize', handleResize);

        // Animation loop
        let time = 0;
        app.ticker.add((delta) => {
            time += delta / 60;
            uniforms.uTime = time;
        });

        // GSAP animation with ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        gsap.to(uniforms, {
            uRevealProgress: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: container,
                start: "top 80%",
                once: true,
            }
        });

        // Clean up function
        return () => {
            window.removeEventListener('resize', handleResize);
            app.destroy(true);
        };
    }

    // Initialize when DOM is ready
    initPixelGrid();
});
</script>
```

### Option B: Using an Embed Element

1. **Add an Embed element** inside your container (instead of the div block)
2. **Paste the following code** into the embed element:

```html
<div class="pixel-grid-background" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; width: 100%; height: 100%;"></div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.4.0/pixi.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

<script type="module">
// [Same JavaScript code as above]
</script>
```

## Step 4: Customize the Animation

You can customize various aspects of the animation by modifying these values in the JavaScript:

### Colors
```javascript
// Background color (dark purple: #0D0C14)
vec3 bgColor = vec3(13.0/255.0, 12.0/255.0, 20.0/255.0);

// Dot color (light purple)
vec3 dotColor = vec3(126.0/255.0, 101.0/255.0, 187.0/255.0);
```

### Grid Size
```javascript
uGridSize: 2.0, // Smaller = more dots, Larger = fewer dots
```

### Animation Speed
```javascript
duration: 1.5, // Reveal animation duration in seconds
```

### Reveal Position
```javascript
start: "top 80%", // When the animation starts (80% from top)
```

## Step 5: Test and Optimize

1. **Preview your site** to see the animation in action
2. **Test on different devices** to ensure responsiveness
3. **Adjust the z-index** if needed to ensure proper layering
4. **Test scroll performance** - the animation is optimized but monitor performance on slower devices

## Step 6: Troubleshooting

### Common Issues:

1. **Animation not showing**: Check if the container has the correct class name
2. **Performance issues**: Consider reducing grid density or adding performance optimizations
3. **Responsive issues**: Ensure the parent container has proper dimensions
4. **Z-index conflicts**: Adjust the z-index value to layer properly with other elements

### Performance Tips:

- The animation automatically adjusts to device pixel ratio
- Uses hardware acceleration through PIXI.js
- Includes built-in resize handling
- ScrollTrigger ensures animation only runs when visible

## Additional Customization Options

### Multiple Backgrounds
To add the same effect to multiple containers:
1. Use different class names (e.g., `pixel-grid-background-1`, `pixel-grid-background-2`)
2. Initialize each one separately in the JavaScript
3. Apply different colors or settings to each

### Static Version
If you want a static version without scroll trigger:
```javascript
// Remove ScrollTrigger and set immediate reveal
uniforms.uRevealProgress = 1.0;
```

## Browser Compatibility

- **Modern browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Mobile devices**: Optimized for mobile performance
- **Older browsers**: May require PIXI.js polyfills

---

**Note**: This implementation is optimized for Webflow and will work as a background element without interfering with your existing content or layout.
