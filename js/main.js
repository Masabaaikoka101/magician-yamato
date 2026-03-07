/**
 * main.js — アニメーション・スクロール処理
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- ヘッダーのスクロール状態管理 ---
    const header = document.getElementById('site-header');
    const stickyCta = document.getElementById('sticky-cta');
    let lastScroll = 0;

    function onScroll() {
        const scrollY = window.scrollY;

        // ヘッダーの背景切り替え
        if (header) {
            if (scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // スティッキーCTAの表示
        if (stickyCta) {
            if (scrollY > 400) {
                stickyCta.classList.add('visible');
            } else {
                stickyCta.classList.remove('visible');
            }
        }

        lastScroll = scrollY;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // 初期状態

    // --- Intersection Observer: fade-in アニメーション ---
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    }

    // --- no-hero ページの body class ---
    const hasHero = document.querySelector('.hero, .page-hero, .page-header');
    if (!hasHero) {
        document.body.classList.add('no-hero');
    }

});
