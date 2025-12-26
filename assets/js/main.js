// ==========================================
// STUDYGATE - Main JavaScript File
// ==========================================

'use strict';

// === COUNTER ANIMATION FOR STATS ===
function animateCounter(element, target, duration = 2500) {
    let start = 0;
    const startTime = performance.now();
    const suffix = element.dataset.suffix || '';
    
    // Easing function for smooth animation
    const easeOutQuart = (x) => 1 - Math.pow(1 - x, 4);
    
    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing
        const easedProgress = easeOutQuart(progress);
        const current = Math.floor(easedProgress * target);
        
        element.textContent = `${current}${suffix}`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = `${target}${suffix}`;
        }
    };
    
    requestAnimationFrame(animate);
}

// Observer for Stats Counter
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && statNumber.textContent === '0') {
                const target = parseInt(statNumber.dataset.target);
                const delay = parseInt(entry.target.dataset.delay) || 0;
                
                setTimeout(() => {
                    animateCounter(statNumber, target);
                }, delay);
            }
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

// Observe all stat cards
document.addEventListener('DOMContentLoaded', () => {
    const statCards = document.querySelectorAll('.stat-card');
    
    // Start counter animation immediately if cards are visible
    statCards.forEach((card, index) => {
        const statNumber = card.querySelector('.stat-number');
        if (statNumber && statNumber.textContent === '0') {
            const target = parseInt(statNumber.dataset.target);
            const delay = index * 150; // Staggered animation
            
            setTimeout(() => {
                animateCounter(statNumber, target);
            }, delay);
        }
    });
    
    // Also observe for lazy loading if user scrolls
    statCards.forEach(card => statsObserver.observe(card));
});

// === NAVBAR SCROLL EFFECT ===
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// === MOBILE MENU TOGGLE ===
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// === INTERSECTION OBSERVER FOR ANIMATIONS ===
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe all elements with animation classes
const animatedElements = document.querySelectorAll('.animate-fade-up');
animatedElements.forEach(el => observer.observe(el));

// === FORM VALIDATION & SUBMISSION ===
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Skip JS handling when the form is handled by Django on the server (data-server="true").
if (contactForm && !contactForm.dataset.server) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.name || !data.email || !data.phone || !data.message) {
            showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showMessage('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }
        
        // Phone validation
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(data.phone)) {
            showMessage('يرجى إدخال رقم هاتف صحيح', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'جاري الإرسال...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            showMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
        
        // For actual implementation, use:
        /*
        try {
            const response = await fetch('YOUR_API_ENDPOINT', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (response.ok) {
                showMessage('تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا', 'success');
                contactForm.reset();
            } else {
                showMessage('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى', 'error');
            }
        } catch (error) {
            showMessage('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
        */
    });
}

function showMessage(message, type) {
    if (formMessage) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }
}

// === NEWSLETTER FORM ===
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('يرجى إدخال بريد إلكتروني صحيح');
            return;
        }
        
        // Show loading state
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'جاري الاشتراك...';
        submitBtn.disabled = true;
        
        // Simulate submission
        setTimeout(() => {
            alert('شكرًا لاشتراكك في نشرتنا البريدية!');
            emailInput.value = '';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
        
        // For actual implementation, use API call similar to contact form
    });
}

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// === LAZY LOADING IMAGES ===
if ('loading' in HTMLImageElement.prototype) {
    // Browser supports lazy loading
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// === ACTIVE NAV LINK HIGHLIGHT ===
const currentLocation = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentLocation || (currentLocation === '' && linkPath === 'index.html')) {
        link.classList.add('active');
    }
});

// === BACK TO TOP BUTTON (Optional Enhancement) ===
const createBackToTop = () => {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 30px;
        width: 50px;
        height: 50px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        font-size: 1.5rem;
        z-index: 998;
    `;
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// Uncomment to enable back to top button
// createBackToTop();

// === CONSOLE LOG (Remove in production) ===
console.log('%c🎓 STUDYGATE', 'color: #112d53; font-size: 24px; font-weight: bold;');
console.log('%cنجاحك هو هدفنا', 'color: #da7900; font-size: 16px;');
console.log('Website developed with ❤️ for STUDYGATE');

// === PREVENT RIGHT-CLICK (Optional - Remove if not needed) ===
// Uncomment to prevent right-click on images
/*
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});
*/

// === PERFORMANCE MONITORING ===
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
        
        // Send to analytics if needed
        // analytics.send('pageLoadTime', pageLoadTime);
    }
});

// === SERVICE WORKER REGISTRATION (For PWA - Optional) ===
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    });
}
*/

// === INITIALIZE ALL FEATURES ON DOM READY ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ All features initialized');
    
    // === PARTNERS SLIDER ===
    const partnersContainer = document.querySelector('.partners-slider') || document.querySelector('.partners-logos');
    const prevBtn = document.querySelector('.partner-arrow-prev');
    const nextBtn = document.querySelector('.partner-arrow-next');
    
    if (partnersContainer && prevBtn && nextBtn) {
        console.log('✅ Partners slider initialized');
        
        const scrollAmount = 284; // 260px card width + 24px gap
        let autoScrollInterval;
        let userPaused = false;
        
        // Debounce function for better performance
        let scrollTimeout;
        const handleScroll = (direction) => {
            if (scrollTimeout) return;
            
            partnersContainer.scrollBy({
                left: direction === 'prev' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
            
            scrollTimeout = setTimeout(() => {
                scrollTimeout = null;
            }, 300);
        };
        
        // Auto scroll function - continuous
        const startAutoScroll = () => {
            if (autoScrollInterval) return;
            
            console.log('▶️ Auto scroll started - continuous mode');
            
            autoScrollInterval = setInterval(() => {
                if (!userPaused) {
                    // Check if reached end, then scroll back to start
                    const maxScroll = partnersContainer.scrollWidth - partnersContainer.clientWidth;
                    
                    if (partnersContainer.scrollLeft >= maxScroll - 10) {
                        partnersContainer.scrollTo({
                            left: 0,
                            behavior: 'smooth'
                        });
                    } else {
                        handleScroll('next');
                    }
                }
            }, 3000); // Auto scroll every 3 seconds
        };
        
        const stopAutoScroll = () => {
            if (autoScrollInterval) {
                console.log('⏸️ Auto scroll paused temporarily');
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        };
        
        const resumeAutoScroll = () => {
            userPaused = false;
            if (!autoScrollInterval) {
                startAutoScroll();
            }
        };
        
        // Manual controls - pause temporarily then resume
        prevBtn.addEventListener('click', () => {
            console.log('⬅️ Previous button clicked');
            userPaused = true;
            handleScroll('prev');
            setTimeout(() => {
                resumeAutoScroll();
            }, 3000); // Resume after 3 seconds
        });
        
        nextBtn.addEventListener('click', () => {
            console.log('➡️ Next button clicked');
            userPaused = true;
            handleScroll('next');
            setTimeout(() => {
                resumeAutoScroll();
            }, 3000); // Resume after 3 seconds
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                userPaused = true;
                handleScroll('next');
                setTimeout(resumeAutoScroll, 3000);
            }
            if (e.key === 'ArrowRight') {
                userPaused = true;
                handleScroll('prev');
                setTimeout(resumeAutoScroll, 3000);
            }
        });
        
        // Touch swipe support - brief pause then continue
        let touchStartX = 0;
        let touchEndX = 0;
        
        partnersContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            userPaused = true;
        }, { passive: true });
        
        partnersContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            setTimeout(resumeAutoScroll, 3000);
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    handleScroll('next');
                } else {
                    handleScroll('prev');
                }
            }
        };
        
        // Start auto scroll immediately - no pause on hover
        startAutoScroll();
        
        // Keep running even when page is not visible (optional - remove if you want to save resources)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Optional: stop when tab is hidden to save resources
                stopAutoScroll();
            } else {
                startAutoScroll();
            }
        });
    } else {
        console.error('❌ Partners slider elements not found!');
    }
});

// === SMOOTH SCROLL FOR TABLE OF CONTENTS ===
document.addEventListener('DOMContentLoaded', () => {
    const tocLinks = document.querySelectorAll('.toc-link');
    
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offset = 100; // Offset for fixed navbar
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Highlight active link
                tocLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Highlight TOC link on scroll
    const sections = document.querySelectorAll('.post-body h2[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
