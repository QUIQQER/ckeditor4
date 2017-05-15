/**
 * Copyright (c) 2016, SmartCore Studio.
 * Licensed under the terms of the MIT License.
*/

CKEDITOR.plugins.add( 'pre', {
	requires: 'widget,dialog',
	lang : 'en,ru',
	icons: 'pre',
	init: function( editor ) {
		var preDefaultTitle = editor.config.preDefaultTitle;
		var preDefaultClass = editor.config.preDefaultClass || '';
		var preDefaults;
		if (editor.config.preDefaultMonospace!=false) preDefaults+= ' data-monospace="true"';
		if (editor.config.preDefaultHidesummary==true) preDefaults+= ' data-hidesummary="true"';
		if (editor.config.preDefaultCollapse==true) preDefaults+= ' data-collapse="true"';
		if (editor.config.preDefaultWrap==true) preDefaults+= ' data-wrap="true"';
		if (editor.config.preDefaultBordered==true) preDefaults+= 'data-bordered="true"';
		CKEDITOR.dialog.add( 'pre', this.path + 'dialogs/pre.js' );
		editor.ui.addButton('pre', {
			label: editor.lang.pre.button,
			command: 'pre',
			toolbar: 'insert'
		});
		editor.widgets.add( 'pre', {
			allowedContent:
				'details(*)[open,data-*]{*};' +
				'summary(!pre-title){*}; pre(*){*}',
			requiredContent: 'details',
			editables: {
				content: {
					selector: 'div.pre-content',
					allowedContent: 'br strong em a[href,target](*){*}'
				}
			},
			template:
				'<details class="pre" '+preDefaults+' data-cssclass="'+ preDefaultClass + '" open>' +
					'<summary class="pre-title" style="font-weight: bold">' + preDefaultTitle + '</summary>' +
					'<div class="pre-content" style="padding: 4px 12px; margin-top: 2px; font-family: monospace; white-space: pre; overflow: auto;">' + editor.lang.pre.content + '</div>' +
				'</details>',				
			dialog: 'pre',
			upcast: function( element ) {
				return element.name == 'details' && element.hasClass( 'pre' );
			},
			init: function() {
				var title = this.element.findOne('.pre-title').getText();
				if ( title )
					this.setData( 'title', title );
				
				var cssclass = this.element.getAttribute("data-cssclass");
				if ( cssclass )
					this.setData( 'cssclass', cssclass );
				
				var color = this.element.getAttribute("data-color");
				if ( color )
					this.setData( 'color', color );
				else
					this.setData( 'color', '' );

				var maxheight = this.element.getAttribute("data-maxheight");
				if ( maxheight )
					this.setData( 'maxheight', maxheight );
				else
					this.setData( 'maxheight', '' );

				var hidesummary = this.element.getAttribute("data-hidesummary");
				if ( hidesummary )
					this.setData( 'hidesummary', hidesummary );

				var collapse = this.element.getAttribute("data-collapse");
				if ( collapse )
					this.setData( 'collapse', collapse );

				var monospace = this.element.getAttribute("data-monospace");
				if ( monospace )
					this.setData( 'monospace', monospace );

				var bordered = this.element.getAttribute("data-bordered");
				if ( bordered )
					this.setData( 'bordered', bordered );

				var wrap = this.element.getAttribute("data-wrap");
				if ( wrap )
					this.setData( 'wrap', wrap );
			},

			data: function() {
				if (typeof this.data.color !== 'undefined') 
				{
					this.element.setAttribute("data-color", this.data.color);
					if ( this.data.color == '' )
					{
						this.element.findOne('.pre-content').removeStyle( 'color' );
						this.element.findOne('.pre-content').removeStyle( 'background-color' );
					}
					else
					{
						if (this.data.color=='Gray')
						{
							this.element.findOne('.pre-content').setStyle( 'background-color', '#eee' );
							this.element.findOne('.pre-content').setStyle( 'color', '#000' );
						}
						if (this.data.color=='Black')
						{
							this.element.findOne('.pre-content').setStyle( 'background-color', '#000' );
							this.element.findOne('.pre-content').setStyle( 'color', '#FFF' );
						}
					}
				}
				
				if (typeof this.data.maxheight !== 'undefined') 
				{
					this.element.setAttribute("data-maxheight", this.data.maxheight);
					if ( this.data.maxheight == '' )
					{
						this.element.findOne('.pre-content').removeStyle( 'max-height' );
					}
					else
					{
						this.element.findOne('.pre-content').setStyle( 'max-height', this.data.maxheight );
					}
				}
				
				if (typeof this.data.monospace !== 'undefined') 
				{
					this.element.setAttribute("data-monospace", this.data.monospace);
					if ( this.data.monospace == '' )
					{
						this.element.findOne('.pre-content').removeStyle( 'font-family' );
					}
					else
					{
						this.element.findOne('.pre-content').setStyle( 'font-family', 'monospace' );
					}
				}
				
				if (typeof this.data.wrap !== 'undefined') 
				{
					this.element.setAttribute("data-wrap", this.data.wrap);
					if ( this.data.wrap == '' )
					{
						this.element.findOne('.pre-content').setStyle( 'white-space', 'pre' );
					}
					else
					{
						this.element.findOne('.pre-content').removeStyle( 'white-space' );
					}
				}
				
				if (typeof this.data.bordered !== 'undefined') 
				{
					this.element.setAttribute("data-bordered", this.data.bordered);
					if ( this.data.bordered == '' )
					{
						this.element.removeStyle( 'border');
						this.element.findOne('summary').removeStyle( 'padding' );
					}
					else
					{
						this.element.setStyle( 'border', '1px solid #ddd' );
						this.element.findOne('summary').setStyle( 'padding',  '2px 12px');
					}
				}
				
				if (typeof this.data.hidesummary !== 'undefined') 
				{
					this.element.setAttribute("data-hidesummary", this.data.hidesummary);
					if ( this.data.hidesummary == '' )
					{
						this.element.findOne('summary').removeStyle( 'display' );
					}
					else
					{
						this.element.findOne('summary').setStyle( 'display', 'none' );
					}
				}
				
				if (typeof this.data.title !== 'undefined') 
				{
					this.element.findOne('.pre-title').setText(this.data.title);
				}
				
				if (typeof this.data.cssclass !== '') 
				{
					if ( this.data.cssclass )
						this.element.setAttributes({'class': 'pre '+this.data.cssclass});
					else
						this.element.setAttributes({'class': 'pre'});
				}
				
				if (typeof this.data.collapse !== 'undefined') 
				{
					this.element.setAttribute("data-collapse", this.data.collapse);
					if ( this.data.collapse )
						this.element.removeAttribute( 'open' );
					else
						this.element.setAttribute( 'open' );
				}
			}
		});
	}
});
