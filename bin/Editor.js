/**
 * ckeditor4 for QUIQQER
 *
 * @module package/quiqqer/ckeditor4/bin/Editor
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require require
 * @require qui/QUI
 * @require controls/editors/Editor
 * @require Locale
 * @require Ajax
 * @require qui/utils/Math
 * @require qui/utils/Elements
 * @require css!package/quiqqer/ckeditor4/bin/Editor.css
 */
define('package/quiqqer/ckeditor4/bin/Editor', [

    'require',
    'qui/QUI',
    'controls/editors/Editor',
    'Locale',
    'Ajax',
    'qui/utils/Math',
    'qui/utils/Elements',
    'package/quiqqer/ckeditor4/bin/Settings',

    'css!package/quiqqer/ckeditor4/bin/Editor.css'

], function (require, QUI, Editor, Locale, Ajax, QUIMath, QUIElements, Settings) {
    "use strict";


    return new Class({

        Extends: Editor,
        Type   : 'package/quiqqer/ckeditor4/bin/Editor',

        Binds: [
            '$onLoad',
            '$onDestroy',
            '$onSetContent',
            '$onGetContent',
            '$onDrop',
            '$onResize',
            '$onAddCSS',
            '$onInstanceReadyListener'
        ],

        /**
         * Control Constructor
         * @param Manager
         * @param options
         */
        initialize: function (Manager, options) {
            this.parent(Manager, options);

            this.$cssFiles = {};

            this.addEvents({
                onLoad      : this.$onLoad,
                onResize    : this.$onResize,
                onDestroy   : this.$onDestroy,
                onSetContent: this.$onSetContent,
                onGetContent: this.$onGetContent,
                onDrop      : this.$onDrop,
                onAddCSS    : this.$onAddCSS
            });
        },

        /**
         * Editor onLoad Event
         * if the editor is to be drawn and inserted
         *
         * @param {Object} data - Editor data
         */
        $onLoad: function (data) {
            var self = this;

            if ("CKEDITOR" in window) {
                self.$loadInstance(data);
                return;
            }

            // load CKEDITOR
            require([URL_OPT_DIR + 'ckeditor/ckeditor/ckeditor.js'], function () {
                // set global events
                window.CKEDITOR.on('instanceReady', function (ev) {
                    var Editor = QUI.Controls.getById(ev.editor.name);

                    if (Editor && "$onInstanceReadyListener" in Editor) {
                        Editor.$onInstanceReadyListener(ev);
                    }
                });

                // http://docs.ckeditor.com/#!/guide/dev_howtos_dialog_windows
                window.CKEDITOR.on('dialogDefinition', function (ev) {
                    var Editor = QUI.Controls.getById(ev.editor.name);

                    Editor.$imageDialog(ev);
                    Editor.$linkDialog(ev);
                    Editor.$html5AudioDialog(ev);
                    Editor.$html5VideoDialog(ev);
                });

                self.$loadInstance(data);
            });
        },

        /**
         * Load the CKEditor Instance into an Textarea or DOMNode Element
         *
         * @param {Object} data - Editor settings data
         */
        $loadInstance: function (data) {

            if (typeof window.CKEDITOR === 'undefined') {
                return;
            }

            var self      = this,
                Container = this.getContainer(),
                Textarea  = false,
                size      = Container.getSize();

            if (!Container.getElement('textarea')) {
                Textarea = new Element('textarea', {
                    id    : self.getId(),
                    styles: {
                        height: size.y,
                        width : size.x
                    }
                }).inject(Container);
            }

            if (!Textarea) {
                Textarea = Container.getElement('textarea');
            }

            var instance = Textarea.get('id');

            if (window.CKEDITOR.instances[instance]) {
                window.CKEDITOR.instances[instance].destroy(true);
            }

            self.setAttribute('instancename', instance);


            // parse the buttons for the ckeditor
            var b, g, i, len, blen, glen, group, items,
                buttonEntry, lineEntry, groupEntry;

            var buttons = data.toolbar,
                lines   = buttons.lines || [],
                toolbar = [];

            for (i = 0, len = lines.length; i < len; i++) {
                items     = [];
                lineEntry = lines[i];

                // groups
                for (g = 0, glen = lineEntry.length; g < glen; g++) {
                    group      = [];
                    groupEntry = lineEntry[g];

                    // buttons
                    for (b = 0, blen = groupEntry.length; b < blen; b++) {
                        buttonEntry = groupEntry[b];

                        if (buttonEntry.type === 'separator') {
                            group.push('-');
                            continue;
                        }

                        group.push(buttonEntry.button);
                    }

                    toolbar.push(group);
                }

                toolbar.push('/');
            }

            var height = size.y,
                width  = size.x;

            if (self.getAttribute('width')) {
                width = self.getAttribute('width');
            }

            if (self.getAttribute('height')) {
                height = self.getAttribute('height');
            }

            var zIndex = QUIElements.getComputedZIndex(Container);

            // parse styles to fckedit styles
            var entry, styles = [];

            if (!("styles" in data)) {
                data.styles = [];
            }

            for (i = 0, len = data.styles.length; i < len; i++) {
                entry = data.styles[i];

                styles.push({
                    name      : entry.text,
                    element   : entry.element,
                    attributes: entry.attributes
                });
            }

            if (!("cssFiles" in data)) {
                data.cssFiles = [];
            }

            data.cssFiles.push(
                URL_OPT_DIR + 'quiqqer/ckeditor4/bin/defaultWysiwyg.css'
            );

            data.cssFiles.push(
                URL_OPT_DIR + 'quiqqer/quiqqer/bin/css/fonts/font-awesome.min.css'
            );


            Settings.getConfig().then(function (config) {
                var plugins = config.plugins;

                plugins = self.$parseToolbarToPlugins(toolbar).concat(plugins);
                plugins = plugins.unique();

                var pluginPath   = config.pluginPath;
                var extraPlugins = plugins.join(",");

                var i, len, pluginName;

                for (i = 0, len = plugins.length; i < len; i++) {
                    pluginName = plugins[i];

                    if (!window.CKEDITOR.plugins.get(pluginName)) {
                        window.CKEDITOR.plugins.addExternal(
                            pluginName,
                            pluginPath + "/bin/" + pluginName + "/",
                            ""
                        );
                    }
                }

                window.CKEDITOR.replace(instance, {
                    skinName                 : 'moono-lisa',
                    customConfig             : '',
                    language                 : Locale.getCurrent(),
                    baseHref                 : URL_DIR,
                    basePath                 : URL_DIR,
                    height                   : height,
                    width                    : width,
                    toolbar                  : toolbar,
                    allowedContent           : true,
                    extraAllowedContent      : 'iframe(*)[*]{*}; img(*)[*]{*}; script(*)[*]{*}; ins(*)[*]{*}',
                    protectedSource          : [/<ins[\s|\S]+?<\/ins>/g],
                    stylesSet                : styles,
                    contentsCss              : data.cssFiles || [],
                    bodyClass                : data.bodyClass,
                    // templates_files : [URL_OPT_DIR +'base/bin/pcsgEditorPlugins/templates.php'],
                    baseFloatZIndex          : zIndex,
                    extraPlugins             : extraPlugins,
                    //removePlugins            : 'scayt',
                    disableNativeSpellChecker: config.disableNativeSpellChecker,
                    autoGrow_onStartup       : false,
                    resize_enabled           : false
                });

                // because of font awesome
                window.CKEDITOR.dtd.$removeEmpty.span = false;
                window.CKEDITOR.dtd.$removeEmpty.i    = false;
            });

        },

        /**
         * Editor onDestroy Event
         *
         * @param {Object} Editor - controls/editors/Editor
         */
        $onDestroy: function (Editor) {
            var Instance = Editor.getInstance();

            if (!Instance || !(name in Instance)) {
                return;
            }

            if (window.CKEDITOR.instances[Instance.name]) {
                try {
                    window.CKEDITOR.instances[Instance.name].destroy(true);
                } catch (e) {
                }

                window.CKEDITOR.instances[Instance.name] = null;
                delete window.CKEDITOR.instances[Instance.name];


                window.CKEDITOR.removeListener(
                    'instanceReady',
                    this.$onInstanceReadyListener
                );
            }
        },

        /**
         * event : instance ready
         * @param instance
         */
        $onInstanceReadyListener: function (instance) {
            if (typeof instance.editor === 'undefined' ||
                typeof instance.editor.name === 'undefined' ||
                instance.editor.name !== this.getAttribute('instancename')) {
                return;
            }

            // resize the editor
            var Container     = this.getContainer(),
                containerSize = Container.getSize();

            // fckeditor resize, setHeight is sooooooooooo mysterious
            instance.editor.resize(containerSize.x, containerSize.y);

            this.setInstance(instance.editor);
            this.fireEvent('loaded', [this, instance.editor]);

            instance.editor.focus();
        },

        /**
         * event : on resize
         */
        $onResize: function () {
            var Container     = this.getContainer(),
                Instance      = this.getInstance(),
                containerSize = Container.getSize();

            Instance.resize(containerSize.x, containerSize.y);
        },

        /**
         * Editor onSetContent Event
         *
         * @param {String} content
         * @param {Object} Editor - controls/editors/Editor
         */
        $onSetContent: function (content, Editor) {
            if (Editor.getInstance()) {
                Editor.getInstance().setData(content);
            }
        },

        /**
         * Editor onGetContent Event
         *
         * @param {Object} Editor - controls/editors/Editor
         */
        $onGetContent: function (Editor) {
            if (Editor.getInstance()) {
                Editor.setAttribute('content', Editor.getInstance().getData());
            }
        },

        /**
         * Set the focus to the editor
         */
        focus: function () {
            if (this.getInstance()) {
                this.getInstance().focus();
            }
        },

        /**
         * Switch to source mode
         */
        switchToSource: function () {
            if (this.getInstance()) {
                this.getInstance().setMode('source');
            }
        },

        /**
         * Switch to wysiwyg editor
         */
        switchToWYSIWYG: function () {
            if (this.getInstance()) {
                this.getInstance().setMode('wysiwyg');
            }
        },

        /**
         * Hide the toolbar
         */
        hideToolbar: function () {
            var Toolbar = this.getElm().getElement('.cke_top');

            if (Toolbar) {
                Toolbar.setStyle('display', 'none');
            }
        },

        /**
         * show the toolbar
         */
        showToolbar: function () {
            var Toolbar = this.getElm().getElement('.cke_top');

            if (Toolbar) {
                Toolbar.setStyle('display', null);
            }
        },

        /**
         * Set the height of the instance
         *
         * @param {Number} height
         */
        setHeight: function (height) {
            if (this.getInstance()) {
                this.getInstance().resize(false, height);
            }

            this.setAttribute('height', height);
        },

        /**
         * Set the height of the instance
         *
         * @param {Number} width
         */
        setWidth: function (width) {
            if (this.getInstance()) {
                this.getInstance().resize(width, false);
            }

            this.setAttribute('width', width);
        },

        /**
         * event : on add css
         *
         * @param {String} file - path to the css file
         * @param {Object} Editor - controls/editor/Editor
         */
        $onAddCSS: function (file, Editor) {
            var Instance = this.getInstance();

            this.$cssFiles[file] = true;

            if (Instance) {
                var Doc  = Editor.getDocument(),
                    Link = Doc.createElement('link');

                Link.href = file;
                Link.rel  = "stylesheet";
                Link.type = "text/css";

                Doc.head.appendChild(Link);
            }
        },

        /**
         * event : on Drop
         * @param {Object} params
         */
        $onDrop: function (params) {
            var Instance = this.getInstance();

            for (var i = 0, len = params.length; i < len; i++) {
                Instance.insertHtml("<img src=" + params[i].url + " />");
            }
        },

        /**
         * Generate the extra plugins option in dependence of the toolbar
         * @param toolbar
         *
         * @return Array
         */
        $parseToolbarToPlugins: function (toolbar) {
            var extra      = [],
                buttonList = [];

            if (typeOf(toolbar) == 'array') {
                buttonList = toolbar.flatten();
            }

            for (var i = 0, len = buttonList.length; i < len; i++) {
                switch (buttonList[i]) {
                    case 'Templates':
                        extra.push('templates');
                        break;

                    case 'Find':
                    case 'Replace':
                        extra.push('find');
                        break;

                    case 'SelectAll':
                        extra.push('selectall');
                        break;

                    case 'Form':
                    case 'Checkbox':
                    case 'Radio':
                    case 'TextField':
                    case 'Textarea':
                    case 'Select':
                    case 'Button':
                    case 'ImageButton':
                    case 'HiddenField':
                        extra.push('forms');
                        break;

                    case 'CreateDiv':
                        extra.push('div');
                        break;

                    case 'JustifyLeft':
                    case 'JustifyCenter':
                    case 'JustifyRight':
                    case 'JustifyBlock':
                        extra.push('justify');
                        break;

                    case 'BidiLtr':
                    case 'BidiRtl':
                        extra.push('bidi');
                        break;

                    case 'Language':
                        extra.push('language');
                        break;

                    case 'Link':
                    case 'Unlink':
                    case 'Anchor':
                        extra.push('link');
                        break;

                    case 'Flash':
                        extra.push('flash');
                        break;

                    case 'Smiley':
                        extra.push('smiley');
                        break;

                    case 'PageBreak':
                        extra.push('pagebreak');
                        break;

                    case 'Iframe':
                        extra.push('iframe');
                        break;

                    case 'Font':
                    case 'FontSize':
                        extra.push('font');
                        break;

                    case 'BGColor':
                    case 'TextColor':
                        extra.push('colorbutton');
                        break;
                    case 'Code':
                        extra.push('codetag');
                        break;
                    case 'Image':
                        extra.push('image');
                        break;
                    case 'Zoom':
                        extra.push('zoom');
                        break;
                    case 'Youtube':
                        extra.push('youtube');
                        break;
                    case 'Videodetector':
                        extra.push('videodetector');
                        break;
                    case 'Tweetabletext':
                        extra.push('tweetabletext');
                        break;
                    case 'Createtoken':
                        extra.push('token');
                        break;
                    case 'TransformTextSwitcher':
                    case 'TransformTextToLowercase':
                    case 'TransformTextToUppercase':
                    case 'TransformTextCapitalize':
                        extra.push('texttransform');
                        break;
                    case 't2s_button':
                        extra.push('text2speech');
                        break;
                    case 'Symbol':
                        extra.push('symbol');
                        break;
                    case 'pre':
                        extra.push('pre');
                        break;
                    case 'pbckeditor':
                        extra.push('pbckeditor');
                        break;
                    case 'page2images':
                        extra.push('page2images');
                        break;
                    case 'Markdown':
                        extra.push('markdown');
                        break;
                    case 'Loremipsum':
                        extra.push('loremipsum');
                        break;
                    case 'inserthtml4x':
                        extra.push('inserthtml4x');
                        break;
                    case 'Html5Video':
                        extra.push('html5video');
                        break;
                    case 'Html5Audio':
                        extra.push('html5audio');
                        break;
                    case 'EqnEditor':
                        extra.push('eqneditor');
                        break;
                    case 'cssanim':
                        extra.push('cssanim');
                        break;
                    case 'WebSpeechEnabled':
                    case 'WebSpeechSettings':
                        extra.push('ckwebspeech');
                        break;
                    case 'base64image':
                        extra.push('base64image');
                        break;
                    case 'AutoCorrect':
                        extra.push('autocorrect');
                        break;
                }
            }

            return extra;
        },


        /**
         * edit the image dialog
         *
         * @param {DOMEvent} ev - CKEvent
         * @return {DOMEvent} ev (CKEvent)
         */
        $imageDialog: function (ev) {

            // Take the dialog name and its definition from the event data.
            var self             = this,
                dialogName       = ev.data.name,
                dialogDefinition = ev.data.definition;

            /**
             * Image dialog
             */
            if (dialogName !== 'image') {
                return ev;
            }


            var oldOnShow = dialogDefinition.onShow;

            // Get a reference to the "Link Info" tab.
            dialogDefinition.onShow = function () {
                var Button;

                oldOnShow.bind(this)();

                // image button
                var UrlGroup = this.getContentElement('info', 'txtUrl')
                                   .getElement().$;

                var UrlInput = UrlGroup.getElement('input[type="text"]');

                var HeightInput = this.getContentElement('info', 'txtHeight')
                                      .getElement().$
                                      .getElement('input[type="text"]');

                var WidthInput = this.getContentElement('info', 'txtWidth')
                                     .getElement().$
                                     .getElement('input[type="text"]');


                UrlGroup.getElement('label').setStyles({
                    'float': 'left',
                    'width': '100%'
                });

                if (!UrlGroup.getElement('.qui-button')) {
                    Button = new Element('button', {
                        'class': 'qui-button',
                        html   : '<span class="fa fa-picture-o"></span>',
                        events : {
                            click: function () {
                                self.openMedia({
                                    events: {
                                        onSubmit: function (Win, data) {
                                            UrlInput.value = data.url;

                                            Ajax.get('ajax_media_details', function (fileData) {
                                                if (fileData.image_height > 500 ||
                                                    fileData.image_width > 500) {
                                                    var result = QUIMath.resizeVar(
                                                        fileData.image_height,
                                                        fileData.image_width,
                                                        500
                                                    );
                                                    // es darf keine image height gesetzt
                                                    // da das Bild sonst im mobile view sich verzieht
                                                    // HeightInput.value = result.var1;
                                                    WidthInput.value = result.var2;
                                                } else {
                                                    // HeightInput.value = fileData.image_height;
                                                    WidthInput.value = fileData.image_width;
                                                }

                                                // if (!fileData.image_height) {
                                                //     HeightInput.value = '';
                                                // }

                                                if (!fileData.image_width) {
                                                    WidthInput.value = '';
                                                }
                                            }, {
                                                project: data.project,
                                                fileid : data.id
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }).inject(UrlGroup);

                    Button.getPrevious().setStyles({
                        'float': 'left'
                    });
                }


                // link button
                var LinkGroup = this.getContentElement('Link', 'txtUrl')
                                    .getElement()
                    .$;


                if (LinkGroup.getElement('.qui-button')) {
                    return;
                }

                var LinkInput = LinkGroup.getElement('input[type="text"]');

                Button = new Element('button', {
                    'class': 'qui-button',
                    html   : '<span class="fa fa-home"></span>',
                    events : {
                        click: function () {
                            self.openProject({
                                events: {
                                    onSubmit: function (Win, data) {
                                        LinkInput.value = data.urls[0];
                                    }
                                }
                            });
                        }
                    }
                }).inject(LinkGroup);


                var Prev = Button.getPrevious();

                Prev.setStyles({
                    'float': 'left',
                    width  : Prev.getSize().x - 100
                });
            };

            return ev;
        },

        /**
         * edit the link dialog
         *
         * @param {DOMEvent} ev - CKEvent
         * @return {DOMEvent} ev - CKEvent
         */
        $linkDialog: function (ev) {
            // Take the dialog name and its definition from the event data.
            var dialogName = ev.data.name;

            /**
             * Link dialog
             */
            if (dialogName != 'link') {
                return ev;
            }

            // remove protokoll dropdown
            //dialogDefinition.getContents( 'info' ).remove( 'protocol');

            // remove protokoll at insertion
            var Protokoll;

            var dialogDefinition = ev.data.definition,
                Url              = dialogDefinition.getContents('info').get('url'),
                orgCommit        = Url.commit;

            Url.commit = function (data) {
                orgCommit.call(this, data);

                Protokoll = dialogDefinition.dialog
                                            .getContentElement('info', 'protocol')
                                            .getElement()
                                            .$
                                            .getElement('select');

                data.url = {
                    protocol: Protokoll.value,
                    url     : this.getValue()
                };
            };

            var self      = this,
                oldOnShow = dialogDefinition.onShow;


            self.$turnLinkRelInputToSelect(dialogDefinition);

            // Get a reference to the "Link Info" tab.
            dialogDefinition.onShow = function () {
                oldOnShow.bind(this)();

                var UrlGroup = this.getContentElement('info', 'url')
                                   .getElement()
                    .$;

                if (UrlGroup.getElement('.qui-button')) {
                    return;
                }

                var UrlInput = UrlGroup.getElement('input[type="text"]');

                Protokoll = this.getContentElement('info', 'protocol')
                                .getElement()
                                .$
                                .getElement('select');

                UrlInput.setStyles({
                    'float': 'left',
                    width  : UrlInput.getSize().x - 100
                });

                var Links = new Element('button', {
                    'class': 'qui-button',
                    html   : '<span class="fa fa-home"></span>',
                    events : {
                        click: function () {
                            self.openProject({
                                events: {
                                    onSubmit: function (Win, data) {
                                        UrlInput.value  = data.urls[0];
                                        Protokoll.value = '';
                                    }
                                }
                            });
                        }
                    }
                }).inject(UrlInput, 'after');

                // image button
                new Element('button', {
                    'class': 'qui-button',
                    html   : '<span class="fa fa-picture-o"></span>',
                    events : {
                        click: function () {
                            self.openMedia({
                                events: {
                                    onSubmit: function (Win, data) {
                                        UrlInput.value  = data.url;
                                        Protokoll.value = '';
                                    }
                                }
                            });
                        }
                    }
                }).inject(Links, 'after');
            };

            return ev;
        },

        /**
         * Extends the Html5Audio Dialog
         *
         * @param {DOMEvent} ev - CKEvent
         * @return {DOMEvent} ev - CKEvent
         */
        $html5AudioDialog: function (ev) {

            var dialogname       = ev.data.name,
                dialogDefinition = ev.data.definition,
                Button           = null;

            if (dialogname !== "html5audio") {
                return ev;
            }

            var self = this;

            var oldOnShow = dialogDefinition.onShow || function () {
            };

            dialogDefinition.onShow = function () {
                oldOnShow.bind(this)();

                var UrlGroup = this.getContentElement("info", "url").getElement().$;

                if (UrlGroup.getElement('.qui-button')) {
                    return;
                }

                var UrlInput = UrlGroup.getElement('input[type="text"]');


                Button = new Element('button', {
                    'class': 'qui-button',
                    html   : '<span class="fa fa-picture-o"></span>',
                    events : {
                        click: function () {
                            self.openMedia({
                                events: {
                                    onSubmit: function (Win, data) {
                                        UrlInput.value = data.url;
                                    }
                                }
                            });
                        }
                    },
                    style  : {
                        float: "left"
                    }
                }).inject(UrlGroup);


                var Label = UrlGroup.getElement("label");

                Label.setStyles({
                    width  : "100%",
                    display: "block"
                });

                Button.getPrevious().setStyles({
                    'width': '85%',
                    float  : "left"
                });
            };

            return ev;
        },


        $html5VideoDialog: function (ev) {
            var dialogname       = ev.data.name,
                dialogDefinition = ev.data.definition,
                Button           = null;


            if (dialogname !== "html5video") {
                return ev;
            }

            var self = this;

            var oldOnShow = dialogDefinition.onShow || function () {
            };

            dialogDefinition.onShow = function () {
                oldOnShow.bind(this)();

                var UrlGroup = this.getContentElement("info", "url").getElement().$;

                if (UrlGroup.getElement('.qui-button')) {
                    return;
                }

                var UrlInput = UrlGroup.getElement('input[type="text"]');


                Button = new Element('button', {
                    'class': 'qui-button',
                    html   : '<span class="fa fa-picture-o"></span>',
                    events : {
                        click: function () {
                            self.openMedia({
                                events: {
                                    onSubmit: function (Win, data) {
                                        UrlInput.value = data.url;
                                    }
                                }
                            });
                        }
                    }
                }).inject(UrlGroup);


                Button.getPrevious().setStyles({
                    'width': '85%',
                    'float': 'left'
                });
            };

            return ev;
        },

        /**
         * Turns the "relation" text-input to a select-input.
         * Returns as a boolean if the operation was successful.
         *
         * @see "quiqqer/ckeditor4#28"
         *
         * @param DialogDefinition
         *
         * @return boolean
         */
        $turnLinkRelInputToSelect: function (DialogDefinition) {
            var AdvancedTab = DialogDefinition.getContents("advanced");

            if (!AdvancedTab) {
                return false;
            }

            var RelationInput = AdvancedTab.get('advRel');

            if (!RelationInput) {
                return false;
            }

            if (RelationInput) {
                RelationInput.type  = 'select';
                RelationInput.items = [
                    ['alternate'],
                    ['author'],
                    ['bookmark'],
                    ['external'],
                    ['help'],
                    ['license'],
                    ['next'],
                    ['nofollow'],
                    ['noreferrer'],
                    ['noopener'],
                    ['prev'],
                    ['search'],
                    ['tag']
                ];
            }

            return true;
        }

    });
});
