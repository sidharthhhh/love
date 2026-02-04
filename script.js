document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const mainQuestion = document.getElementById('mainQuestion');
    const successContainer = document.getElementById('successContainer');
    const stickerContainer = document.getElementById('stickerContainer');
    const music = document.getElementById('bgMusic');

    // State
    let noClickCount = 0;
    const noTexts = [
        "NO 💔",
        "Are you sure?",
        "Think again...",
        "Really? 🥺",
        "Last chance!",
        "Don't do this!",
        "I'll cry 😭",
        "Okay fine..."
    ];

    // --- Typing Effect ---
    const questionText = "Will you be my Valentine? 💖";
    mainQuestion.innerText = ""; // Clear initially

    // Create cursor
    const cursorSpan = document.createElement('span');
    cursorSpan.classList.add('cursor-blink');
    mainQuestion.appendChild(cursorSpan);

    let charIndex = 0;
    function typeText() {
        if (charIndex < questionText.length) {
            cursorSpan.before(questionText.charAt(charIndex));
            charIndex++;
            setTimeout(typeText, 100); // Speed
        } else {
            // Remove cursor after delay
            setTimeout(() => cursorSpan.style.display = 'none', 3000);
        }
    }

    // --- Initial Animation ---
    // Animate container/buttons, then start typing
    const tl = gsap.timeline();

    // Note: We animate opacity/y for safety (if JS fails, CSS shows them)
    tl.from(mainQuestion, { duration: 1, y: -50, opacity: 0, ease: "bounce.out", onComplete: typeText })
        .from(".btn", { duration: 0.8, opacity: 0, y: 30, stagger: 0.2, ease: "power2.out" }, "-=0.5");

    // Yes Button Pulse
    gsap.to(yesBtn, {
        scale: 1.1,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
    });

    // --- Music Autoplay Hook ---
    const startMusic = () => {
        music.play().catch(e => console.log("Audio autoplay blocked until interaction"));
        document.removeEventListener('click', startMusic);
        document.removeEventListener('touchstart', startMusic);
    };
    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('touchstart', startMusic, { once: true });

    // --- No Button Logic ---
    const moveNoButton = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const btnRect = noBtn.getBoundingClientRect();
        const padding = 20;

        // Random position
        let newX = Math.random() * (viewportWidth - btnRect.width - padding * 2) + padding;
        let newY = Math.random() * (viewportHeight - btnRect.height - padding * 2) + padding;

        // Move to body for absolute positioning reliability
        if (noBtn.parentNode !== document.body) {
            document.body.appendChild(noBtn);
            noBtn.style.position = 'absolute';
            noBtn.style.zIndex = '1000';
        }

        gsap.to(noBtn, {
            left: newX,
            top: newY,
            duration: 0.3,
            ease: "power2.out"
        });

        // Progressive Effects
        noClickCount++;

        if (noClickCount < noTexts.length) {
            noBtn.innerHTML = `NO 💔<br><span class="subtext">${noTexts[noClickCount]}</span>`;
        } else {
            noBtn.innerHTML = `NO 💔<br><span class="subtext">Error: 404</span>`;
            noBtn.style.opacity = Math.max(0.2, 1 - (noClickCount * 0.1));
        }

        // Shrink
        const currentScale = gsap.getProperty(noBtn, "scale") || 1; // default 1
        if (currentScale > 0.6) {
            gsap.to(noBtn, { scale: currentScale * 0.9, duration: 0.2 });
        }

        // Grow Yes Button
        const yesScale = gsap.getProperty(yesBtn, "scale") || 1;
        if (yesScale < 15) {
            gsap.killTweensOf(yesBtn, "scale");
            gsap.to(yesBtn, {
                scale: yesScale * 1.3,
                duration: 0.3,
                ease: "elastic.out(1, 0.3)"
            });
        }
    };

    noBtn.addEventListener('mouseover', moveNoButton);
    noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNoButton(); });
    noBtn.addEventListener('click', (e) => { e.preventDefault(); moveNoButton(); });

    // --- Yes Button Logic ---
    yesBtn.addEventListener('click', () => {
        // 0. Hide No Button
        noBtn.style.display = 'none';

        // 1. Reveal Overlay
        successContainer.classList.remove('hidden');

        // 2. Animate Success Msg
        gsap.from(".success-msg", {
            scale: 0,
            rotation: -720,
            duration: 1.5,
            ease: "elastic.out(1, 0.3)"
        });

        // 3. (Stiffness Removed) 
        // skipped sticker

        // 4. Confetti
        createConfetti();
    });

    // Simple Confetti
    function createConfetti() {
        const colors = ['#ff4d6d', '#ff8fa3', '#fff0f3', '#e5b8f4'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -10 + 'px';
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '1000';

            successContainer.appendChild(confetti);

            gsap.to(confetti, {
                y: '100vh',
                x: (Math.random() - 0.5) * 200,
                rotation: Math.random() * 360,
                duration: Math.random() * 3 + 2,
                ease: "power1.out",
                delay: Math.random() * 2
            });
        }
    }
});
