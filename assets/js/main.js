/* ほしぞらレコード main.js */
(function () {
  'use strict';

  /* ============================================================
     営業中バッジ（Design.md 5章）
     木〜月 10:30–18:00、火・水 定休
     表示: 本日定休・営業時間外のみ（営業中は表示しない）
     Asia/Tokyo の曜日と時刻で判定。判定できないときはバッジを出さない
     ============================================================ */
  function updateBadge() {
    var badge = document.getElementById('hr-status-badge');
    if (!badge) return;

    try {
      var now = new Date();
      var fmt = new Intl.DateTimeFormat('ja-JP', {
        timeZone: 'Asia/Tokyo',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });
      var parts = fmt.formatToParts(now);

      var weekday = '';
      var hour    = -1;
      var minute  = -1;

      parts.forEach(function (p) {
        if (p.type === 'weekday') weekday = p.value;
        if (p.type === 'hour')    hour    = parseInt(p.value, 10);
        if (p.type === 'minute')  minute  = parseInt(p.value, 10);
      });

      if (!weekday || hour < 0 || minute < 0) return;

      var closedDays = ['火', '水'];
      var isClosed   = closedDays.indexOf(weekday) !== -1;
      var totalMin   = hour * 60 + minute;
      var openMin    = 10 * 60 + 30;
      var closeMin   = 18 * 60;
      var isOpen     = !isClosed && totalMin >= openMin && totalMin < closeMin;

      /* 営業中は表示しない */
      if (isOpen) return;

      var label, cls;
      if (isClosed) {
        label = '本日定休';
        cls   = 'hr-badge--closed';
      } else {
        label = '営業時間外';
        cls   = 'hr-badge--outside';
      }

      badge.textContent = label;
      badge.className   = 'hr-badge ' + cls;
      badge.removeAttribute('hidden');
    } catch (e) {
      /* Intl 非対応・例外時はバッジを出さない */
    }
  }

  /* ============================================================
     ハンバーガーメニュー（〜959px）
     ============================================================ */
  function initHamburger() {
    var btn    = document.getElementById('hr-hamburger-btn');
    var drawer = document.getElementById('hr-drawer');
    if (!btn || !drawer) return;

    function openDrawer() {
      drawer.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'メニューを閉じる');
      var firstLink = drawer.querySelector('a[href], button');
      if (firstLink) firstLink.focus();
    }

    function closeDrawer(returnFocus) {
      drawer.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'メニューを開く');
      if (returnFocus) btn.focus();
    }

    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-expanded') === 'true') {
        closeDrawer(true);
      } else {
        openDrawer();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        closeDrawer(true);
      }
    });

    document.addEventListener('click', function (e) {
      var header = document.querySelector('.hr-header');
      if (
        btn.getAttribute('aria-expanded') === 'true' &&
        header && !header.contains(e.target)
      ) {
        closeDrawer(false);
      }
    });

    var mq = window.matchMedia('(min-width: 960px)');
    function onMqChange(e) {
      if (e.matches && btn.getAttribute('aria-expanded') === 'true') {
        closeDrawer(false);
      }
    }
    if (mq.addEventListener) {
      mq.addEventListener('change', onMqChange);
    } else if (mq.addListener) {
      mq.addListener(onMqChange);
    }
  }

  /* 初期化 */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      updateBadge();
      initHamburger();
    });
  } else {
    updateBadge();
    initHamburger();
  }

}());
