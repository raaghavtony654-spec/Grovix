document.addEventListener('DOMContentLoaded', () => {
    // ====== LOADING SCREEN ======
    const loadingScreen = document.getElementById('loading-screen');
    const loaderText = document.getElementById('loader-text');
    const navLogo = document.querySelector('.logo');
    if (loadingScreen && loaderText && navLogo) {
        document.body.classList.add('loading');

        let minTimerDone = false;
        let pageLoaded = false;
        let handoffStarted = false;

        function morphLoaderToNav() {
            if (handoffStarted || !(minTimerDone && pageLoaded)) return;
            handoffStarted = true;

            // Match navbar type (weight, tracking) while the word is still centered.
            loaderText.classList.add('matched');

            const startMorph = () => {
                const first = loaderText.getBoundingClientRect();
                const last = navLogo.getBoundingClientRect();

                const dx = (last.left + last.width / 2) - (first.left + first.width / 2);
                const dy = (last.top + last.height / 2) - (first.top + first.height / 2);
                const scale = last.width / first.width;

                document.body.classList.add('loader-morphing');
                document.body.classList.remove('loading');
                loadingScreen.classList.add('handoff');

                requestAnimationFrame(() => {
                    loaderText.style.transition = 'transform 1.05s cubic-bezier(0.76, 0, 0.24, 1)';
                    loaderText.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
                });

                let finished = false;
                const finish = () => {
                    if (finished) return;
                    finished = true;
                    navLogo.style.opacity = '1';
                    loadingScreen.remove();
                    document.body.classList.remove('loader-morphing');
                    navLogo.style.removeProperty('opacity');
                };

                loaderText.addEventListener('transitionend', (event) => {
                    if (event.propertyName === 'transform') finish();
                }, { once: true });

                setTimeout(finish, 1200);
            };

            // Let letter-spacing settle so the large mark already looks like the nav logo.
            setTimeout(startMorph, 420);
        }

        setTimeout(() => {
            minTimerDone = true;
            morphLoaderToNav();
        }, 3000);

        // Failsafe: force pageLoaded to true after 3500ms just in case a network resource is hanging
        setTimeout(() => {
            if (!pageLoaded) {
                pageLoaded = true;
                morphLoaderToNav();
            }
        }, 3500);

        if (document.readyState === 'complete') {
            pageLoaded = true;
        } else {
            window.addEventListener('load', () => {
                pageLoaded = true;
                morphLoaderToNav();
            });
        }
    }

    // ====== SMOOTH SCROLL HELPER ======
    const smoothScrollTo = (targetY, duration = 800) => {
        const startY = window.scrollY;
        const distance = targetY - startY;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // cubic ease out
            window.scrollTo(0, startY + distance * ease);
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    // ====== HERO TEXT ANIMATION ======
    const words = document.querySelectorAll('.hero-title .word');
    const subtitle = document.querySelector('.hero-subtitle');
    const btn = document.querySelector('.get-in-touch-btn');

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

    // ====== HANDS ANIMATION ======
    const roboticHand = document.querySelector('.robotic-hand');
    const humanHand = document.querySelector('.human-hand');
    const spark = document.querySelector('.spark');

    setTimeout(() => {
        roboticHand.style.transition = 'transform 3.5s cubic-bezier(0.25, 1, 0.25, 1)';
        roboticHand.style.transform = 'translate(0px, -50%) rotate(4deg)';

        humanHand.style.transition = 'transform 3.5s cubic-bezier(0.25, 1, 0.25, 1)';
        humanHand.style.transform = 'translate(0px, -50%)';
    }, 500);

    setTimeout(() => {
        spark.style.transition = 'transform 0.2s ease-out, opacity 0.5s ease-out';
        spark.style.transform = 'translate(-50%, -50%) scale(1)';
        spark.style.opacity = '1';

        setTimeout(() => {
            spark.style.opacity = '0';
            spark.style.transform = 'translate(-50%, -50%) scale(2)';
        }, 200);
    }, 3800);

    setTimeout(() => {
        roboticHand.dataset.loaded = 'true';
    }, 4000);

    // ====== MOUSE TRACKING ======
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (window.innerWidth / 2 - e.clientX) / 50;
        mouseY = (window.innerHeight / 2 - e.clientY) / 50;

        document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // ====== GLOBAL DOT GRID CANVAS ======
    const globalCanvas = document.getElementById('global-reactive-canvas');
    if (globalCanvas) {
        const ctx = globalCanvas.getContext('2d');
        let dots = [];
        const spacing = 8;
        let globalMouse = { x: -1000, y: -1000 };
        let targetGlobalMouse = { x: -1000, y: -1000 };
        
        const resizeCanvas = () => {
            globalCanvas.width = window.innerWidth;
            globalCanvas.height = window.innerHeight;
            dots = [];
            for (let x = 0; x < globalCanvas.width + spacing; x += spacing) {
                for (let y = 0; y < globalCanvas.height + spacing; y += spacing) {
                    dots.push({ baseX: x, baseY: y, x: x, y: y });
                }
            }
        };
        
        window.addEventListener('resize', resizeCanvas);
        document.addEventListener('mousemove', (e) => {
            targetGlobalMouse.x = e.clientX;
            targetGlobalMouse.y = e.clientY;
        });
        
        resizeCanvas();
        
        const animateCanvas = () => {
            globalMouse.x += (targetGlobalMouse.x - globalMouse.x) * 0.2;
            globalMouse.y += (targetGlobalMouse.y - globalMouse.y) * 0.2;
            
            ctx.clearRect(0, 0, globalCanvas.width, globalCanvas.height);
            
            // Dynamically change dot color based on hero dark mode state
            const isDark = document.documentElement.style.getPropertyValue('--white-bg-opacity') === '1';
            ctx.fillStyle = isDark ? '#ffffff' : '#111111';
            
            const visibilityRadius = window.innerWidth * 0.07813; // Matches 7.813vw
            const repulsionRadius = visibilityRadius * 0.6; // Smaller repulsion radius
            const visRadSq = visibilityRadius * visibilityRadius;
            
            for (let i = 0; i < dots.length; i++) {
                const dot = dots[i];
                const dx = globalMouse.x - dot.baseX;
                
                // Fast AABB check to skip distant dots
                if (Math.abs(dx) > visibilityRadius + 50) {
                    dot.x = dot.baseX;
                    dot.y = dot.baseY;
                    continue;
                }
                const dy = globalMouse.y - dot.baseY;
                if (Math.abs(dy) > visibilityRadius + 50) {
                    dot.x = dot.baseX;
                    dot.y = dot.baseY;
                    continue;
                }
                
                const distSq = dx * dx + dy * dy;
                
                if (distSq < visRadSq) {
                    const dist = Math.sqrt(distSq);
                    const opacity = Math.max(0, 1 - (dist / visibilityRadius));
                    
                    let offsetX = 0;
                    let offsetY = 0;
                    
                    // Repulsion logic
                    if (dist < repulsionRadius && dist > 0.1) {
                        const force = (repulsionRadius - dist) / repulsionRadius;
                        const pushDistance = force * 6; // Max 6px push away
                        offsetX = (dx / dist) * -pushDistance;
                        offsetY = (dy / dist) * -pushDistance;
                    }
                    
                    // Spring physics
                    dot.x += ((dot.baseX + offsetX) - dot.x) * 0.3;
                    dot.y += ((dot.baseY + offsetY) - dot.y) * 0.3;
                    
                    ctx.globalAlpha = opacity * 0.7; // Reduced opacity for subtlety
                    ctx.fillRect(dot.x - 0.8, dot.y - 0.8, 1.6, 1.6); // Slightly smaller dot
                } else {
                    dot.x = dot.baseX;
                    dot.y = dot.baseY;
                }
            }
            requestAnimationFrame(animateCanvas);
        };
        animateCanvas();
    }

    // ====== SCROLL ANIMATION (Hero viewport) ======
    const bigBangCircle = document.getElementById('big-bang-circle');
    const root = document.documentElement;
    const heroViewport = document.getElementById('hero-viewport');
    const contentBelow = document.getElementById('content-below');

    // Calculate how much of the body scroll is dedicated to the hero animation
    const heroScrollHeight = window.innerHeight * 0.6; // Increased distance for a smoother, slower animation

    let hasAutoScrolledHero = false;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Automatically complete the hero animation on first scroll
        if (!hasAutoScrolledHero && scrollY > 5 && scrollY < heroScrollHeight - 5) {
            hasAutoScrolledHero = true;
            // Temporarily disable user scroll to ensure smooth transition
            document.body.style.overflow = 'hidden';
            smoothScrollTo(heroScrollHeight, 2000); // 2000ms for a slower, smoother glide
            setTimeout(() => {
                document.body.style.overflow = '';
            }, 2050);
        }

        const progress = Math.max(0, Math.min(1, scrollY / heroScrollHeight));

        // Phase 1: Close hands
        let closeProgress = Math.min(progress / 0.3, 1);
        let additionalRoboticX = -2.5 + (closeProgress * 3.3);
        let additionalHumanX = 2.5 + (closeProgress * -3.3);

        // Phase 2 & 3: Circle expansion
        let circleProgress = 0;
        if (progress > 0.3) {
            circleProgress = Math.min((progress - 0.3) / 0.5, 1);
        }

        let circleScale = 0;
        let circleGlow = 0;
        if (circleProgress > 0) {
            if (circleProgress < 0.4) {
                circleScale = circleProgress * 12.5;
                circleGlow = circleProgress * 50;
            } else {
                circleScale = 5 + Math.pow((circleProgress - 0.4) / 0.6, 3) * 300;
                circleGlow = 20;
            }
        }
        bigBangCircle.style.transform = `translate(-50%, -50%) scale(${circleScale})`;
        bigBangCircle.style.boxShadow = `0 0 ${circleGlow}px ${circleGlow / 2}px rgba(0,0,0,0.8)`;

        // Phase 4: Dark mode
        let darkProgress = 0;
        if (progress > 0.8) {
            darkProgress = (progress - 0.8) / 0.2;
        }

        const handOpacity = 1 - darkProgress;
        roboticHand.style.opacity = handOpacity;
        humanHand.style.opacity = handOpacity;

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

        roboticHand.dataset.scrollOffset = additionalRoboticX;
        humanHand.dataset.scrollOffset = additionalHumanX;

    });

    // Set initial content position so it starts scrolling up precisely when hero animation finishes
    const contentStart = heroScrollHeight + window.innerHeight;
    if (contentBelow) {
        contentBelow.style.marginTop = `${contentStart}px`;
    }

    // ====== FLOATING HANDS LOOP ======
    let currentRx = 0;
    let currentHx = 0;

    function animateHands() {
        const time = Date.now() * 0.001;

        const floatY1 = Math.sin(time * 1.5) * 5;
        const floatX1 = Math.cos(time * 1.2) * 3;
        const floatY2 = Math.sin(time * 2.0) * 4;
        const floatX2 = Math.cos(time * 1.7) * 4;

        if (roboticHand.dataset.loaded === 'true') {
            const targetRx = parseFloat(roboticHand.dataset.scrollOffset || 0);
            const targetHx = parseFloat(humanHand.dataset.scrollOffset || 0);

            currentRx += (targetRx - currentRx) * 0.1;
            currentHx += (targetHx - currentHx) * 0.1;

            roboticHand.style.transform = `translate(calc(${mouseX + floatX1}px + ${currentRx}vw), calc(-50% + ${mouseY + floatY1}px)) rotate(4deg)`;
            humanHand.style.transform = `translate(calc(${-mouseX + floatX2}px + ${currentHx}vw), calc(-50% + ${-mouseY + floatY2}px))`;
        }
        requestAnimationFrame(animateHands);
    }
    animateHands();

    // ====== SCROLL REVEAL FOR SECTIONS ======
    const revealElements = document.querySelectorAll(
        '.service-card, .client-card, .testimonial-card, .faq-item, .info-card, .section-title, .section-subtitle, .section-label'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation slightly for cards in grids
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                const siblingIndex = Array.from(siblings).indexOf(entry.target);

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, siblingIndex * 80);

                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.25
    });

    // Delay all observer setups until after layout has fully recalculated
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {

            revealElements.forEach(el => revealObserver.observe(el));




            // ====== COMPARISON TABLE TEAR-THROUGH ANIMATION ======
            const comparisonTable = document.querySelector('.comparison-table');
            if (comparisonTable) {
                const rows = comparisonTable.querySelectorAll('.comparison-row');
                const othersHeader = comparisonTable.querySelector('.others-col');
                const grovixHeader = comparisonTable.querySelector('.grovix-col');

                // Add tear-flash and tear-crack overlays to each Others cell
                rows.forEach(row => {
                    const othersItem = row.querySelector('.comparison-item.others');
                    if (othersItem) {
                        const flash = document.createElement('div');
                        flash.className = 'tear-flash';
                        othersItem.appendChild(flash);

                        const crack = document.createElement('div');
                        crack.className = 'tear-crack';
                        othersItem.appendChild(crack);
                    }

                    // Add particle burst container to each row
                    const particleBurst = document.createElement('div');
                    particleBurst.className = 'particle-burst';
                    row.appendChild(particleBurst);
                });

                // Create particles for a burst effect
                const spawnParticles = (row) => {
                    const burst = row.querySelector('.particle-burst');
                    if (!burst) return;
                    const count = 12;
                    for (let i = 0; i < count; i++) {
                        const p = document.createElement('div');
                        p.className = 'particle';
                        const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.5;
                        const distance = 40 + Math.random() * 60;
                        const tx = Math.cos(angle) * distance;
                        const ty = Math.sin(angle) * distance;
                        const duration = 0.4 + Math.random() * 0.3;
                        p.style.animation = `particleFly ${duration}s ease-out forwards`;
                        p.style.setProperty('--tx', `${tx}px`);
                        p.style.setProperty('--ty', `${ty}px`);
                        // Use custom transform in animation via inline keyframes
                        p.style.left = '0';
                        p.style.top = '0';
                        p.animate([
                            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
                        ], { duration: duration * 1000, easing: 'ease-out', fill: 'forwards' });
                        burst.appendChild(p);
                        setTimeout(() => p.remove(), duration * 1000 + 50);
                    }
                };

                const animateComparisonTable = () => {
                    let delay = 0;

                    // Phase 1: Headers appear
                    setTimeout(() => othersHeader.classList.add('header-visible'), delay);
                    setTimeout(() => grovixHeader.classList.add('header-visible'), delay + 150);
                    delay += 500;

                    // Phase 2: Others items appear one by one
                    rows.forEach((row, i) => {
                        const othersItem = row.querySelector('.comparison-item.others');
                        setTimeout(() => {
                            othersItem.classList.add('others-visible');
                        }, delay + i * 250);
                    });
                    delay += rows.length * 250 + 400;

                    // Phase 3: Grovix items tear through, one by one
                    rows.forEach((row, i) => {
                        const othersItem = row.querySelector('.comparison-item.others');
                        const grovixItem = row.querySelector('.comparison-item.grovix');
                        const flash = othersItem.querySelector('.tear-flash');
                        const crack = othersItem.querySelector('.tear-crack');
                        const rowDelay = delay + i * 700;

                        // Step 1: Crack appears on the Others cell
                        setTimeout(() => {
                            crack.classList.add('crack-active');
                        }, rowDelay);

                        // Step 2: Flash + shake on the Others cell + particles
                        setTimeout(() => {
                            flash.classList.add('flash-active');
                            othersItem.classList.add('others-shaking');
                            spawnParticles(row);
                        }, rowDelay + 150);

                        // Step 3: Grovix item tears through
                        setTimeout(() => {
                            grovixItem.classList.add('grovix-tearing');
                        }, rowDelay + 200);

                        // Step 4: Settle into position
                        setTimeout(() => {
                            grovixItem.classList.remove('grovix-tearing');
                            grovixItem.classList.add('grovix-settled');
                            othersItem.classList.remove('others-shaking');
                        }, rowDelay + 700);
                    });
                };

                const compObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Snap section to center and lock scroll
                            const section = entry.target.closest('.section') || entry.target;
                            const rect = section.getBoundingClientRect();
                            const targetY = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
                            document.body.style.overflow = 'hidden';
                            smoothScrollTo(targetY, 800);

                            
                            animateComparisonTable();
                            
                            // Unlock scroll after animation finishes (~5650ms)
                            setTimeout(() => {
                                document.body.style.overflow = '';
                            }, 5800);
                            
                            compObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.25 });
                compObserver.observe(comparisonTable);
            }

            // ====== PROCESS STEPS SEQUENTIAL ANIMATION ======
            const processSteps = document.querySelector('.process-steps');
            if (processSteps) {
                const steps = processSteps.querySelectorAll('.process-step');
                const connectors = processSteps.querySelectorAll('.process-connector');

                // Create SVG border trace for each step
                const createBorderTrace = (step) => {
                    const w = step.offsetWidth + 4;  // +4 for the 2px inset on each side
                    const h = step.offsetHeight + 4;
                    const r = 16; // border-radius

                    // Path starting from RIGHT CENTER, going clockwise:
                    // right-center → bottom-right corner → bottom-left → top-left → top-right → back to right-center
                    const d = [
                        `M ${w} ${h / 2}`,
                        `L ${w} ${h - r}`,
                        `Q ${w} ${h} ${w - r} ${h}`,
                        `L ${r} ${h}`,
                        `Q 0 ${h} 0 ${h - r}`,
                        `L 0 ${r}`,
                        `Q 0 0 ${r} 0`,
                        `L ${w - r} 0`,
                        `Q ${w} 0 ${w} ${r}`,
                        `L ${w} ${h / 2}`
                    ].join(' ');

                    const svgNS = 'http://www.w3.org/2000/svg';
                    const svg = document.createElementNS(svgNS, 'svg');
                    svg.setAttribute('class', 'border-trace-svg');
                    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
                    svg.setAttribute('preserveAspectRatio', 'none');

                    const path = document.createElementNS(svgNS, 'path');
                    path.setAttribute('d', d);
                    path.setAttribute('class', 'border-trace-path');
                    path.setAttribute('pathLength', '100');
                    path.setAttribute('stroke-dasharray', '100');
                    path.setAttribute('stroke-dashoffset', '100');

                    svg.appendChild(path);
                    step.appendChild(svg);

                    return path;
                };

                // Build SVG paths for all steps
                const paths = [];
                steps.forEach(step => {
                    paths.push(createBorderTrace(step));
                });

                const animateSequence = () => {
                    let delay = 0;

                    steps.forEach((step, i) => {
                        const currentDelay = delay;

                        // 1. Reveal the card
                        setTimeout(() => {
                            step.classList.add('reveal-step');
                        }, currentDelay);

                        // 2. After card fades in (0.3s), start tracing the border
                        setTimeout(() => {
                            paths[i].style.strokeDashoffset = '0';
                        }, currentDelay + 300);

                        // 3. After border trace completes (1.2s), mark as traced (add glow)
                        setTimeout(() => {
                            step.classList.add('traced');
                        }, currentDelay + 1500);

                        // 4. Extend the connector line (if not the last card)
                        if (connectors[i]) {
                            setTimeout(() => {
                                connectors[i].classList.add('extend');
                            }, currentDelay + 1500);
                        }

                        // Timeline per card:
                        // 0ms    - card fades in (0.3s)
                        // 300ms  - border starts tracing (1.2s)
                        // 1500ms - trace done, connector starts extending (0.6s)
                        // 2100ms - connector fully reaches next card → THEN next card appears
                        delay += 2100;
                    });
                };

                const processObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // Snap section to center and lock scroll
                            const section = entry.target.closest('.section') || entry.target;
                            const rect = section.getBoundingClientRect();
                            const targetY = window.scrollY + rect.top - (window.innerHeight - rect.height) / 2;
                            document.body.style.overflow = 'hidden';
                            smoothScrollTo(targetY, 800);

                            
                            animateSequence();
                            
                            // Unlock scroll after animation finishes (last card traced at ~5700ms)
                            setTimeout(() => {
                                document.body.style.overflow = '';
                            }, 5800);
                            
                            processObserver.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.25 });

                processObserver.observe(processSteps);
            }

        }); // end inner rAF
    }); // end outer rAF

    // ====== FAQ ACCORDION ======
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ====== SMOOTH SCROLL FOR NAV LINKS ======
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();

                // Calculate position accounting for the hero scroll offset
                const targetPosition = target.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: targetPosition - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ====== CONTACT FORM ======
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sent! ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #333 0%, #555 100%)';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                contactForm.reset();
            }, 2500);
        });
    }

    // ====== MOBILE MENU ======
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.flexDirection = 'column';
            navLinks.style.background = 'rgba(255,255,255,0.95)';
            navLinks.style.padding = '1rem 2rem';
            navLinks.style.borderRadius = '0 0 20px 20px';
            navLinks.style.gap = '1rem';
            navLinks.style.backdropFilter = 'blur(12px)';
        });
    }

    // ====== COUNTER ANIMATION FOR STATS ======
    const statElements = document.querySelectorAll('.client-stat');
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.transition = 'color 0.3s ease';
                entry.target.style.color = '';
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    statElements.forEach(el => statObserver.observe(el));

    // ====== MODAL LOGIC ======
    const serviceDetailsData = {
        'strategic': {
            label: 'ADS • ADS • ADS',
            title: 'Strategic Marketing',
            gradient: 'linear-gradient(160deg, #1a1a1a 0%, #111111 100%)',
            body: '<p>Ready to give your brand the spotlight it deserves? Dive into our Paid Ads extravaganza and let your message shine in the digital universe!</p><p>Our data-driven strategic marketing approach ensures maximum ROI. We don\'t just spend your budget; we invest it wisely across high-converting channels to acquire loyal customers.</p><ul><li>Comprehensive Audience Targeting</li><li>A/B Testing for Ad Creatives</li><li>Real-time Campaign Optimization</li><li>Transparent Performance Analytics</li></ul>'
        },
        'design': {
            label: 'DESIGN • DESIGN • DESIGN',
            title: 'Eye-catchy Designs',
            gradient: 'linear-gradient(160deg, #1e1e1e 0%, #141414 100%)',
            body: '<p>We craft visuals that speak to your ideal customers. Ready for an extraordinary brand transformation?</p><p>First impressions matter. Our design team blends aesthetics with psychology to create compelling brand identities, stunning graphics, and interfaces that not only look beautiful but drive meaningful engagement.</p><ul><li>Brand Identity & Logo Design</li><li>High-converting Landing Pages</li><li>Engaging Social Media Assets</li><li>UI/UX Optimization</li></ul>'
        },
        'social': {
            label: 'SOCIAL • SOCIAL • SOCIAL',
            title: 'Social Media Management',
            gradient: 'linear-gradient(160deg, #1c1c1c 0%, #121212 100%)',
            body: '<p>Ready to make your brand the talk of the social town? Dive into our Social Media Management expertise and let your brand resonate across digital platforms!</p><p>We build communities, not just follower counts. By creating authentic, platform-native content, we foster genuine relationships between your brand and your audience.</p><ul><li>Strategic Content Calendars</li><li>Community Management & Engagement</li><li>Influencer Partnerships</li><li>Viral Trend Capitalization</li></ul>'
        },
        'automation': {
            label: 'AUTOMATE • AUTOMATE • AUTOMATE',
            title: 'Automation Services',
            gradient: 'linear-gradient(160deg, #1d1d1d 0%, #131313 100%)',
            body: '<p>Automate the manual task, Save the time and energy, Only focus on delivering quality.</p><p>Stop wasting time on repetitive tasks. We build intelligent automation pipelines that connect your favorite tools, streamline your operations, and allow your team to focus on high-impact creative work.</p><ul><li>CRM & Email Flow Automation</li><li>Zapier/Make Custom Integrations</li><li>Lead Nurturing Sequences</li><li>Data Syncing & Reporting Bots</li></ul>'
        },
        'web': {
            label: 'WEB • WEB • WEB',
            title: 'Web Development',
            gradient: 'linear-gradient(160deg, #1f1f1f 0%, #151515 100%)',
            body: '<p>From tech wizardry to seamless online experiences – enter the world of Technical Solutions. We transform digital hiccups into high-fives for your users.</p><p>Your website is your 24/7 salesperson. We build lightning-fast, fully responsive, and SEO-optimized web experiences that captivate visitors and convert them into paying customers.</p><ul><li>Custom Frontend & Backend Architecture</li><li>E-commerce Store Optimization</li><li>CMS Integration & Training</li><li>Continuous Maintenance & Security</li></ul>'
        },
        'seo': {
            label: 'SEO • SEO • SEO',
            title: 'Robust SEO',
            gradient: 'linear-gradient(160deg, #1b1b1b 0%, #111111 100%)',
            body: '<p>Elevate your online presence, automate workflows, and define digital brilliance with hassle-free SEO.</p><p>Climb to the top of Google and stay there. Our white-hat SEO strategies build long-term organic authority, ensuring that when your customers are searching for your solutions, they find you first.</p><ul><li>Comprehensive Technical Audits</li><li>High-intent Keyword Research</li><li>On-Page Content Optimization</li><li>Authoritative Link Building</li></ul>'
        }
    };

    const modalOverlay = document.getElementById('service-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCard = modalOverlay ? modalOverlay.querySelector('.modal-card') : null;
    const modalLabel = document.getElementById('modal-label');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const detailCards = document.querySelectorAll('.detail-card');
    let hoverTimer = null;
    let hoveredCard = null;

    // Add a subtle progress ring to show the hover is being tracked
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'hover-progress';
    document.body.appendChild(progressIndicator);

    if (modalOverlay && modalClose && modalCard) {
        const openModal = (card) => {
            const serviceId = card.getAttribute('data-service-id');
            if (!serviceId || !serviceDetailsData[serviceId]) return;

            const data = serviceDetailsData[serviceId];
            const rect = card.getBoundingClientRect();

            // Set the modal card's initial position to match the hovered card
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            modalCard.style.transformOrigin = `${centerX}px ${centerY}px`;

            // Match the gradient color
            modalCard.style.background = data.gradient;

            // Populate content
            modalLabel.textContent = data.label;
            modalTitle.textContent = data.title;
            modalBody.innerHTML = data.body;

            // Set initial transform to match card size/position
            const scaleX = rect.width / (window.innerWidth * 0.9);
            const scaleY = rect.height / (window.innerHeight * 0.9);
            const modalTargetLeft = window.innerWidth * 0.05;
            const modalTargetTop = window.innerHeight * 0.05;
            const translateX = centerX - (modalTargetLeft + window.innerWidth * 0.45);
            const translateY = centerY - (modalTargetTop + window.innerHeight * 0.45);

            modalCard.style.transition = 'none';
            modalCard.style.transform = `translate(${translateX}px, ${translateY}px) scale(${Math.max(scaleX, scaleY)})`;
            modalCard.style.borderRadius = '16px';

            // Show the overlay (initially transparent)
            modalOverlay.classList.add('active');

            // Force reflow, then animate to final position
            modalCard.offsetHeight;
            modalCard.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.5s ease';
            modalCard.style.transform = 'translate(0, 0) scale(1)';
            modalCard.style.borderRadius = '24px';
        };

        const closeModal = () => {
            modalCard.style.transition = 'transform 0.4s cubic-bezier(0.5, 0, 0.75, 0), border-radius 0.4s ease, opacity 0.4s ease';
            modalCard.style.transform = 'translate(0, 0) scale(0.92)';
            modalCard.style.opacity = '0';

            setTimeout(() => {
                modalOverlay.classList.remove('active');
                modalCard.style.transform = '';
                modalCard.style.opacity = '';
                modalCard.style.transition = '';
            }, 400);
        };

        // Hover-based trigger with 2.5 second delay
        detailCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                hoveredCard = card;
                // Add progress animation class
                card.classList.add('hover-charging');

                hoverTimer = setTimeout(() => {
                    card.classList.remove('hover-charging');
                    openModal(card);
                    hoveredCard = null;
                }, 1500);
            });

            card.addEventListener('mouseleave', () => {
                if (hoverTimer) {
                    clearTimeout(hoverTimer);
                    hoverTimer = null;
                }
                card.classList.remove('hover-charging');
                hoveredCard = null;
            });

            // Also allow click as a shortcut
            card.addEventListener('click', () => {
                if (hoverTimer) {
                    clearTimeout(hoverTimer);
                    hoverTimer = null;
                }
                card.classList.remove('hover-charging');
                openModal(card);
            });
        });

        modalClose.addEventListener('click', closeModal);

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // ====== ANIMATED CLIENTS GRID ======
    const animatedClientsGrid = document.getElementById('clients-grid-animated');
    if (animatedClientsGrid) {
        const clientCards = Array.from(animatedClientsGrid.querySelectorAll('.client-card-animated'));
        
        // 7 slots. 
        // 0-2: Left column (top, mid, bot)
        // 3: Center column
        // 4-6: Right column (top, mid, bot)
        const slots = [
            { left: '3%', top: '7%', width: '22%', height: '26%' },
            { left: '3%', top: '37%', width: '22%', height: '26%' },
            { left: '3%', top: '67%', width: '22%', height: '26%' },
            { left: '34%', top: '7%', width: '32%', height: '86%' }, // Center
            { left: '75%', top: '7%', width: '22%', height: '26%' },
            { left: '75%', top: '37%', width: '22%', height: '26%' },
            { left: '75%', top: '67%', width: '22%', height: '26%' }
        ];

        let cardToSlot = [0, 1, 2, 3, 4, 5, 6];
        let isAnimating = false;

        // Apply slot geometry to a card
        function applySlot(card, slot) {
            card.style.left = slot.left;
            card.style.top = slot.top;
            card.style.width = slot.width;
            card.style.height = slot.height;
        }

        // Double-rAF: ensures transition is committed in frame N,
        // then the new values are applied in frame N+1 so the browser sees
        // a "from" and "to" state and actually animates between them.
        function nextFrame(fn) {
            requestAnimationFrame(() => {
                requestAnimationFrame(fn);
            });
        }

        // ---- Initial layout (instant, no transition) ----
        clientCards.forEach((card, i) => {
            card.style.transition = 'none';
            applySlot(card, slots[cardToSlot[i]]);
            if (cardToSlot[i] === 3) {
                card.classList.add('is-center');
            }
        });

        // ---- Swap animation ----
        function performSwap() {
            if (isAnimating) return;
            isAnimating = true;

            const centerCardIdx = cardToSlot.indexOf(3);
            const sideSlotOptions = [0, 1, 2, 4, 5, 6];
            const targetSideSlot = sideSlotOptions[Math.floor(Math.random() * sideSlotOptions.length)];
            const sideCardIdx = cardToSlot.indexOf(targetSideSlot);

            const centerCard = clientCards[centerCardIdx];
            const sideCard = clientCards[sideCardIdx];

            const centerSlot = slots[3];
            const sideSlot = slots[targetSideSlot];

            // Shrunk position: side-card size centered within center slot area
            const shrunkLeft = (parseFloat(centerSlot.left) + (parseFloat(centerSlot.width) - parseFloat(sideSlot.width)) / 2) + '%';
            const shrunkTop = (parseFloat(centerSlot.top) + (parseFloat(centerSlot.height) - parseFloat(sideSlot.height)) / 2) + '%';

            // ===== PHASE 1: Shrink center card =====
            // Set transition, then in the NEXT frame set the target values
            centerCard.style.transition = 'left 0.6s cubic-bezier(0.4,0,0.2,1), top 0.6s cubic-bezier(0.4,0,0.2,1), width 0.6s cubic-bezier(0.4,0,0.2,1), height 0.6s cubic-bezier(0.4,0,0.2,1), padding 0.6s cubic-bezier(0.4,0,0.2,1), background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease';
            // Force browser to acknowledge the transition before changing values
            getComputedStyle(centerCard).transition;

            nextFrame(() => {
                centerCard.style.width = sideSlot.width;
                centerCard.style.height = sideSlot.height;
                centerCard.style.left = shrunkLeft;
                centerCard.style.top = shrunkTop;
                centerCard.style.padding = '1.5vw';
                centerCard.classList.remove('is-center');
            });

            // ===== PHASE 2: Slide both cards (after shrink finishes) =====
            setTimeout(() => {
                // Set slide transition on both
                centerCard.style.transition = 'left 1s cubic-bezier(0.25,0.46,0.45,0.94), top 1s cubic-bezier(0.25,0.46,0.45,0.94)';
                sideCard.style.transition = 'left 1s cubic-bezier(0.25,0.46,0.45,0.94), top 1s cubic-bezier(0.25,0.46,0.45,0.94)';
                getComputedStyle(centerCard).transition;
                getComputedStyle(sideCard).transition;

                // Elevate z-index so sliding cards pass over the rest
                centerCard.style.zIndex = '20';
                sideCard.style.zIndex = '20';

                nextFrame(() => {
                    // Old center card slides out to its new side position
                    centerCard.style.left = sideSlot.left;
                    centerCard.style.top = sideSlot.top;

                    // Side card slides into the center area (at side-card size)
                    sideCard.style.left = shrunkLeft;
                    sideCard.style.top = shrunkTop;
                });

                // ===== PHASE 3: Expand the new center card =====
                setTimeout(() => {
                    sideCard.style.transition = 'left 0.7s cubic-bezier(0.4,0,0.2,1), top 0.7s cubic-bezier(0.4,0,0.2,1), width 0.7s cubic-bezier(0.4,0,0.2,1), height 0.7s cubic-bezier(0.4,0,0.2,1), padding 0.7s cubic-bezier(0.4,0,0.2,1), background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease';
                    getComputedStyle(sideCard).transition;

                    nextFrame(() => {
                        sideCard.style.width = centerSlot.width;
                        sideCard.style.height = centerSlot.height;
                        sideCard.style.left = centerSlot.left;
                        sideCard.style.top = centerSlot.top;
                        sideCard.style.padding = '3vw';
                        sideCard.classList.add('is-center');
                    });

                    // ===== Cleanup =====
                    setTimeout(() => {
                        centerCard.style.transition = 'none';
                        sideCard.style.transition = 'none';
                        centerCard.style.zIndex = '1';
                        sideCard.style.zIndex = '1';

                        cardToSlot[centerCardIdx] = targetSideSlot;
                        cardToSlot[sideCardIdx] = 3;
                        isAnimating = false;
                    }, 800);
                }, 1100); // wait for slide
            }, 700); // wait for shrink
        }

        // Kick off the loop
        setInterval(performSwap, 5000);
    }

    // ====== GLOBAL PARTICLE HEADINGS ======
    function initGlobalParticleHeadings() {
        const canvas = document.getElementById('global-heading-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // Define all headings
        const heroTitle = document.querySelector('.hero-title');
        const sectionTitles = Array.from(document.querySelectorAll('.section-title'));
        const allHeadings = [heroTitle, ...sectionTitles].filter(Boolean);
        
        let particles = []; 
        let targetsByHeading = []; 
        let repelElements = []; 
        
        let mouse = { x: -1000, y: -1000, radius: window.innerWidth * 0.08 };
        
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        function getTargetsForHeading(heading, step) {
            const hRect = heading.getBoundingClientRect();
            if (hRect.width === 0) return [];
            
            // Clone heading for safe mutation
            const clone = heading.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.top = '0px';
            clone.style.left = '0px';
            clone.style.visibility = 'hidden';
            clone.style.width = hRect.width + 'px'; 
            clone.style.margin = '0px';
            document.body.appendChild(clone);
            
            // Wrap text nodes in clone
            const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT, null, false);
            const textNodes = [];
            let node;
            while(node = walker.nextNode()) textNodes.push(node);
            textNodes.forEach(n => {
                if (n.nodeValue.trim().length > 0) {
                    const span = document.createElement('span');
                    span.className = 'particle-measure-span';
                    span.textContent = n.nodeValue;
                    n.parentNode.replaceChild(span, n);
                }
            });
            
            let headingTargets = [];
            const spans = clone.querySelectorAll('.particle-measure-span');
            spans.forEach(span => {
                const sRect = span.getBoundingClientRect();
                if (sRect.width === 0 || sRect.height === 0) return;
                
                const styles = window.getComputedStyle(span);
                const fontSize = parseFloat(styles.fontSize) || 16;
                
                // Add padding to prevent clipping due to line-height or font bounding box
                const paddingX = fontSize * 0.2;
                const paddingY = fontSize * 0.6;
                
                const offCanvas = document.createElement('canvas');
                offCanvas.width = sRect.width + paddingX * 2;
                offCanvas.height = sRect.height + paddingY * 2;
                const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
                
                offCtx.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
                offCtx.letterSpacing = styles.letterSpacing;
                offCtx.fillStyle = '#ffffff';
                offCtx.textBaseline = 'middle';
                offCtx.textAlign = 'left';
                
                // Draw exactly centered vertically, offset by paddingX horizontally
                offCtx.fillText(span.textContent, paddingX, offCanvas.height / 2); 
                const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height).data;
                
                // Calculate local offsets relative to the heading's top-left corner
                // Since the clone is at fixed top:0, left:0, sRect directly gives local offsets
                // We subtract a small optical nudge (12% of height) to perfectly vertically center the text
                const opticalNudge = sRect.height * 0.12; 
                const localOffsetX = sRect.left - paddingX;
                const localOffsetY = sRect.top + (sRect.height / 2) - (offCanvas.height / 2) - opticalNudge;
                
                for (let y = 0; y < offCanvas.height; y += step) {
                    for (let x = 0; x < offCanvas.width; x += step) {
                        const alpha = imgData[(y * offCanvas.width + x) * 4 + 3];
                        if (alpha > 128) {
                            headingTargets.push({
                                localX: localOffsetX + x,
                                localY: localOffsetY + y
                            });
                        }
                    }
                }
            });
            
            document.body.removeChild(clone);
            return headingTargets;
        }
        
        function measureHeadings() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const step = Math.max(5, Math.floor(window.innerWidth / 250));
            targetsByHeading = [];
            let maxParticlesNeeded = 0;
            
            repelElements = Array.from(document.querySelectorAll('.service-card, .detail-card, .client-card, .step-card, .comparison-table, .review-card, .faq-item'));
            
            allHeadings.forEach((heading) => {
                const wasHidden = heading.classList.contains('hide-text');
                if(wasHidden) heading.classList.remove('hide-text');
                
                const headingTargets = getTargetsForHeading(heading, step);
                targetsByHeading.push(headingTargets);
                
                if (headingTargets.length > maxParticlesNeeded) {
                    maxParticlesNeeded = headingTargets.length;
                }
                
                if(wasHidden) heading.classList.add('hide-text');
            });
            
            // Initialize global particle pool or append if more are needed
            if (targetsByHeading.length > 0) {
                const heroTargets = targetsByHeading[0];
                const hRect = allHeadings[0].getBoundingClientRect();
                
                while (particles.length < maxParticlesNeeded) {
                    const idx = particles.length;
                    const t = heroTargets[idx % heroTargets.length] || {localX: 0, localY: 0};
                    particles.push({
                        x: hRect.left + t.localX,
                        y: hRect.top + t.localY,
                        vx: 0,
                        vy: 0,
                        size: step * 0.55,
                        transitX: Math.random(),
                        transitY: Math.random(),
                        transitPhase: Math.random() * Math.PI * 2
                    });
                }
                
                // Update sizes in case step changed on resize
                particles.forEach(p => p.size = step * 0.55);
            }
        }
        
        function getActiveHeadingIndex() {
            let closestHeadingIdx = -1;
            let minDistance = Infinity;
            
            const contentBelow = document.getElementById('content-below');
            const contentTop = contentBelow ? contentBelow.getBoundingClientRect().top : window.innerHeight;
            
            allHeadings.forEach((heading, idx) => {
                const rect = heading.getBoundingClientRect();
                const headingCenter = rect.top + rect.height / 2;
                
                // If contentBelow has scrolled up high enough to cover the hero text, ignore the hero text
                if (idx === 0 && contentTop < headingCenter) {
                    return; 
                }
                
                const screenCenter = window.innerHeight / 2;
                const dist = Math.abs(headingCenter - screenCenter);
                
                if (dist < minDistance) {
                    minDistance = dist;
                    closestHeadingIdx = idx;
                }
            });
            
            // Snap to heading if it is within 40% of the screen height from center
            if (minDistance > window.innerHeight * 0.4) {
                return -1; // Split/Transit state
            }
            return closestHeadingIdx;
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const repelRects = [];
            repelElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    repelRects.push({
                        left: rect.left - 30,
                        right: rect.right + 30,
                        top: rect.top - 30,
                        bottom: rect.bottom + 30
                    });
                }
            });
            
            const activeIdxResolved = getActiveHeadingIndex();
            // Dynamic color logic: Hero section uses dynamic text color, rest is white
            if (activeIdxResolved === 0) {
                const dynamicColor = getComputedStyle(document.documentElement).getPropertyValue('--dynamic-text').trim();
                ctx.fillStyle = dynamicColor || '#111111';
            } else {
                ctx.fillStyle = '#ffffff';
            }
            
            const activeTargets = activeIdxResolved >= 0 ? targetsByHeading[activeIdxResolved] : null;
            let activeRect = null;
            if (activeIdxResolved >= 0) {
                activeRect = allHeadings[activeIdxResolved].getBoundingClientRect();
            }
            
            const time = Date.now() * 0.0003; // Slower wave motion for left/right particles
            
            particles.forEach((p, i) => {
                let targetX, targetY;
                
                if (activeTargets && i < activeTargets.length) {
                    // Form the heading text dynamically based on current live position
                    const t = activeTargets[i];
                    targetX = activeRect.left + t.localX;
                    targetY = activeRect.top + t.localY; 
                } else {
                    // Transit state: Float organically in the left/right empty space margins
                    const isLeft = i % 2 === 0;
                    
                    // Spread horizontally in the 10% margins using the particle's fixed random hash
                    const marginWidth = window.innerWidth * 0.12;
                    targetX = isLeft ? (p.transitX * marginWidth) : (window.innerWidth - marginWidth + p.transitX * marginWidth);
                    
                    // Add a gentle floating wave motion
                    targetY = (p.transitY * window.innerHeight) + Math.sin(time + p.transitPhase) * 40; 
                    
                    // Dodge cards (repel logic)
                    repelRects.forEach(rect => {
                        if (targetX > rect.left && targetX < rect.right && targetY > rect.top && targetY < rect.bottom) {
                            if (isLeft) {
                                targetX = Math.min(targetX, rect.left);
                            } else {
                                targetX = Math.max(targetX, rect.right);
                            }
                        }
                    });
                }
                
                // Repel from mouse
                let dx = mouse.x - p.x;
                let dy = mouse.y - p.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    p.vx -= Math.cos(angle) * force * 1.5; // Reduced repel force for smoother feel
                    p.vy -= Math.sin(angle) * force * 1.5;
                }
                
                // Spring towards target (premium, slow, smooth spring)
                const isForming = activeTargets && i < activeTargets.length;
                const springForce = isForming ? 0.003 : 0.001; // Ultra slow and soft
                p.vx += (targetX - p.x) * springForce;
                p.vy += (targetY - p.y) * springForce;
                
                // Friction (more glide, settles smoothly)
                p.vx *= 0.92;
                p.vy *= 0.92;
                
                p.x += p.vx;
                p.y += p.vy;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }
        
        // Wait briefly for layout/fonts to settle before measuring
        setTimeout(() => {
            measureHeadings();
            allHeadings.forEach(h => h.classList.add('hide-text'));
            canvas.style.opacity = '1';
            animate();
        }, 1200);
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            mouse.radius = window.innerWidth * 0.08;
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                measureHeadings();
            }, 300);
        });
    }
    
    const globalHeadingCanvas = document.getElementById('global-heading-canvas');
    if (globalHeadingCanvas) {
        globalHeadingCanvas.style.opacity = '0';
        globalHeadingCanvas.style.transition = 'opacity 0.4s ease';
        initGlobalParticleHeadings();
    }
});
