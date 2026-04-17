/**
 * components.js — 共通ヘッダー・フッター・モバイルメニュー
 */

/** 現在のページファイル名を取得 */
function getCurrentPage() {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  return filename;
}

/** ヘッダーを生成・挿入 */
function renderHeader() {
  const currentPage = getCurrentPage();

  const navItems = [
    { label: 'サービス', href: 'index.html#service' },
    { label: 'プロフィール', href: 'index.html#profile' },
    { label: '動画', href: 'index.html#movie' },
    { label: 'イベント', href: 'event.html' },
    { label: 'マジックBAR', href: 'bar.html' },
    { label: '飲食店', href: 'restaurant.html' },
  ];

  const navLinksHtml = navItems.map(item => {
    // ハッシュリンク（ページ内アンカー）は、トップページで一律アクティブにしないようにする
    const isHashLink = item.href.includes('#');
    const isActive = !isHashLink && currentPage === item.href.split('#')[0];
    return `<a href="${item.href}" class="nav-link${isActive ? ' active' : ''}">${item.label}</a>`;
  }).join('');

  const mobileLinksHtml = navItems.map(item =>
    `<a href="${item.href}" class="mobile-nav-link">${item.label}</a>`
  ).join('');

  const headerHtml = `
    <header class="site-header" id="site-header">
      <div class="header-inner">
        <a href="index.html" class="header-logo">YAMATO</a>
        <nav class="header-nav">
          ${navLinksHtml}
          <a href="contact.html" class="nav-cta">お問い合わせ</a>
        </nav>
        <button class="menu-toggle" id="menu-toggle" aria-label="メニュー">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
    <nav class="mobile-nav" id="mobile-nav">
      ${mobileLinksHtml}
      <a href="contact.html" class="btn btn-primary">お問い合わせ</a>
    </nav>
  `;

  document.body.insertAdjacentHTML('afterbegin', headerHtml);

  // モバイルメニューのトグル
  const toggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });
    // リンククリックで閉じる
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/** フッターを生成・挿入 */
function renderFooter() {
  const footerHtml = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-inner">
          <div>
            <div class="footer-brand">Magician YAMATO</div>
            <p class="footer-desc">
              確かな技術と独特のユーモアで、<br>
              記憶に残る体験をお届けします。
            </p>
          </div>
          <div class="footer-links">
            <h4>SERVICE</h4>
            <a href="event.html">余興・イベント</a>
            <a href="bar.html">マジックBAR</a>
            <a href="restaurant.html">飲食店</a>
            <a href="contact.html">お問い合わせ</a>
          </div>
          <div class="footer-links">
            <h4>CONTACT</h4>
            <a href="mailto:yamatouuu06@gmail.com">yamatouuu06@gmail.com</a>
            <a href="contact.html">お問い合わせフォーム</a>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="footer-sns">
            <a href="https://line.me/R/ti/p/@344pyyvy?ts=02022038&oat_content=url" target="_blank" rel="noopener noreferrer" aria-label="LINE">
              <img src="images/sns/line.png" alt="LINE" width="22" height="22">
            </a>
            <a href="https://www.tiktok.com/@0-79bd-4ecf-bc21-d4ffc2983c2b" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <img src="images/sns/tiktok.png" alt="TikTok" width="22" height="22">
            </a>
            <a href="https://www.youtube.com/channel/UCWutF12nvDDOikKtkUoJs3A" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <img src="images/sns/youtube.png" alt="YouTube" width="22" height="22">
            </a>
            <a href="https://www.instagram.com/yamato_magic?utm_source=qr%2F" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="images/sns/instagram.png" alt="Instagram" width="22" height="22">
            </a>
          </div>
          &copy; ${new Date().getFullYear()} Magician YAMATO All Rights Reserved.
        </div>
      </div>
    </footer>
  `;

  // body の閉じタグの前に挿入
  document.body.insertAdjacentHTML('beforeend', footerHtml);
}

/** スティッキーCTAを生成・挿入 */
function renderStickyCta() {
  const ctaHtml = `
    <div class="sticky-cta" id="sticky-cta">
      <div style="display: flex; gap: 8px; justify-content: center;">
        <button type="button" class="btn btn-primary" onclick="openContactModal()" style="padding: 12px 20px; font-size: 0.9rem;">お問い合わせ</button>
        <a href="https://line.me/R/ti/p/@344pyyvy?ts=02022038&oat_content=url" target="_blank" rel="noopener noreferrer" class="btn btn-line" style="padding: 12px 20px; font-size: 0.9rem;">
            <img src="images/sns/line.png" alt="" aria-hidden="true" style="margin-right: 6px; width: 18px; height: 18px;">LINE
        </a>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', ctaHtml);
}

/** 共通のお問い合わせモーダルを生成・挿入 */
function renderContactModal() {
  // すでにある場合は何もしない（念のため）
  if (document.getElementById('contact-modal')) return;

  const modalHtml = `
    <div class="contact-modal-overlay" id="contact-modal">
      <div class="contact-modal-content">
        <button class="contact-modal-close" aria-label="閉じる" onclick="closeContactModal()"></button>
        <div class="contact-modal-body">
            <!-- forms will be loaded here, or placed inline -->
            <div class="form-container" id="contact-form-container">
                <!-- ステップインジケーター -->
                <div class="form-steps-indicator" id="steps-indicator">
                    <div class="step-dot active"></div>
                    <div class="step-dot"></div>
                    <div class="step-dot"></div>
                </div>

                <!-- Step 1: 連絡先入力 -->
                <div class="form-step active" id="step-1">
                    <h3>ご連絡先をご入力ください</h3>
                    <p>まずはご連絡先をご入力ください。</p>
                    <div class="form-group">
                        <label>お名前 <span class="label-required">必須</span></label>
                        <input type="text" id="name" placeholder="例: 大和太郎" required>
                    </div>
                    <div class="form-group">
                        <label>メールアドレス <span class="label-required">必須</span></label>
                        <input type="email" id="email" placeholder="例: yamada@example.com" required>
                    </div>
                    <div class="form-group">
                        <label>電話番号 <span class="label-optional">任意</span></label>
                        <input type="tel" id="phone" placeholder="例: 090-1234-5678">
                    </div>
                    <div class="form-actions">
                        <div></div>
                        <button type="button" class="btn btn-primary" id="btn-next-1">次へ</button>
                    </div>
                </div>

                <!-- Step 2: サービス選択 -->
                <div class="form-step" id="step-2">
                    <h3>ご利用サービスを選択してください</h3>
                    <p>ご希望のサービスをお選びください。</p>
                    <div class="selection-cards">
                        <label class="selection-card">
                            <input type="radio" name="service" value="余興・イベント">
                            <span class="selection-card-label">余興・イベント</span>
                        </label>
                        <label class="selection-card">
                            <input type="radio" name="service" value="マジックBAR">
                            <span class="selection-card-label">マジックBAR</span>
                        </label>
                        <label class="selection-card">
                            <input type="radio" name="service" value="飲食店">
                            <span class="selection-card-label">飲食店</span>
                        </label>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-outline-dark" id="btn-back-2">戻る</button>
                        <button type="button" class="btn btn-primary" id="btn-next-2" disabled>次へ</button>
                    </div>
                </div>

                <!-- Step 3: 詳細入力 -->
                <div class="form-step" id="step-3">
                    <h3>詳細をお聞かせください</h3>
                    <p>可能な範囲でご記入ください。</p>

                    <!-- 余興・イベント用フィールド -->
                    <div id="fields-event" style="display:none;">
                        <div class="form-group">
                            <label>プラン <span class="label-required">必須</span></label>
                            <div class="radio-button-group" id="plan">
                                <label class="radio-button-label">
                                    <input type="radio" name="plan" value="テーブルマジック">
                                    <span class="radio-button-text">テーブル</span>
                                </label>
                                <label class="radio-button-label">
                                    <input type="radio" name="plan" value="ホッピング">
                                    <span class="radio-button-text">ホッピング</span>
                                </label>
                                <label class="radio-button-label">
                                    <input type="radio" name="plan" value="サロンマジック">
                                    <span class="radio-button-text">サロン</span>
                                </label>
                                <label class="radio-button-label">
                                    <input type="radio" name="plan" value="ステージマジック">
                                    <span class="radio-button-text">ステージ</span>
                                </label>
                                <label class="radio-button-label">
                                    <input type="radio" name="plan" value="未定・相談">
                                    <span class="radio-button-text">相談して決める</span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>シチュエーション <span class="label-required">必須</span></label>
                            <div class="radio-button-group" id="situation">
                                <label class="radio-button-label">
                                    <input type="radio" name="situation" value="企業イベント">
                                    <span class="radio-button-text">企業・団体</span>
                                </label>
                                <label class="radio-button-label">
                                    <input type="radio" name="situation" value="結婚式">
                                    <span class="radio-button-text">結婚式</span>
                                </label>
                                <label class="radio-button-label">
                                    <input type="radio" name="situation" value="パーティー">
                                    <span class="radio-button-text">パーティー</span>
                                </label>
                                <label class="radio-button-label">
                                    <input type="radio" name="situation" value="その他">
                                    <span class="radio-button-text">その他</span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>出演料・ご予算 <span class="label-optional">任意</span></label>
                            <input type="text" id="budget" placeholder="例: 予算5万円、相談して決めたい など">
                        </div>
                    </div>

                    <!-- マジックBAR用フィールド -->
                    <div id="fields-bar" style="display:none;">
                        <div class="form-group">
                            <label>ご希望日時 <span class="label-optional">任意</span></label>
                            <input type="text" id="bar-date" placeholder="例: 2026年4月1日 19:00頃">
                        </div>
                        <div class="form-group">
                            <label>人数 <span class="label-optional">任意</span></label>
                            <input type="text" id="bar-guests" placeholder="例: 4名">
                        </div>
                    </div>

                    <!-- 飲食店用フィールド -->
                    <div id="fields-restaurant" style="display:none;">
                        <div class="form-group">
                            <label>店舗責任者名 <span class="label-optional">任意</span></label>
                            <input type="text" id="manager-name" placeholder="例: 佐藤太郎">
                        </div>
                        <div class="form-group">
                            <label>店舗名 <span class="label-optional">任意</span></label>
                            <input type="text" id="shop-name" placeholder="例: ビストロ○○">
                        </div>
                        <div class="form-group">
                            <label>店舗住所 <span class="label-optional">任意</span></label>
                            <input type="text" id="shop-address" placeholder="例: 東京都新宿区○○ 1-2-3">
                        </div>
                    </div>

                    <!-- 共通フィールド -->
                    <div class="form-group">
                        <label>希望日時 <span class="label-optional">任意</span></label>
                        <input type="text" id="date" placeholder="例: 2026年5月15日">
                    </div>
                    <div class="form-group">
                        <label>参加人数 <span class="label-optional">任意</span></label>
                        <input type="text" id="guests" placeholder="例: 50名">
                    </div>
                    <div class="form-group">
                        <label>ご要望・こだわり <span class="label-optional">任意</span></label>
                        <textarea id="message" placeholder="具体的なご要望があればお書きください。決まっていなくても大丈夫です。"></textarea>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn btn-outline-dark" id="btn-back-3">戻る</button>
                        <button type="button" class="btn btn-primary" id="btn-submit">送信する</button>
                    </div>

                    <p class="form-note">
                        ※ お問い合わせは、お電話（<a href="tel:08087330621" class="tel-link">080-8733-0621</a>）・メール・<a href="https://line.me/R/ti/p/@344pyyvy?ts=02022038&oat_content=url" target="_blank" rel="noopener noreferrer" style="color: #06C755; font-weight: bold; text-decoration: underline;">LINE</a>でも承っております。
                    </p>
                </div>

                <!-- 送信完了 -->
                <div class="form-step" id="step-success">
                    <div class="form-success">
                        <div class="form-success-icon">✓</div>
                        <h3 style="margin-bottom:12px;">送信完了しました</h3>
                        <p>お問い合わせありがとうございます。<br>内容を確認の上、2営業日以内にご連絡いたします。</p>
                        <div style="margin-top: 28px;">
                            <button type="button" class="btn btn-outline-dark" onclick="closeContactModal()">閉じる</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // モーダルの外側クリックで閉じる処理
  const modal = document.getElementById('contact-modal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeContactModal();
    }
  });
}

/** モーダルを開く */
window.openContactModal = function (e) {
  if (e) e.preventDefault();
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.add('active');
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    modal.style.zIndex = '99999';
    document.body.classList.add('modal-open');
    // モーダルが開かれたらフォームのJavaScriptを初期化
    if (typeof initContactForm === 'function') {
      initContactForm();
    }
  }
};

/** モーダルを閉じる */
window.closeContactModal = function () {
  const modal = document.getElementById('contact-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    document.body.classList.remove('modal-open');
  }
};

/** 全ての「お問い合わせへ」リンクをモーダル開閉処理に書き換える */
function bindContactLinksToModal() {
  const contactLinks = document.querySelectorAll('a[href="contact.html"], a[href="./contact.html"]');
  contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  });
}

/** 初期化 */
document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderStickyCta();
  renderContactModal();
  bindContactLinksToModal();

  // contact.html に直接アクセスされた場合は自動でモーダルを開く
  if (window.location.pathname.includes('contact.html')) {
    setTimeout(() => {
      openContactModal();
    }, 100);
  }
});
