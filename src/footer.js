import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

// Global variable for circular particle system
let globalCircularParticleSystem = null;

gsap.to(".orbi-outer-turbine", {
    rotation: -360,
    duration: 20,
    repeat: -1,
    ease: "none",
    transformOrigin: "center center"
});

gsap.to(".orbi-inner-turbine", {
    rotation: -360,
    duration: 20,
    repeat: -1,
    ease: "none",
    transformOrigin: "center center"
});


function createPipeAnimations() {
    console.log("Creating pipe animations...");
    const pipes = [
        { circle: "#left-circle", path: "#left-pipe-line" },
        { circle: "#center-circle", path: "#center-pipe-line" },
        { circle: "#right-circle", path: "#right-pipe-line" },
    ];

    const tl = gsap.timeline({ repeat: -1, delay: 1 });

    pipes.forEach((pipe, index) => {
        const path = document.querySelector(pipe.path);
        const circle = document.querySelector(pipe.circle);

        if (!path) {
            console.error(`Path not found for ${pipe.path}`);
            return;
        }
        if (!circle) {
            console.error(`Circle not found for ${pipe.circle}`);
            return;
        }

        console.log(`Animating ${pipe.circle} along ${pipe.path}`);

        const length = path.getTotalLength();
        console.log(`Path length for ${pipe.path}: ${length}`);

        // Set initial state
        gsap.set(circle, { autoAlpha: 0 });

        tl.to(circle, {
            motionPath: {
                path: path,
                align: path,
                alignOrigin: [0.5, 0.5],
                start: 1,
                end: 0.25,
            },
            autoAlpha: 1,
            duration: 5,
            ease: "none",
        }, index * 0.5)
            .to(circle, { autoAlpha: 0, duration: 1 }, (index * 0.5) + 4);
    });
}

createPipeAnimations();

// Circular Particle System for multi-directional scatter animation
class CircularParticleSystem {
    constructor() {
        this.container = document.getElementById('circular-particle-container');
        this.particles = [];
        this.maxParticles = 90; // Total particles across all directions (increased for 9 directions)
        this.spawnRate = 700; // Spawn interval in milliseconds (even slower spawning)
        this.spawnInterval = null;

        // Particle settings
        this.minSize = 1.44;
        this.maxSize = 5;
        this.shapeTypes = ['circle', 'star']; // Only circles and stars

        // Circular directions: wider top coverage for more horizontal spread
        this.directions = [
            { name: 'quarter-left', angle: 160 },      // Quarter left (slightly upward)
            { name: 'left-top', angle: 135 },          // Left-top diagonal
            { name: 'top-left-wide', angle: 110 },     // Wide top-left
            { name: 'top-left', angle: 100 },          // Top-left
            { name: 'top', angle: 90 },                // Straight up
            { name: 'top-right', angle: 80 },          // Top-right
            { name: 'top-right-wide', angle: 70 },     // Wide top-right
            { name: 'top-right-diagonal', angle: 45 }, // Top-right diagonal
            { name: 'quarter-right', angle: 20 }       // Quarter right (slightly upward)
        ];

        this.setupResizeHandler();
    }

    init() {
        if (!this.container) {
            console.warn('Circular particle container not found');
            return false;
        }

        this.startAnimation();
        console.log('Circular particle system initialized');
        return true;
    }

    setupResizeHandler() {
        // Debounced resize handler to prevent animation shifting
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Ensure circular particles container maintains proper centering after resize
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

        let element;
        let color, opacity;

        // Determine color and opacity (same as original ParticleSystem)
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
                element.setAttribute('href', '#circular-particle-star');
                element.setAttribute('transform', `scale(${size / 2.5})`);
                break;
        }

        // Set consistent styling
        element.setAttribute('fill', color);
        element.setAttribute('opacity', opacity);
        element.classList.add('circular-particle');

        return {
            element,
            size,
            shapeType,
            isActive: true
        };
    }

    getRandomShape() {
        // 80% circles, 20% stars (as requested)
        if (Math.random() < 0.8) {
            return 'circle';
        } else {
            return 'star';
        }
    }

    getRandomSize() {
        return this.minSize + Math.random() * (this.maxSize - this.minSize);
    }

    spawnCircularBurst() {
        if (!this.container) {
            console.warn('Cannot spawn circular burst: missing container');
            return;
        }

        // Remove excess particles if needed
        while (this.particles.length >= this.maxParticles) {
            const oldestParticle = this.particles[0];
            if (oldestParticle) {
                this.removeParticle(oldestParticle);
            }
        }

        // Container dimensions
        const containerWidth = 1250;
        const containerHeight = 679;
        const containerCenterX = containerWidth / 2; // 625
        const containerCenterY = containerHeight / 2; // 339.5

        // Spawn particles in all 5 directions simultaneously
        this.directions.forEach((direction, index) => {
            const particle = this.createParticle();

            // Start particles from very bottom area with slight offset
            const startX = containerCenterX + (Math.random() - 0.5) * 30;
            const startY = containerHeight * 0.95 + (Math.random() - 0.5) * 20; // Start from bottom 95% area (much lower)

            // Position the particle in container coordinates
            gsap.set(particle.element, {
                x: startX,
                y: startY,
                rotation: Math.random() * 360,
                autoAlpha: 0 // Start with autoAlpha 0 for smooth appearance
            });

            // Add to DOM
            this.container.appendChild(particle.element);
            this.particles.push(particle);

            // Animate particle in the specific direction
            this.animateParticleInDirection(particle, startX, startY, direction);
        });
    }

    animateParticleInDirection(particle, startX, startY, direction) {
        // Container dimensions
        const containerWidth = 1250;
        const containerHeight = 679;

        // Convert angle to radians
        const angleRad = direction.angle * Math.PI / 180;

        // Calculate travel distance based on direction - increased for much farther travel
        let travelDistance = 800 + Math.random() * 500; // 500-800 pixels travel (much farther reach)

        // Apply 70% distance limit for all directions for optimal visual effect
        travelDistance = travelDistance * 0.62; // 70% of the full calculated distance

        // Calculate end position based on angle
        const endX = startX + Math.cos(angleRad) * travelDistance;
        const endY = startY - Math.sin(angleRad) * travelDistance; // Negative because Y increases downward

        const duration = 22 + Math.random() * 8; // 22-30 seconds for ultra slow, dreamy movement

        // Get the final opacity from the element itself, which was set in createParticle
        const finalOpacity = particle.element.getAttribute('opacity');

        // Create timeline for smooth fade in, movement, and fade out
        const tl = gsap.timeline({
            onComplete: () => this.removeParticle(particle)
        });

        // Smooth fade in with autoAlpha
        tl.to(particle.element, {
            autoAlpha: finalOpacity,
            duration: 2.5,
            ease: "power2.out"
        })
            // Move in direction with slower rotation
            .to(particle.element, {
                x: endX,
                y: endY,
                rotation: `+=${(Math.random() - 0.5) * 120}`, // Reduced rotation for gentler movement
                duration: duration,
                ease: "power1.out" // Gentler easing for slower feel
            }, 0)
            // Smooth fade out with autoAlpha towards the end
            .to(particle.element, {
                autoAlpha: 0,
                duration: 4.5,
                ease: "power2.in"
            }, ">-4.5");
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
        // Clear any existing interval
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }

        // Start infinite loop spawning
        this.spawnInterval = setInterval(() => {
            this.spawnCircularBurst();
        }, this.spawnRate);

        // Initial burst for immediate effect (slower start)
        setTimeout(() => this.spawnCircularBurst(), 800);

        console.log('Circular particle animation started');
    }

    destroy() {
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
        }
        this.particles.forEach(particle => this.removeParticle(particle));
    }
}

// Initialize circular particle system
function initializeCircularParticleSystem() {
    // Initialize the circular particle system
    globalCircularParticleSystem = new CircularParticleSystem();

    // Start the circular particle system
    globalCircularParticleSystem.init();

    // Add cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (globalCircularParticleSystem) {
            globalCircularParticleSystem.destroy();
        }
    });

    console.log('Circular particle system initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCircularParticleSystem);
} else {
    // DOM is already ready
    initializeCircularParticleSystem();
}
