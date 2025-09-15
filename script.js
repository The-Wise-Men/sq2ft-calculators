// Square Inches to Square Feet Converter JavaScript

class SquareConverter {
    constructor() {
        this.inputField = document.getElementById('square-inches');
        this.resultMain = document.getElementById('result-main');
        this.resultDetail = document.getElementById('result-detail');
        this.convertBtn = document.getElementById('convert-btn');
        this.clearBtn = document.getElementById('clear-btn');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Convert button click (optional button)
        if (this.convertBtn) {
            this.convertBtn.addEventListener('click', () => this.convert());
        }

        // Clear button click
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clear());
        }

        // Enter key press
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convert();
            }
        });

        // Real-time conversion as user types
        this.inputField.addEventListener('input', () => {
            const value = this.inputField.value.trim();

            // Validate input
            validateInput(this.inputField, {
                min: 0,
                max: 1000000,
                required: false,
                customMessage: 'Please enter a valid number or fraction'
            });

            if (value) {
                this.convert();
            }
        });
    }

    parseInput(inputStr) {
        inputStr = inputStr.trim();

        if (!inputStr) {
            return null;
        }

        // Remove extra spaces
        inputStr = inputStr.replace(/\s+/g, ' ');

        // Try mixed number pattern first (e.g., "144 1/2")
        const mixedPattern = /^(\d+(?:\.\d+)?)\s+(\d+)\/(\d+)$/;
        const mixedMatch = inputStr.match(mixedPattern);
        if (mixedMatch) {
            const wholePart = parseFloat(mixedMatch[1]);
            const numerator = parseInt(mixedMatch[2]);
            const denominator = parseInt(mixedMatch[3]);
            return wholePart + (numerator / denominator);
        }

        // Try simple fraction pattern (e.g., "1/2", "289/2")
        const fractionPattern = /^(\d+)\/(\d+)$/;
        const fractionMatch = inputStr.match(fractionPattern);
        if (fractionMatch) {
            const numerator = parseInt(fractionMatch[1]);
            const denominator = parseInt(fractionMatch[2]);
            if (denominator === 0) return null;
            return numerator / denominator;
        }

        // Try decimal pattern (e.g., "144.5", "144.25")
        const decimalPattern = /^(\d+(?:\.\d+)?)$/;
        const decimalMatch = inputStr.match(decimalPattern);
        if (decimalMatch) {
            return parseFloat(decimalMatch[1]);
        }

        return null;
    }

    convert() {
        const inputStr = this.inputField.value;

        if (!inputStr.trim()) {
            this.showError("Please enter square inches to convert.");
            return;
        }

        const squareInches = this.parseInput(inputStr);

        if (squareInches === null) {
            this.showError("Please enter a valid number or fraction.");
            return;
        }

        if (squareInches < 0) {
            this.showError("Square inches cannot be negative.");
            return;
        }

        // Convert to square feet (1 square foot = 144 square inches)
        const squareFeet = squareInches / 144;

        // Format the result
        let resultText;
        if (squareFeet === Math.floor(squareFeet)) {
            resultText = `${Math.floor(squareFeet)} ft²`;
        } else {
            resultText = `${squareFeet.toFixed(4)} ft²`;
        }

        const detailText = `${squareFeet.toFixed(6)} square feet`;

        this.resultMain.textContent = resultText;
        this.resultDetail.textContent = detailText;

        // Let CSS control colors

        // Track conversion for analytics (if needed)
        this.trackConversion(squareInches, squareFeet);
    }

    clear() {
        this.inputField.value = '';
        this.resultMain.textContent = '0 ft²';
        this.resultDetail.textContent = 'Enter square inches above to convert';
        // Let CSS define colors
        this.resultMain.style.color = '';
        this.resultDetail.style.color = '';
        this.inputField.focus();
    }

    showError(message) {
        this.resultMain.textContent = 'Error';
        this.resultDetail.textContent = message;
        this.resultMain.style.color = '#dc3545';
        this.resultDetail.style.color = '#dc3545';

        // Do not auto-clear; keep message visible until user action
    }

    trackConversion(squareInches, squareFeet) {
        // Google Analytics event tracking (if GA is set up)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                event_category: 'Calculator',
                event_label: 'Square Inches to Feet',
                value: Math.round(squareInches)
            });
        }

        // You can add other analytics tracking here
        console.log(`Converted ${squareInches} sq in to ${squareFeet.toFixed(4)} sq ft`);
    }
}

// Common conversion examples for SEO and user help
const commonConversions = {
    144: 1,
    288: 2,
    432: 3,
    576: 4,
    720: 5,
    864: 6,
    1008: 7,
    1152: 8,
    1296: 9,
    1440: 10
};

// Utility functions for additional features
function getCommonConversion(squareInches) {
    return commonConversions[squareInches] || null;
}

function generateRandomExample() {
    const examples = ['144', '288', '144.5', '144 1/2', '289/2', '576', '720.25', '432 3/4'];
    return examples[Math.floor(Math.random() * examples.length)];
}

// Add example functionality
function addExampleFeature() {
    const helpText = document.querySelector('.help-text');
    if (helpText) {
        helpText.addEventListener('click', () => {
            const example = generateRandomExample();
            document.getElementById('square-inches').value = example;
            converter.convert();
        });
        helpText.style.cursor = 'pointer';
        helpText.title = 'Click for a random example';
    }
}

// Mobile Navigation Toggle
class MobileNav {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');

        if (this.navToggle && this.navMenu) {
            this.initializeEventListeners();
        }
    }

    initializeEventListeners() {
        this.navToggle.addEventListener('click', () => {
            this.toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu when clicking on nav links (mobile), but keep it open for dropdown toggles or placeholder links
        this.navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    const href = (link.getAttribute('href') || '').trim();
                    const isDropdownToggle = link.classList.contains('dropdown-toggle');
                    const isPlaceholder = href === '' || href === '#';
                    if (isDropdownToggle || isPlaceholder) {
                        e.preventDefault();
                        return; // Do not close menu
                    }
                    this.closeMenu();
                }
            });
        });
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Dynamic Header Scroll Effect
class DynamicHeader {
    constructor() {
        this.header = document.querySelector('.main-nav');
        this.scrollThreshold = 50;

        if (this.header) {
            this.initializeScrollListener();
        }
    }

    initializeScrollListener() {
        let ticking = false;

        const updateHeader = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > this.scrollThreshold) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);

        // Initial check
        updateHeader();
    }
}

// Initialize the converter when page loads
let converter;
let mobileNav;
let dynamicHeader;

// Error handling utility
const safeExecute = (fn, context = 'Unknown') => {
    try {
        return fn();
    } catch (error) {
        console.error(`Error in ${context}:`, error);
        return null;
    }
};

// Form validation utility
const validateInput = (input, options = {}) => {
    const {
        min = 0,
        max = Infinity,
        required = false,
        type = 'number',
        customMessage = null
    } = options;

    const value = type === 'number' ? parseFloat(input.value) : input.value;
    const wrapper = input.closest('.input-wrapper');
    let messageEl = wrapper?.querySelector('.validation-message');

    // Create message element if it doesn't exist
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'validation-message';
        wrapper?.appendChild(messageEl);
    }

    // Clear previous states
    input.classList.remove('error', 'valid');
    messageEl.className = 'validation-message';

    // Check if empty and required
    if (required && (!input.value || input.value.trim() === '')) {
        input.classList.add('error');
        messageEl.classList.add('error');
        messageEl.textContent = customMessage || 'This field is required';
        return false;
    }

    // Skip validation if empty and not required
    if (!input.value || input.value.trim() === '') {
        return true;
    }

    // Type-specific validation
    if (type === 'number') {
        if (isNaN(value)) {
            input.classList.add('error');
            messageEl.classList.add('error');
            messageEl.textContent = customMessage || 'Please enter a valid number';
            return false;
        }

        if (value < min) {
            input.classList.add('error');
            messageEl.classList.add('error');
            messageEl.textContent = customMessage || `Value must be at least ${min}`;
            return false;
        }

        if (value > max) {
            input.classList.add('error');
            messageEl.classList.add('error');
            messageEl.textContent = customMessage || `Value must be no more than ${max}`;
            return false;
        }
    }

    // Valid input
    input.classList.add('valid');
    messageEl.classList.add('success');
    messageEl.textContent = '✓ Valid';
    return true;
};

// Immediate fallback: show content if JavaScript is working
document.addEventListener('DOMContentLoaded', () => {
    // Show content immediately on DOM ready as fallback
    const docEl = document.documentElement;
    if (!docEl.classList.contains('page-ready')) {
        docEl.classList.add('page-ready');
    }

    // Instantiate converter only on pages that have the input
    const squareInchesInput = document.getElementById('square-inches');
    if (squareInchesInput) {
        safeExecute(() => {
            converter = new SquareConverter();
            addExampleFeature();
            squareInchesInput.focus();
        }, 'SquareConverter initialization');
    }

    // Global UI inits with error handling
    safeExecute(() => {
        mobileNav = new MobileNav();
    }, 'MobileNav initialization');

    safeExecute(() => {
        dynamicHeader = new DynamicHeader();
    }, 'DynamicHeader initialization');

    // Attach animation classes (Animate.css and Hover.css)
    try {
        const isCoarse = window.matchMedia('(pointer: coarse)').matches;
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        document.querySelectorAll('.calculator-card').forEach(el => {
            el.classList.add('animate__animated', 'animate__fadeInUp');
        });
        document.querySelectorAll('.content-section article').forEach(el => {
            el.classList.add('animate__animated', 'animate__fadeInUp');
        });
        document.querySelectorAll('.faq-section').forEach(el => {
            el.classList.add('animate__animated', 'animate__fadeInUp');
        });
        // Do not animate title on every load; handled by AOS once via sessionStorage

        // Helper to trigger a brief animate.css effect on tap/click
        const addTapAnimation = (elements, animation) => {
            elements.forEach(el => {
                const trigger = () => {
                    if (prefersReduced) return;
                    el.classList.add('animate__animated', animation);
                    const handleEnd = () => {
                        el.classList.remove('animate__animated', animation);
                        el.removeEventListener('animationend', handleEnd);
                    };
                    el.addEventListener('animationend', handleEnd, { once: true });
                };
                el.addEventListener('touchstart', trigger, { passive: true });
                el.addEventListener('click', trigger);
            });
        };

        const buttons = document.querySelectorAll('.convert-btn, .clear-btn');
        const pills = document.querySelectorAll('.calculator-nav a, .preset-btn');
        const navLinks = document.querySelectorAll('.nav-link');

        if (isCoarse) {
            // Mobile/touch: tap-friendly pulse/subtle scale
            addTapAnimation(buttons, 'animate__pulse');
            // Do not animate pills on tap; only on first page load via AOS
        } else {
            // Desktop: disable mouse-over animation classes
        }
    } catch (e) {
        // Non-fatal if libraries are missing
    }

    // Inject Font Awesome icons into calculator pills based on destination (force consistent icons)
    const ensurePillIcons = () => {
        try {
            const pillIconForHref = (href) => {
                if (!href) return 'fa-circle-dot';
                const h = href.toLowerCase();
                if (h.includes('index')) return 'fa-ruler-combined';
                if (h.includes('tile')) return 'fa-border-all';
                if (h.includes('carpet')) return 'fa-couch';
                if (h.includes('hardwood')) return 'fa-tree';
                if (h.includes('baseboard')) return 'fa-ruler';
                if (h.includes('subfloor')) return 'fa-hammer';
                return 'fa-circle-dot';
            };
            document.querySelectorAll('.calculator-nav a').forEach(a => {
                // remove any existing leading icon
                if (a.firstElementChild && a.firstElementChild.tagName === 'I') {
                    a.removeChild(a.firstElementChild);
                }
                const icon = pillIconForHref(a.getAttribute('href') || '');
                a.innerHTML = `<i class="fa-solid ${icon}"></i> ` + a.innerHTML;
            });
        } catch (e) {}
    };
    ensurePillIcons();
    window.addEventListener('load', ensurePillIcons);

    // Hybrid PJAX navigation for calculator pills + page-ready fade
    try {
        const docEl = document.documentElement;

        // Ensure content is visible - add fallback timeout
        const showContent = () => {
            docEl.classList.add('page-ready');
        };

        // Defer reveal until load for smoother first paint
        window.addEventListener('load', showContent);

        // Fallback: show content after 2 seconds even if load event doesn't fire
        setTimeout(showContent, 2000);

        const normalizeUrl = (u) => {
            try { return new URL(u, window.location.href).href; } catch { return u; }
        };

        const loadedScriptSrcs = new Set(
            Array.from(document.querySelectorAll('script[src]')).map(s => normalizeUrl(s.getAttribute('src')))
        );

        const loadExternalScriptsSequentially = async (scripts) => {
            for (const src of scripts) {
                if (loadedScriptSrcs.has(src)) continue;
                await new Promise((resolve, reject) => {
                    const s = document.createElement('script');
                    s.src = src;
                    s.async = false;
                    s.onload = () => { loadedScriptSrcs.add(src); resolve(); };
                    s.onerror = reject;
                    document.head.appendChild(s);
                });
            }
        };

        const executeInlineScripts = (container) => {
            container.querySelectorAll('script:not([src])').forEach(old => {
                const code = old.textContent || '';
                if (!code.trim()) return;
                // Avoid rerunning AdSense snippets
                if (code.includes('adsbygoogle')) return;
                const s = document.createElement('script');
                s.textContent = code;
                document.body.appendChild(s);
                // Cleanup optional
                setTimeout(() => s.remove(), 0);
            });
        };

        const reInitNewContent = () => {
            // Re-run icon injection for new pills
            try { ensurePillIcons(); } catch (e) {}

            // Re-init AOS on new nodes
            try {
                document.querySelectorAll('.calculator-card').forEach(el => el.setAttribute('data-aos', 'fade-up'));
                document.querySelectorAll('.content-section article').forEach(el => el.setAttribute('data-aos', 'fade-up'));
                document.querySelectorAll('.faq-section').forEach(el => el.setAttribute('data-aos', 'fade-up'));
                if (window.AOS && typeof window.AOS.refresh === 'function') {
                    // Use refresh instead of init for PJAX navigation
                    window.AOS.refresh();
                } else if (window.AOS && typeof window.AOS.init === 'function') {
                    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                    window.AOS.init({
                        duration: 300,
                        once: true,
                        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                        offset: 60,
                        mirror: false,
                        disable: () => prefersReduced
                    });
                }
            } catch (e) {
                console.log('AOS refresh failed:', e);
            }

            // Re-init converter if present
            try {
                const squareInchesInput = document.getElementById('square-inches');
                if (squareInchesInput) {
                    // reset global converter ref
                    converter = new SquareConverter();
                    addExampleFeature();
                } else {
                    converter = undefined;
                }
            } catch (e) {}

            // Re-attach smooth scroll for anchors inside new main
            try {
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        const href = this.getAttribute('href');
                        if (!href || href === '#') return;
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    });
                });
            } catch (e) {}

            // Ensure copy buttons exist and are wired
            try { initCopyButtons(); } catch (e) {}
        };

        const pjaxSwap = async (url, pushState = true) => {
            const mainEl = document.querySelector('main');
            if (!mainEl) { window.location.href = url; return; }
            try {
                const res = await fetch(url, { credentials: 'same-origin' });
                if (!res.ok) throw new Error('HTTP ' + res.status);
                const html = await res.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newMain = doc.querySelector('main');
                if (!newMain) throw new Error('No main in response');

                // Update title
                if (doc.title) document.title = doc.title;

                // Load any external scripts not yet present (from the fetched document)
                const srcs = Array.from(doc.querySelectorAll('script[src]'))
                    .map(s => normalizeUrl(s.getAttribute('src')));
                await loadExternalScriptsSequentially(srcs);

                // After content is ready, fade out current, then swap, then fade in
                const performSwap = () => {
                    // Swap content while hidden
                    mainEl.innerHTML = newMain.innerHTML;
                    // Execute inline scripts from the new main only
                    executeInlineScripts(mainEl);
                    // Scroll to top and re-init UI behavior
                    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
                    reInitNewContent();
                    // Rebind PJAX links in the new content
                    try {
                        document.querySelectorAll('.calculator-nav a').forEach(link => {
                            link.addEventListener('click', (e) => {
                                const href = link.getAttribute('href');
                                if (!href || href.startsWith('#')) return;
                                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return;
                                e.preventDefault();
                                const dest = normalizeUrl(href);
                                if (dest === normalizeUrl(window.location.href)) return;
                                pjaxSwap(dest, true);
                            });
                        });
                    } catch (_) {}

                    // Prefetch likely next pages (new set)
                    try {
                        const prefetchPills = () => {
                            document.querySelectorAll('.calculator-nav a').forEach(a => {
                                const href = a.getAttribute('href');
                                if (!href || href.startsWith('#')) return;
                                const l = document.createElement('link');
                                l.rel = 'prefetch';
                                l.href = href;
                                document.head.appendChild(l);
                            });
                        };
                        (window.requestIdleCallback ? window.requestIdleCallback(prefetchPills) : setTimeout(prefetchPills, 400));
                    } catch (_) {}

                    if (pushState) window.history.pushState({ pjax: true }, '', url);
                    // Reveal next frame for a clean fade-in
                    requestAnimationFrame(() => mainEl.classList.remove('fade-hidden'));
                };

                // Trigger fade-out, then swap on transition end
                const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (prefersReduced) {
                    performSwap();
                } else {
                    let swapped = false;
                    const handleEnd = () => {
                        if (swapped) return;
                        swapped = true;
                        mainEl.removeEventListener('transitionend', handleEnd);
                        performSwap();
                    };
                    mainEl.addEventListener('transitionend', handleEnd, { once: true });
                    // Fallback in case transitionend doesn’t fire
                    setTimeout(handleEnd, 200);
                    // Start fade-out
                    // Ensure a frame so the transition applies
                    requestAnimationFrame(() => mainEl.classList.add('fade-hidden'));
                }
            } catch (err) {
                // Fallback to hard navigation
                window.location.href = url;
                return;
            }
        };

        const bindPjaxLinks = () => {
            document.querySelectorAll('.calculator-nav a').forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (!href || href.startsWith('#')) return;
                    // Allow new tab/window
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return;
                    e.preventDefault();
                    const dest = normalizeUrl(href);
                    if (dest === normalizeUrl(window.location.href)) return;
                    pjaxSwap(dest, true);
                });
            });
        };

        bindPjaxLinks();
        // Prefetch pill targets on idle to minimize fetch delay
        try {
            const prefetchPills = () => {
                document.querySelectorAll('.calculator-nav a').forEach(a => {
                    const href = a.getAttribute('href');
                    if (!href || href.startsWith('#')) return;
                    const l = document.createElement('link');
                    l.rel = 'prefetch';
                    l.href = href;
                    document.head.appendChild(l);
                });
            };
            (window.requestIdleCallback ? window.requestIdleCallback(prefetchPills) : setTimeout(prefetchPills, 500));
        } catch (_) {}
        window.addEventListener('popstate', () => {
            pjaxSwap(window.location.href, false);
        });
    } catch (e) {}

    // Add AOS attributes then init (if library present)
    const initAOS = () => {
        try {
            // Check if AOS is disabled via URL parameter or localStorage
            const urlParams = new URLSearchParams(window.location.search);
            const disableAOS = urlParams.get('disable-aos') === 'true' ||
                              localStorage.getItem('disableAOS') === 'true';

            if (disableAOS) {
                console.log('AOS disabled by user preference');
                return;
            }

            // Check if AOS is available and not already initialized
            if (!window.AOS || typeof window.AOS.init !== 'function') {
                console.log('AOS library not available, skipping animations');
                return;
            }

            // First-load only animations for title/pills (persist across pages in session)
            const hasAnimatedIntro = sessionStorage.getItem('introAnimated') === 'true';
            if (!hasAnimatedIntro) {
                const titleEl = document.querySelector('.page-title');
                if (titleEl) titleEl.setAttribute('data-aos', 'fade-down');
                const pillsEl = document.querySelector('.calculator-nav');
                if (pillsEl) pillsEl.setAttribute('data-aos', 'fade-down');
                // Mark after AOS finishes first run
                document.addEventListener('aos:in', () => {
                    sessionStorage.setItem('introAnimated', 'true');
                }, { once: true });
            }

            // Always animate body content below pills on load
            document.querySelectorAll('.calculator-card').forEach(el => el.setAttribute('data-aos', 'fade-up'));
            document.querySelectorAll('.content-section article').forEach(el => el.setAttribute('data-aos', 'fade-up'));
            document.querySelectorAll('.faq-section').forEach(el => el.setAttribute('data-aos', 'fade-up'));

            const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.AOS.init({
                duration: 300,
                once: true,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                offset: 60,
                mirror: false,
                disable: () => prefersReduced
            });
        } catch (e) {
            console.log('AOS initialization failed:', e);
        }
    };

    // Try to initialize AOS immediately, then retry after a delay if it fails
    initAOS();

    // Fallback: retry AOS initialization after a delay
    setTimeout(() => {
        if (!window.AOS || !window.AOS.refresh) {
            initAOS();
        }
    }, 1000);

    // Add global function to disable AOS if needed
    window.disableAOS = () => {
        localStorage.setItem('disableAOS', 'true');
        console.log('AOS disabled. Refresh the page to apply changes.');
    };

    // Add smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Wire copy button on initial load as well
    try { initCopyButtons(); } catch (e) {}

    // Footer year
    try {
        const yearEls = document.querySelectorAll('.js-current-year');
        const y = new Date().getFullYear();
        yearEls.forEach(el => { el.textContent = y; });
    } catch (e) {}
});

// Service Worker for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    // Temporarily disable SW registration to eliminate stale caching while we stabilize deploy
    console.log('SW registration disabled by app config');
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to convert
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && converter) {
        e.preventDefault();
        converter.convert();
    }

    // Escape to clear
    if (e.key === 'Escape' && converter) {
        e.preventDefault();
        converter.clear();
    }
});

// Export for testing or external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SquareConverter;
}

// Copy-to-clipboard setup
function initCopyButtons() {
    // 1) Primary calculator (single result)
    document.querySelectorAll('.result-display').forEach(container => {
        let btn = container.querySelector('.copy-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.type = 'button';
            btn.innerHTML = '<i class="fa-solid fa-copy" style="margin-right:6px"></i>Copy';
            container.appendChild(btn);
        }
        const resultMain = container.querySelector('#result-main') || document.getElementById('result-main');
        const resultDetail = container.querySelector('#result-detail') || document.getElementById('result-detail');
        const copyText = () => {
            const text = resultMain && resultMain.textContent ? resultMain.textContent.trim() : '';
            if (!text) return;
            const detail = (resultDetail && resultDetail.textContent) ? resultDetail.textContent.trim() : '';
            const isPlaceholder = /enter\s+square\s+inches\s+above\s+to\s+convert/i.test(detail);
            const toCopy = isPlaceholder || !detail ? text : `${text} — ${detail}`;
            copyToClipboard(btn, toCopy);
        };
        btn.onclick = copyText;
    });

    // 2) Results grid (multiple items)
    document.querySelectorAll('.results-grid .result-item').forEach(item => {
        // Avoid duplicating button
        if (item.querySelector('.copy-btn')) return;
        const valueEl = item.querySelector('.result-value') || item.querySelector('strong, b, span');
        if (!valueEl) return;
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.type = 'button';
        btn.style.marginTop = '0.5rem';
        btn.innerHTML = '<i class="fa-solid fa-copy" style="margin-right:6px"></i>Copy';
        item.appendChild(btn);
        btn.onclick = () => {
            const label = item.querySelector('.result-label')?.textContent?.trim();
            const value = valueEl.textContent?.trim() || '';
            const text = label ? `${label}: ${value}` : value;
            if (!text) return;
            copyToClipboard(btn, text);
        };
    });

    // 3) Copy All for calculators with results-grid (exclude index page with #square-inches)
    const isIndex = !!document.getElementById('square-inches');
    const resultsGrid = document.querySelector('.results-grid');
    if (!isIndex && resultsGrid) {
        // Place Copy All under the section header if not present
        const resultSection = resultsGrid.closest('.result-section');
        if (resultSection && !resultSection.querySelector('.copy-all-btn')) {
            const copyAllBtn = document.createElement('button');
            copyAllBtn.className = 'copy-all-btn';
            copyAllBtn.type = 'button';
            copyAllBtn.style.marginTop = '0.6rem';
            copyAllBtn.innerHTML = '<i class="fa-solid fa-clipboard-list" style="margin-right:6px"></i>Copy All';
            // Insert after header if present, else at end of section before grid
            const header = resultSection.querySelector('.result-header');
            if (header && header.nextSibling) {
                header.parentNode.insertBefore(copyAllBtn, header.nextSibling);
            } else {
                resultSection.insertBefore(copyAllBtn, resultsGrid);
            }
            copyAllBtn.onclick = () => {
                const lines = [];
                resultsGrid.querySelectorAll('.result-item').forEach(item => {
                    const label = item.querySelector('.result-label')?.textContent?.trim();
                    const value = item.querySelector('.result-value, strong, b, span')?.textContent?.trim();
                    if (!value) return;
                    lines.push(label ? `${label}: ${value}` : value);
                });
                const text = lines.join('\n');
                if (!text) return;
                copyToClipboard(copyAllBtn, text);
            };
        }
    }
}

function copyToClipboard(btn, text) {
    navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('copied');
        const prev = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check" style="margin-right:6px"></i>Copied';
        setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = prev; }, 1200);
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (_) {}
        document.body.removeChild(ta);
        btn.classList.add('copied');
        const prev = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check" style="margin-right:6px"></i>Copied';
        setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = prev; }, 1200);
    });
}
