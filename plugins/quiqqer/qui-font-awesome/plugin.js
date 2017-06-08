(function () {
    "use strict";
    console.log(CKEDITOR);


    CKEDITOR.plugins.add('qui-font-awesome', {
        icons: "icon",
        lang : ['en', 'de'],
        init : function (editor) {
            console.log("Init");

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
                            console.log("Submit");
                            if (selected.length === 0) {
                                return;
                            }
                            console.log("Insert");
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

