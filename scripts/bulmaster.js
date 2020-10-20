/**
 *! bulmaster.js | github.com/kirishu/bulmaster
 *    ページ初期設定スクリプト
 */
const Bulmaster = (() => {
    'use strict';

    /** 各種設定 */
    const _settings = {
        neverChileMenuClose: false,     // trueなら子メニューは常に開いたまま（expandしっぱなし）
        showMenuHideSwitch: true,       // メニューを縮小するswitchの表示
    };

    /** element <menu> */
    let _$menu;
    /** element Responsiveメニューの親element） */
    let _$menu_rpsv;
    /** element メニュー表示アイコン */
    let _$icon_hamburger;
    /** element blockUi */
    let _$blockUi;

    let _menu_width;

    // createElement と classList.addを一度にやるだけの関数
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
            // Responsiveメニュー表示アイコン
            _$icon_hamburger = document.querySelector('.icon-hamburger');

            // モバイル用Responsiveメニュー 親element作成
            const elemA1 = _createElement('div', ['modal', 'modal-menu']);
            const elemA2 = _createElement('div', ['modal-background']);
            elemA1.appendChild(elemA2);
            document.body.appendChild(elemA1);
            _$menu_rpsv = elemA1;

            // メニューのwidthを取得
            _menu_width = parseInt(window.getComputedStyle(_$menu).width, 10);
        } else {
            // menuがないとき
            _menu_width = 0;
            document.querySelector('main').style.marginLeft = '0';
            const nav = document.querySelector('nav.header');
            if (nav) {
                console.log(nav);
                nav.style.left = '0';
            }
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
        _$blockUi = elemB1;
    };


    /** メニュークリック イベント関数リテラル */
    const _menuClickEvent = (function (e) {
        // liタグが子持ちメニューだったらopen/closeを切り替える
        const li = this.parentNode;
        if (li.classList.contains('has-children')) {
            // リンクの遷移を無効にする
            e.preventDefault();
            // open/closeを切り替える
            if (!_settings.neverChileMenuClose) {
                li.classList.toggle('open');
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
            _$menu.querySelectorAll('ul li.has-children').forEach(_ => {
                _.classList.add('open');
            });
        } else {
            // 子メニューにactiveがついていた場合は開いておく
            const active = _$menu.querySelector('ul li.has-children div.menu-child a.active');
            const elem = active ? active.closest('li.has-children') : null;
            if (elem && !elem.classList.contains('open')) {
                elem.classList.add('open');
            }
        }

        // Responsiveメニュー用に<menu>nodeをコピーして、_$menu_rpsvの子要素にする
        const menunode = _$menu.cloneNode(true);
        menunode.style.display = 'block';
        _$menu_rpsv.appendChild(menunode);

        // メニュー のアンカーに clickイベントを付与
        document.querySelectorAll('menu ul a').forEach(_ => {
            _.addEventListener('click', _menuClickEvent, false);
        }, this);

        // 表示制御switchの設定
        if (_settings.showMenuHideSwitch) {
            swtchMenuSetting();
        }

        return;
    };

    /**
     * メニュー縮小switchの設定
     */
    const swtchMenuSetting = () => {
        const sw = `
            <div>MENU SWITCH</div>
            <div class='switch is-marginless'>
                <label><input type='checkbox' checked><span class='lever'></span></label>
            </div>
        `;
        const domli = _createElement('li', ['menu-label', 'menu-switch']);
        domli.innerHTML = sw;
        _$menu.querySelector('ul').appendChild(domli);
        const shirinkSw = _$menu.querySelector(".switch input[type='checkbox']");

        // 縮小メニューのオーバレイを動的に追加
        const shrink = document.createElement('div');
        shrink.id = '__bulmaster_shrink_menu_overlay';
        _$menu.appendChild(shrink);

        // メニューを縮小/復元する関数リテラル
        const doShrinkMenu = (e, isShrink) => {
            e.preventDefault();

            const main = document.querySelector('main');
            const nav = document.querySelector('nav.header');
            if (isShrink) {
                // 縮小
                main.classList.add('shrink-menu-main');
                if (nav) {
                    nav.classList.add('shrink-menu-nav');
                }
                _$menu.classList.add('shrink-menu-width');
                shrink.classList.add('shrink');
            } else {
                // 復元
                main.classList.remove('shrink-menu-main');
                if (nav) {
                    nav.classList.remove('shrink-menu-nav');
                }
                _$menu.classList.remove('shrink-menu-width');
                shrink.classList.remove('shrink');
                shirinkSw.checked = true;
            }
        };

        // メニュー縮小switch change event
        shirinkSw.addEventListener('change', (e) => {
            if (!shirinkSw.checked) {
                doShrinkMenu(e, true);
            }
        }, false);

        // shrinkのclick event
        shrink.addEventListener('click', (e) => {
            doShrinkMenu(e, false);
        }, false);
    };

    /** PageTopスクロール設定 */
    const scrollPageTop = () => {
        // PageTopボタン作成
        const i = _createElement('i', ['fas', 'fa-chevron-circle-up']);
        const s = _createElement('span', ['icon']);
        const icon = _createElement('a', ['icon-move-top']);
        s.appendChild(i);
        icon.appendChild(s);
        document.body.appendChild(icon);

        // PageTopボタン click event
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            const duration = 200;
            const y = window.pageYOffset;
            const step = duration / y > 1 ? 10 : 40;
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
        // ハンバーガアイコン click event
        if (_$icon_hamburger) {
            _$icon_hamburger.addEventListener('click', (e) => {
                e.preventDefault();
                document.documentElement.classList.add('is-clipped');
                _$menu_rpsv.style.display = 'block';
                // Responsiveメニュー 表示
                setTimeout(() => {
                    _$menu_rpsv.querySelector('.modal-background').style.opacity = '1';
                    _$menu_rpsv.querySelector('menu').style.transform = 'translateX(0px)';
                }, 10);
            }, false);
        }

        // modal-background click event
        if (_$menu_rpsv) {
            // メニュー 消去（background click event）
            _$menu_rpsv.querySelector('.modal-background').addEventListener('click', (e) => {
                e.preventDefault();
                document.documentElement.classList.remove('is-clipped');
                _$menu_rpsv.querySelector('.modal-background').style.opacity = '0';
                // Responsiveメニュー 非表示
                _$menu_rpsv.querySelector('menu').style.transform = `translateX(-${_menu_width}px)`;
                setTimeout(() => {
                    _$menu_rpsv.style.display = 'none';
                }, 1000);
            }, false);
        }

        // dropdown button click event
        const $dropbtns = document.querySelectorAll('.dropdown:not(.is-hoverable)');
        if ($dropbtns) {
            $dropbtns.forEach(_ => {
                _.addEventListener('click', (e) => {
                    e.stopPropagation();
                    _.classList.toggle('is-active');
                });
            });

            document.addEventListener('click', (e) => {
                $dropbtns.forEach(_ => {
                    _.classList.remove('is-active');
                });
            });
        }
    };

    // DOMContentLoaded execute
    window.addEventListener('DOMContentLoaded', (e) => {
        Bulmaster.init();
    });

    // ------------------------------
    // public API
    return {
        /**
         * 初期化
         */
        init: () => {
            // element初期設定
            elementInit();
            // メニュー設定
            menuInit();
            // PageTopスクロール設定
            scrollPageTop();
            // event handler登録
            addEvents();
        },

        /**
         * block-uiの表示/非表示
         */
        showBlockUi: (isVisible) => {
            if (isVisible) {
                document.documentElement.classList.add('is-clipped');
                _$blockUi.style.display = 'block';
            } else {
                document.documentElement.classList.remove('is-clipped');
                _$blockUi.style.display = 'none';
            }
        },

        /**
         * Modal Open/close
         */
        showModal: (id, isVisible) => {
            const $target = document.getElementById(id);
            if (!$target || !$target.classList.contains('modal')) {
                return;
            }
            const $modalCard = $target.querySelector('.modal-card');
            if (isVisible) {
                 document.documentElement.classList.add('is-clipped');
                $target.style.display = 'flex';
                setTimeout(() => {
                    $modalCard.style.opacity = '1';
                }, 1);
            } else {
                $modalCard.style.opacity = '0';
                setTimeout(() => {
                    document.documentElement.classList.remove('is-clipped');
                    $target.style.display = 'none';
                }, 300);
                // ↑ timeout値は、CSSの.modal-card transition の duration 値と合わせる
            }
        },
    };

})();