import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// Register plugins
gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export class RevealLightAnimation {
    constructor(containerSelector = 'svg') {
        this.container = document.querySelector(containerSelector);
        this.masterTimeline = null;
        this.isInitialized = false;
    }

    // Initialize the animation
    init() {
        if (this.isInitialized) {
            return;
        }

        if (!this.container) {
            console.error('Animation container not found');
            return;
        }

        this.createMasterTimeline();
        this.isInitialized = true;
    }

    // Create the master timeline with ScrollTrigger
    createMasterTimeline() {
        this.masterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: this.container,
                start: 'top center',
                end: 'bottom center',
                scrub: 1,
                markers: true, // Set to true for debugging
                onComplete: () => {
                    console.log('Reveal light animation complete!');
                }
            }
        });

        this.buildAnimationSequence();
    }

    // Build the simplified animation sequence
    buildAnimationSequence() {
        const circles = '.small-circle, .medium-circle, .large-circle';
        const paths = '.triangle-path, .star-path';
        const glows = '.glow-group';

        this.masterTimeline
            .set(circles, { autoAlpha: 0, scale: 0, transformOrigin: 'center' })
            .set(paths, { drawSVG: '0%', autoAlpha: .4 })
            .set(glows, { autoAlpha: 0 });

        this.masterTimeline
            .to(circles, {
                autoAlpha: .5,
                scale: 1,
                duration: 1,
                ease: 'back.out(1.7)',
                stagger: {
                    amount: 0.5,
                    from: 'random'
                }
            })
            .to(glows, {
                autoAlpha: (index, target) => parseFloat(target.getAttribute('opacity')) || 1,
                duration: 2,
                ease: 'power2.inOut',
                stagger: {
                    amount: 0.5
                }
            }, "-=1.5")
            .to(paths, {
                drawSVG: '100%',
                duration: 2,
                ease: 'power1.inOut',
                stagger: {
                    amount: 1,
                    from: 'random'
                }
            }, "-=0.5");
    }


    // Method to refresh ScrollTrigger (useful for dynamic content)
    refresh() {
        if (ScrollTrigger) {
            ScrollTrigger.refresh();
        }
    }

    // Method to destroy the animation and cleanup
    destroy() {
        if (this.masterTimeline) {
            this.masterTimeline.kill();
            this.masterTimeline = null;
        }

        if (ScrollTrigger) {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }

        this.isInitialized = false;
        console.log('RevealLightAnimation destroyed');
    }

    // Method to pause the animation
    pause() {
        if (this.masterTimeline) {
            this.masterTimeline.pause();
        }
    }

    // Method to resume the animation
    resume() {
        if (this.masterTimeline) {
            this.masterTimeline.resume();
        }
    }

    // Method to restart the animation
    restart() {
        if (this.masterTimeline) {
            this.masterTimeline.restart();
        }
    }
}

// Factory function for easy initialization
export function createRevealLightAnimation(containerSelector) {
    return new RevealLightAnimation(containerSelector);
}

// Auto-initialize if DOM is ready and container exists
export function autoInitRevealLight(containerSelector = 'svg') {
    const initAnimation = () => {
        const animation = new RevealLightAnimation(containerSelector);
        animation.init();
        return animation;
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimation);
    } else {
        return initAnimation();
    }
}

// Default export
export default RevealLightAnimation;
