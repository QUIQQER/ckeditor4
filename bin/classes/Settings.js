define('package/quiqqer/ckeditor4/bin/classes/Settings', [

    'qui/QUI',
    'qui/classes/DOM',
    'Ajax'

], function (QUI, QUIDOM, QUIAjax) {
    "use strict";

    return new Class({

        Extends: QUIDOM,

        initialize: function () {
            this.plugins = null;
        },


        getPlugins: function () {
            var self = this;

            if (this.plugins !== null) {
                return Promise.resolve(this.plugins);
            }

            return new Promise(function (resolve, reject) {
                QUIAjax.get("package_quiqqer_ckeditor4_ajax_getActivePlugins", function (result) {

                    self.plugins = result;
                    resolve(result);
                }, {
                    'package': 'quiqqer/ckeditor4',
                    'onError': reject
                });

            });
        }
    });
});