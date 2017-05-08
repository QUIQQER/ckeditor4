define('package/quiqqer/ckeditor4/bin/classes/Settings', [

    'qui/QUI',
    'qui/classes/DOM',
    'Ajax'

], function (QUI, QUIDOM, QUIAjax) {
    "use strict";

    return new Class({

        Extends: QUIDOM,

        initialize: function () {
            this.pluginData = null;
        },


        getPluginData: function () {
            var self = this;

            if (this.pluginData !== null) {
                return Promise.resolve(this.pluginData);
            }

            return new Promise(function (resolve, reject) {
                QUIAjax.get("package_quiqqer_ckeditor4_ajax_getPluginData", function (result) {

                    self.pluginData = result;
                    resolve(result);
                }, {
                    'package': 'quiqqer/ckeditor4',
                    'onError': reject
                });

            });
        }
    });
});