document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Animate toggle button
            const spans = menuToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Glass Card Spotlight Glow Effect
    const glassCards = document.querySelectorAll('.glass-card');
    
    glassCards.forEach(card => {
        // Create dynamic glow element if not already existing
        let glow = card.querySelector('.spotlight-glow');
        if (!glow) {
            glow = document.createElement('div');
            glow.className = 'spotlight-glow';
            card.appendChild(glow);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
            glow.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });
    });

    // 5. Active Link Tracking on Scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // 6. Contact Form Validation and Mock Submit
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const submitBtn = contactForm.querySelector('button[type="submit"]');

            if (!name || !email || !subject || !message) {
                showStatus('Please fill in all fields.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showStatus('Please enter a valid email address.', 'error');
                return;
            }

            // Disable submit button during mock API call
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Sending...';

            setTimeout(() => {
                showStatus('Thank you for reaching out! We will be in touch shortly.', 'success');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }, 1500);
        });
    }

    // 7. Privacy Policy Modal Logic
    const privacyLink = document.getElementById('footPrivacy');
    const privacyModal = document.getElementById('privacyModal');
    const closePrivacyBtn = document.getElementById('closePrivacyBtn');

    if (privacyLink && privacyModal && closePrivacyBtn) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable page scrolling
        });

        const closeBtnHandler = () => {
            privacyModal.classList.remove('active');
            document.body.style.overflow = 'auto'; // Enable page scrolling
        };

        closePrivacyBtn.addEventListener('click', closeBtnHandler);

        // Close when clicking overlay backdrop
        privacyModal.addEventListener('click', (e) => {
            if (e.target === privacyModal) {
                closeBtnHandler();
            }
        });

        // Close when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && privacyModal.classList.contains('active')) {
                closeBtnHandler();
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showStatus(msg, type) {
        formStatus.textContent = msg;
        formStatus.className = `form-status ${type}`;
        
        // Auto fade out status message after 5 seconds if success
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }
    }
});
