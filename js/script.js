document.addEventListener('DOMContentLoaded', () => {
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
    // Pre-order Counter Simulation
    const countElement = document.getElementById('current-preorders');
    if (countElement) {
        let currentCount = 6542;
        const targetCount = 10000;

        function updateCount() {
            // Simulate random increase
            if (Math.random() > 0.6) {
                currentCount += Math.floor(Math.random() * 3);
                if (currentCount > targetCount) currentCount = targetCount;

                countElement.innerText = currentCount.toLocaleString();

                // Update progress bar width calculation
                const progressFill = document.querySelector('.progress-fill');
                if (progressFill) {
                    const percentage = (currentCount / targetCount) * 100;
                    progressFill.style.width = percentage + '%';
                }
            }
        }

        // Update every 2 seconds
        setInterval(updateCount, 2000);
    }

    // Notification Form Handling
    // Pre-order & Notification Form Handling
    const preorderForm = document.getElementById('preorder-form');
    if (preorderForm) {
        preorderForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const preorderCheck = this.querySelector('input[name="preorder"]');
            const notificationCheck = this.querySelector('input[name="notification"]');

            if (emailInput && emailInput.value) {
                if (!preorderCheck.checked && !notificationCheck.checked) {
                    alert('최소한 하나의 옵션을 선택해주세요.');
                    return;
                }

                let message = '신청이 완료되었습니다!\n';
                message += '이메일: ' + emailInput.value + '\n';

                if (preorderCheck.checked) message += '- 사전 예약 (가격 할인) 신청됨\n';
                if (notificationCheck.checked) message += '- 앱 출시 알림 신청됨';

                alert(message);
                emailInput.value = '';
            }
        });
    }
});
