// ==========================================
// WhatsApp Consultants Popup
// Smart & Professional Implementation
// ==========================================

'use strict';

/**
 * WhatsApp Consultants Configuration
 * يمكن تعديل هذه البيانات بسهولة
 */
const CONSULTANTS_DATA = [
    {
        id: 1,
        name: 'سيف محمد',
        role: 'مستشار أكاديمي',
        phone: '+60182221141',
        // avatar: 'assets/img/consultants/saif.jpg', // اختياري
        initials: 'س',
        color: '#667eea'
    },
    {
        id: 2,
        name: 'أسيل',
        role: 'مستشارة أكاديمية',
        phone: '+60182221151',
        // avatar: 'assets/img/consultants/aseel.jpg', // اختياري
        initials: 'أ',
        color: '#f093fb'
    },
    {
        id: 3,
        name: 'محمد سعيد',
        role: 'مستشار أكاديمي',
        phone: '+60182221411',
        // avatar: 'assets/img/consultants/mohamed.jpg', // اختياري
        initials: 'م',
        color: '#4facfe'
    }
];

/**
 * Default WhatsApp Message
 * الرسالة الافتراضية التي تُرسل عند فتح WhatsApp
 */
const DEFAULT_MESSAGE = 'مرحبًا، أود الاستفسار عن الدراسة في ماليزيا.';

/**
 * WhatsApp Popup Manager
 */
const WhatsAppPopup = {
    overlay: null,
    popup: null,
    isOpen: false,

    /**
     * Initialize the popup
     */
    init() {
        this.createPopup();
        this.setupEventListeners();
        console.log('✅ WhatsApp Popup initialized');
    },

    /**
     * Create popup HTML structure
     */
    createPopup() {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'whatsapp-popup-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'whatsapp-popup-title');

        // Create popup
        const popup = document.createElement('div');
        popup.className = 'whatsapp-popup';

        // Build popup content
        popup.innerHTML = `
            <button class="whatsapp-popup-close" aria-label="إغلاق" type="button">
                ×
            </button>
            
            <div class="whatsapp-popup-header">
                <h2 class="whatsapp-popup-title" id="whatsapp-popup-title">
                    استشارة مجانية!
                </h2>
                <p class="whatsapp-popup-subtitle">
                    انقر على أحد المستشارين أدناه للاستفسار عن الدراسة في ماليزيا
                </p>
            </div>
            
            <div class="whatsapp-consultants-list">
                ${this.generateConsultantCards()}
            </div>
            
            <div class="whatsapp-popup-footer">
                <p class="whatsapp-popup-footer-text">
                    نحن متاحون للمساعدة <a href="contact.html" class="whatsapp-popup-footer-link">تواصل معنا</a>
                </p>
            </div>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        this.overlay = overlay;
        this.popup = popup;
    },

    /**
     * Generate consultant cards HTML
     */
    generateConsultantCards() {
        return CONSULTANTS_DATA.map(consultant => `
            <div class="whatsapp-consultant-card" 
                 data-phone="${consultant.phone}" 
                 data-name="${consultant.name}"
                 role="button"
                 tabindex="0"
                 aria-label="اتصل بـ ${consultant.name} عبر WhatsApp">
                
                <div class="whatsapp-consultant-avatar">
                    ${this.generateAvatar(consultant)}
                    <span class="whatsapp-status-indicator" aria-label="متصل"></span>
                </div>
                
                <div class="whatsapp-consultant-info">
                    <h3 class="whatsapp-consultant-name">${consultant.name}</h3>
                    <p class="whatsapp-consultant-role">${consultant.role}</p>
                    <p class="whatsapp-consultant-phone" dir="ltr">${consultant.phone}</p>
                </div>
                
                <div class="whatsapp-consultant-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                </div>
            </div>
        `).join('');
    },

    /**
     * Generate avatar (image or placeholder)
     */
    generateAvatar(consultant) {
        if (consultant.avatar) {
            return `<img src="${consultant.avatar}" alt="${consultant.name}" loading="lazy">`;
        } else {
            return `<div class="avatar-placeholder" style="background: ${consultant.color || '#667eea'}">${consultant.initials}</div>`;
        }
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Close button
        const closeBtn = this.popup.querySelector('.whatsapp-popup-close');
        closeBtn.addEventListener('click', () => this.close());

        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Consultant cards click
        const cards = this.popup.querySelectorAll('.whatsapp-consultant-card');
        cards.forEach(card => {
            card.addEventListener('click', () => this.handleConsultantClick(card));
            
            // Keyboard support
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleConsultantClick(card);
                }
            });
        });

        // Update all WhatsApp buttons to open popup
        this.updateWhatsAppButtons();
    },

    /**
     * Update existing WhatsApp buttons to open popup
     */
    updateWhatsAppButtons() {
        // Find all WhatsApp buttons/links
        const whatsappButtons = document.querySelectorAll('a[href*="wa.me"], .btn-whatsapp, .whatsapp-float');
        
        whatsappButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });
    },

    /**
     * Handle consultant card click
     */
    handleConsultantClick(card) {
        const phone = card.dataset.phone;
        const name = card.dataset.name;
        
        // Generate WhatsApp URL
        const message = encodeURIComponent(DEFAULT_MESSAGE);
        const whatsappUrl = `https://wa.me/${phone.replace(/\+/g, '')}?text=${message}`;
        
        // Track event (optional - for analytics)
        this.trackConsultantClick(name, phone);
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        // Close popup after short delay
        setTimeout(() => this.close(), 500);
    },

    /**
     * Open popup
     */
    open() {
        this.overlay.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Focus on first card
        setTimeout(() => {
            const firstCard = this.popup.querySelector('.whatsapp-consultant-card');
            if (firstCard) firstCard.focus();
        }, 400);
        
        console.log('📱 WhatsApp Popup opened');
    },

    /**
     * Close popup
     */
    close() {
        this.overlay.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = '';
        
        console.log('📱 WhatsApp Popup closed');
    },

    /**
     * Track consultant click (for analytics)
     */
    trackConsultantClick(name, phone) {
        // يمكن إضافة Google Analytics أو أي نظام تتبع آخر هنا
        console.log(`📊 Consultant clicked: ${name} (${phone})`);
        
        // Example: Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'consultant_click', {
                'consultant_name': name,
                'consultant_phone': phone
            });
        }
    }
};

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        WhatsAppPopup.init();
    });
} else {
    WhatsAppPopup.init();
}

// Export for external use (optional)
if (typeof window !== 'undefined') {
    window.WhatsAppPopup = WhatsAppPopup;
}
