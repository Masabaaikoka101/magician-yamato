/**
 * contact-form.js — ステップ型フォーム制御 + GAS連携
 */

function initContactForm() {
    // すでに初期化済みのフラグがあればスキップ
    if (document.body.dataset.contactFormInit === 'true') return;
    document.body.dataset.contactFormInit = 'true';

    /**
     * Google Apps Script のWebアプリURL
     */
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbwMMUq8dG5fpKAtAjxiFVyq1oLmEtauyniWgKkBjCFG3g5oVGzMHZsL99grYULWgq39TQ/exec';

    let selectedService = '';

    // --- ステップ切り替え ---
    function goToStep(stepIdStr) {
        // 全ステップを一旦非表示に
        const stepIds = ['step-1', 'step-2', 'step-3', 'step-success'];
        stepIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('active');
        });

        // 対象ステップを表示
        let matchStep = stepIdStr;
        if (typeof stepIdStr === 'number') {
            matchStep = 'step-' + stepIdStr;
        } else if (stepIdStr === 'success') {
            matchStep = 'step-success';
        }

        const target = document.getElementById(matchStep);
        if (target) target.classList.add('active');

        // ドットインジケーター更新
        const dots = document.querySelectorAll('#steps-indicator .step-dot');
        dots.forEach((dot, i) => {
            let activeIndex = 2; // default to step 3 or success
            if (matchStep === 'step-1') activeIndex = 0;
            if (matchStep === 'step-2') activeIndex = 1;
            dot.classList.toggle('active', i === activeIndex);
        });
    }

    // --- Step 1: サービス選択（イベント委譲） ---
    document.addEventListener('change', (e) => {
        if (e.target.matches('input[name="service"]')) {
            selectedService = e.target.value;
            const btnNext1Local = document.getElementById('btn-next-1');
            if (btnNext1Local) btnNext1Local.disabled = false;
        }
    });

    // --- ボタンのクリック処理（イベント委譲） ---
    document.addEventListener('click', async (e) => {
        const targetId = e.target.id;

        // Step 1 -> 2
        if (targetId === 'btn-next-1') {
            const fieldsEvent = document.getElementById('fields-event');
            const fieldsBar = document.getElementById('fields-bar');
            const fieldsRestaurant = document.getElementById('fields-restaurant');

            if (fieldsEvent) fieldsEvent.style.display = selectedService === '余興・イベント' ? 'block' : 'none';
            if (fieldsBar) fieldsBar.style.display = selectedService === 'マジックBAR' ? 'block' : 'none';
            if (fieldsRestaurant) fieldsRestaurant.style.display = selectedService === '飲食店' ? 'block' : 'none';

            // 共通の日時・人数フィールド表示切替
            const dateFieldGroup = document.getElementById('date')?.closest('.form-group');
            const guestsFieldGroup = document.getElementById('guests')?.closest('.form-group');

            if (dateFieldGroup && guestsFieldGroup) {
                if (selectedService === 'マジックBAR' || selectedService === '飲食店') {
                    dateFieldGroup.style.display = 'none';
                    guestsFieldGroup.style.display = 'none';
                } else {
                    dateFieldGroup.style.display = 'block';
                    guestsFieldGroup.style.display = 'block';
                }
            }
            goToStep(2);
        }

        // Step 2 -> 1, Step 2 -> 3
        if (targetId === 'btn-back-2') goToStep(1);
        if (targetId === 'btn-next-2') goToStep(3);

        // Step 3 -> 2
        if (targetId === 'btn-back-3') goToStep(2);

        // 送信処理
        if (targetId === 'btn-submit') {
            const nameEl = document.getElementById('name');
            const emailEl = document.getElementById('email');

            if (!nameEl || !emailEl) return;

            const name = nameEl.value.trim();
            const email = emailEl.value.trim();

            // バリデーション
            if (!name || !email) {
                alert('お名前とメールアドレスは必須です。');
                return;
            }

            // 送信中の状態
            const btnSubmitLocal = e.target;
            btnSubmitLocal.disabled = true;
            btnSubmitLocal.textContent = '送信中...';

            // データ収集
            const formData = {
                service: selectedService,
                name: name,
                email: email,
                phone: document.getElementById('phone')?.value.trim() || '',
                message: document.getElementById('message')?.value.trim() || '',
            };

            // サービス別データ
            if (selectedService === '余興・イベント') {
                formData.plan = document.getElementById('plan')?.value || '';
                formData.situation = document.getElementById('situation')?.value || '';
                formData.budget = document.getElementById('budget')?.value.trim() || '';
                formData.date = document.getElementById('date')?.value.trim() || '';
                formData.guests = document.getElementById('guests')?.value.trim() || '';
            } else if (selectedService === 'マジックBAR') {
                formData.date = document.getElementById('bar-date')?.value.trim() || '';
                formData.guests = document.getElementById('bar-guests')?.value.trim() || '';
            } else if (selectedService === '飲食店') {
                formData.managerName = document.getElementById('manager-name')?.value.trim() || '';
                formData.shopName = document.getElementById('shop-name')?.value.trim() || '';
                formData.shopAddress = document.getElementById('shop-address')?.value.trim() || '';
                formData.date = document.getElementById('date')?.value.trim() || '';
                formData.guests = document.getElementById('guests')?.value.trim() || '';
            }

            try {
                // GAS URLが設定されているか確認
                if (GAS_URL === 'YOUR_GAS_DEPLOY_URL_HERE') {
                    console.warn('GAS URLが未設定です。デモとして成功画面を表示します。');
                    goToStep('success');
                    const indicator = document.getElementById('steps-indicator');
                    if (indicator) indicator.style.display = 'none';
                    return;
                }

                // hidden iframe + form submit 方式（CORS完全回避）
                const iframeName = 'gas-submit-iframe-' + Date.now();
                const iframe = document.createElement('iframe');
                iframe.name = iframeName;
                iframe.style.display = 'none';
                document.body.appendChild(iframe);

                const form = document.createElement('form');
                form.method = 'POST';
                form.action = GAS_URL;
                form.target = iframeName;
                form.style.display = 'none';

                // formDataの各キーを hidden input として追加
                Object.keys(formData).forEach(key => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = formData[key];
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();

                // 送信後クリーンアップ（少し待ってから削除）
                setTimeout(() => {
                    form.remove();
                    iframe.remove();
                }, 5000);

                // 成功画面
                goToStep('success');
                const indicator = document.getElementById('steps-indicator');
                if (indicator) indicator.style.display = 'none';

            } catch (error) {
                console.error('送信エラー:', error);
                alert('送信中にエラーが発生しました。お手数ですがメールでお問い合わせください。');
                btnSubmitLocal.disabled = false;
                btnSubmitLocal.textContent = '送信する';
            }
        }
    });
}

// 従来のページ用（contact.htmlなどに直接埋め込まれている場合）
document.addEventListener('DOMContentLoaded', () => {
    // DOM構築後にフォームが存在すれば初期化
    if (document.getElementById('contact-form-container')) {
        initContactForm();
    }
});
