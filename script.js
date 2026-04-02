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
    };
}

// ── Quote Calculator Alpine component ──
function quoteCalc() {
    return {
        serviceType: '',
        aptSize: '',
        extras: { oven: false, fridge: false, windows: false },
        windowCount: 1,

        // Regular cleaning prices
        regularPrices: {
            '30': 45, '30-40': 50, '40-50': 55,
            '60-70': 65, '70-80': 70, '80-100': 75, '100+': 80
        },
        // Airbnb prices
        airbnbPrices: {
            'a25': 35, 'a25-40': 40, 'a40-60': 45, 'a60-80': 55
        },

        get basePrice() {
            if (this.serviceType === 'regular') return this.regularPrices[this.aptSize] || 0;
            if (this.serviceType === 'airbnb') return this.airbnbPrices[this.aptSize] || 0;
            return 0;
        },

        get extrasPrice() {
            if (this.serviceType !== 'regular') return 0;
            let total = 0;
            if (this.extras.oven) total += 15;
            if (this.extras.fridge) total += 10;
            if (this.extras.windows) total += 15 * (this.windowCount || 1);
            return total;
        },

        get totalPrice() {
            return this.basePrice + this.extrasPrice;
        },

        whatsappLink() {
            const sizeLabels = {
                '30': 'iki 30 m²', '30-40': '30–40 m²', '40-50': '40–50 m²',
                '60-70': '60–70 m²', '70-80': '70–80 m²', '80-100': '80–100 m²', '100+': '100+ m²',
                'a25': 'iki 25 m²', 'a25-40': '25–40 m²', 'a40-60': '40–60 m²', 'a60-80': '60–80 m²'
            };
            const typeLabel = this.serviceType === 'regular' ? 'Reguliarus valymas' : 'Airbnb valymas';
            const sizeLabel = sizeLabels[this.aptSize] || '';
            let extrasArr = [];
            if (this.extras.oven) extrasArr.push('Orkaitė (+15 €)');
            if (this.extras.fridge) extrasArr.push('Šaldytuvas (+10 €)');
            if (this.extras.windows) extrasArr.push('Langai ×' + this.windowCount + ' (+' + (15 * this.windowCount) + ' €)');
            const extrasStr = extrasArr.length ? extrasArr.join(', ') : 'Nėra';

            const msg = encodeURIComponent(
                `Sveiki! Norėčiau užsakyti valymo paslaugą.\n\n` +
                `Paslauga: ${typeLabel}\n` +
                `Plotas: ${sizeLabel}\n` +
                `Papildomos: ${extrasStr}\n` +
                `Preliminari kaina: nuo ${this.totalPrice} €`
            );
            return `https://wa.me/37063013887?text=${msg}`;
        },

        init() {
            // Reset size when service type changes
            this.$watch('serviceType', () => {
                this.aptSize = '';
                this.extras = { oven: false, fridge: false, windows: false };
                this.windowCount = 1;
                // Re-init lucide icons for newly shown elements
                this.$nextTick(() => {
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                });
            });
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

// ── Subtle hero parallax on scroll ──
document.addEventListener('DOMContentLoaded', () => {
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    if (scrolled < window.innerHeight) {
                        heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px) scale(1.05)';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
});

// ── Magnetic button effect on CTA buttons ──
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-magnetic, .hero-cta a').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            setTimeout(() => { btn.style.transition = ''; }, 400);
        });
    });
});

// ── Tilt effect on service cards ──
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#paslaugos .grid > div:not(:last-child)').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = 'perspective(800px) rotateY(' + (x * 5) + 'deg) rotateX(' + (-y * 5) + 'deg) translateY(-4px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
            setTimeout(() => { card.style.transition = ''; }, 600);
        });
    });
});

// ── Scroll-triggered reveal animations ──
document.addEventListener('DOMContentLoaded', () => {

    // ── Apply animation classes per section context ──

    // Section headers get blur-in reveal
    document.querySelectorAll(
        '#paslaugos .text-center.max-w-2xl,' +
        '#kaip-veikia .text-center.max-w-2xl,' +
        '#kontaktai > div > div > span:first-child,' +
        '#kontaktai > div > div > h2,' +
        '#kontaktai > div > div > p.text-gray-500'
    ).forEach(el => el.classList.add('blur-in'));

    // Section header decorative line
    document.querySelectorAll(
        '#paslaugos .text-center.max-w-2xl,' +
        '#kaip-veikia .text-center.max-w-2xl'
    ).forEach(header => {
        const lineEl = document.createElement('span');
        lineEl.classList.add('line-reveal');
        // Insert after the subtitle
        const subtitle = header.querySelector('p');
        if (subtitle) {
            subtitle.after(lineEl);
        }
    });

    // Service cards — scale-in + card-lift
    document.querySelectorAll('#paslaugos .grid > div').forEach(el => {
        el.classList.add('scale-in', 'card-lift');
    });

    // Service card icons — icon-pop
    document.querySelectorAll('#paslaugos .grid > div .w-14').forEach(el => {
        el.classList.add('icon-pop');
    });

    // How-it-works steps — fade-in-up
    document.querySelectorAll('#kaip-veikia .grid > div').forEach(el => {
        el.classList.add('fade-in-up');
    });

    // How-it-works step icons — gentle float
    document.querySelectorAll('#kaip-veikia .grid > div .w-16').forEach(el => {
        el.classList.add('float-gentle');
    });

    // Payment box — shimmer accent
    const paymentBox = document.querySelector('#kaip-veikia .bg-beige-50');
    if (paymentBox) {
        paymentBox.classList.add('fade-in-up', 'shimmer-box');
    }

    // Why us — image slides from left, content slides from right
    const whyImage = document.querySelector('#kodel-mes .grid > div:first-child');
    const whyContent = document.querySelector('#kodel-mes .grid > div:last-child');
    if (whyImage) whyImage.classList.add('fade-in-left');
    if (whyContent) whyContent.classList.add('fade-in-right');

    // Why us — individual benefit rows
    document.querySelectorAll('#kodel-mes .flex.gap-4').forEach(el => {
        el.classList.add('fade-in-up');
    });

    // Why us — benefit icons get icon-pop
    document.querySelectorAll('#kodel-mes .flex.gap-4 .w-12').forEach(el => {
        el.classList.add('icon-pop');
    });

    // Contact section — form slides left, info slides right
    const contactForm = document.querySelector('#kontaktai .grid > div:first-child');
    const contactInfo = document.querySelector('#kontaktai .grid > div:last-child');
    if (contactForm) contactForm.classList.add('fade-in-left');
    if (contactInfo) contactInfo.classList.add('fade-in-right');

    // Footer columns — fade-in-up
    document.querySelectorAll('footer .grid > div').forEach(el => {
        el.classList.add('fade-in-up');
    });

    // ── Intersection Observer (triggers all animation classes) ──
    const animatedClasses = ['fade-in-up', 'fade-in-left', 'fade-in-right', 'scale-in', 'blur-in', 'line-reveal'];

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add small random delay (20-80ms) for organic stagger feel
                    const randomDelay = 20 + Math.random() * 60;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, randomDelay);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        }
    );

    animatedClasses.forEach(cls => {
        document.querySelectorAll('.' + cls).forEach(el => {
            observer.observe(el);
        });
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

        // Contact / Calculator
        'contact.label': 'Contact us',
        'contact.title': 'Get an instant quote',
        'contact.subtitle': 'Select a service, area size and extras — the price updates automatically.',
        'contact.directTitle': 'Contact us directly',
        'contact.phone': 'Phone',

        // Quote calculator
        'calc.serviceType': 'Service type *',
        'calc.regular': 'Regular cleaning',
        'calc.airbnb': 'Airbnb cleaning',
        'calc.aptSize': 'Apartment size *',
        'calc.selectSize': 'Select size',
        'calc.extras': 'Extra services',
        'calc.oven': 'Oven cleaning',
        'calc.fridge': 'Fridge cleaning',
        'calc.windows': 'Window cleaning',
        'calc.windowsNote': '(15 € / window, larger windows — more)',
        'calc.windowCount': 'Number of windows',
        'calc.airbnbNote': 'Price includes bed linen change. Linen must be pre-washed — we do not wash on-site! For deep cleaning, contact us privately.',
        'calc.deepNote': 'For deep cleaning prices, contact us personally — we adjust based on your needs.',
        'calc.estimate': 'Estimated price:',
        'calc.from': 'from',
        'calc.orderWhatsApp': 'Order via WhatsApp',

        // Footer
        'footer.brand': 'Professional cleaning service coordination in Vilnius.',
        'footer.links': 'Links',
        'footer.servicesTitle': 'Services',
        'footer.contactTitle': 'Contacts',
        'footer.copy': '© 2026 ŠvaraPlus. All rights reserved.',
        'footer.business': 'Individuali veikla pagal pažymą nr. 1501924 Edvin Katenel LT047044060008303226',
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
        'contact.title': 'Sužinokite kainą akimirksniu',
        'contact.subtitle': 'Pasirinkite paslaugą, plotą ir papildomas paslaugas — kaina atsinaujins automatiškai.',
        'contact.directTitle': 'Susisiekite tiesiogiai',
        'contact.phone': 'Telefonas',
        'calc.serviceType': 'Paslaugos tipas *',
        'calc.regular': 'Reguliarus valymas',
        'calc.airbnb': 'Airbnb valymas',
        'calc.aptSize': 'Buto plotas *',
        'calc.selectSize': 'Pasirinkite plotą',
        'calc.extras': 'Papildomos paslaugos',
        'calc.oven': 'Orkaitės valymas',
        'calc.fridge': 'Šaldytuvo valymas',
        'calc.windows': 'Langų valymas',
        'calc.windowsNote': '(15 € / langas, dideliam langui — daugiau)',
        'calc.windowCount': 'Langų skaičius',
        'calc.airbnbNote': 'Į kainą įeina patalynės keitimas. Patalynė turi būti išskalbta — vietoje neskalbiam! Dėl giluminio valymo susisiekite asmeniškai.',
        'calc.deepNote': 'Dėl giluminio valymo kainų susisiekite su mumis asmeniškai — patiksliname pagal poreikius.',
        'calc.estimate': 'Preliminari kaina:',
        'calc.from': 'nuo',
        'calc.orderWhatsApp': 'Užsakyti per WhatsApp',
        'footer.brand': 'Profesionalus valymo paslaugų koordinavimas Vilniuje.',
        'footer.links': 'Nuorodos',
        'footer.servicesTitle': 'Paslaugos',
        'footer.contactTitle': 'Kontaktai',
        'footer.copy': '© 2026 ŠvaraPlus. Visos teisės saugomos.',
        'footer.business': 'Individuali veikla pagal pažymą nr. 1501924 Edvin Katenel LT047044060008303226',
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
