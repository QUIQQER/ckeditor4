/**
 * Copyright (c) 2016, SmartCore Studio.
 * Licensed under the terms of the MIT License.
*/

CKEDITOR.dialog.add('pre', function( editor ) {
	return {
		title: editor.lang.pre.dialogTitle,
		minWidth: 300,
		minHeight: 100,
		contents: [
		{
			id: 'info',
			label: editor.lang.pre.tab,
			elements: [
			{
				id: 'title',
				type: 'text',
				label: editor.lang.pre.title,
				setup: function( widget ) {
					this.setValue( widget.data.title );
				},
				commit: function( widget ) {
					widget.setData( 'title', this.getValue() );
				}
			},
			{
				type: 'hbox',
				widths: ['50%', '50%'],
				children: [				
				{
					type: 'vbox',
					children: [
					{
						id: 'color',
						type: 'select',
						label: editor.lang.pre.color,
						items: [
							[ editor.lang.pre.colorDefault, '' ],
							[ editor.lang.pre.colorGray, 'Gray' ],
							[ editor.lang.pre.colorBlack, 'Black' ]
						],
						setup: function( widget ) {
							this.setValue( widget.data.color );
						},
						commit: function( widget ) {
							widget.setData( 'color', this.getValue() );
						}
					},
					{
						id: 'maxheight',
						type: 'select',
						label: editor.lang.pre.maxheight,
						items: [
							[ editor.lang.pre.maxheightDefault, '' ],
							[ '100px', '100px' ],
							[ '200px', '200px' ],
							[ '300px', '300px' ]
						],
						setup: function( widget ) {
							this.setValue( widget.data.maxheight );
						},
						commit: function( widget ) {
							widget.setData( 'maxheight', this.getValue() );
						}
					},
					{
						id: 'cssclass',
						type: 'text',
						label: editor.lang.pre.cssclass,
						setup: function( widget ) {
							this.setValue( widget.data.cssclass );
						},
						commit: function( widget ) {
							widget.setData( 'cssclass', this.getValue() );
						}
					}]
				},
				{
					type: 'vbox',
					styles: ['vertical-align:top'],
					children: [
					{
						id: 'hidesummary',
						type: 'checkbox',
						label: editor.lang.pre.hidesummary,
						setup: function( widget ) {
							this.setValue( widget.data.hidesummary );
						},
						commit: function( widget ) {
							widget.setData( 'hidesummary', this.getValue()?'true':'' );
						}
					},
					{
						id: 'collapse',
						type: 'checkbox',
						label: editor.lang.pre.collapse,
						setup: function( widget ) {
							this.setValue( widget.data.collapse );
						},
						commit: function( widget ) {
							widget.setData( 'collapse', this.getValue()?'true':'' );
						}
					},
					{
						id: 'monospace',
						type: 'checkbox',
						label: editor.lang.pre.monospace,
						setup: function( widget ) {
							this.setValue( widget.data.monospace );
						},
						commit: function( widget ) {
							widget.setData( 'monospace', this.getValue()?'true':'' );
						}
					},
					{
						id: 'wrap',
						type: 'checkbox',
						label: editor.lang.pre.wrap,
						setup: function( widget ) {
							this.setValue( widget.data.wrap );
						},
						commit: function( widget ) {
							widget.setData( 'wrap', this.getValue()?'true':'' );
						}
					},
					{
						id: 'bordered',
						type: 'checkbox',
						label: editor.lang.pre.bordered,
						setup: function( widget ) {
							this.setValue( widget.data.bordered );
						},
						commit: function( widget ) {
							widget.setData( 'bordered', this.getValue()?'true':'' );
						}
					}]
				}]
			}]
		}]
	}
})
