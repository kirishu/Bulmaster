/**
 * bulmaster.js
 *    ページ初期設定スクリプト
 *    ※即時関数ではなく、DOMContentLoadedで実行されます
 */
{
    // execute
    window.addEventListener('DOMContentLoaded', (e) => {
        Bulmaster();
    });
}

/**
 * Bulmaster
 */
const Bulmaster = (() => {
    'use strict';

    /** 各種設定 */
    const _settings = {
        neverChileMenuClose: false,     // trueなら子メニューは常に開いたまま（expandしっぱなし）
    };

    /** element <main> */
    const _$main = document.querySelector('main');
    /** element <menu> */
    const _$menu = document.querySelector('menu');
    /** element #page_settings_$menu_modal （モーダルメニューの親element） */
    const _$menu_modal = document.getElementById('page_settings_menu_modal');
    /** モーダルメニュー表示アイコン */
    const _$icon_hamburger = document.querySelector('.icon-hamburger');


    /** メニュークリック イベント関数リテラル */
    const _menuClickEvent = (function (e) {
        // liタグが子持ちメニューだったらopen/closeを切り替える
        const li = this.parentNode;
        if (li.classList.contains('has-children')) {
            // リンクの遷移を無効にする
            e.preventDefault();
            // open/closeを切り替える
            const hasOpen = li.classList.contains('open');
            if (hasOpen) {
                if (!_settings.neverChileMenuClose) {
                    li.classList.remove('open');
                }
            } else {
                li.classList.add('open');
            }
        } else {
            if (!this.classList.contains('non-location')) {
                // non-locationがあるときはすべてのaタグの.activeを取り除く
                document.querySelectorAll('menu ul a').forEach(_ => {
                    if (_.classList.contains('active')) {
                        _.classList.remove('active');
                    }
                });
                // 自分をactiveにする
                this.classList.add('active');
            }
        }
    });

    /** メニュー設定 */
    const menuInit = () => {
        if (!_$menu) {
            return;
        }
        if (_settings.neverChileMenuClose) {
            // neverChileMenuCloseがtrueのときは、すべての子持ちメニューを開く
            _$menu.querySelectorAll('ul li.has-children').forEach(li => {
                li.classList.add('open');
            });
        } else {
            // 子メニューにactiveがついていた場合は開いておく
            const active = _$menu.querySelector('ul li.has-children div.menu-child a.active');
            const elem = active ? active.closest('li.has-children') : null;
            if (elem && !elem.classList.contains('open')) {
                elem.classList.add('open');
            }
        }

        // モーダルメニュー用に<menu>nodeをコピーして、_$menu_modalの子要素にする
        const elem = _$menu.cloneNode(true);
        elem.style.display = 'block';
        _$menu_modal.appendChild(elem);

        // メニュー エレメントに clickイベントを付与
        document.querySelectorAll('menu ul a').forEach(a => {
            a.addEventListener('click', _menuClickEvent, false);
        }, this);

        return;
    };

    /**
     * ページアウトライン設定
     * ※init()と window.resizeイベントで呼ばれる
     */
    const setOutline = () => {
        // .content-containerの上マージンをヘッダー(nav.header)の高さに合わせる
        const nav = document.querySelector('nav.header');
        if (nav) {
            document.querySelector('.content-container').style.marginTop = nav.clientHeight + 25 + 'px';
        }
    };

    /** PageTopスクロール設定 */
    const scrollPageTop = () => {
        const icon = document.querySelector('.icon-move-top');
        if (!icon) {
            return;
        }

        // スクロールボタン click event
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const duration = 100;
            const y = window.pageYOffset;
            const step = duration / y > 1 ? 10 : 100;
            const timeStep = duration / y * step;

            const scrollUp = () => {
                if (window.pageYOffset === 0) {
                    clearInterval(ivalid);
                } else {
                    scrollBy(0, -step);
                }
            }

            const ivalid = setInterval(scrollUp, timeStep);
        }, false);

        window.addEventListener('scroll', (e) => {
            e.preventDefault();
            // 変化するポイントまでスクロールしたらクラスを追加
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 10) {
                icon.style.visibility = 'visible';
            } else {
                icon.style.visibility = 'hidden';
            }
        }, false);

    };

    /** event handler登録 */
    const addEvents = () => {
        // window resize event
        window.addEventListener('resize', setOutline, false);

        if (_$icon_hamburger) {
            // モーダルメニュー表示ハンバーガアイコン click event
            _$icon_hamburger.addEventListener('click', (e) => {
                _$menu_modal.style.display = 'block';
            }, false);
        }
        if (_$menu_modal) {
            // モーダルメニュー background click event
            _$menu_modal.querySelector('.modal-background').addEventListener('click', (e) => {
                _$menu_modal.style.display = 'none';
            }, false);
        }
    };

    // 各処理の実行
    // -----------------------------
    // メニュー設定
    menuInit();
    // ページアウトライン設定
    setOutline();
    // PageTopスクロール設定
    scrollPageTop();
    // event handler登録
    addEvents();

});