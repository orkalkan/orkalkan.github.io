/* ============================================
   ORK ALKAN — Portfolio JavaScript
   Particle Engine, Typed Text, Scroll Reveals
   ============================================ */

(() => {
    "use strict";

    // --- Particle Engine ---
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    let animationId;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    const createParticle = () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
        color: ["#6c5ce7", "#00cec9", "#fd79a8", "#fdcb6e"][Math.floor(Math.random() * 4)]
    });

    const initParticles = () => {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(createParticle());
        }
    };

    const drawParticles = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Mouse interaction — strong magnetic pull
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const mouseRadius = 300;

            if (dist < mouseRadius && dist > 0) {
                const force = (mouseRadius - dist) / mouseRadius;
                const angle = Math.atan2(dy, dx);
                p.vx += Math.cos(angle) * force * 0.8;
                p.vy += Math.sin(angle) * force * 0.8;
            }

            // Damping
            p.vx *= 0.92;
            p.vy *= 0.92;

            // Wrap around
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();

            // Draw connections — stronger near mouse
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const connDx = p.x - p2.x;
                const connDy = p.y - p2.y;
                const connDist = Math.sqrt(connDx * connDx + connDy * connDy);

                // Wider connection radius near mouse
                const midX = (p.x + p2.x) / 2;
                const midY = (p.y + p2.y) / 2;
                const mouseDistToMid = Math.sqrt((mouseX - midX) * (mouseX - midX) + (mouseY - midY) * (mouseY - midY));
                const maxConn = mouseDistToMid < 250 ? 200 : 120;
                const maxOpacity = mouseDistToMid < 250 ? 0.4 : 0.15;

                if (connDist < maxConn) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = p.color;
                    ctx.globalAlpha = (1 - connDist / maxConn) * maxOpacity;
                    ctx.lineWidth = mouseDistToMid < 250 ? 1 : 0.5;
                    ctx.stroke();
                }
            }
        }

        ctx.globalAlpha = 1;
        animationId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    initParticles();
    drawParticles();

    window.addEventListener("resize", () => {
        resizeCanvas();
        initParticles();
    });

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Cursor glow
        const glow = document.getElementById("cursorGlow");
        if (glow) {
            glow.style.left = e.clientX + "px";
            glow.style.top = e.clientY + "px";
        }
    });

    // --- Typed Text Effect ---
    const typedElement = document.getElementById("typedText");
    const phrases = [
        "SAP Enterprise Systems",
        "SaaS Products",
        "Security Tools",
        "Test Automation Platforms",
        "Fiori Applications",
        "Full Stack Solutions"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    const typeText = () => {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typedElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typedElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(typeText, typingSpeed);
    };

    setTimeout(typeText, 1000);

    // --- Navbar Scroll ---
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".section[id]");

    const updateNavbar = () => {
        const scrollY = window.scrollY;

        // Scrolled state
        if (scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Active section
        let currentSection = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 200;
            if (scrollY >= sectionTop) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + currentSection) {
                link.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", updateNavbar, { passive: true });
    updateNavbar();

    // --- Mobile Menu ---
    const navToggle = document.getElementById("navToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    navToggle.addEventListener("click", () => {
        navToggle.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
    });

    document.querySelectorAll(".mobile-link").forEach((link) => {
        link.addEventListener("click", () => {
            navToggle.classList.remove("active");
            mobileMenu.classList.remove("active");
            document.body.style.overflow = "";
        });
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add("visible");
                    }, parseInt(delay));
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // --- Counter Animation ---
    const statNumbers = document.querySelectorAll(".stat-number[data-target]");

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    let current = 0;
                    const increment = target / 40;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            entry.target.textContent = target;
                            clearInterval(timer);
                        } else {
                            entry.target.textContent = Math.floor(current);
                        }
                    }, 30);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach((el) => counterObserver.observe(el));

    // --- Smooth Scroll for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    // --- 3D Tilt Effect on Cards ---
    const tiltCards = document.querySelectorAll(".skill-card, .project-card");

    tiltCards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = "perspective(1000px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) translateY(-4px)";
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)";
        });
    });

    // --- Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll(".btn-magnetic");

    magneticBtns.forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = "translate(" + (x * 0.3) + "px, " + (y * 0.3) + "px)";
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "translate(0px, 0px)";
        });
    });

    // --- Konami Code Easter Egg ---
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;

    const easterEggLines = [
        { text: "$ sudo access --granted", cls: "ee-accent", delay: 0 },
        { text: "Initializing secure connection...", cls: "ee-warn", delay: 400 },
        { text: "████████████████████ 100%", cls: "ee-success", delay: 800 },
        { text: "", cls: "", delay: 1200 },
        { text: "┌──────────────────────────────────────┐", cls: "ee-accent", delay: 1300 },
        { text: "│  WELCOME TO THE INNER SANCTUM        │", cls: "ee-accent", delay: 1500 },
        { text: "│  You found the secret terminal!       │", cls: "ee-pink", delay: 1700 },
        { text: "│                                      │", cls: "", delay: 1800 },
        { text: "│  > Name: Ramazan Kalkan               │", cls: "", delay: 1900 },
        { text: "│  > Role: SAP ABAP & Fiori Developer   │", cls: "", delay: 2100 },
        { text: "│  > Status: Building cool stuff 24/7   │", cls: "ee-success", delay: 2300 },
        { text: "│  > Secret: Powered by mass amounts    │", cls: "ee-warn", delay: 2500 },
        { text: "│           of coffee & curiosity ☕     │", cls: "ee-warn", delay: 2700 },
        { text: "│                                      │", cls: "", delay: 2800 },
        { text: "│  Press ESC to return to reality...    │", cls: "ee-pink", delay: 3000 },
        { text: "└──────────────────────────────────────┘", cls: "ee-accent", delay: 3200 },
    ];

    const showEasterEgg = () => {
        const overlay = document.getElementById("easterEgg");
        const body = document.getElementById("easterEggBody");
        body.innerHTML = "";
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";

        easterEggLines.forEach((line) => {
            setTimeout(() => {
                const div = document.createElement("div");
                div.className = "easter-egg-line terminal-output " + line.cls;
                div.textContent = line.text;
                div.style.animationDelay = "0s";
                body.appendChild(div);
                body.scrollTop = body.scrollHeight;
            }, line.delay);
        });
    };

    const hideEasterEgg = () => {
        const overlay = document.getElementById("easterEgg");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
    };

    document.addEventListener("keydown", (e) => {
        if (document.getElementById("easterEgg").classList.contains("active")) {
            if (e.key === "Escape") {
                hideEasterEgg();
            }
            return;
        }

        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                showEasterEgg();
            }
        } else {
            konamiIndex = 0;
        }
    });

    document.getElementById("easterEgg").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
            hideEasterEgg();
        }
    });

    // --- Contact Form ---
    // Uses native form submission to FormSubmit.co.
    // First submission triggers an email confirmation to info@orklabs.io;
    // after confirming, all subsequent submissions deliver directly.
    const contactForm = document.getElementById("contactForm");
    const submitBtn = document.getElementById("submitBtn");

    if (contactForm && submitBtn) {
        contactForm.addEventListener("submit", () => {
            submitBtn.disabled = true;
            submitBtn.querySelector("span").textContent = "Sending...";
        });
    }
})();
