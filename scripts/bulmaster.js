/**
 *! bulmaster.js | github.com/kirishu/bulmaster
 *    ページ初期設定スクリプト
 */
const Bulmaster = (() => {
    'use strict';

    /** 各種設定 */
    const _settings = {
        neverChileMenuClose: false,     // trueなら子メニューは常に開いたまま（expandしっぱなし）
        shrinkMenuIcon: true,           // メニューを縮小するアイコンの表示
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
            // mainのアニメーション定義
            document.querySelector('main').style.transitionDuration = window.getComputedStyle(_$menu).transitionDuration;
        } else {
            // menuがないとき
            _menu_width = 0;
            document.querySelector('main').style.marginLeft = '0';
            const nav = document.querySelector('nav.header');
            if (nav) {
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

        // メニュー非表示の作成
        if (_settings.shrinkMenuIcon) {
            shrinkMenuSetting();
        }

        return;
    };

    /**
     * メニュー非表示の作成
     */
    const shrinkMenuSetting = () => {
        // アイコンを追加
        const html = "<i class='fas fa-bars'></i><i class='fas fa-arrow-left'></i><span class='menu-text'>shrink</span>";
        const domli = _createElement('div', ['shrink-menu-icon']);
        domli.innerHTML = html;
        const shirinkIcon = _$menu.querySelector('menu .menu-items').appendChild(domli);

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
            }
        };

        // メニュー縮小 change event
        shirinkIcon.addEventListener('click', (e) => {
            doShrinkMenu(e, true);
        }, false);

        // shrinkのclick event
        shrink.addEventListener('click', (e) => {
            doShrinkMenu(e, false);
        }, false);
    };

    /** PageTopスクロール設定 */
    const scrollPageTop = () => {
        // PageTopボタン作成
        const i = _createElement('i', ['fas', 'fa-chevron-circle-up', 'fa-border']);
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

            document.addEventListener('click', () => {
                $dropbtns.forEach(_ => {
                    _.classList.remove('is-active');
                });
            });
        }
    };

    // DOMContentLoaded execute
    window.addEventListener('DOMContentLoaded', () => {
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
         * @param {string} id elementのid
         * @param {boolean} isVisible true=表示/false=非表示
         * @returns void
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

        /**
         * Dialog Open/Close
         * @param {boolean} isVisible true=表示/false=非表示
         * @param {string} msg メッセージ
         * @param {boolean} isYesNo true=YesNoボタン/false=OKボタンのみ
         * @param {object} func YesまたはOKボタンに割り当てる関数（OKのときはダイアログCloseも同時に呼ばれます）
         * @returns bool
         */
        showDialog: (isVisible, msg, isYesNo, func) => {
            const id = '__bulmaster_dialogbox__';
            // 既存dialogの消去
            if (document.getElementById(id)) {
                const $elem = document.getElementById(id);
                $elem.style.opacity = '0';
                if (!!_dialogFunc) {
                    $elem.querySelector('a').removeEventListener('click', _dialogFunc);
                    _dialogFunc = null;
                }
                $elem.innerHTML = '';
                $elem.remove();
            }
            if (!isVisible) {
                return;
            }

            // 新規dialogの作成
            let html = "<div class='card'><div class='card-content'><div class='content'><pre class='is-break-word'>"
                     + msg
                     + "</pre></div></div>"
                     + "<footer class='card-footer'>";
            if (isYesNo) {
                // YesNo
                html += "<a href='javascript:void(0)' class='card-footer-item'>Yes</a>"
                      + "<a href='javascript:Bulmaster.showDialog(false)' class='card-footer-item'>No</a>";
            } else {
                // OK only
                html += "<a href='javascript:Bulmaster.showDialog(false)' class='card-footer-item'>Ok</a>";
            }
            html += "</footer></div>";

            const dom = _createElement('div', ['dialog']);
            dom.id = id;
            dom.innerHTML = html;
            document.body.appendChild(dom);
            if (!!func) {
                _dialogFunc = func;
                // 最初の<a>にイベントを割り当てる
                document.getElementById(id).querySelector('a').addEventListener('click', _dialogFunc);
            } else {
                _dialogFunc = null;
            }

            setTimeout(() => {
                document.getElementById(id).style.opacity = '1';
            }, 10);
        },
    };

})();