document.addEventListener('DOMContentLoaded', () => {
    // Language Support
    let currentLang = 'ko';

    function getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.toLowerCase().includes('ko')) return 'ko';
        if (browserLang.toLowerCase().includes('en')) return 'en';
        if (browserLang.toLowerCase().includes('zh')) return 'zh'; // Chinese
        if (browserLang.toLowerCase().includes('vi')) return 'vi'; // Vietnamese
        return 'ko'; // Default
    }

    function updateLanguage(lang) {
        if (!translations[lang]) return;
        currentLang = lang;
        const t = translations[lang];

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const targetAttr = element.getAttribute('data-i18n-attr');
            const isHtml = element.getAttribute('data-i18n-html') === 'true';

            if (t[key]) {
                if (targetAttr) {
                    element.setAttribute(targetAttr, t[key]);
                } else if (isHtml) {
                    element.innerHTML = t[key];
                } else {
                    element.innerText = t[key];
                }
            }
        });

        // Update html lang attribute
        document.documentElement.lang = lang;
    }

    // Initialize Language
    const detectedLang = getBrowserLanguage();
    updateLanguage(detectedLang);
    updateLanguageUI(detectedLang);

    // Language Selector UI Logic
    const langBtn = document.querySelector('.lang-toggle-btn');
    const langContainer = document.querySelector('.lang-dropdown-container');
    const langOptions = document.querySelectorAll('.lang-dropdown-menu button');

    // Toggle dropdown on click (especially for mobile)
    if (langBtn) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langContainer.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (langContainer && !langContainer.contains(e.target)) {
            langContainer.classList.remove('active');
        }
    });

    // Handle Language Selection
    langOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedLang = btn.getAttribute('data-lang');
            updateLanguage(selectedLang);
            updateLanguageUI(selectedLang);
            langContainer.classList.remove('active');
        });
    });

    function updateLanguageUI(lang) {
        // Update the displayed text on the button
        const langMap = {
            'ko': 'KR',
            'en': 'EN',
            'zh': 'CN',
            'vi': 'VN'
        };
        const currentLangText = document.querySelector('.current-lang-text');
        if (currentLangText) {
            currentLangText.innerText = langMap[lang] || 'KR';
        }
    }

    // Scroll Animation using Intersection Observer

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run animation only once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header Background on Scroll
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    // Pre-order Counter logic removed

    // Notification Form Handling
    // Pre-order & Notification Form Handling
    // Pre-order & Notification Form Handling
    const preorderForm = document.getElementById('preorder-form');
    if (preorderForm) {
        // 체크박스 상태 변경 시 hidden input 값 업데이트
        const chkPreorder = document.getElementById('chk_preorder');
        const chkAlarm = document.getElementById('chk_alarm');
        const listHiddenIds = ['hidden_is_preorder', 'hidden_is_alarm'];

        function updateHiddenValues() {
            document.getElementById('hidden_is_preorder').value = chkPreorder.checked ? "O" : "X";
            document.getElementById('hidden_is_alarm').value = chkAlarm.checked ? "O" : "X";
        }

        chkPreorder.addEventListener('change', updateHiddenValues);
        chkAlarm.addEventListener('change', updateHiddenValues);

        // 초기값 설정
        updateHiddenValues();

        preorderForm.addEventListener('submit', function (e) {
            const btn = document.getElementById('submitBtn');
            const originalBtnText = btn.innerText;

            // 로딩 표시
            btn.innerText = translations[currentLang]['js.processing'];
            // 주의: form이 submit 되는 동안 버튼을 disable 하면 submit이 안 될 수도 있으나,
            // click 이벤트가 이미 발생했으므로 괜찮습니다. 안전을 위해 짧은 timeout 후 처리하거나 그대로 둡니다.
            // 여기서는 UI 피드백만 줍니다.

            // iframe 로드 완료 시 (서버 응답 시)
            const iframe = document.getElementById('hidden_iframe');
            let isSubmitted = false;

            const onloadHandler = function () {
                if (!isSubmitted) return; // 첫 로드 시 실행 방지
                alert(translations[currentLang]['js.completed']);
                preorderForm.reset();
                // 체크박스와 hidden 값도 초기화 상태로 복구 (reset은 체크박스 초기화함)
                // 하지만 hidden값은 수동 리셋 필요할 수 있음 -> updateHiddenValues()가 change 이벤트로 처리됨
                // form.reset() 후 체크박스 상태가 돌아가면 change 이벤트를 수동으로 트리거해주는 것이 안전
                setTimeout(() => {
                    updateHiddenValues();
                    // Restore button text based on current language
                    const key = btn.getAttribute('data-i18n');
                    if (key && translations[currentLang][key]) {
                        btn.innerText = translations[currentLang][key];
                    } else {
                        btn.innerText = originalBtnText;
                    }
                }, 100);

                // 이벤트 리스너 제거 (중복 방지)
                iframe.removeEventListener('load', onloadHandler);
            };

            iframe.addEventListener('load', onloadHandler);
            isSubmitted = true;

            // 기본 제출 동작(action으로 이동)을 허용합니다! e.preventDefault() 하지 않음!
        });
    }
});
