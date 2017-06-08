define('package/quiqqer/ckeditor4/bin/backend/controls/UploadWindow', [

    'qui/QUI',
    'qui/controls/windows/Confirm',
    'Locale',
    'controls/upload/Form'
], function (QUI, QUIConfirm, QUILocale, UploadForm) {
    "use strict";


    return new Class({

        Extends: QUIConfirm,
        Type   : 'package/quiqqer/ckeditor4/bin/windows/Upload',

        Binds: [
            '$onSubmit',
            '$onOpen',
            '$onComplete'
        ],

        initialize: function (options) {
            this.setAttributes({
                title        : QUILocale.get("quiqqer/ckeditor4", "window.upload.title"),
                icon         : 'fa fa-upload',
                maxWidth     : 400,
                maxHeight    : 600,
                autoclose    : false,
                texticon     : false,
                cancel_button: {
                    text     : false,
                    textimage: 'icon-remove fa fa-remove'
                },
                ok_button    : {
                    text     : QUILocale.get("quiqqer/ckeditor4", "window.upload.button.upload"),
                    textimage: 'fa fa-upload'
                }
            });

            this.$Upload = null;

            this.parent(options);

            this.addEvents({
                onOpen: this.$onOpen,
                onSubmit: this.$onSubmit
            });

        },

        /**
         * Calls the ajax function to get the labels from gitlab and sets up its controls.
         */
        $onOpen: function () {
            var Content = this.getContent();

            this.$Upload = new UploadForm({
                multible    : false,
                sendbutton  : false,
                cancelbutton: false,
                events      : {
                    onComplete: this.$onComplete
                },
                styles      : {
                    height: '80%'
                }
            });

            this.$Upload.setParam('onfinish', 'package_quiqqer_ckeditor4_ajax_uploadComplete');
            this.$Upload.setParam('extract', 0);

            this.$Upload.inject(Content);

            var description = new Element("div", {
                "html" : QUILocale.get("quiqqer/ckeditor4", "message.settings.upload.warning.external"),
                "class": "content-message-attention",
                "style": "margin-top: 10px;"
            });
            description.inject(Content);

        },


        $onSubmit: function () {
            this.$Upload.submit();
        },

        $onComplete: function (Form, File, result) {

            QUI.MessageHandler.addSuccess(
                QUILocale.get("quiqqer/ckeditor4", "message.window.upload.complete")
            );

            this.fireEvent("uploadDone");

            this.close();
        }

    });
});
