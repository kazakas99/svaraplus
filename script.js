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
                window.open(`https://wa.me/37063013887?text=${msg}`, '_blank');

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

// ═══════════════════════════════════════════════
// Language Switcher (LT ↔ EN)
// ═══════════════════════════════════════════════
let currentLang = 'lt';

const translations = {
    en: {
        // Nav
        'nav.services': 'Services',
        'nav.howItWorks': 'How it works',
        'nav.whyUs': 'Why us',
        'nav.getPrice': 'Get a quote',

        // Hero
        'hero.title1': 'Cleanliness in your home —',
        'hero.title2': 'worry-free',
        'hero.subtitle': 'Reliable apartment, house and Airbnb cleaning. You order — we take care of spotless cleanliness.',
        'hero.whatsapp': 'Message WhatsApp',
        'hero.freeEstimate': 'Get a free estimate',
        'hero.trust1': 'Payment after cleaning',
        'hero.trust2': 'We respond within 1 hour',

        // Services
        'services.label': 'Our services',
        'services.title': 'Cleaning solutions for every need',
        'services.subtitle': 'From deep cleaning to regular maintenance — find the service that suits you best.',
        'services.general.title': 'Deep cleaning',
        'services.general.desc': 'Thorough apartment and house cleaning. An ideal choice for maintaining regular order at home.',
        'services.airbnb.title': 'Airbnb cleaning',
        'services.airbnb.desc': 'Fast and thorough cleaning between guests. Linen change, tidy kitchen, fresh scent.',
        'services.regular.title': 'Weekly / monthly cleaning',
        'services.regular.desc': 'Regular home maintenance — the same trusted cleaner every time. Flexible schedule.',
        'services.orderNow': 'Order now',
        'services.cta.title': 'Not sure what you need?',
        'services.cta.desc': 'Write to us — we will help you choose the most suitable service and offer the best price.',
        'services.cta.button': 'Consult on WhatsApp',
        'services.popular': 'Popular',
        'services.from': 'from',
        'services.perVisit': '/ visit',

        // How it works
        'how.label': 'Simple process',
        'how.title': 'How does it work?',
        'how.subtitle': 'Everything is simple — from inquiry to sparkling home in just four steps.',
        'how.step1.title': 'Write to us',
        'how.step1.desc': 'WhatsApp message or fill out the form — we respond within 1 hour.',
        'how.step2.title': 'Get a price',
        'how.step2.desc': 'We evaluate the area, service type and provide an exact price.',
        'how.step3.title': 'Enjoy spotless cleanliness!',
        'how.step3.desc': 'The cleaner arrives at the agreed time. After work — before/after photos for your peace of mind.',
        'how.step4.title': 'Pay for the service',
        'how.step4.desc': 'Full amount via Paysera or bank transfer — simple and secure.',
        'how.payment.title': 'How does payment work?',
        'how.payment.desc': 'The full amount is paid after cleaning. You can pay via <strong>Paysera</strong> or bank transfer, simple and secure.',

        // Why us
        'why.label': 'Why ŠvaraPlus?',
        'why.title': 'Reliability you feel from the first contact',
        'why.p1.title': 'Verified cleaners',
        'why.p1.desc': 'Every cleaner is carefully selected and verified. We work only with responsible, experienced specialists.',
        'why.p2.title': 'Payment after work',
        'why.p2.desc': 'You pay the full amount after cleaning — we issue an invoice on request.',
        'why.p3.title': 'Before & After photos',
        'why.p3.desc': 'We photograph before and after every cleaning — you see the exact result and quality guarantee.',
        'why.p4.title': 'Fast response',
        'why.p4.desc': 'Write at any time — we respond within 1 hour and arrange everything quickly and conveniently.',

        // Contact form
        'contact.label': 'Contact us',
        'contact.title': 'Get a free estimate',
        'contact.subtitle': 'Fill out the form and we will respond within 1 hour with an exact price.',
        'contact.directTitle': 'Contact us directly',
        'contact.phone': 'Phone',

        // Form
        'form.name': 'Name *',
        'form.namePh': 'Your name',
        'form.phone': 'Phone *',
        'form.phonePh': '+370 6XX XXXXX',
        'form.service': 'Service *',
        'form.servicePh': 'Select a service',
        'form.serviceGen': 'Deep cleaning',
        'form.serviceAirbnb': 'Airbnb cleaning',
        'form.serviceReg': 'Weekly / monthly cleaning',
        'form.city': 'City *',
        'form.cityPh': 'Select a city',
        'form.message': 'Additional information',
        'form.messagePh': 'Area size, preferences, date...',
        'form.submit': 'Get a quote',
        'form.sending': 'Sending...',
        'form.sent': 'Sent! We will contact you soon.',

        // Footer
        'footer.brand': 'Professional cleaning service coordination in Vilnius.',
        'footer.links': 'Links',
        'footer.servicesTitle': 'Services',
        'footer.contactTitle': 'Contacts',
        'footer.copy': '© 2026 ŠvaraPlus. All rights reserved.',
        'footer.privacy': 'Privacy policy',
        'footer.terms': 'Terms of use',

        // WhatsApp tooltip
        'whatsappTooltip': 'Write to us! 💬',
    },
    lt: {
        'nav.services': 'Paslaugos',
        'nav.howItWorks': 'Kaip veikia',
        'nav.whyUs': 'Kodėl mes',
        'nav.getPrice': 'Gauti kainą',
        'hero.title1': 'Švara jūsų namuose —',
        'hero.title2': 'be rūpesčių',
        'hero.subtitle': 'Patikimas butų, namų, Airbnb valymas. Jūs užsakote — mes pasirūpiname nepriekaištinga švara.',
        'hero.whatsapp': 'Rašyti į WhatsApp',
        'hero.freeEstimate': 'Gauti nemokamą įvertinimą',
        'hero.trust1': 'Apmokėjimas prieš valymą',
        'hero.trust2': 'Atsakome per 1 val.',
        'services.label': 'Mūsų paslaugos',
        'services.title': 'Valymo sprendimai kiekvienam poreikiui',
        'services.subtitle': 'Nuo generalinio valymo iki reguliaraus palaikymo — raskite sau tinkamiausią paslaugą.',
        'services.general.title': 'Generalinis valymas',
        'services.general.desc': 'Nuodugnus butų ir namų valymas. Idealus pasirinkimas norint palaikyti reguliarią tvarką namie.',
        'services.airbnb.title': 'Airbnb valymas',
        'services.airbnb.desc': 'Greitas ir kruopštus valymas tarp svečių. Patalynės keitimas, tvarkinga virtuvė, šviežias kvapas.',
        'services.regular.title': 'Savaitinis / mėnesinis valymas',
        'services.regular.desc': 'Reguliarus namų palaikymas — ta pati patikima valytoja kiekvieną kartą. Lankstus grafikas.',
        'services.orderNow': 'Užsakyti dabar',
        'services.cta.title': 'Nežinote, ko reikia?',
        'services.cta.desc': 'Parašykite mums — padėsime parinkti tinkamiausią paslaugą ir pasiūlysime geriausią kainą.',
        'services.cta.button': 'Konsultacija WhatsApp',
        'services.popular': 'Populiaru',
        'services.from': 'nuo',
        'services.perVisit': '/ vizitas',
        'how.label': 'Paprastas procesas',
        'how.title': 'Kaip tai veikia?',
        'how.subtitle': 'Viskas paprasta — nuo užklausos iki spindančių namų vos keturi žingsniai.',
        'how.step1.title': 'Parašykite mums',
        'how.step1.desc': 'WhatsApp žinutė arba užpildykite formą — atsakome per 1 val.',
        'how.step2.title': 'Gausite kainą',
        'how.step2.desc': 'Įvertiname plotą, paslaugos tipą ir pateikiame tikslią kainą.',
        'how.step3.title': 'Džiaukitės nepriekaištinga švara!',
        'how.step3.desc': 'Valytoja atvyksta sutartu laiku. Po darbo — before/after nuotraukos jūsų ramybei.',
        'how.step4.title': 'Apmokate paslaugą',
        'how.step4.desc': 'Pilna suma per Paysera arba bankiniu pavedimu — paprasta ir saugu.',
        'how.payment.title': 'Kaip vyksta apmokėjimas?',
        'how.payment.desc': 'Visa suma apmokama po valymo. Mokėti galite per <strong>Paysera</strong> arba bankiniu pavedimu, paprasta ir saugu.',
        'why.label': 'Kodėl ŠvaraPlus?',
        'why.title': 'Patikimumas, kurį jaučiate nuo pirmo kontakto',
        'why.p1.title': 'Patikrintos valytojos',
        'why.p1.desc': 'Kiekviena valytoja kruopščiai atrinkta ir patikrinta. Dirbame tik su atsakingomis, patirtį turinčiomis specialistėmis.',
        'why.p2.title': 'Apmokėjimas po darbo',
        'why.p2.desc': 'Visą sumą mokate po valymo - prireikus išrašome sąskaitą faktūrą.',
        'why.p3.title': 'Before & After nuotraukos',
        'why.p3.desc': 'Kiekvieno valymo metu fotografuojame prieš ir po — matote tikslų rezultatą ir kokybės garantiją.',
        'why.p4.title': 'Greitas atsakymas',
        'why.p4.desc': 'Rašykite bet kuriuo metu — atsakome per 1 valandą ir suderiname viską greitai bei patogiai.',
        'contact.label': 'Susisiekite',
        'contact.title': 'Gaukite nemokamą įvertinimą',
        'contact.subtitle': 'Užpildykite formą ir atsakysime per 1 valandą su tikslia kaina.',
        'contact.directTitle': 'Susisiekite tiesiogiai',
        'contact.phone': 'Telefonas',
        'form.name': 'Vardas *',
        'form.namePh': 'Jūsų vardas',
        'form.phone': 'Telefonas *',
        'form.phonePh': '+370 6XX XXXXX',
        'form.service': 'Paslauga *',
        'form.servicePh': 'Pasirinkite paslaugą',
        'form.serviceGen': 'Generalinis valymas',
        'form.serviceAirbnb': 'Airbnb valymas',
        'form.serviceReg': 'Savaitinis / mėnesinis valymas',
        'form.city': 'Miestas *',
        'form.cityPh': 'Pasirinkite miestą',
        'form.message': 'Papildoma informacija',
        'form.messagePh': 'Patalpų plotas, pageidavimai, data...',
        'form.submit': 'Gauti kainą',
        'form.sending': 'Siunčiama...',
        'form.sent': 'Išsiųsta! Susisieksime greitai.',
        'footer.brand': 'Profesionalus valymo paslaugų koordinavimas Vilniuje.',
        'footer.links': 'Nuorodos',
        'footer.servicesTitle': 'Paslaugos',
        'footer.contactTitle': 'Kontaktai',
        'footer.copy': '© 2026 ŠvaraPlus. Visos teisės saugomos.',
        'footer.privacy': 'Privatumo politika',
        'footer.terms': 'Naudojimo sąlygos',
        'whatsappTooltip': 'Rašykite mums! 💬',
    }
};

function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;

    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
            el.textContent = dict[key];
        }
    });

    // HTML content (for elements with <strong> etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key] !== undefined) {
            el.innerHTML = dict[key];
        }
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] !== undefined) {
            el.setAttribute('placeholder', dict[key]);
        }
    });

    // Update html lang attribute
    document.documentElement.lang = lang === 'en' ? 'en' : 'lt';
}

function toggleLanguage() {
    currentLang = currentLang === 'lt' ? 'en' : 'lt';
    applyTranslations(currentLang);

    // Update toggle button labels
    const nextLang = currentLang === 'lt' ? 'EN' : 'LT';
    const nextLangMobile = currentLang === 'lt' ? 'English' : 'Lietuvių';

    const label = document.getElementById('lang-label');
    const labelMobile = document.getElementById('lang-label-mobile');
    if (label) label.textContent = nextLang;
    if (labelMobile) labelMobile.textContent = nextLangMobile;

    // Re-init lucide icons (some templates may have re-rendered)
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 50);
}
