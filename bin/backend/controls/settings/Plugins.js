define('package/quiqqer/ckeditor4/bin/backend/controls/settings/Plugins', [
    'qui/QUI',
    'qui/controls/Control',
    'controls/grid/Grid',
    'Ajax',
    'Locale'
], function (QUI, QUIControl, Grid, QUIAjax, QUILocale) {
    "use strict";

    return new Class({
        Extends: QUIControl,
        Type   : 'package/quiqqer/ckeditor4/bin/backend/controls/settings/Plugins',

        Binds: [
            '$onCreate',
            '$onImport',
            '$onResize',
            '$onRefresh',
            '$toggleState',
            '$onTblClick',
            '$onTblDblClick',
            '$openStorePage'
        ],

        options: {},

        /**
         * Control constructor
         * @param options
         */
        initialize: function (options) {
            this.parent(options);

            // Variablendklarationen
            this.$Grid  = null;
            this.$Input = null;

            this.$canToggle = false;
            this.$canUpload = false;

            // Eventdeklarationen
            this.addEvents({
                onCreate : this.$onCreate,
                onResize : this.$onResize,
                onRefresh: this.$onRefresh,
                onImport : this.$onImport
            });
        },

        /**
         * Eventhandler onCreate
         */
        $onCreate: function () {
            var self = this;

            var Container = new Element('div').inject(this.getElm());


            this.$Grid = new Grid(Container, {
                buttons: [{
                    name    : 'state',
                    text    : QUILocale.get(
                        "quiqqer/ckeditor4",
                        "editors.settings.plugins.table.button.activate"
                    ),
                    disabled: true,
                    events  : {
                        onClick: this.$toggleState
                    }
                }, {
                    name  : 'upload',
                    text  : QUILocale.get(
                        "quiqqer/ckeditor4",
                        "editors.settings.plugins.table.button.upload"
                    ),
                    events: {
                        onClick: this.$displayUpload
                    }
                }],

                height     : "500",
                columnModel: [
                    {
                        header   : QUILocale.get(
                            "quiqqer/ckeditor4",
                            "editors.settings.plugins.table.header.state"
                        ),
                        dataIndex: 'icon',
                        dataType : 'node',
                        width    : 60
                    },
                    {
                        header   : QUILocale.get(
                            "quiqqer/ckeditor4",
                            "editors.settings.plugins.table.header.name"
                        ),
                        dataIndex: 'name',
                        dataType : 'string',
                        width    : 400
                    },
                    {
                        header   : QUILocale.get(
                            "quiqqer/ckeditor4",
                            "editors.settings.plugins.table.header.url"
                        ),
                        dataIndex: 'url',
                        dataType : 'string',
                        width    : 400
                    }
                ]
            });

            this.$Grid.addEvents({
                onDblClick: self.$onTblDblClick,
                onClick   : self.$onTblClick
            });


            QUIAjax.get("package_quiqqer_ckeditor4_ajax_getPermissions", function (permissions) {

                self.$canToggle = permissions.toggle;
                self.$canUpload = permissions.upload;


                if (!self.$canToggle) {
                    self.$Grid.getAttribute('buttons').state.disable();
                }

                if (!self.$canUpload) {
                    self.$Grid.getAttribute('buttons').upload.disable();
                }
            }, {
                package: "quiqqer/ckeditor4"
            });


            this.refresh();
            this.$onResize();
        },

        /**
         * event: onImport
         */
        $onImport: function () {
            this.$Input = this.getElm();
            this.$Elm   = new Element('div', {
                style: "width: 100%;"
            }).wraps(this.$Input);

            this.$onCreate();
        },

        /**
         * event : on resize
         */
        $onResize: function () {
            if (!this.$Grid || !this.$Elm) {
                return;
            }

            var size = this.$Elm.getSize();

            this.$Grid.setHeight(size.y);
            this.$Grid.setWidth(size.x);
            this.$Grid.resize();
        },

        /**
         * Refreshes the plugin table
         */
        refresh: function () {
            var self = this;

            return new Promise(function (resolve, reject) {
                QUIAjax.get("package_quiqqer_ckeditor4_ajax_getPlugins", function (result) {

                    for (var i = 0, len = result.length; i < len; i++) {

                        result[i].url = '<a target="_blank" href="' + self.$getStorePageUrl(result[i].name) + '">' + self.$getStorePageUrl(result[i].name) + '</a>';

                        if (result[i].state === 0) {
                            result[i].icon = new Element("span", {
                                'class': 'fa fa-times fa-2x'
                            });

                            continue;
                        }

                        if (result[i].state === 1) {
                            result[i].icon = new Element("span", {
                                'class': 'fa fa-check fa-2x'
                            });
                        }
                    }

                    self.$Grid.setData({
                        data: result
                    });

                    resolve();
                }, {
                    'package': "quiqqer/ckeditor4",
                    onError  : reject
                });
            });
        },

        /**
         * Toggles the state of the selected plugin
         * @returns {*}
         */
        $toggleState: function () {
            var self = this;
            return new Promise(function (resolve) {
                if (!self.$Grid) {

                    return resolve();
                }

                var data = self.$Grid.getSelectedData()[0];

                if (!data.name || data.state === null || data.state === 'undefined') {

                    return;
                }


                if (data.state === 0) {
                    self.$enablePlugin(data.name).then(function () {
                            self.refresh();
                            QUI.MessageHandler.addSuccess(QUILocale.get(
                                "quiqqer/ckeditor4",
                                "message.settings.plugins.activation.success"
                            ));
                        }
                    ).catch(function () {
                    });
                }


                if (data.state === 1) {
                    self.$disablePlugin(data.name).then(function () {
                            self.refresh();
                            QUI.MessageHandler.addSuccess(QUILocale.get(
                                "quiqqer/ckeditor4",
                                "message.settings.plugins.deactivation.success"
                            ));
                        }
                    ).catch(function () {
                    });
                }

            });
        },

        /**
         * Opens the store page of the currently selected plugin
         */
        $openStorePage: function () {

            var url = "http://ckeditor.com/addon/";

            url = url + this.$getSelectedName();

            window.open(url, '_blank');
        },

        /**
         * Gets the store page url of the given plugin
         */
        $getStorePageUrl: function (pluginName) {

            var url = "http://ckeditor.com/addon/";

            url = url + pluginName;
            return url;
        },

        /**
         * Returns the currently selected name
         *
         * @returns {boolean}
         */
        $getSelectedName: function () {
            var self = this;

            if (!self.$Grid) {

                return false;
            }

            var data = self.$Grid.getSelectedData()[0];

            if (!data.name || data.state === null || data.state === 'undefined') {

                return false;
            }

            return data.name;

        },

        /**
         * Disable the plugin with the given name
         * @param name
         * @returns {*}
         */
        $disablePlugin: function (name) {

            return new Promise(function (resolve, reject) {
                QUIAjax.post("package_quiqqer_ckeditor4_ajax_deactivatePlugin", resolve, {
                    'package'   : 'quiqqer/ckeditor4',
                    'pluginName': name,
                    onError     : reject
                });
            });
        },

        /**
         * Enable the plugin with the given name
         * @param name
         * @returns {*}
         */
        $enablePlugin: function (name) {
            return new Promise(function (resolve, reject) {
                QUIAjax.post("package_quiqqer_ckeditor4_ajax_activatePlugin", resolve, {
                    'package'   : 'quiqqer/ckeditor4',
                    'pluginName': name,
                    onError     : reject
                });
            });
        },

        /**
         * Displays the Upload window
         */
        $displayUpload: function () {

            var self = this;

            require(['package/quiqqer/ckeditor4/bin/backend/controls/UploadWindow'], function (Window) {
                new Window({
                    events: {
                        onUploadDone: self.refresh
                    }
                }).open();
            });

        },

        /**
         * event: onClick table row
         */
        $onTblClick: function () {
            var self = this;

            var TableButtons = self.$Grid.getAttribute('buttons');
            var StateBtn     = TableButtons.state;
            var data         = self.$Grid.getSelectedData()[0];

            if (!data) {
                return;
            }

            if (data.state === 0) {
                StateBtn.setAttribute("text", QUILocale.get(
                    "quiqqer/ckeditor4",
                    "editors.settings.plugins.table.button.activate"
                ));
            }

            if (data.state === 1) {
                StateBtn.setAttribute("text", QUILocale.get(
                    "quiqqer/ckeditor4",
                    "editors.settings.plugins.table.button.deactivate"
                ));
            }

            if (StateBtn && self.$canToggle) {
                StateBtn.enable();
            }

        },

        /**
         * event: onCoubleClick table row
         */
        $onTblDblClick: function () {
            //this.$openStorePage();
            this.$toggleState();
        }
    });
});