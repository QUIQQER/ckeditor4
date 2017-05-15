define('package/quiqqer/ckeditor4/bin/backend/classes/Settings', [

    'qui/QUI',
    'qui/classes/DOM',
    'Ajax'

], function (QUI, QUIDOM, QUIAjax) {
    "use strict";

    return new Class({

        Extends: QUIDOM,

        initialize: function () {
            this.config = null;
        },


        getConfig: function(){
            var self = this;

            if (this.config !== null) {
                return Promise.resolve(this.config);
            }

            return new Promise(function (resolve, reject) {
                QUIAjax.get("package_quiqqer_ckeditor4_ajax_getEditorConfig", function (result) {

                    self.config = result;
                    resolve(result);
                }, {
                    'package': 'quiqqer/ckeditor4',
                    'onError': reject
                });

            });
        }
    });
});