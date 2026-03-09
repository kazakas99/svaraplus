/* ═══════════════════════════════════════════════
   ŠvaraPlus — Script
   Alpine.js handles most interactivity inline.
   This file adds scroll animations, Lucide icon
   init, and the Alpine data/form logic.
   ═══════════════════════════════════════════════ */

// ── Alpine.js App Data ──
function app() {
    return {
        scrolled: false,
        mobileMenu: false,

        // Form
        form: {
            name: '',
            phone: '',
            service: '',
            city: '',
            message: ''
        },
        formSubmitting: false,
        formSubmitted: false,

        submitForm() {
            // Basic client-side validation
            if (!this.form.name || !this.form.phone || !this.form.service || !this.form.city) {
                return;
            }

            this.formSubmitting = true;

            // Simulate form submission (replace with real endpoint)
            setTimeout(() => {
                this.formSubmitting = false;
                this.formSubmitted = true;

                // Build WhatsApp message as fallback
                const msg = encodeURIComponent(
                    `Sveiki! Norėčiau užsakyti valymo paslaugą.\n\n` +
                    `Vardas: ${this.form.name}\n` +
                    `Telefonas: ${this.form.phone}\n` +
                    `Paslauga: ${this.form.service}\n` +
                    `Miestas: ${this.form.city}\n` +
                    `Papildoma info: ${this.form.message || 'Nėra'}`
                );

                // Open WhatsApp with pre-filled message
                window.open(`https://wa.me/37068564040?text=${msg}`, '_blank');

                // Reset form after delay
                setTimeout(() => {
                    this.formSubmitted = false;
                    this.form = {
                        name: '',
                        phone: '',
                        service: '',
                        city: '',
                        message: ''
                    };
                }, 4000);
            }, 1200);
        }
    };
}

// ── Initialize Lucide Icons ──
document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Re-init icons after Alpine has rendered (catches x-show/x-if elements)
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 500);
});

// ── Scroll-triggered fade-in animations ──
document.addEventListener('DOMContentLoaded', () => {
    // Add .fade-in-up class to animatable elements
    const selectors = [
        '#paslaugos .grid > div',
        '#kaip-veikia .grid > div',
        '#kodel-mes .flex.gap-4',
        '#atsiliepimai .grid > div',
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('fade-in-up');
        });
    });

    // Intersection Observer
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
});

// ── Smooth scroll for anchor links (fallback) ──
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ── Counter animation for stats ──
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);

    function step() {
        start += increment;
        if (start >= target) {
            element.textContent = target + '+';
            return;
        }
        element.textContent = Math.floor(start) + '+';
        requestAnimationFrame(step);
    }

    step();
}
