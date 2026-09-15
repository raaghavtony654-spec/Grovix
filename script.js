document.addEventListener('DOMContentLoaded', () => {
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

    // ====== SCROLL ANIMATION (Hero viewport) ======
    const bigBangCircle = document.getElementById('big-bang-circle');
    const root = document.documentElement;
    const heroViewport = document.getElementById('hero-viewport');
    const contentBelow = document.getElementById('content-below');

    // Calculate how much of the body scroll is dedicated to the hero animation
    const heroScrollHeight = window.innerHeight * 1.5; // body is 250vh, hero takes ~150vh of scroll

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
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

            // ====== NAV TEXT FLY-TO-SECTION ANIMATION ======
            const flyNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');
            const sectionFlyMap = [];

            flyNavLinks.forEach(link => {
                const href = link.getAttribute('href');
                const section = document.querySelector(href);
                if (!section) return;
                const sectionTitle = section.querySelector('.section-title');
                if (!sectionTitle) return;
                // Find the fly-target span that matches this nav link's text
                const navText = link.textContent.trim();
                const flyTarget = sectionTitle.querySelector(`.fly-target[data-nav="${navText}"]`);
                sectionFlyMap.push({ link, section, sectionTitle, flyTarget, titleRevealed: false });
            });

            // Remove these titles from generic reveal & mark as fly-managed
            sectionFlyMap.forEach(({ sectionTitle }) => {
                sectionTitle.classList.remove('reveal');
                revealObserver.unobserve(sectionTitle);
                sectionTitle.classList.add('fly-managed');
            });

            // One-time title reveal with flying text clone
            // Helper: convert px to vw (based on current viewport width)
            const toVw = (px) => (px / window.innerWidth) * 100;

            const titleRevealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const data = sectionFlyMap.find(d => d.sectionTitle === entry.target);
                        if (data && !data.titleRevealed) {
                            data.titleRevealed = true;

                            const vw = window.innerWidth;
                            const linkRect = data.link.getBoundingClientRect();

                            // ── START position: nav link in absolute document coords (vw) ──
                            const startLeftVw = ((linkRect.left + window.scrollX) / vw) * 100;
                            const startTopVw = ((linkRect.top + window.scrollY) / vw) * 100;

                            // ── END position: fly-target in absolute document coords (vw) ──
                            const landingEl = data.flyTarget || data.sectionTitle;

                            // Temporarily reveal title (no transition) to measure final resting position
                            data.sectionTitle.style.transition = 'none';
                            data.sectionTitle.classList.add('fly-arrived');
                            data.sectionTitle.offsetHeight; // force reflow

                            const targetRect = landingEl.getBoundingClientRect();
                            const targetFontSizeVw = (parseFloat(getComputedStyle(landingEl).fontSize) / vw) * 100;
                            const endLeftVw = ((targetRect.left + window.scrollX) / vw) * 100;
                            const endTopVw = ((targetRect.top + window.scrollY) / vw) * 100;

                            // Hide it again immediately
                            data.sectionTitle.classList.remove('fly-arrived');
                            data.sectionTitle.offsetHeight; // force reflow
                            data.sectionTitle.style.transition = '';

                            // ── DELTA in vw (fixed, deterministic) ──
                            const dxVw = endLeftVw - startLeftVw;
                            const dyVw = endTopVw - startTopVw;

                            // ── Create flyer at nav link's absolute document position ──
                            const flyer = document.createElement('div');
                            flyer.className = 'nav-text-flyer';
                            flyer.textContent = data.link.textContent;
                            flyer.style.left = startLeftVw + 'vw';
                            flyer.style.top = startTopVw + 'vw';
                            flyer.style.fontSize = '0.792vw';  // matches nav link font-size
                            flyer.style.fontWeight = '500';
                            flyer.style.opacity = '1';
                            flyer.style.transform = 'translate(0, 0)';
                            document.body.appendChild(flyer);

                            // Force reflow to lock starting position
                            flyer.offsetHeight;

                            // ── Animate: translate by fixed vw delta + grow font in vw ──
                            flyer.style.transition = 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1), font-size 0.85s ease, font-weight 0.85s ease';
                            flyer.style.transform = `translate(${dxVw}vw, ${dyVw}vw)`;
                            flyer.style.fontSize = targetFontSizeVw + 'vw';
                            flyer.style.fontWeight = '800';

                            // After arrival: reveal real title, fade out clone
                            setTimeout(() => {
                                data.sectionTitle.classList.add('fly-arrived');
                                flyer.style.transition = 'opacity 0.3s ease';
                                flyer.style.opacity = '0';
                                setTimeout(() => flyer.remove(), 300);
                            }, 850);
                        }
                        titleRevealObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.25 });

            sectionFlyMap.forEach(d => titleRevealObserver.observe(d.sectionTitle));

            // Scroll-based nav link management: only ONE hidden at a time
            let currentHiddenLink = null;
            let flyReady = false;
            setTimeout(() => { flyReady = true; }, 600);

            const updateActiveNavLink = () => {
                if (!flyReady) return;

                let activeData = null;

                // Find the section whose top is above 40% of viewport and bottom is still visible
                for (const data of sectionFlyMap) {
                    const rect = data.section.getBoundingClientRect();
                    if (rect.top < window.innerHeight * 0.4 && rect.bottom > 100) {
                        activeData = data;
                    }
                }

                const newHiddenLink = activeData ? activeData.link : null;

                if (newHiddenLink !== currentHiddenLink) {
                    // Immediately restore the previous nav link
                    if (currentHiddenLink) {
                        currentHiddenLink.style.transition = 'opacity 0.3s ease';
                        currentHiddenLink.style.opacity = '1';
                        currentHiddenLink.style.pointerEvents = '';
                    }
                    // Hide the new active one
                    if (newHiddenLink) {
                        newHiddenLink.style.transition = 'opacity 0.3s ease';
                        newHiddenLink.style.opacity = '0';
                        newHiddenLink.style.pointerEvents = 'none';
                    }
                    currentHiddenLink = newHiddenLink;
                }
            };

            window.addEventListener('scroll', updateActiveNavLink, { passive: true });


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
                            // Snap to center and lock scroll
                            entry.target.scrollIntoView({ block: 'center' });
                            document.body.style.overflow = 'hidden';
                            
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
                            // Snap to center and lock scroll
                            entry.target.scrollIntoView({ block: 'center' });
                            document.body.style.overflow = 'hidden';
                            
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
});
