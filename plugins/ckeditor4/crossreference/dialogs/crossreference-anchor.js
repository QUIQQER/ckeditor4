CKEDITOR.dialog.add('crossreference-anchor-dialog', function(editor) {
	
	var config = editor.config.crossreference;
	
	var generateUUID = function() {
		var d = new Date().getTime();
		if(window.performance && typeof window.performance.now === "function"){
			d += performance.now(); // use high-precision timer if available
		}
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	};
	
	return {
		title : editor.lang.crossreference.anchor,
		minWidth : 400,
		minHeight : 150,
		
		contents : [ 
			{
				id : 'tab-main',
				label : editor.lang.crossreference.anchor,
				elements : [ 
					{
						type : 'vbox',
						widths : [ '100%' ],
						children : [
							{
								type : 'html',
								id : 'description',
								html : '<div style="white-space: normal; text-align: justify;">' + editor.lang.crossreference.anchorDescription + '</div>',
							},
							{
								type : 'select',
								id : 'type',
								width: '100%',
								label : editor.lang.crossreference.anchorType,
								items : [],
								required: true,
								items : [['']],
								onLoad: function() {
									this.getInputElement().setStyle('width', '100%');
									for (var typeName in config.types) {
										var type = config.types[typeName];
										var label = type.name;
										if (type.allowCreateAnchors == false)
											continue;
										this.add(label, type.type);
									}
								},
								setup: function(element) {
									this.setValue(element.getAttribute('cross-reference'));
								},
								commit: function(element) {
									element.setAttribute('cross-reference', this.getValue());
									element.setAttribute('cross-anchor', '');
								}
							},
							{
								type : 'text',
								id : 'name',
								width: '100%',
								label : editor.lang.crossreference.anchorName,
								required: true,
								setup: function(element) {
									this.setValue(element.getAttribute('cross-name'));
								},
								commit: function(element) {
									element.setAttribute('cross-name', this.getValue());
								}
							}
						]
					} 
				]
			} 
		],
		
		onLoad : function() {
		
		},
		
		onShow : function() {
			var selection = editor.getSelection();
			this.element = selection.getStartElement();
			if (this.element)
				this.element = this.element.getAscendant('a', true);
			if (!this.element || this.element.getName() != 'a' || !this.element.hasAttribute('cross-anchor')) {
				this.element = editor.document.createElement('a');
				var guid = generateUUID();
				this.element.setAttribute('cross-guid', guid);
				this.insertMode = true;
			} else {
				this.insertMode = false;
			}
			
			if (this.insertMode)
				this.setValueOf('tab-main', 'name', selection.getSelectedText().trim());
			else
				this.setupContent(this.element);
		},
		
		onOk : function() {
			if (!this.getValueOf('tab-main', 'type'))
				return;
			
			this.commitContent(this.element);
			
			if (this.insertMode)
				editor.insertElement(this.element);
			
			editor.execCommand('update-crossreferences');
		}
		
	};
});
