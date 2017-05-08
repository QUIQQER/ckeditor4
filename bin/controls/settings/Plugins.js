define('package/quiqqer/ckeditor4/bin/controls/settings/Plugins', [
    'qui/QUI',
    'qui/controls/Control',
    'controls/grid/Grid',
    'Ajax',
    'Locale'
], function (QUI, QUIControl, Grid, QUIAjax, QUILocale) {
    "use strict";

    return new Class(
        {
            Extends: QUIControl,
            Type   : 'package/quiqqer/ckeditor4/bin/controls/settings/Plugins',

            Binds: [
                '$onCreate',
                '$onResize',
                '$onRefresh',
                '$toggleState'
            ],

            options: {},

            /**
             * Control constructor
             * @param options
             */
            initialize: function (options) {
                this.parent(options);

                // Variablendklarationen
                this.$Grid = null;


                // Eventdeklarationen
                this.addEvents({
                    onCreate : this.$onCreate,
                    onResize : this.$onResize,
                    onRefresh: this.$onRefresh,
                    onInject : this.$onCreate,
                    onImport : this.$onCreate
                });
            },

            /**
             * Eventhandler onCreate
             */
            $onCreate: function () {
                var self = this;

                var Container = new Element('div').inject(
                    this.getElm()
                );


                this.$Grid = new Grid(Container, {
                    buttons    : [{
                        name    : 'state',
                        text    : QUILocale.get(
                            "quiqqer/ckeditor4",
                            "editors.settings.plugins.table.button.activate"
                        ),
                        disabled: true,
                        events  : {
                            onClick: this.$toggleState
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
                        }
                    ]
                });
                this.$Grid.addEvents({

                    onDblClick: function () {
                        this.$toggleState();
                    }.bind(this),

                    onClick: function () {

                        var TableButtons = self.$Grid.getAttribute('buttons');

                        var StateBtn = TableButtons.state;

                        var data = self.$Grid.getSelectedData()[0];

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

                        if (StateBtn) {
                            StateBtn.enable();
                        }
                    }

                });


                this.refresh();
                this.$onResize();
            },

            /**
             * event : on refresh
             */
            $onRefresh: function () {

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

                QUIAjax.get("package_quiqqer_ckeditor4_ajax_getPlugins", function (result) {

                    for (var i = 0, len = result.length; i < len; i++) {

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

                            continue;
                        }
                    }

                    self.$Grid.setData({
                        data: result
                    });


                }, {
                    'package': "quiqqer/ckeditor4"
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
                            QUI.MessageHandler.addSuccess("Failed");
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
                            QUI.MessageHandler.addSuccess("Failed");
                        });
                    }

                });
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
            }

        }
    );
});