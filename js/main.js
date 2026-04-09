// File: js/main.js
// JavaScript untuk Website E-commerce

// ========================================
// 1. DARK MODE TOGGLE
// ========================================
class DarkModeManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Cek preferensi yang tersimpan
        const savedMode = localStorage.getItem('darkMode');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedMode === 'aktif' || (!savedMode && prefersDark)) {
            this.enableDarkMode();
        }
        
        this.createToggleButton();
    }
    
    enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'aktif');
        this.updateButtonText(true);
    }
    
    disableDarkMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'nonaktif');
        this.updateButtonText(false);
    }
    
    toggle() {
        if (document.body.classList.contains('dark-mode')) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }
    
    updateButtonText(isDark) {
        const btn = document.getElementById('darkModeBtn');
        if (btn) {
            btn.textContent = isDark ? '☀️ Mode Terang' : '🌙 Mode Gelap';
        }
    }
    
    createToggleButton() {
        // Cari navbar menu
        const navMenu = document.getElementById('navMenu');
        if (navMenu && !document.getElementById('darkModeBtn')) {
            const li = document.createElement('li');
            li.innerHTML = `<button id="darkModeBtn" class="dark-mode-toggle">🌙 Mode Gelap</button>`;
            navMenu.appendChild(li);
            
            const btn = document.getElementById('darkModeBtn');
            btn.addEventListener('click', () => this.toggle());
        }
    }
}

// ========================================
// 2. SMOOTH SCROLL UNTUK SEMUA LINK
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        // Untuk semua link internal (#)
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Tombol kembali ke atas yang lebih baik
        this.createScrollTopButton();
    }
    
    createScrollTopButton() {
        // Hapus jika sudah ada
        const existingBtn = document.querySelector('.scroll-top-btn');
        if (existingBtn) existingBtn.remove();
        
        const btn = document.createElement('a');
        btn.href = '#';
        btn.className = 'scroll-top-btn';
        btn.innerHTML = '⬆';
        btn.setAttribute('aria-label', 'Kembali ke atas');
        document.body.appendChild(btn);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        });
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ========================================
// 3. TYPING EFFECT UNTUK HERO
// ========================================
class TypingEffect {
    constructor(elementId, texts, delay = 2000) {
        this.element = document.getElementById(elementId);
        this.texts = texts;
        this.currentIndex = 0;
        this.delay = delay;
        this.isDeleting = false;
        
        if (this.element) {
            this.type();
        }
    }
    
    type() {
        const currentText = this.texts[this.currentIndex];
        const currentLength = this.element.textContent.length;
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, currentLength - 1);
        } else {
            this.element.textContent = currentText.substring(0, currentLength + 1);
        }
        
        let speed = 100;
        
        if (this.isDeleting) {
            speed = 50;
        }
        
        if (!this.isDeleting && this.element.textContent === currentText) {
            speed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.element.textContent === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            speed = 500;
        }
        
        setTimeout(() => this.type(), speed);
    }
}

// ========================================
// 4. PAGE LOADER
// ========================================
class PageLoader {
    constructor() {
        this.createLoader();
        this.hideLoader();
    }
    
    createLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.id = 'pageLoader';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.insertBefore(loader, document.body.firstChild);
    }
    
    hideLoader() {
        window.addEventListener('load', () => {
            const loader = document.getElementById('pageLoader');
            if (loader) {
                loader.classList.add('hide');
                setTimeout(() => loader.remove(), 500);
            }
        });
    }
}

// ========================================
// 5. TOAST NOTIFICATION SYSTEM
// ========================================
class ToastNotification {
    static show(message, duration = 3000) {
        // Hapus toast yang sudah ada
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
}

// ========================================
// 6. FORM VALIDATION ENHANCEMENT
// ========================================
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', (e) => {
            if (!this.validate()) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        this.form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
        });
    }
    
    validate() {
        let isValid = true;
        this.form.querySelectorAll('[required]').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        if (field.hasAttribute('required') && value === '') {
            isValid = false;
            errorMessage = 'Field ini wajib diisi';
        } else if (field.type === 'email' && value !== '' && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Email tidak valid';
        } else if (field.id === 'telepon' && value !== '' && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Nomor telepon tidak valid';
        } else if (field.id === 'pesan' && value.length < 10 && value !== '') {
            isValid = false;
            errorMessage = 'Pesan minimal 10 karakter';
        }
        
        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    isValidPhone(phone) {
        return /^[0-9+\-\s()]+$/.test(phone);
    }
    
    showFieldError(field, isValid, message) {
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        if (!isValid && message) {
            const error = document.createElement('small');
            error.className = 'field-error';
            error.style.cssText = 'color: #dc3545; display: block; margin-top: 5px;';
            error.textContent = message;
            field.parentElement.appendChild(error);
            field.style.borderColor = '#dc3545';
        } else {
            field.style.borderColor = '';
        }
    }
    
    clearFieldError(field) {
        const error = field.parentElement.querySelector('.field-error');
        if (error) error.remove();
        field.style.borderColor = '';
    }
}

// ========================================
// 7. PRODUCT SEARCH & FILTER ENHANCEMENT
// ========================================
class ProductFilter {
    constructor() {
        this.initSearch();
    }
    
    initSearch() {
        // Tambahkan search box jika di halaman produk
        const container = document.querySelector('.filter-container');
        if (container && !document.getElementById('searchProduk')) {
            const searchDiv = document.createElement('div');
            searchDiv.style.marginLeft = 'auto';
            searchDiv.innerHTML = `
                <input type="text" id="searchProduk" placeholder="🔍 Cari produk..." 
                       style="padding: 8px 16px; border-radius: 30px; border: 1px solid #ddd;">
            `;
            container.appendChild(searchDiv);
            
            const searchInput = document.getElementById('searchProduk');
            searchInput.addEventListener('input', (e) => this.search(e.target.value));
        }
    }
    
    search(keyword) {
        const produkCards = document.querySelectorAll('.kartu-produk');
        const searchTerm = keyword.toLowerCase();
        
        produkCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('.deskripsi-singkat')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || desc.includes(searchTerm) || searchTerm === '') {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ========================================
// 8. VISITOR COUNTER (localStorage)
// ========================================
class VisitorCounter {
    constructor() {
        this.init();
    }
    
    init() {
        let count = localStorage.getItem('visitorCount');
        if (count === null) {
            count = 1;
        } else {
            count = parseInt(count) + 1;
        }
        localStorage.setItem('visitorCount', count);
        
        // Tampilkan jika ada elemen
        const counterElement = document.getElementById('visitorCount');
        if (counterElement) {
            counterElement.textContent = count;
        }
        
        // Optional: show welcome back message for returning visitors
        if (count > 1) {
            setTimeout(() => {
                ToastNotification.show(`Selamat datang kembali! Anda pengunjung ke-${count}`, 3000);
            }, 1000);
        }
    }
}

// ========================================
// 9. BACK TO TOP WITH PROGRESS
// ========================================
class ScrollProgress {
    constructor() {
        this.createProgressBar();
    }
    
    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background-color: var(--warna-primer, #1D9E75);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        progressBar.id = 'scrollProgress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
}

// ========================================
// 10. INITIALIZE EVERYTHING
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize semua komponen
    new PageLoader();
    new SmoothScroll();
    new DarkModeManager();
    new VisitorCounter();
    new ScrollProgress();
    new ProductFilter();
    
    // Form validator untuk halaman kontak
    if (document.getElementById('contactForm')) {
        new FormValidator('contactForm');
    }
    
    // Typing effect untuk hero section
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && window.innerWidth > 768) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.classList.add('typing-text');
        new TypingEffect('typing-text', [originalText], 3000);
    }
    
    // Tambahkan visitor counter display di footer
    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom && !document.getElementById('visitorCount')) {
        const visitorDiv = document.createElement('div');
        visitorDiv.style.marginTop = '10px';
        visitorDiv.style.fontSize = '12px';
        visitorDiv.innerHTML = `👥 Pengunjung: <span id="visitorCount">0</span> kali`;
        footerBottom.appendChild(visitorDiv);
    }
    
    console.log('%c🚀 Website E-commerce siap!', 'color: #1D9E75; font-size: 16px; font-weight: bold;');
    console.log('%cHari 7 & 8: Project Final + JavaScript ✅', 'color: #0E6B4F; font-size: 14px;');
});