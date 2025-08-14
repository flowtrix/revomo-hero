import './style.css'

import gsap from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// Global variables for premium plugins
let SplitText, MorphSVGPlugin;

// Global flag to prevent multiple initializations
let isInitialized = false;
let globalAnimationSystem = null;
let globalParticleSystem = null;
let globalDiagonalParticleSystem = null;

// Async function to load premium plugins
async function loadPremiumPlugins() {
    try {
        const splitTextModule = await import("gsap/SplitText");
        SplitText = splitTextModule.SplitText;
    } catch (error) {
        // SplitText plugin not available, using fallback animations
    }

    try {
        const morphModule = await import("gsap/MorphSVGPlugin");
        MorphSVGPlugin = morphModule.MorphSVGPlugin;
    } catch (error) {
        // MorphSVG plugin not available
    }

    // Register available plugins
    const availablePlugins = [InertiaPlugin, Physics2DPlugin, DrawSVGPlugin, MotionPathPlugin];
    if (SplitText) availablePlugins.push(SplitText);
    if (MorphSVGPlugin) availablePlugins.push(MorphSVGPlugin);

    gsap.registerPlugin(...availablePlugins);

    // Register ScrollTrigger from CDN if available
    if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    return { SplitText, MorphSVGPlugin };
}

// Main Animation Timeline Class
class RevomoAnimationSystem {
    constructor(particleSystem) {
        this.timeline = gsap.timeline();
        this.pluginsLoaded = false;
        this.config = null;
        this.particleSystem = particleSystem;
        this.animationsSetup = false; // Flag to prevent duplicate setup
    }

    async init() {
        // Prevent multiple initializations
        if (this.animationsSetup) {
            console.warn('Animation system already initialized');
            return;
        }

        // Load configuration first
        await this.loadConfig();

        // Load premium plugins
        await loadPremiumPlugins();
        this.pluginsLoaded = true;

        // Setup animations directly - DOM should be ready by now
        this.setupAnimations();
        this.animationsSetup = true;
    }

    async loadConfig() {
        try {
            const response = await fetch('./config.json');
            this.config = await response.json();
            console.log('Configuration loaded:', this.config);
        } catch (error) {
            console.error('Failed to load configuration:', error);
        }
    }

    updateTooltipTexts() {
        if (!this.config || !this.config.tooltips) {
            console.warn('No tooltip configuration available');
            return;
        }

        const tooltips = this.config.tooltips;

        // Update first tooltip - target the div with both classes
        const firstTooltip = document.querySelector('.first-tooltip-content.tooltip-text');
        if (firstTooltip && tooltips.first) {
            firstTooltip.textContent = tooltips.first.text;
            console.log('✅ First tooltip updated:', tooltips.first.text);
        } else {
            console.warn('❌ First tooltip element not found or config missing');
        }

        // Update second tooltip - target the div with both classes
        const secondTooltip = document.querySelector('.second-tooltip-content.tooltip-text');
        if (secondTooltip && tooltips.second) {
            secondTooltip.textContent = tooltips.second.text;
            console.log('✅ Second tooltip updated:', tooltips.second.text);
        } else {
            console.warn('❌ Second tooltip element not found or config missing');
        }

        // Update third tooltip - first text
        const thirdTooltipFirst = document.querySelector('.third-tooltip-content-one.tooltip-text');
        if (thirdTooltipFirst && tooltips.third && tooltips.third.first) {
            thirdTooltipFirst.textContent = tooltips.third.first.text;
            console.log('✅ Third tooltip (first) updated:', tooltips.third.first.text);
        } else {
            console.warn('❌ Third tooltip (first) element not found or config missing');
        }

        // Update third tooltip - second text
        const thirdTooltipSecond = document.querySelector('.third-tooltip-content-two.tooltip-text');
        if (thirdTooltipSecond && tooltips.third && tooltips.third.second) {
            thirdTooltipSecond.textContent = tooltips.third.second.text;
            console.log('✅ Third tooltip (second) updated:', tooltips.third.second.text);
        } else {
            console.warn('❌ Third tooltip (second) element not found or config missing');
        }

        const dec = document.querySelector('.dec');
        if (dec && tooltips.dec) {
            dec.textContent = tooltips.dec.text;
            console.log('✅ Dec updated:', tooltips.dec.text);
        } else {
            console.warn('❌ Dec element not found or config missing');
        }

        const jan = document.querySelector('.jan');
        if (jan && tooltips.jan) {
            jan.textContent = tooltips.jan.text;
            console.log('✅ Jan updated:', tooltips.jan.text);
        } else {
            console.warn('❌ Jan element not found or config missing');
        }

        console.log('✅ All tooltip texts updated from configuration');
    }

    setupAnimations() {
        this.updateTooltipTexts();
        this.debugElements();
        this.createMainTimeline();
        this.createAdvancedSVGAnimations();
        this.createDollarAnimations();
        this.createScrollTriggerAnimations();
        this.createCircularProgressAnimation();
        this.setupBackgroundLayerHoverEffects();
        this.optimizePerformance();
    }

    debugElements() {
        // Validation of SVG elements - debug output removed
        const elementsToCheck = [
            { name: 'Inner Hero', selector: '#inner-hero' },
            { name: 'Metric Logo', selector: '.metric-logo' },
            { name: 'Background', selector: '.background' },
            { name: 'Metric Background', selector: '.metric-background' },
            { name: 'Metric Background Gradient', selector: '.metric-background-gradient' },
            { name: 'Stroked Metric', selector: '.stroked-metric' },
            { name: 'Metric', selector: '.metric' },
            { name: 'Metric Line', selector: '.metric-line' },
            { name: 'Metric Glow', selector: '.metric-glow' },
            { name: 'Metric Glow Light', selector: '.metric-glow-light' },
            { name: 'First Tooltip Content', selector: '.first-tooltip-content' },
            { name: 'Second Tooltip Content', selector: '.second-tooltip-content' },
            { name: 'Third Tooltip Content One', selector: '.third-tooltip-content-one' },
            { name: 'Third Tooltip Content Two', selector: '.third-tooltip-content-two' },
            { name: 'Tooltip Stroke Elements', selector: '.first-tooltip-stroke, .second-tooltip-stroke, .third-tooltip-stroke' }
        ];

        // Element validation (logging removed)
        elementsToCheck.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
        });
    }

    createMainTimeline() {
        const tl = this.timeline;

        // Kill any existing animations on the main container to prevent conflicts
        gsap.killTweensOf("#revomo-animation");
        gsap.killTweensOf("#rotating-lines");

        // Set transform origin to center for zoom-out effect
        gsap.set("#revomo-animation", {
            transformOrigin: "center center"
        });

        // Initial setup - start with the entire SVG hidden
        gsap.set("#revomo-animation", {
            autoAlpha: 0
        });

        gsap.set("#rotating-lines", {
            opacity: 0
        });

        // Main fade-in reveal animation - 2 seconds duration
        // The entire SVG container fades in over 2 seconds
        tl.to("#revomo-animation", {
            autoAlpha: 1,
            duration: 2,
            ease: "power2.out",
            delay: 0.5 // Small delay to see the effect clearly
        });

        tl.to("#rotating-lines", {
            opacity: 1,
            duration: 0.1,
            ease: "power2.out",
        });
    }

    createAdvancedSVGAnimations() {
        // Create advanced timeline for SVG elements
        const advancedTl = gsap.timeline({ delay: 2.8 }); // Start after main animation

        // 1. Stagger reveal-in animation for #inner-hero
        this.createStaggerRevealAnimation(advancedTl);

        // 2. AutoAlpha reveal animations in sequence
        this.createAutoAlphaSequence(advancedTl);

        // 3. Tooltip animations
        this.createTooltipAnimations(advancedTl);

        // 4. Footer Content Animation
        this.createFooterContentAnimation(advancedTl);

        // 5. Background Layer 3D Cards Animation - starts 2 seconds after inner-hero
        this.createBackgroundLayer3DAnimation(advancedTl);

        // Start particle system after inner-hero animation completes
        if (this.particleSystem) {
            const staggerDuration = 1.2; // from createStaggerRevealAnimation
            const elementDuration = 0.8; // from createStaggerRevealAnimation
            const totalDuration = staggerDuration + elementDuration;
            advancedTl.call(() => {
                this.particleSystem.start();
            }, [], `stagger-start+=${totalDuration}`);
        }

        return advancedTl;
    }

    createStaggerRevealAnimation(tl) {
        const innerHero = document.querySelector("#inner-hero");

        if (!innerHero) {
            return;
        }

        // Get all direct children of inner-hero for stagger effect
        const staggerElements = Array.from(innerHero.children);

        // Set initial state - hidden
        gsap.set(staggerElements, {
            autoAlpha: 0,
            transformOrigin: "center center"
        });

        // Stagger reveal animation
        tl.to(staggerElements, {
            autoAlpha: 1,
            duration: 0.8,
            stagger: {
                amount: 1.2, // Total time for all elements
                from: "start", // Start from first element
                ease: "power2.out"
            },
            ease: "power2.out"
        }, "stagger-start");
    }

    createAutoAlphaSequence(tl) {
        // 2.1 Metric Logo
        const metricLogos = document.querySelectorAll('.metric-logo');
        if (metricLogos.length > 0) {
            gsap.set(metricLogos, { autoAlpha: 0 });
            tl.to(metricLogos, {
                autoAlpha: 1,
                duration: 0.6,
                ease: "power2.out"
            }, "sequence-start");
        }

        // 2.2 Background
        const backgrounds = document.querySelectorAll('.background');
        if (backgrounds.length > 0) {
            gsap.set(backgrounds, { autoAlpha: 0 });
            tl.to(backgrounds, {
                autoAlpha: 1,
                duration: 0.6,
                ease: "power2.out"
            }, "sequence-start+=0.3");
        }

        // 2.3 Metric Background & Gradient (together)
        const metricBgGrad = document.querySelectorAll('.metric-background-gradient');
        const combinedBgElements = [...metricBgGrad];

        if (combinedBgElements.length > 0) {
            gsap.set(combinedBgElements, { autoAlpha: 0 });
            tl.to(combinedBgElements, {
                autoAlpha: 1,
                duration: 0.6,
                ease: "power2.out"
            }, "sequence-start+=0.6");
        }

        // 2.4 Line Chart Metric Animation with sequential drawing using DrawSVG plugin
        const otherLineChartElements = [
            ...document.querySelectorAll('.metric'),
            ...document.querySelectorAll('.metric-line'),
            ...document.querySelectorAll('.metric-glow'),
            ...document.querySelectorAll('.metric-glow-light')
        ];

        // Animate line chart elements with DrawSVG sequential drawing animation
        if (otherLineChartElements.length > 0) {
            const drawingSVGElements = [];
            const fallbackElements = [];

            // Separate SVG path elements that can use DrawSVG from fallback elements
            otherLineChartElements.forEach((element, index) => {
                try {
                    // Check if it's a path element and has getTotalLength method
                    if (element.tagName.toLowerCase() === 'path' && typeof element.getTotalLength === 'function') {
                        const pathLength = element.getTotalLength();

                        // Set initial state - start completely hidden using DrawSVG
                        gsap.set(element, {
                            drawSVG: "0%", // Start with no stroke visible
                            autoAlpha: 1,
                            strokeWidth: element.getAttribute('stroke-width') || element.style.strokeWidth || '1.5',
                        });

                        drawingSVGElements.push({ element, pathLength, index });
                    } else {
                        throw new Error('Element is not a valid SVG path or lacks getTotalLength method');
                    }
                } catch (error) {
                    // Fallback to opacity animation for this element
                    gsap.set(element, { autoAlpha: 0 });
                    fallbackElements.push(element);
                }
            });

            // Create sequential drawing animation for valid paths using DrawSVG
            // All elements (.metric, .metric-line, .metric-glow, .metric-glow-light) use same duration and timing
            if (drawingSVGElements.length > 0) {
                const drawingDuration = 2.0; // Same duration for all elements
                const startDelay = 1.1; // Same start timing as original

                drawingSVGElements.forEach(({ element, pathLength, index }) => {
                    // Animate from 0% to 100% to create progressive drawing effect
                    tl.to(element, {
                        drawSVG: "100%", // Draw from start to end
                        duration: drawingDuration, // Same duration for all elements
                        ease: "power2.inOut"
                    }, `sequence-start+=${startDelay}`); // Same timing for all elements - no stagger
                });
            }

            // Animate fallback elements with opacity
            if (fallbackElements.length > 0) {
                tl.to(fallbackElements, {
                    autoAlpha: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out"
                }, "sequence-start+=1.1");
            }
        }

        // 2.5 Tooltip animations are now handled in createTooltipAnimations
    }

    createTooltipAnimations(tl) {
        const tooltips = [{
            name: 'First Tooltip',
            parts: [
                '.first-tooltip-stroke',
                '.first-tooltip-circle-stroke',
                '.first-tooltip-circle',
                '.first-tooltip-fill',
                '.first-tooltip-fill-stroke',
            ],
            content: '.first-tooltip-content'
        }, {
            name: 'Second Tooltip',
            parts: [
                '.second-tooltip-stroke',
                '.second-tooltip-circle-stroke',
                '.second-tooltip-circle',
                '.second-tooltip-fill',
                '.second-tooltip-fill-stroke',
            ],
            content: '.second-tooltip-content'
        }, {
            name: 'Third Tooltip',
            parts: [
                '.third-tooltip-stroke',
                '.third-tooltip-circle-stroke',
                '.third-tooltip-circle',
                '.third-tooltip-fill',
                '.third-tooltip-gradient',
                '.third-tooltip-fill-stroke'
            ],
            content: '.third-tooltip-content-one, .third-tooltip-content-two'
        }];

        const tooltipDelay = 2.5; // Delay between each tooltip animation

        tooltips.forEach((tooltip, index) => {
            const startTime = `sequence-start+=${1.4 + (index * tooltipDelay)}`;
            const tooltipParts = document.querySelectorAll(tooltip.parts.join(', '));
            const tooltipContent = document.querySelectorAll(tooltip.content);

            if (tooltipContent.length > 0) {
                // Animate content to start concurrently with the tooltip parts for a smoother effect.
                this.animateTooltipText(tl, tooltipContent, startTime);
            }

            if (tooltipParts.length > 0) {
                gsap.set(tooltipParts, {
                    autoAlpha: 0,
                    scale: 0.9,
                    transformOrigin: 'center center'
                });
                tl.to(tooltipParts, {
                    autoAlpha: 1,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out'
                }, startTime);
            }

            // Special handling for the third tooltip's gradient
            if (tooltip.name === 'Third Tooltip') {
                const gradients = document.querySelectorAll('.third-tooltip-gradient');
                gradients.forEach(gradient => {
                    const gradientStops = gradient.querySelectorAll('stop');
                    if (gradientStops.length > 0) {
                        gsap.set(gradientStops, {
                            attr: { 'stop-opacity': 0 }
                        });
                        tl.to(gradientStops, {
                            attr: { 'stop-opacity': 1 },
                            duration: 0.6,
                            ease: 'power2.out',
                            stagger: 0.2
                        }, startTime);
                    }
                });
            }

        });
    }

    animateTooltipText(tl, elements, startTime) {
        elements.forEach((element, index) => {
            // Add a 0.3s delay between each element's animation
            const position = (index === 0) ? startTime : "<+=0.3";

            if (element) {
                // Fallback for no SplitText or no text
                this.fallbackAnimate(tl, element, position);
            }
        });
    }

    fallbackAnimate(tl, element, position) {
        gsap.set(element, {
            autoAlpha: 0,
            y: 15,
        });
        tl.to(element, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
        }, position);
    }

    createFooterContentAnimation(tl) {
        // Get footer content elements
        const footerElements = document.querySelectorAll('.footer-content');

        if (footerElements.length === 0) {
            return;
        }

        // Filter elements that have text content (not just paths/lines)
        const textElements = Array.from(footerElements).filter(element =>
            element.textContent && element.textContent.trim().length > 0
        );

        if (textElements.length === 0) {
            // Animate all footer elements with simple alpha animation
            gsap.set(footerElements, {
                autoAlpha: 0,
                scale: 0.95
            });

            tl.to(footerElements, {
                autoAlpha: 1,
                scale: 1,
                duration: 0.6,
                stagger: {
                    amount: 0.3,
                    from: "start",
                    ease: "power2.out"
                },
                ease: "back.out(1.7)"
            }, "sequence-start+=3.0"); // Start after all other animations
            return;
        }

        // Animate text-based footer elements with SplitText if available
        textElements.forEach((element, index) => {
            if (SplitText && element.textContent.trim()) {
                try {
                    // Create SplitText instance for footer text animation
                    const splitText = new SplitText(element, {
                        type: "lines,words,chars",
                        linesClass: "split-line",
                        wordsClass: "split-word",
                        charsClass: "split-char"
                    });

                    // Set initial state for characters
                    gsap.set(splitText.chars, {
                        autoAlpha: 0,
                        y: 15,
                        scale: 0.9
                    });

                    // Animate characters with stagger
                    tl.to(splitText.chars, {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        stagger: {
                            amount: 0.2,
                            from: "start",
                            ease: "power2.out"
                        },
                        ease: "back.out(1.7)",
                        onComplete: () => {
                            // Cleanup SplitText for performance
                            splitText.revert();
                        }
                    }, `sequence - start+=${3.0 + (index * 0.05)}`);

                } catch (error) {
                    // Fallback animation
                    gsap.set(element, {
                        autoAlpha: 0,
                        y: 10,
                        scale: 0.95
                    });

                    tl.to(element, {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.4,
                        ease: "back.out(1.7)"
                    }, `sequence - start+=${3.0 + (index * 0.05)}`);
                }
            } else {
                // Fallback animation when SplitText is not available
                gsap.set(element, {
                    autoAlpha: 0,
                    y: 10,
                    scale: 0.95
                });

                tl.to(element, {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)"
                }, `sequence - start+=${3.0 + (index * 0.05)}`);
            }
        });
    }

    createBackgroundLayer3DAnimation(tl) {
        // Get all background layer figure elements
        const backgroundFigures = document.querySelectorAll('.background-layer-figure');

        if (backgroundFigures.length === 0) {
            console.warn('No background layer figures found for 3D animation');
            return;
        }

        // PERFORMANCE OPTIMIZATION: Set initial state - completely hidden until animation starts
        gsap.set(backgroundFigures, {
            autoAlpha: 0, // Completely hidden (visibility: hidden + opacity: 0)
            scale: 1.4,
            rotationY: -25,
            rotationX: 15,
            z: -150,
            transformOrigin: "center center",
            transformStyle: "preserve-3d"
        });

        // Make the parent container visible before starting the animation
        gsap.set('.background-layer', { autoAlpha: 1 });

        // PERFORMANCE OPTIMIZATION: Disable pointer events during animation
        gsap.set(backgroundFigures, {
            pointerEvents: "none"
        });

        // Create the 3D cards floating down animation
        // Starts 2 seconds after the inner-hero stagger animation begins
        tl.to(backgroundFigures, {
            autoAlpha: 0.5, // Reveal and set to target opacity
            scale: 1,
            rotationY: 0,
            rotationX: 0,
            z: 0,
            duration: 1.5,
            stagger: {
                amount: 2.0, // Total stagger duration
                from: "random", // Random order for more organic feel
                ease: "power2.out"
            },
            ease: "power3.out",
            transformOrigin: "center center"
        }, "stagger-start+=2.0"); // Start 2 seconds after inner-hero animation

        // PERFORMANCE OPTIMIZATION: Enable pointer events after animation completes
        tl.set(backgroundFigures, {
            pointerEvents: "auto"
        }, "stagger-start+=4.0"); // Enable hover after cards have settled
    }

    setupBackgroundLayerHoverEffects() {
        const backgroundFigures = document.querySelectorAll('.background-layer-figure');
        const backgroundLayer = document.querySelector('.background-layer');

        if (backgroundFigures.length === 0 || !backgroundLayer) {
            console.warn('Background layer elements not found for hover effects');
            return;
        }

        // Force enable pointer events immediately for iframe compatibility
        gsap.set(backgroundFigures, {
            pointerEvents: "auto",
            cursor: "pointer"
        });

        // Enhanced hover effects with GSAP for smoother animations
        // Also support touch events for mobile and iframe compatibility
        backgroundFigures.forEach((figure, index) => {

            const handleHoverEnter = () => {
                // Animate the hovered figure
                gsap.to(figure, {
                    autoAlpha: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });

                // Slightly fade other figures for focus effect
                backgroundFigures.forEach((otherFigure, otherIndex) => {
                    if (otherIndex !== index) {
                        gsap.to(otherFigure, {
                            autoAlpha: 0.1,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                });
            };

            const handleHoverLeave = () => {
                // Reset the hovered figure
                gsap.to(figure, {
                    autoAlpha: 0.5,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });

                // Restore opacity to all other figures
                backgroundFigures.forEach((otherFigure, otherIndex) => {
                    if (otherIndex !== index) {
                        gsap.to(otherFigure, {
                            autoAlpha: 0.5,
                            duration: 0.3,
                            ease: "power2.out"
                        });
                    }
                });
            };

            // Mouse events for desktop
            figure.addEventListener('mouseenter', handleHoverEnter, { passive: true });
            figure.addEventListener('mouseleave', handleHoverLeave, { passive: true });

            // Touch events for mobile and iframe compatibility
            figure.addEventListener('touchstart', handleHoverEnter, { passive: true });
            figure.addEventListener('touchend', handleHoverLeave, { passive: true });

            // Focus events for accessibility and iframe compatibility
            figure.addEventListener('focus', handleHoverEnter, { passive: true });
            figure.addEventListener('blur', handleHoverLeave, { passive: true });

            // Make figures focusable for iframe interaction
            figure.setAttribute('tabindex', '0');
            figure.setAttribute('role', 'button');
            figure.setAttribute('aria-label', `Interactive element ${index + 1}`);
        });

        // Add global event listener to detect iframe interaction capability
        document.addEventListener('mousemove', () => {
            // Force enable interactions if mouse movement is detected
            backgroundFigures.forEach(figure => {
                gsap.set(figure, {
                    pointerEvents: "auto",
                    cursor: "pointer"
                });
            });
        }, { once: true, passive: true });

        console.log('Background layer hover effects setup complete with iframe compatibility');
    }

    createScrollTriggerAnimations() {
        if (!window.ScrollTrigger) return;

        // Create scroll-triggered animations for future sections
        ScrollTrigger.create({
            trigger: "#hero-section",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                gsap.to("#revomo-animation", {
                    scale: 1 - (progress * 0.2),
                    opacity: 1 - (progress * 0.5),
                    duration: 0.3
                });
            }
        });

        // Parallax effect for hero content
        ScrollTrigger.create({
            trigger: "#hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                gsap.set(".hero-content", {
                    y: progress * -100
                });
            }
        });
    }

    createDollarAnimations() {
        // Get all dollar elements
        const dollarElements = document.querySelectorAll('.dollar');

        if (dollarElements.length === 0) {
            return;
        }

        // Set initial state - hidden and scaled down
        gsap.set(dollarElements, {
            scale: 0,
            opacity: 0,
            transformOrigin: "center center"
        });

        const floatElement = (element) => {
            const moveRange = 15; // The range of movement in pixels
            const duration = 3 + Math.random() * 3; // Duration of each movement (3-6s)

            gsap.to(element, {
                x: gsap.utils.random(-moveRange, moveRange, 1),
                y: gsap.utils.random(-moveRange, moveRange, 1),
                rotation: gsap.utils.random(-10, 10, 1),
                duration: duration,
                ease: "sine.inOut",
                onComplete: floatElement, // Create a seamless loop
                onCompleteParams: [element] // Pass the element to the next call
            });
        };

        // Create staggered spring-like reveal animation
        const dollarTl = gsap.timeline({
            delay: 4.5,
            onComplete: () => {
                dollarElements.forEach(floatElement);
            }
        });

        dollarTl.to(dollarElements, {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "back.out(2.5)",
            stagger: {
                amount: 0.6,
                from: "start"
            }
        });

        return dollarTl;
    }

    createCircularProgressAnimation() {
        // Circular progress animation removed - no .progress-circle elements exist in DOM
        // This method is kept to maintain the class structure
    }

    optimizePerformance() {
        // GPU acceleration and cleanup
        gsap.set("#revomo-animation", {
            force3D: true,
            transformPerspective: 1000
        });

        // Cleanup function for performance
        this.cleanup = () => {
            ScrollTrigger?.killAll();
            this.timeline.kill();
            gsap.killTweensOf("#revomo-animation");
            gsap.killTweensOf("#rotating-lines");
        };
    }

    // Method to destroy the animation system
    destroy() {
        if (this.cleanup) {
            this.cleanup();
        }
        this.animationsSetup = false;
    }
}

// Simple Particle System
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particle-container');
        this.particles = [];
        this.maxParticles = 75; // Set a medium number of particles

        // Size thresholds
        this.minSize = 1.44;
        this.maxSize = 5;

        // Shape types
        this.shapeTypes = ['circle', 'star']; // Only circles and stars

        // Add resize handler to prevent animation shifting
        this.setupResizeHandler();
        this.init();
    }

    init() {
        // Will be started by RevomoAnimationSystem
    }

    setupResizeHandler() {
        // Debounced resize handler to prevent animation shifting
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Ensure container maintains proper centering after resize
                if (this.container) {
                    gsap.set(this.container, {
                        clearProps: "all"
                    });
                }
            }, 100);
        });
    }

    start() {
        this.startAnimation();
    }

    createParticle() {
        const shapeType = this.getRandomShape();
        const size = this.getRandomSize();

        let element;
        let color, opacity;

        // Determine color and opacity
        if (Math.random() < 0.8) {
            // 80% of particles
            color = '#ACA0E4';
            opacity = 0.8;
        } else {
            // 20% of particles
            color = '#7A42EB';
            opacity = 0.4;
        }

        // Create different shapes
        switch (shapeType) {
            case 'circle':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                element.setAttribute('r', size / 2);
                element.setAttribute('cx', 0);
                element.setAttribute('cy', 0);
                break;

            case 'star':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                element.setAttribute('href', '#particle-star');
                element.setAttribute('transform', `scale(${size / 2.5})`);
                break;
        }

        // Set consistent styling
        element.setAttribute('fill', color);
        element.setAttribute('opacity', opacity);
        element.classList.add('particle');

        return {
            element,
            size,
            shapeType,
            isActive: true
        };
    }

    getRandomShape() {
        // 95% circles, 5% stars
        if (Math.random() < 0.95) {
            return 'circle';
        } else {
            return 'star';
        }
    }

    getRandomSize() {
        return this.minSize + Math.random() * (this.maxSize - this.minSize);
    }

    getOpacityBasedOnSize(size) {
        // This function is no longer used for opacity, but we can keep it in case it's needed elsewhere.
        const sizeRange = this.maxSize - this.minSize;
        const sizeRatio = (size - this.minSize) / sizeRange;
        return 0.1 + (sizeRatio * 0.9);
    }

    spawnParticle() {
        if (this.particles.length >= this.maxParticles || !this.container) return;

        const particle = this.createParticle();

        // Use the particle container's coordinate system (centered)
        const containerCenterX = 1250 / 2; // 625
        const containerCenterY = 679 / 2; // 339.5

        // Start particles from the center area with slight offset
        const startX = containerCenterX + (Math.random() - 0.5) * 40;
        const startY = containerCenterY * 0.85 + (Math.random() - 0.5) * 40;

        // Position the particle in container coordinates
        gsap.set(particle.element, {
            x: startX,
            y: startY,
            rotation: Math.random() * 360,
            opacity: 0 // Start with opacity 0 and fade in
        });

        // Add to DOM
        this.container.appendChild(particle.element);
        this.particles.push(particle);

        // Animate particle scattering
        this.animateParticle(particle, startX, startY);
    }

    animateParticle(particle, startX, startY) {
        // Container dimensions
        const containerWidth = 1250;
        const containerHeight = 679;

        // Reduce travel distance to keep particles more contained and gentle
        const travelDistanceX = Math.random() * (containerWidth / 2.5); // Keep X-axis travel within a tighter bound
        const direction = Math.random() < 0.5 ? -1 : 1;
        const endX = startX + (direction * travelDistanceX);

        const travelDistanceY = (Math.random() - 0.5) * (containerHeight * 0.8); // Constrain Y-axis travel
        const endY = startY + travelDistanceY + 70; // Add a downward drift

        const duration = 8 + Math.random() * 4; // Slower, more gentle animation (8-12 seconds)

        // Get the final opacity from the element itself, which was set in createParticle
        const finalOpacity = particle.element.getAttribute('opacity');

        gsap.to(particle.element, {
            x: endX,
            y: endY,
            opacity: finalOpacity, // Animate to the final opacity
            rotation: `+=${(Math.random() - 0.5) * 180}`, // Less rotation
            duration: duration,
            ease: "power2.out" // A gentler ease out
            // No onComplete, so particles remain
        });
    }

    removeParticle(particle) {
        // Remove from DOM
        if (particle.element.parentNode) {
            particle.element.parentNode.removeChild(particle.element);
        }

        // Remove from particles array
        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
        }
    }

    startAnimation() {
        // Spawn all particles at once with a slight delay
        for (let i = 0; i < this.maxParticles; i++) {
            setTimeout(() => this.spawnParticle(), i * 20); // Stagger the spawn
        }
    }

    destroy() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        this.particles.forEach(particle => this.removeParticle(particle));
    }
}

class DiagonalParticleSystem {
    constructor() {
        this.container = document.getElementById('falling-particles');
        this.particles = [];
        this.maxParticles = 45; // Increased from 25 for higher density
        this.spawnRate = 150; // Reduced from 250 for more frequent spawning (denser)
        this.beamWidth = 300;
        this.beamAngle = 135; // Angle for diagonal particle movement
        this.spawnInterval = null;

        // Particle settings
        this.minSize = 1;
        this.maxSize = 3;
        this.shapeTypes = ['circle', 'square', 'star', 'polygon'];
    }

    init() {
        if (!this.container) {
            console.warn('Diagonal particle container not found');
            return false;
        }

        this.setupResizeHandler();
        this.startAnimation();

        console.log('Diagonal particle system initialized');
        return true;
    }

    setupResizeHandler() {
        // Debounced resize handler to prevent animation shifting
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Ensure diagonal particles container maintains proper centering after resize
                if (this.container) {
                    gsap.set(this.container, {
                        clearProps: "all"
                    });
                }
            }, 100);
        });
    }

    createParticle() {
        const shapeType = this.getRandomShape();
        const size = this.getRandomSize();
        const opacity = this.getOpacityBasedOnSize(size);

        let element;

        switch (shapeType) {
            case 'circle':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                element.setAttribute('r', size / 2);
                element.setAttribute('cx', 0);
                element.setAttribute('cy', 0);
                break;

            case 'square':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                element.setAttribute('width', size);
                element.setAttribute('height', size);
                element.setAttribute('x', -size / 2);
                element.setAttribute('y', -size / 2);
                break;

            case 'star':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                element.setAttribute('href', '#particle-star');
                element.setAttribute('transform', `scale(${size / 3})`);
                break;

            case 'polygon':
                element = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                element.setAttribute('href', '#particle-polygon');
                element.setAttribute('transform', `scale(${size / 2.5})`);
                break;
        }

        // Use neutral particle styling
        element.setAttribute('fill', '#ACA0E4'); // Neutral color
        element.setAttribute('opacity', opacity);
        element.classList.add('diagonal-particle');

        return {
            element,
            size,
            shapeType,
            isActive: true
        };
    }

    getRandomShape() {
        return this.shapeTypes[Math.floor(Math.random() * this.shapeTypes.length)];
    }

    getRandomSize() {
        return this.minSize + Math.random() * (this.maxSize - this.minSize);
    }

    getOpacityBasedOnSize(size) {
        const sizeRange = this.maxSize - this.minSize;
        const sizeRatio = (size - this.minSize) / sizeRange;
        return 0.3 + (sizeRatio * 0.7); // 30% to 100% opacity
    }

    spawnParticle() {
        if (!this.container) {
            console.warn('Cannot spawn particle: missing container');
            return;
        }

        if (this.particles.length >= this.maxParticles) {
            const oldestParticle = this.particles[0];
            if (oldestParticle) {
                this.removeParticle(oldestParticle);
            }
        }

        const particle = this.createParticle();

        // Use container coordinate system (1250x679)
        const containerWidth = 1250;
        const containerHeight = 679;

        // Spawn particles inside the rotated beam, starting from top-right area of container
        const distAlongBeam = Math.random() * 200; // Spawn within the first 200px of the beam's length
        const distAcrossBeam = (Math.random() - 0.5) * this.beamWidth * 0.9; // Use 90% of beam width

        const angleRad = this.beamAngle * Math.PI / 180;

        // Convert from beam's local coordinates to rotated coordinates
        const localX = distAlongBeam;
        const localY = distAcrossBeam;
        const rotatedX = localX * Math.cos(angleRad) - localY * Math.sin(angleRad);
        const rotatedY = localX * Math.sin(angleRad) + localY * Math.cos(angleRad);

        // Translate to the beam's origin point at the top-right area of the container
        const spawnX = containerWidth + rotatedX;
        const spawnY = 0 + rotatedY;

        gsap.set(particle.element, {
            x: spawnX,
            y: spawnY,
            rotation: Math.random() * 360,
            opacity: 0
        });

        this.container.appendChild(particle.element);
        this.particles.push(particle);

        this.animateParticle(particle, spawnX, spawnY);
    }

    animateParticle(particle, startX, startY) {
        const angleRad = this.beamAngle * Math.PI / 180;
        // Travel far enough to cross the entire container
        const containerHeight = 679;
        const travelDist = (containerHeight / Math.sin(angleRad)) * 1.5;

        // Add slight random drift to make movement feel more natural
        const driftAngle = (Math.random() - 0.5) * 0.1; // +/- 0.05 radians from beam angle
        const finalAngle = angleRad + driftAngle;

        const endX = startX + travelDist * Math.cos(finalAngle);
        const endY = startY + travelDist * Math.sin(finalAngle);

        const duration = 20 + Math.random() * 10; // Slower, more gentle movement (20-30 seconds)

        const tl = gsap.timeline({ onComplete: () => this.removeParticle(particle) });

        tl.to(particle.element, {
            opacity: this.getOpacityBasedOnSize(particle.size),
            duration: 1,
            ease: "power2.inOut"
        })
            .to(particle.element, {
                x: endX,
                y: endY,
                rotation: `+=${(Math.random() - 0.5) * 270}`,
                duration: duration,
                ease: "none"
            }, 0)
            .to(particle.element, {
                opacity: 0,
                duration: 2,
                ease: "power2.in"
            }, ">-2");
    }

    removeParticle(particle) {
        if (particle.element.parentNode) {
            particle.element.parentNode.removeChild(particle.element);
        }

        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
        }
    }

    startAnimation() {
        // Clear any existing interval
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }

        // Start continuous spawning loop
        this.spawnInterval = setInterval(() => {
            this.spawnParticle();
        }, this.spawnRate);

        // Initial particles with staggered timing for immediate effect
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.spawnParticle(), i * 100);
        }

        console.log('Diagonal particle animation started');
    }

    destroy() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        this.particles.forEach(particle => this.removeParticle(particle));
    }
}

// Debug function to verify iframe interactions
function debugIframeInteractions() {
    const backgroundFigures = document.querySelectorAll('.background-layer-figure');

    console.log('🔍 Iframe Interaction Debug:');
    console.log(`Found ${backgroundFigures.length} background figures`);

    backgroundFigures.forEach((figure, index) => {
        const styles = window.getComputedStyle(figure);
        console.log(`Figure ${index + 1}:`, {
            pointerEvents: styles.pointerEvents,
            cursor: styles.cursor,
            position: styles.position,
            zIndex: styles.zIndex,
            opacity: styles.opacity
        });

        // Add visual debug indicator
        figure.addEventListener('mouseenter', () => {
            console.log(`✅ Hover detected on figure ${index + 1}`);
        });
    });

    // Test iframe detection
    const isInIframe = window.self !== window.top;
    console.log(`Running in iframe: ${isInIframe}`);

    return {
        figureCount: backgroundFigures.length,
        isInIframe,
        interactionsEnabled: backgroundFigures.length > 0
    };
}

// Make debug function globally available
window.debugIframeInteractions = debugIframeInteractions;

// Single initialization function to prevent duplicates
async function initializeRevomoAnimation() {
    // Prevent multiple initializations
    if (isInitialized) {
        console.warn('Revomo animation already initialized');
        return;
    }

    // Check if containers exist
    if (!document.getElementById('falling-particles')) {
        console.warn('Particle container not found, skipping initialization');
        return;
    }

    try {
        isInitialized = true;

        // Initialize particle systems
        globalParticleSystem = new ParticleSystem();
        globalDiagonalParticleSystem = new DiagonalParticleSystem();

        // Initialize main animation system
        globalAnimationSystem = new RevomoAnimationSystem(globalParticleSystem);
        await globalAnimationSystem.init();

        // Start the diagonal particle system
        globalDiagonalParticleSystem.init();

        // Add cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (globalAnimationSystem) {
                globalAnimationSystem.destroy();
            }
            if (globalParticleSystem) {
                globalParticleSystem.destroy();
            }
            if (globalDiagonalParticleSystem) {
                globalDiagonalParticleSystem.destroy();
            }
        });

        // Auto-debug in iframe context
        setTimeout(() => {
            if (window.self !== window.top) {
                console.log('🎯 Iframe detected - running interaction debug');
                debugIframeInteractions();
            }
        }, 5000);

        console.log('Revomo animation system initialized successfully');
    } catch (error) {
        console.error('Error initializing animation systems:', error);
        isInitialized = false; // Reset flag on error to allow retry
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeRevomoAnimation);
} else {
    // DOM is already ready
    initializeRevomoAnimation();
}
