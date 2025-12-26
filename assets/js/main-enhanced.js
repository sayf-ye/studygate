// ==========================================
// STUDYGATE - Main JavaScript File
// Enhanced & Optimized for Django Integration
// ==========================================

'use strict';

/**
 * App Configuration
 * مركزية الإعدادات للسهولة في الصيانة
 */
const APP_CONFIG = {
    scrollOffset: 80,
    animationThreshold: 0.1,
    counterDuration: 2500,
    sliderScrollAmount: 284,
    autoScrollInterval: 3000,
    debounceDelay: 300
};

/**
 * Utility Functions
 * وظائف مساعدة يمكن استخدامها في أي مكان
 */
const Utils = {
    /**
     * Get CSRF Token from Cookie (for Django)
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value
     */
    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                cookie = cookie.trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },

    /**
     * Debounce Function
     * تأخير تنفيذ الوظيفة حتى التوقف عن الاستدعاء
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Throttle Function
     * تحديد عدد مرات تنفيذ الوظيفة خلال فترة زمنية
     */
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Easing Function for Smooth Animations
     */
    easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }
};

/**
 * Counter Animation Module
 * تحريك الأرقام في قسم الإحصائيات
 */
const CounterAnimation = {
    /**
     * Animate a single counter
     * @param {HTMLElement} element - Counter element
     * @param {number} target - Target number
     * @param {number} duration - Animation duration
     */
    animate(element, target, duration = APP_CONFIG.counterDuration) {
        const startTime = performance.now();
        const suffix = element.dataset.suffix || '';
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = Utils.easeOutQuart(progress);
            const current = Math.floor(easedProgress * target);
            
            element.textContent = `${current}${suffix}`;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = `${target}${suffix}`;
            }
        };
        
        requestAnimationFrame(update);
    },

    /**
     * Initialize counters with Intersection Observer
     */
    init() {
        const statCards = document.querySelectorAll('.stat-card');
        if (!statCards.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber && statNumber.textContent === '0') {
                        const target = parseInt(statNumber.dataset.target);
                        const delay = parseInt(entry.target.dataset.delay) || 0;
                        
                        setTimeout(() => {
                            this.animate(statNumber, target);
                        }, delay);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px'
        });

        statCards.forEach(card => observer.observe(card));
    }
};

/**
 * Navigation Module
 * إدارة شريط التنقل والقائمة المحمولة
 */
const Navigation = {
    navbar: null,
    menuToggle: null,
    navMenu: null,
    lastScroll: 0,

    /**
     * Initialize navigation
     */
    init() {
        this.navbar = document.getElementById('navbar');
        this.menuToggle = document.getElementById('menuToggle');
        this.navMenu = document.getElementById('navMenu');

        if (!this.navbar) return;

        this.setupScrollEffect();
        this.setupMobileMenu();
        this.highlightActiveLink();
    },

    /**
     * Navbar scroll effect
     */
    setupScrollEffect() {
        const handleScroll = Utils.throttle(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            this.lastScroll = currentScroll;
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
    },

    /**
     * Mobile menu functionality
     */
    setupMobileMenu() {
        if (!this.menuToggle || !this.navMenu) return;

        // Toggle menu
        this.menuToggle.addEventListener('click', () => {
            this.menuToggle.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        const navLinks = this.navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.menuToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    },

    /**
     * Close mobile menu
     */
    closeMenu() {
        this.menuToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    },

    /**
     * Highlight active navigation link
     */
    highlightActiveLink() {
        const currentPath = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
};

/**
 * Animation Module
 * إدارة تأثيرات الظهور عند التمرير
 */
const AnimationObserver = {
    /**
     * Initialize Intersection Observer for animations
     */
    init() {
        const animatedElements = document.querySelectorAll('.animate-fade-up, .animate-slide-up, .animate-image-appear');
        if (!animatedElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: APP_CONFIG.animationThreshold
        });

        animatedElements.forEach(el => observer.observe(el));
    }
};

/**
 * Form Handling Module
 * إدارة النماذج مع Django Integration
 */
const FormHandler = {
    /**
     * Initialize contact form
     */
    initContactForm() {
        const contactForm = document.getElementById('contactForm');
        const formMessage = document.getElementById('formMessage');
        
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!this.validateContactForm(data)) {
                return;
            }
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'جاري الإرسال...';
            submitBtn.disabled = true;

            try {
                // Django Integration Point
                const csrftoken = Utils.getCookie('csrftoken');
                
                const response = await fetch(contactForm.action || '/contact/', {
                    method: 'POST',
                    headers: {
                        'X-CSRFToken': csrftoken
                    },
                    body: formData
                });

                if (response.ok) {
                    this.showMessage(formMessage, 'تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا', 'success');
                    contactForm.reset();
                } else {
                    this.showMessage(formMessage, 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى', 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                this.showMessage(formMessage, 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى', 'error');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    },

    /**
     * Validate contact form
     */
    validateContactForm(data) {
        const formMessage = document.getElementById('formMessage');

        // Check required fields
        if (!data.name || !data.email || !data.phone || !data.message) {
            this.showMessage(formMessage, 'يرجى ملء جميع الحقول المطلوبة', 'error');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showMessage(formMessage, 'يرجى إدخال بريد إلكتروني صحيح', 'error');
            return false;
        }

        // Phone validation
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(data.phone)) {
            this.showMessage(formMessage, 'يرجى إدخال رقم هاتف صحيح', 'error');
            return false;
        }

        return true;
    },

    /**
     * Initialize newsletter form
     */
    initNewsletterForm() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('يرجى إدخال بريد إلكتروني صحيح');
                return;
            }
            
            const submitBtn = newsletterForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'جاري الاشتراك...';
            submitBtn.disabled = true;

            try {
                // Django Integration Point
                const csrftoken = Utils.getCookie('csrftoken');
                
                const response = await fetch('/newsletter/subscribe/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({ email })
                });

                if (response.ok) {
                    alert('شكرًا لاشتراكك في نشرتنا البريدية!');
                    emailInput.value = '';
                } else {
                    alert('حدث خطأ. يرجى المحاولة مرة أخرى');
                }
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                alert('حدث خطأ. يرجى المحاولة مرة أخرى');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    },

    /**
     * Show form message
     */
    showMessage(messageElement, message, type) {
        if (!messageElement) return;
        
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        
        setTimeout(() => {
            messageElement.className = 'form-message';
        }, 5000);
    }
};

/**
 * Partners Slider Module
 * سلايدر الشركاء مع دعم اللمس والتمرير التلقائي
 */
const PartnersSlider = {
    container: null,
    prevBtn: null,
    nextBtn: null,
    autoScrollInterval: null,
    userPaused: false,
    scrollTimeout: null,

    /**
     * Initialize slider
     */
    init() {
        this.container = document.querySelector('.partners-slider') || document.querySelector('.partners-logos');
        this.prevBtn = document.querySelector('.partner-arrow-prev');
        this.nextBtn = document.querySelector('.partner-arrow-next');

        if (!this.container || !this.prevBtn || !this.nextBtn) return;

        this.setupControls();
        this.setupKeyboardNav();
        this.setupTouchSupport();
        this.startAutoScroll();
        this.setupVisibilityChange();
    },

    /**
     * Setup manual controls
     */
    setupControls() {
        this.prevBtn.addEventListener('click', () => {
            this.pauseAndResume();
            this.scroll('prev');
        });

        this.nextBtn.addEventListener('click', () => {
            this.pauseAndResume();
            this.scroll('next');
        });
    },

    /**
     * Scroll slider
     */
    scroll(direction) {
        if (this.scrollTimeout) return;
        
        this.container.scrollBy({
            left: direction === 'prev' ? -APP_CONFIG.sliderScrollAmount : APP_CONFIG.sliderScrollAmount,
            behavior: 'smooth'
        });
        
        this.scrollTimeout = setTimeout(() => {
            this.scrollTimeout = null;
        }, APP_CONFIG.debounceDelay);
    },

    /**
     * Start auto scroll
     */
    startAutoScroll() {
        if (this.autoScrollInterval) return;
        
        this.autoScrollInterval = setInterval(() => {
            if (!this.userPaused) {
                const maxScroll = this.container.scrollWidth - this.container.clientWidth;
                
                if (this.container.scrollLeft >= maxScroll - 10) {
                    this.container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    this.scroll('next');
                }
            }
        }, APP_CONFIG.autoScrollInterval);
    },

    /**
     * Stop auto scroll
     */
    stopAutoScroll() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
            this.autoScrollInterval = null;
        }
    },

    /**
     * Pause and resume after delay
     */
    pauseAndResume() {
        this.userPaused = true;
        setTimeout(() => {
            this.userPaused = false;
        }, APP_CONFIG.autoScrollInterval);
    },

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.pauseAndResume();
                this.scroll('next');
            } else if (e.key === 'ArrowRight') {
                this.pauseAndResume();
                this.scroll('prev');
            }
        });
    },

    /**
     * Setup touch support
     */
    setupTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            this.pauseAndResume();
        }, { passive: true });
        
        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            const swipeThreshold = 50;
            
            if (Math.abs(diff) > swipeThreshold) {
                this.scroll(diff > 0 ? 'next' : 'prev');
            }
        }, { passive: true });
    },

    /**
     * Setup visibility change handler
     */
    setupVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoScroll();
            } else {
                this.startAutoScroll();
            }
        });
    }
};

/**
 * Smooth Scroll Module
 * التمرير السلس للروابط الداخلية
 */
const SmoothScroll = {
    /**
     * Initialize smooth scroll for anchor links
     */
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - APP_CONFIG.scrollOffset;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
};

/**
 * Lazy Loading Module
 * تحميل الصور الكسول
 */
const LazyLoading = {
    /**
     * Initialize lazy loading
     */
    init() {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Fallback: Use Intersection Observer
            this.observeImages();
        }
    },

    /**
     * Observe images for lazy loading
     */
    observeImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
};

/**
 * Performance Monitor
 * مراقبة أداء الصفحة
 */
const PerformanceMonitor = {
    /**
     * Log page load time
     */
    init() {
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`📊 Page loaded in ${pageLoadTime}ms`);
                
                // Django Integration Point: Send to analytics
                // this.sendToAnalytics('pageLoadTime', pageLoadTime);
            }
        });
    },

    /**
     * Send metrics to analytics (placeholder)
     */
    sendToAnalytics(metric, value) {
        // Implement analytics sending logic here
        // Example: Google Analytics, custom Django endpoint, etc.
    }
};

/**
 * App Initialization
 * تهيئة التطبيق بالكامل
 */
const App = {
    /**
     * Initialize all modules
     */
    init() {
        console.log('%c🎓 STUDYGATE', 'color: #112d53; font-size: 24px; font-weight: bold;');
        console.log('%cنجاحك هو هدفنا', 'color: #da7900; font-size: 16px;');
        
        // Initialize modules
        Navigation.init();
        AnimationObserver.init();
        CounterAnimation.init();
        FormHandler.initContactForm();
        FormHandler.initNewsletterForm();
        SmoothScroll.init();
        LazyLoading.init();
        PerformanceMonitor.init();
        
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                PartnersSlider.init();
            });
        } else {
            PartnersSlider.init();
        }
        
        console.log('✅ All features initialized');
    }
};

// Start the application
App.init();

// Export for Django templates (if needed)
if (typeof window !== 'undefined') {
    window.STUDYGATE = {
        Utils,
        FormHandler,
        Navigation,
        PartnersSlider
    };
}
