/*
 *  # Google this term Plugin for CKEditor #
 *
 *  (C) Copyright Ahmad Faiyaz (all rights reserverd)
 *  MIT License
 *
 *
*/


/*
* A simple plugin to add button to the CKEditor context menu. By clicking the
* button one can search selected text on the google on new tab
*/


(function() {
	CKEDITOR.plugins.add('googlethisterm', {
        init: function(editor) {
        	if (editor.contextMenu) {
			    editor.addMenuGroup('googleTermGroup');
			    editor.addMenuItem('googleTermItem', {
			        label: 'Google this term',
			        onClick : function(){
			        	var sel = editor.getSelection();
			        	var url = "https://www.google.com/search?gws_rd=ssl&q="+sel.getSelectedText();
			        	window.open(url, '_blank');
			        },
			        group: 'googleTermGroup'
			    });
			    
			    editor.contextMenu.addListener( function( element ) {
			    	var sel = editor.getSelection();
			        if ( !(sel.getSelectedText()=="") ) {
			            return { googleTermItem: CKEDITOR.TRISTATE_OFF };
			        }
			    });
			}
        }
    });
})();
