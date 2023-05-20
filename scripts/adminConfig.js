/**
 *  管理機能内で共通の関数群
 * @module adminConfig
 */
const adminConfig = (() => {
    'use strict';

    const createDialog = (isYesNo, msg, onClose) => {
        const dialogId = '__adminConfig_dialogbox__';
        const button1Id = '__adminConfig_dialogbox_button1__';
        const button2Id = '__adminConfig_dialogbox_button2__';

        // 新規dialogの作成
        let html = "<div class='card'><div class='card-content'><div class='content'><pre class='is-break-word'>"
            + msg
            + "</pre></div></div>"
            + "<footer class='card-footer'>";
        if (isYesNo) {
            // YesNo
            html += "<a id='" + button1Id + "' href='javascript:void(0)' class='card-footer-item'>Yes</a>"
                + "<a id='" + button2Id + "' href='javascript:void(0)' class='card-footer-item'>No</a>";
        } else {
            // OK only
            html += "<a id='" + button1Id + "' href='javascript:void(0)' class='card-footer-item'>Ok</a>";
        }
        html += "</footer></div>";

        const dialog = document.createElement('div');
        dialog.id = dialogId;
        dialog.classList.add('dialog');
        dialog.innerHTML = html;
        document.body.appendChild(dialog);

        const close = (result) => {
            document.body.removeChild(dialog);
            onClose(result);
        };

        // クリックイベントの設定
        document.getElementById(button1Id).addEventListener("click", () => {
            close(true);
        });
        if (isYesNo) {
            document.getElementById(button2Id).addEventListener("click", () => {
                close(false);
            });
        }

        // アニメーション表示
        setTimeout(() => {
            document.getElementById(dialogId).style.opacity = '1';
        }, 10);
    };

    return {

        confirmAsync: async (msg) => {
            return new Promise((resolve) => {
                createDialog(true, msg, resolve);
            });
        },

        msgboxAsync: async (msg) => {
            return new Promise((resolve) => {
                createDialog(false, msg, resolve);
            });
        },
    };

})();