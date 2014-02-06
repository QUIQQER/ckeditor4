/**
 * ckeditor4 for QUIQQER
 *
 * @author www.pcsg.de (Henning Leutz)
 *
 * @module package/ckeditor4/bin/Editor
 * @package package/ckeditor4/bin/Editor
 */

define('package/quiqqer/ckeditor4/bin/Editor', [

    'require',
    'controls/editors/Editor',
    'Locale',

    'css!package/quiqqer/ckeditor4/bin/Editor.css'

], function(require, Editor, Locale)
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
             '$onDrop'
        ],

        initialize : function(Manager, options)
        {
            this.parent( Manager, options );

            this.addEvents({
                onDestroy    : this.$onDestroy,
                onDraw       : this.$onDraw,
                onSetContent : this.$onSetContent,
                onGetContent : this.$onGetContent,
                onDrop       : this.$onDrop
            });
        },

        /**
         * Load the CKEditor Instance into an Textarea or DOMNode Element
         *
         * @param {DOMNode} Container
         * @param {controls/editor/Editor} Editor
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
                var size = Container.getSize(),

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

            /*
            CKEDITOR.plugins.addExternal(
                'pcsg_image',
                URL_OPT_DIR +'base/bin/pcsgEditorPlugins/image/'
            );

            CKEDITOR.plugins.addExternal(
                'pcsg_link',
                URL_OPT_DIR +'base/bin/pcsgEditorPlugins/link/'
            );

            CKEDITOR.plugins.addExternal(
                'pcsg_short',
                URL_OPT_DIR +'base/bin/pcsgEditorPlugins/short/'
            );

            CKEDITOR.plugins.addExternal(
                'pcsg_youtube',
                URL_OPT_DIR +'base/bin/pcsgEditorPlugins/youtube/'
            );
            */

            // http://docs.ckeditor.com/#!/guide/dev_howtos_dialog_windows
            window.CKEDITOR.on( 'dialogDefinition', function( ev )
            {
                // Take the dialog name and its definition from the event data.
                var dialogName = ev.data.name;
                var dialogDefinition = ev.data.definition;

                /**
                 * Image dialog
                 */
                if ( dialogName == 'image' )
                {
                    // Get a reference to the "Link Info" tab.
                    dialogDefinition.onShow = function()
                    {
                        var UrlGroup = this.getContentElement('info', 'txtUrl' )
                                           .getElement()
                                           .$;

                        var UrlInput = UrlGroup.getElement( 'input[type="text"]' );

                        if ( !UrlGroup.getElement( '.qui-button' ) )
                        {
                            var Button = new Element('button', {
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
                    };
                }
            });


            window.CKEDITOR.replace(instance, {
                language     : Locale.getCurrent(),
                baseHref     : URL_DIR,
                height       : Instance.getSize().y - 140,
                width        : Instance.getSize().x + 20,
                // toolbar      : CKEDITOR_NEXGAM_TOOLBAR,
                // contentsCss  : CKEDITOR_NEXGAM_CSS,
                // bodyClass    : CKEDITOR_NEXGAM_BODY_CLASS,
                // plugins      : CKEDITOR_NEXGAM_PLUGINS,
                // templates_files : [URL_OPT_DIR +'base/bin/pcsgEditorPlugins/templates.php'],
                baseFloatZIndex : 100
            });
        },

        /**
         * Editor onDestroy Event
         *
         * @param {QUI.classes.Editor} Editor
         */
        $onDestroy : function(Editor)
        {
            var Instance = Editor.getInstance();

            if ( window.CKEDITOR.instances[ Instance.name ] ) {
                window.CKEDITOR.instances[ Instance.name ].destroy( true );
            }
        },

        /**
         * Editor onDraw Event
         * if the editor is to be drawn
         *
         * @param {DOMNode} Container
         * @param {controls/editors/Editor} Editor
         */
        $onDraw : function(Container, Editor)
        {
            var self = this;

            // load CKEDITOR
            require([URL_OPT_DIR +'bin/package-ckeditor4/ckeditor.js'], function()
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

                window.CKEDITOR.on('instanceReady', function(instance)
                {
                    if ( typeof instance.editor === 'undefined' ||
                         typeof instance.editor.name  === 'undefined' ||
                         instance.editor.name !== Editor.getAttribute( 'instancename' ) )
                    {
                        return;
                    }

                    Editor.setInstance( instance.editor );
                    Editor.fireEvent( 'loaded', [ Editor, instance.editor ] );

                    instance.editor.focus();

                });

                Editor.loadInstance( Container, Editor );
            });
        },

        /**
         * Editor onSetContent Event
         *
         * @param {String} content
         * @param {controls/editors/Editor} Editor
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
         * @param {String} content
         * @param {controls/editors/Editor} Editor
         */
        $onGetContent : function(Editor)
        {
            if ( Editor.getInstance() ) {
                Editor.setAttribute( 'content', Editor.getInstance().getData() );
            }
        },

        /**
         *
         * @param {Object} params
         */
        $onDrop : function(params)
        {
            var Instance = this.getInstance();

            for ( var i = 0, len = params.length; i < len; i++ ) {
                Instance.insertHtml( "<img src="+ params[ i ].url +" />" );
            }
        }
    });
});