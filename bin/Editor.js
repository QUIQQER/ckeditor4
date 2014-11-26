/**
 * ckeditor4 for QUIQQER
 *
 * @module package/quiqqer/ckeditor4/bin/Editor
 * @author www.pcsg.de (Henning Leutz)
 *
 * @require require
 * @require controls/editors/Editor
 * @require Locale
 * @require Ajax
 * @require qui/utils/Math
 * @require css!package/quiqqer/ckeditor4/bin/Editor.css
 */

define([

    'require',
    'controls/editors/Editor',
    'Locale',
    'Ajax',
    'qui/utils/Math',

    'css!package/quiqqer/ckeditor4/bin/Editor.css'

], function(require, Editor, Locale, Ajax, QUIMath)
{
    "use strict";

    return new Class({

        Extends : Editor,
        Type    : 'package/quiqqer/ckeditor4/bin/Editor',

        Binds : [
             '$onDestroy',
             '$onDraw',
             '$onSetContent',
             '$onGetContent',
             '$onDrop',
             '$onAddCSS',
             '$onInstanceReadyListener'
        ],

        initialize : function(Manager, options)
        {
            this.parent( Manager, options );

            this.$cssFiles = {};

            this.addEvents({
                onDestroy    : this.$onDestroy,
                onDraw       : this.$onDraw,
                onSetContent : this.$onSetContent,
                onGetContent : this.$onGetContent,
                onDrop       : this.$onDrop,
                onAddCSS     : this.$onAddCSS
            });
        },

        /**
         * Load the CKEditor Instance into an Textarea or DOMNode Element
         *
         * @param {HTMLElement} Container
         * @param {Object} Editor - controls/editors/Editor
         */
        loadInstance : function(Container, Editor)
        {
            if ( typeof window.CKEDITOR === 'undefined' ) {
                return;
            }

            var self     = this,
                Instance = Container;

            if ( !Container.getElement( 'textarea' ) )
            {
                var size = Container.getSize();

                Instance = new Element('textarea', {
                    id : this.getId(),
                    styles : {
                        height : size.y,
                        width : size.x - 20
                    }
                }).inject( Container );
            }

            if ( Instance.nodeName != 'TEXTAREA' ) {
                Instance = Instance.getElement( 'textarea' );
            }

            var instance = Instance.get( 'id' );

            if ( window.CKEDITOR.instances[ instance ] ) {
                window.CKEDITOR.instances[ instance ].destroy( true );
            }

            Editor.setAttribute( 'instancename', instance );

            // http://docs.ckeditor.com/#!/guide/dev_howtos_dialog_windows
            window.CKEDITOR.on( 'dialogDefinition', function( ev )
            {
                self.$imageDialog( ev );
                self.$linkDialog( ev );
            });

            this.getButtons(function(buttons)
            {
                // parse the buttons for the ckeditor
                var b, g, i, len, blen, glen, group, items,
                    buttonEntry, lineEntry, groupEntry;

                var lines   = buttons.lines || [],
                    toolbar = [];

                for ( i = 0, len = lines.length; i < len; i++ )
                {
                    items     = [];
                    lineEntry = lines[ i ];

                    // groups
                    for ( g = 0, glen = lineEntry.length; g < glen; g++ )
                    {
                        group      = [];
                        groupEntry = lineEntry[ g ];

                        // buttons
                        for ( b = 0, blen = groupEntry.length; b < blen; b++ )
                        {
                            buttonEntry = groupEntry[ b ];

                            if ( buttonEntry.type == 'seperator' )
                            {
                                group.push( '-' );
                                continue;
                            }

                            group.push( buttonEntry.button );
                        }

                        toolbar.push( group );
                    }

                    toolbar.push( '/' );
                }

                window.CKEDITOR.replace(instance, {
                    language : Locale.getCurrent(),
                    baseHref : URL_DIR,
                    basePath : URL_DIR,
                    height   : Instance.getSize().y - 140,
                    width    : Instance.getSize().x + 20,
                    toolbar  : toolbar,

                    allowedContent      : true,
                    extraAllowedContent : 'div(*)[*]{*}, iframe(*)[*]{*}',

                    contentsCss  : Object.keys( self.$cssFiles ),
                    bodyClass    : self.getAttribute( 'bodyClass' ),
                    // plugins      : CKEDITOR_NEXGAM_PLUGINS,
                    // templates_files : [URL_OPT_DIR +'base/bin/pcsgEditorPlugins/templates.php'],
                    baseFloatZIndex : 100
                });
            });
        },

        /**
         * Editor onDestroy Event
         *
         * @param {Object} Editor - controls/editors/Editor
         */
        $onDestroy : function(Editor)
        {
            var Instance = Editor.getInstance();

            if ( window.CKEDITOR.instances[ Instance.name ] )
            {
                try
                {
                    window.CKEDITOR.instances[ Instance.name ].destroy( true );

                } catch ( e ) {

                }

                window.CKEDITOR.instances[ Instance.name ] = null;
                delete window.CKEDITOR.instances[ Instance.name ];


                window.CKEDITOR.removeListener( 'instanceReady', this.$onInstanceReadyListener );
            }
        },

        /**
         * Editor onDraw Event
         * if the editor is to be drawn
         *
         * @param {HTMLElement} Container
         * @param {Object} Editor - controls/editors/Editor
         */
        $onDraw : function(Container, Editor)
        {
            var self = this;

            // load CKEDITOR
            require([ URL_OPT_DIR +'bin/package-ckeditor4/ckeditor.js' ], function()
            {
                /*
                CKEDITOR.editorConfig = function( config ) {
                    config.language = 'fr';
                    config.uiColor = '#AADC6E';
                };
                */


                // CKEditor aufbauen
                // CKEDITOR_BASEPATH = URL_DIR;
                /*
                CKEDITOR_NEXGAM_TOOLBAR = [
                    { name: 'clipboard', items : [ 'Source', ,'Maximize', '-','pcsg_short', 'Templates','-', 'Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
                    { name: 'basicstyles', items : [ 'Bold','Italic', 'Underline', 'Strike','-','Subscript','Superscript','-','RemoveFormat' ] },
                    { name: 'paragraph', items : [ 'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','NumberedList','BulletedList' ] },
                    { name: 'pcsg', items : [ 'pcsg_image','-', 'pcsg_link', 'pcsg_unlink' ] },
                    { name: 'blocks', items : [ 'Format', 'pcsg_youtube' ] }
                ];

                CKEDITOR_NEXGAM_PLUGINS = '' +
                    'basicstyles,blockquote,button,clipboard,contextmenu,div,elementspath,enterkey,entities,find,' +
                    'font,format,indent,justify,keystrokes,list,liststyle,maximize,pastefromword,' +
                    'pastetext,removeformat,showblocks,showborders,sourcearea,stylescombo,' +
                    'table,tabletools,specialchar,tab,templates,toolbar,undo,wysiwygarea,wsc,pcsg_image,pcsg_link,pcsg_short,pcsg_youtube';

                CKEDITOR_NEXGAM_CSS = [
                    URL_USR_DIR +"bin/nexgam3/css/reset.css",
                    URL_USR_DIR +"bin/nexgam3/css/style.css",
                    URL_USR_DIR +"bin/nexgam3/css/wysiwyg.css",
                    URL_USR_DIR +"bin/nexgam3/css/images.css",
                    URL_USR_DIR +"bin/nexgam3/css/review.css"
                ];

                CKEDITOR_NEXGAM_BODY_CLASS = 'content left content-inner-container wysiwyg';
                */

                window.CKEDITOR.on('instanceReady', self.$onInstanceReadyListener );

                Editor.loadInstance( Container, Editor );
            });
        },


        $onInstanceReadyListener : function(instance)
        {
            if ( typeof instance.editor === 'undefined' ||
                 typeof instance.editor.name  === 'undefined' ||
                 instance.editor.name !== this.getAttribute( 'instancename' ) )
            {
                return;
            }

            this.setInstance( instance.editor );
            this.fireEvent( 'loaded', [ this, instance.editor ] );

            instance.editor.focus();
        },


        /**
         * Editor onSetContent Event
         *
         * @param {String} content
         * @param {Object} Editor - controls/editors/Editor
         */
        $onSetContent : function(content, Editor)
        {
            if ( Editor.getInstance() ) {
                Editor.getInstance().setData( content );
            }
        },

        /**
         * Editor onGetContent Event
         *
         * @param {Object} Editor - controls/editors/Editor
         */
        $onGetContent : function(Editor)
        {
            if ( Editor.getInstance() ) {
                Editor.setAttribute( 'content', Editor.getInstance().getData() );
            }
        },

        /**
         * Set the focus to the editor
         */
        focus : function()
        {
            if ( this.getInstance() ) {
                this.getInstance().focus();
            }
        },

        /**
         * Switch to source mode
         */
        switchToSource : function()
        {
            if ( this.getInstance() ) {
                this.getInstance().setMode( 'source' );
            }
        },

        /**
         * Switch to wysiwyg editor
         */
        switchToWYSIWYG : function()
        {
            if ( this.getInstance() ) {
                this.getInstance().setMode( 'wysiwyg' );
            }
        },

        /**
         * Hide the toolbar
         */
        hideToolbar : function()
        {
            var Toolbar = this.getElm().getElement( '.cke_top' );

            if ( Toolbar ) {
                Toolbar.setStyle( 'display', 'none' );
            }
        },

        /**
         * show the toolbar
         */
        showToolbar : function()
        {
            var Toolbar = this.getElm().getElement( '.cke_top' );

            if ( Toolbar ) {
                Toolbar.setStyle( 'display', null );
            }
        },

        /**
         * Set the height of the instance
         *
         * @param {Number} height
         */
        setHeight : function(height)
        {
            if ( this.getInstance() ) {
                this.getInstance().resize( false, height );
            }
        },

        /**
         * event : on add css
         *
         * @param {String} file - path to the css file
         * @param {Object} Editor - controls/editor/Editor
         */
        $onAddCSS : function(file, Editor)
        {
            var Instance = Editor.getInstance();

            this.$cssFiles[ file ] = true;

            if ( Instance )
            {
                var Doc  = Editor.getDocument(),
                    Link = Doc.createElement('link');

                Link.href = file;
                Link.rel  = "stylesheet";
                Link.type = "text/css";

                Doc.head.appendChild( Link );
            }
        },

        /**
         * event : on Drop
         * @param {Object} params
         */
        $onDrop : function(params)
        {
            var Instance = this.getInstance();

            for ( var i = 0, len = params.length; i < len; i++ ) {
                Instance.insertHtml( "<img src="+ params[ i ].url +" />" );
            }
        },

        /**
         * edit the image dialog
         *
         * @param {DOMEvent} ev - CKEvent
         * @return {DOMEvent} ev (CKEvent)
         */
        $imageDialog : function(ev)
        {
            // Take the dialog name and its definition from the event data.
            var self             = this,
                dialogName       = ev.data.name,
                dialogDefinition = ev.data.definition;

            /**
             * Image dialog
             */
            if ( dialogName != 'image' ) {
                return ev;
            }

            var oldOnShow = dialogDefinition.onShow;

            // Get a reference to the "Link Info" tab.
            dialogDefinition.onShow = function()
            {
                var Button;

                oldOnShow.bind( this )();

                // image button
                var UrlGroup = this.getContentElement('info', 'txtUrl' )
                                   .getElement()
                                   .$;

                var UrlInput = UrlGroup.getElement( 'input[type="text"]' );

                var HeightInput = this.getContentElement('info', 'txtHeight' )
                                      .getElement().$
                                      .getElement( 'input[type="text"]' );

                var WidthInput = this.getContentElement('info', 'txtWidth' )
                                     .getElement().$
                                     .getElement( 'input[type="text"]' );


                if ( !UrlGroup.getElement( '.qui-button' ) )
                {
                    Button = new Element('button', {
                        'class' : 'qui-button',
                        html : '<span class="icon-picture"></span>',
                        events :
                        {
                            click : function()
                            {
                                self.openMedia({
                                    events :
                                    {
                                        onSubmit : function(Win, data)
                                        {
                                            UrlInput.value = data.url;

                                            Ajax.get('ajax_media_details', function(fileData)
                                            {
                                                if ( fileData.image_height > 500 ||
                                                     fileData.image_width > 500 )
                                                {
                                                    var result = QUIMath.resizeVar(
                                                        fileData.image_height,
                                                        fileData.image_width,
                                                        500
                                                    );

                                                    HeightInput.value = result.var1;
                                                    WidthInput.value  = result.var2;

                                                } else
                                                {
                                                    HeightInput.value = fileData.image_height;
                                                    WidthInput.value  = fileData.image_width;
                                                }

                                            }, {
                                                project : data.project,
                                                fileid  : data.id
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    }).inject( UrlGroup );

                    Button.getPrevious().setStyles({
                        'float' : 'left'
                    });
                }


                // link button
                var LinkGroup = this.getContentElement('Link', 'txtUrl' )
                                   .getElement()
                                   .$;


                if ( LinkGroup.getElement( '.qui-button' ) ) {
                    return;
                }

                var LinkInput = LinkGroup.getElement( 'input[type="text"]' );

                Button = new Element('button', {
                    'class' : 'qui-button',
                    html : '<span class="icon-home"></span>',
                    events :
                    {
                        click : function()
                        {
                            self.openProject({
                                events :
                                {
                                    onSubmit : function(Win, data) {
                                        LinkInput.value = data.urls[ 0 ];
                                    }
                                }
                            });
                        }
                    }
                }).inject( LinkGroup );

                var Prev = Button.getPrevious();

                Prev.setStyles({
                    'float' : 'left',
                    width : Prev.getSize().x - 100
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
        $linkDialog : function(ev)
        {
            // Take the dialog name and its definition from the event data.
            var dialogName = ev.data.name;

            /**
             * Link dialog
             */
            if ( dialogName != 'link' ) {
                return ev;
            }

            // remove protokoll dropdown
            //dialogDefinition.getContents( 'info' ).remove( 'protocol');

            // remove protokoll at insertion
            var Protokoll;

            var dialogDefinition = ev.data.definition,
                Url       = dialogDefinition.getContents( 'info' ).get( 'url' ),
                orgCommit = Url.commit;

            Url.commit = function( data )
            {
                orgCommit.call( this, data );

                Protokoll = dialogDefinition.dialog
                                            .getContentElement('info', 'protocol' )
                                            .getElement()
                                            .$
                                            .getElement('select');

                data.url = {
                    protocol : Protokoll.value,
                    url      : this.getValue()
                };
            };

            var self      = this,
                oldOnShow = dialogDefinition.onShow;

            // Get a reference to the "Link Info" tab.
            dialogDefinition.onShow = function()
            {
                oldOnShow.bind( this )();

                var UrlGroup = this.getContentElement('info', 'url' )
                                   .getElement()
                                   .$;

                if ( UrlGroup.getElement( '.qui-button' ) ) {
                    return;
                }

                var UrlInput  = UrlGroup.getElement( 'input[type="text"]' );

                Protokoll = this.getContentElement('info', 'protocol' )
                                .getElement()
                                .$
                                .getElement('select');

                UrlInput.setStyles({
                    'float' : 'left',
                    width   : UrlInput.getSize().x - 100
                });

                var Links = new Element('button', {
                    'class' : 'qui-button',
                    html    : '<span class="icon-home"></span>',
                    events  :
                    {
                        click : function()
                        {
                            self.openProject({
                                events :
                                {
                                    onSubmit : function(Win, data)
                                    {
                                        UrlInput.value  = data.urls[ 0 ];
                                        Protokoll.value = '';
                                    }
                                }
                            });
                        }
                    }
                }).inject( UrlInput, 'after' );

                // image button
                new Element('button', {
                    'class' : 'qui-button',
                    html    : '<span class="icon-picture"></span>',
                    events  :
                    {
                        click : function()
                        {
                            self.openMedia({
                                events :
                                {
                                    onSubmit : function(Win, data)
                                    {
                                        UrlInput.value = data.url;
                                        Protokoll.value = '';
                                    }
                                }
                            });
                        }
                    }
                }).inject( Links, 'after' );
            };

            return ev;
        }
    });
});
