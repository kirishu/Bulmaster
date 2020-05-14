/**
 * bulmaster.js
 *    ページ初期設定スクリプト
 */
const Bulmaster = (() => {
    'use strict';

    /** 各種設定 */
    const _settings = {
        neverChileMenuClose: false,     // trueなら子メニューは常に開いたまま（expandしっぱなし）
    };

    /** element <menu> */
    let _$menu;
    /** element #page_settings_$menu_modal （モーダルメニューの親element） */
    let _$menu_modal;
    /** element　モーダルメニュー表示アイコン */
    let _$icon_hamburger;
    /** element　lockUi */
    let _$lockUi;

    let _menu_width;

    // createElement と classList.addを一度にやるだけ
    const _createElement = (tag, css) => {
        const elem = document.createElement(tag);
        elem.classList.add(...css);
        return elem;
    };

    /** element初期化 */
    const elementInit = () => {
        /** element <menu> */
        _$menu = document.querySelector('menu');

        if (_$menu) {
            // モーダルメニュー表示アイコン
            _$icon_hamburger = document.querySelector('.icon-hamburger');

            // モバイル用モーダルメニュー 親element作成
            const elemA1 = _createElement('div', ['modal', 'modal-menu']);
            const elemA2 = _createElement('div', ['modal-background']);
            elemA1.appendChild(elemA2);
            document.body.appendChild(elemA1);
            _$menu_modal = elemA1;

            // メニューのwidthを取得
            _menu_width = parseInt(window.getComputedStyle(_$menu).width, 10);
        }

        // block-ui element作成
        const elemB1 = _createElement('div', ['block-ui']);
        const elemB2 = _createElement('div', ['modal-background']);
        const elemB3 = _createElement('div', []);
        const elemB4 = _createElement('i', ['fas', 'fa-sync', 'fa-spin', 'fa-6x']);
        elemB3.appendChild(elemB4);
        elemB2.appendChild(elemB3);
        elemB1.appendChild(elemB2);
        document.body.appendChild(elemB1);
        _$lockUi = elemB1;
    };


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
        const menunode = _$menu.cloneNode(true);
        menunode.style.display = 'block';
        _$menu_modal.appendChild(menunode);

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
        // PageTop Node作成
        const i = _createElement('i', ['fas', 'fa-chevron-circle-up', 'fa-2x']);
        const s = _createElement('span', ['icon']);
        const icon = _createElement('a', ['icon-move-top']);
        s.appendChild(i);
        icon.appendChild(s);
        document.body.appendChild(icon);

        // スクロールボタン click event
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const duration = 20;
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
            icon.style.visibility = (scrollTop > 10) ? 'visible' : 'hidden';
        }, false);
    };

    /** event 登録 */
    const addEvents = () => {
        // window resize event
        window.addEventListener('resize', setOutline, false);

        if (_$icon_hamburger) {
            // モーダルメニュー 表示（ハンバーガアイコン click event）
            _$icon_hamburger.addEventListener('click', (e) => {
                _$menu_modal.style.display = 'block';
                setTimeout(() => {
                    _$menu_modal.querySelector('.modal-background').style.opacity = '1';
                    _$menu_modal.querySelector('menu').style.transform = 'translateX(0px)';
                }, 10);
            }, false);
        }
        if (_$menu_modal) {
            // モーダルメニュー 消去（background click event）
            _$menu_modal.querySelector('.modal-background').addEventListener('click', (e) => {
                _$menu_modal.querySelector('.modal-background').style.opacity = '0';
                _$menu_modal.querySelector('menu').style.transform = `translateX(-${_menu_width}px)`;
                setTimeout(() => {
                    _$menu_modal.style.display = 'none';
                }, 1000);
            }, false);
        }
    };

    // ------------------------------
    // 公開API
    return {
        /**
         * 初期化
         */
        init: (() => {
            // element初期設定
            elementInit();
            // メニュー設定
            menuInit();
            // ページアウトライン設定
            setOutline();
            // PageTopスクロール設定
            scrollPageTop();
            // event handler登録
            addEvents();
        }),

        /**
         * block-uiの表示/非表示
         */
        showBlockUi: ((isVisible) => {
            _$lockUi.style.display = isVisible ? 'block' : 'none';
        }),

    };

})();

// execute
window.addEventListener('DOMContentLoaded', (e) => {
    Bulmaster.init();
});
