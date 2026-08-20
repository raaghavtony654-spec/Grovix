document.addEventListener('DOMContentLoaded', () => {
    // 1. Text Animation (Fade up words and subtitle/button)
    const words = document.querySelectorAll('.hero-title .word');
    const subtitle = document.querySelector('.hero-subtitle');
    const btn = document.querySelector('.get-in-touch-btn');

    // Stagger text animation
    words.forEach((word, index) => {
        setTimeout(() => {
            word.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.25, 1), opacity 0.8s ease';
            word.style.transform = 'translateY(0)';
            word.style.opacity = '1';
        }, 100 + (index * 80));
    });

    setTimeout(() => {
        subtitle.style.transition = 'transform 1s cubic-bezier(0.25, 1, 0.25, 1), opacity 1s ease';
        subtitle.style.transform = 'translateY(0)';
        subtitle.style.opacity = '1';
    }, 600);

    setTimeout(() => {
        btn.style.transition = 'transform 1s cubic-bezier(0.25, 1, 0.25, 1), opacity 1s ease, background-color 0.3s ease, box-shadow 0.3s ease';
        btn.style.transform = 'translateY(0)';
        btn.style.opacity = '1';
    }, 800);

    // 2. Hands Load-in Animation
    const roboticHand = document.querySelector('.robotic-hand');
    const humanHand = document.querySelector('.human-hand');
    const spark = document.querySelector('.spark');

    setTimeout(() => {
        roboticHand.style.transition = 'transform 3.5s cubic-bezier(0.25, 1, 0.25, 1)';
        roboticHand.style.transform = 'translate(0px, -50%) rotate(4deg)'; 
        
        humanHand.style.transition = 'transform 3.5s cubic-bezier(0.25, 1, 0.25, 1)';
        humanHand.style.transform = 'translate(0px, -50%)';
    }, 500);

    // Optional: Add a small spark/flash when they "meet"
    setTimeout(() => {
        spark.style.transition = 'transform 0.2s ease-out, opacity 0.5s ease-out';
        spark.style.transform = 'translate(-50%, -50%) scale(1)';
        spark.style.opacity = '1';
        
        setTimeout(() => {
            spark.style.opacity = '0';
            spark.style.transform = 'translate(-50%, -50%) scale(2)';
        }, 200);
    }, 3800); // 500ms delay + ~3300ms animation progress
    
    // Enable floating animation only after slide-in finishes
    setTimeout(() => {
        roboticHand.dataset.loaded = 'true';
    }, 4000);
    // Continuous floating and parallax effect
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (window.innerWidth / 2 - e.clientX) / 50;
        mouseY = (window.innerHeight / 2 - e.clientY) / 50;
        
        document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    const bigBangCircle = document.getElementById('big-bang-circle');
    const root = document.documentElement;

    // Scroll Animation Logic
    window.addEventListener('scroll', () => {
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));

        // Phase 1: 0.0 -> 0.3 (Move fingers from a gap to perfectly touch)
        let closeProgress = Math.min(progress / 0.3, 1);
        let additionalRoboticX = -2.5 + (closeProgress * 3.3); // start with a left gap, move right by 3.3vw (ends at 0.8)
        let additionalHumanX = 2.5 + (closeProgress * -3.3); // start with a right gap, move left by -3.3vw (ends at -0.8)

        // Phase 2 & 3: 0.3 -> 0.8 (Charge and Expand circle)
        let circleProgress = 0;
        if (progress > 0.3) {
            circleProgress = Math.min((progress - 0.3) / 0.5, 1);
        }
        
        // Easing for circle: starts slow (charging), then explodes
        let circleScale = 0;
        let circleGlow = 0;
        if (circleProgress > 0) {
            if (circleProgress < 0.4) {
                // Charging (0.3 to 0.5)
                circleScale = circleProgress * 12.5; 
                circleGlow = circleProgress * 50;
            } else {
                // Exploding (0.5 to 0.8)
                circleScale = 5 + Math.pow((circleProgress - 0.4) / 0.6, 3) * 300;
                circleGlow = 20;
            }
        }
        bigBangCircle.style.transform = `translate(-50%, -50%) scale(${circleScale})`;
        bigBangCircle.style.boxShadow = `0 0 ${circleGlow}px ${circleGlow/2}px rgba(0,0,0,0.8)`;

        // Phase 4: 0.8 -> 1.0 (Dark mode toggle and hands fade)
        let darkProgress = 0;
        if (progress > 0.8) {
            darkProgress = (progress - 0.8) / 0.2; // 0 to 1
        }
        
        // Hands fade out
        const handOpacity = 1 - darkProgress;
        roboticHand.style.opacity = handOpacity;
        humanHand.style.opacity = handOpacity;
        
        // Dark Mode colors
        if (progress > 0.9) {
            root.style.setProperty('--dynamic-text', '#fff');
            root.style.setProperty('--dynamic-nav-bg', 'rgba(0, 0, 0, 0.4)');
            root.style.setProperty('--dynamic-btn-bg', '#fff');
            root.style.setProperty('--dynamic-btn-text', '#111');
            root.style.setProperty('--white-bg-opacity', '1');
        } else {
            root.style.setProperty('--dynamic-text', '#111');
            root.style.setProperty('--dynamic-nav-bg', 'rgba(255, 255, 255, 0.4)');
            root.style.setProperty('--dynamic-btn-bg', '#111');
            root.style.setProperty('--dynamic-btn-text', '#fff');
            root.style.setProperty('--white-bg-opacity', '0');
        }
        
        // Save offsets for requestAnimationFrame loop
        roboticHand.dataset.scrollOffset = additionalRoboticX;
        humanHand.dataset.scrollOffset = additionalHumanX;
    });

    let currentRx = 0;
    let currentHx = 0;

    function animateHands() {
        const time = Date.now() * 0.001;
        
        // Subtle floating independent of mouse
        const floatY1 = Math.sin(time * 1.5) * 5; 
        const floatX1 = Math.cos(time * 1.2) * 3;
        
        const floatY2 = Math.sin(time * 2.0) * 4;
        const floatX2 = Math.cos(time * 1.7) * 4;
        
        if(roboticHand.dataset.loaded === 'true') {
            const targetRx = parseFloat(roboticHand.dataset.scrollOffset || 0);
            const targetHx = parseFloat(humanHand.dataset.scrollOffset || 0);
            
            // Smoothly interpolate the scroll offsets to prevent jitter
            currentRx += (targetRx - currentRx) * 0.1;
            currentHx += (targetHx - currentHx) * 0.1;
            
            roboticHand.style.transform = `translate(calc(${mouseX + floatX1}px + ${currentRx}vw), calc(-50% + ${mouseY + floatY1}px)) rotate(4deg)`;
            humanHand.style.transform = `translate(calc(${-mouseX + floatX2}px + ${currentHx}vw), calc(-50% + ${-mouseY + floatY2}px))`;
        }
        requestAnimationFrame(animateHands);
    }
    animateHands();
});
