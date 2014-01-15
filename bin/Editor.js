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
    'controls/editors/Editor'

], function(require, Editor)
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
         * @param {QUI.controls.editor.Editor} Editor
         */
        loadInstance : function(Container, Editor)
        {
            if ( typeof CKEDITOR === 'undefined' ) {
                return;
            }

            var Instance = Container;

            if ( Instance.nodeName != 'TEXTAREA' ) {
                Instance = Instance.getElement( 'textarea' );
            }

            var instance = Instance.get( 'id' );

            if ( CKEDITOR.instances[ instance ] ) {
                CKEDITOR.instances[ instance ].destroy( true );
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
            CKEDITOR.replace(instance, {
                language     : QUI.Locale.getCurrent(),
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

            if ( CKEDITOR.instances[ Instance.name ] ) {
                CKEDITOR.instances[ Instance.name ].destroy( true );
            }
        },

        /**
         * Editor onDraw Event
         * if the editor is to be drawn
         *
         * @param {DOMNode} Container
         * @param {QUI.classes.Editor} Editor
         */
        $onDraw : function(Container, Editor)
        {
            // load CKEDITOR
            require([

                URL_DIR +'packages/quiqqer/ckeditor4/bin/ckeditor/ckeditor.js'

            ], function(CKE)
            {
                // CKEditor aufbauen
                CKEDITOR_BASEPATH = URL_DIR;
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

                CKEDITOR.on('instanceReady', function(instance)
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

                }.bind( Editor ));

                Editor.loadInstance( Container, Editor );

            }.bind( this ));
        },

        /**
         * Editor onSetContent Event
         *
         * @param {String} content
         * @param {QUI.classes.Editor} Editor
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
         * @param {QUI.classes.Editor} Editor
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