(function () {
    "use strict";



    CKEDITOR.plugins.add('qui-font-awesome', {
        icons: "icon",
        lang : ['en', 'de'],
        init : function (editor) {
            this.$Editor = editor;
            var self     = this;

            editor.ui.addButton('FontAwesome', {
                label  : "Font-Awesome",
                toolbar: 'insert',
                command: 'insert-fa',
                icon   : this.path + 'images/button.png'
            });


            editor.addCommand('insert-fa', {
                exec: function (editor) {

                    require(["controls/icons/Confirm"], function (FontAwesomeDialog) {
                        var window = new FontAwesomeDialog({});

                        window.addEvent("submit", function (dialog, selected) {
                            if (selected.length === 0) {
                                return;
                            }
                            self.insertIcon(selected[0]);

                        });

                        window.open();
                    });


                }
            });
        },

        insertIcon: function (classname) {
            this.$Editor.insertHtml('<span class="' + classname + '">&nbsp;</span>');
        }
    });
})();

