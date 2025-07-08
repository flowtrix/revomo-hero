import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

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

        tl.fromTo(circle, {
            motionPath: {
                path: path,
                align: path,
                alignOrigin: [0.5, 0.5],
                start: 1,
                end: 0.25,
            },
            autoAlpha: 1
        }, {
            motionPath: {
                path: path,
                align: path,
                alignOrigin: [0.5, 0.5],
                start: 1,
                end: 0.25,
            },
            duration: 5,
            ease: "none",
        }, index * 0.5)
            .to(circle, { autoAlpha: 0, duration: 1 }, (index * 0.5) + 4);
    });
}

createPipeAnimations();
