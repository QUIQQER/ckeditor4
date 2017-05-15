CKEDITOR.plugins.add('crossreference', {
	lang : [ 'en', 'ru' ],
	requires : 'dialog,notification',
	icons : 'crossreference,crossreference-anchor,crossreference-link,crossreference-update',
	hidpi : true,
	init : function(editor) {
		
		// config
		
		var config = getConfig();
		editor.config.crossreference = config;
		
		// plugin
		
		var anchorAllowedContent = 'a[!cross-reference,cross-anchor,cross-guid,cross-name,cross-number]{*}(cross-reference,cross-anchor)';
		var anchorRequiredContent = 'a[cross-reference,cross-anchor]';
		var linkAllowedContent = 'a[!cross-reference,cross-link,cross-guid,cross-name,cross-number]{*}(cross-reference,cross-link)';
		var linkRequiredContent = 'a[cross-reference,cross-link]';
		editor.addFeature({
			name: 'crossreference-anchor',
			allowedContent: anchorAllowedContent,
			requiredContent: anchorRequiredContent
		});
		editor.addFeature({
			name: 'crossreference-link',
			allowedContent: linkAllowedContent,
			requiredContent: linkRequiredContent
		});
		editor.ui.add('crossreference', CKEDITOR.UI_MENUBUTTON, {
			label : editor.lang.crossreference.name,
			modes: {
				wysiwyg: 1,
				source: 1 
			},
			toolbar : 'insert',
			onMenu: function() {
				var selectedElement = null;
				
				var selection = editor.getSelection();
				if (selection) {
					var element = selection.getStartElement();
					if (element)
						element = element.getAscendant('a', true);
					if (element && element.hasAttribute('cross-reference')) {
						selectedElement = element;
					}
				}
				
				var state = getMenuState(selectedElement, true);
				return state;
			}
		});
		
		// dialogs
		
		var updateCmdName = 'update-crossreferences';
		var anchorDialogCmdName = 'crossreference-anchor-dialog';
		var linkDialogCmdName = 'crossreference-link-dialog';
		
		CKEDITOR.dialog.add(anchorDialogCmdName, this.path + 'dialogs/crossreference-anchor.js');
		CKEDITOR.dialog.add(linkDialogCmdName, this.path + 'dialogs/crossreference-link.js');
		
		editor.addCommand(anchorDialogCmdName, new CKEDITOR.dialogCommand(anchorDialogCmdName, {
			allowedContent: anchorAllowedContent,
			requiredContent: anchorRequiredContent
		}));
		editor.addCommand(linkDialogCmdName, new CKEDITOR.dialogCommand(linkDialogCmdName, {
			allowedContent: linkAllowedContent,
			requiredContent: linkRequiredContent
		}));

		// commands
		
		editor.addCommand(updateCmdName, {
			async: true,
			contextSensitive: false,
			editorFocus: false,
			modes: {
				wysiwyg: 1,
				source: 1
			},
			readOnly: true,
			exec: function(editor) {
				editor.setReadOnly(true);
				var notification = editor.showNotification(editor.lang.crossreference.updatingCrossReferences, 'progress', 0);
				
				var cmd = this;
				
				var typesCount = 0;
				var processedTypesCount = 0;
				for (var typeName in config.types) {
					typesCount++;
				}
				var linksCount = 0;
				
				var html = null;
				if (editor.mode == 'source')
					html = $('<div>' + editor.getData() + '</div>');
				else
					html = $(editor.editable().$);
				
				function finishCommand() {
					editor.setReadOnly(false);
					editor.fire('afterCommandExec', {
						name: updateCmdName,
						command: cmd
					});
					notification.update({
						type: 'success', 
						message: editor.lang.crossreference.updatedCrossReferences + linksCount,
						important: true
					});
				}
				
				if (typesCount == 0) {
					finishCommand();
					return;
				}
				
				for (var typeName in config.types) {
					config.findAnchors(config, editor, config.types[typeName], function(anchors) {
						notification.update({
							progress: (1 / typesCount) * processedTypesCount 
						});
						for (var i = 0; i < anchors.length; i++) {
							var anchor = anchors[i];
							var type = config.types[anchor.type];
							
							notification.update({
								progress: (1 / typesCount) * processedTypesCount + (1 / typesCount / anchors.length) * i
							});
							
							var aName = type.type + '-' + anchor.guid;
							
							var anchorElement = $('a[cross-reference="' + type.type + '"][cross-anchor][cross-guid="' + anchor.guid + '"]', html);
							if (anchorElement.length > 0) {
								anchorElement.attr('cross-reference', type.type);
								anchorElement.attr('cross-anchor', '');
								anchorElement.attr('cross-guid', anchor.guid);
								anchorElement.attr('cross-name', anchor.name);
								anchorElement.attr('cross-number', anchor.number);
								anchorElement.attr('name', aName);
								if (!anchorElement.hasClass('cross-reference'))
									anchorElement.addClass('cross-reference');
								if (!anchorElement.hasClass('cross-anchor'))
									anchorElement.addClass('cross-anchor');
								
								anchorElement.removeAttr('cross-link');
								anchorElement.removeClass('cross-link');
								
								anchorElement.text(anchor.text);
							}
							
							$('a[cross-reference="' + type.type + '"][cross-link][cross-guid="' + anchor.guid + '"]', html).each(function() {
								var linkElement = $(this);
								
								linkElement.attr('cross-reference', type.type);
								linkElement.attr('cross-link', '');
								linkElement.attr('cross-guid', anchor.guid);
								linkElement.attr('cross-name', anchor.name);
								linkElement.attr('cross-number', anchor.number);
								linkElement.attr('href', '#' + aName);
								
								if (!linkElement.hasClass('cross-reference'))
									linkElement.addClass('cross-reference');
								if (!linkElement.hasClass('cross-link'))
									linkElement.addClass('cross-link');
								
								linkElement.removeAttr('cross-anchor');
								linkElement.removeClass('cross-anchor');
								
								var linkText = anchor.text;
								if (type.linkTextTemplate)
									linkText = config.formatText(type.linkTextTemplate, anchor);
								linkElement.text(linkText);
								linkElement.attr('title', anchor.text.replace(/&nbsp;/g, ' ').trim());
								
								linksCount++;
							});
						}
						processedTypesCount++;
						if (processedTypesCount >= typesCount) {
							// done
							if (editor.mode == 'source')
								editor.setData(html.html());
							finishCommand();
						}
					});
				}
			}
		});
		
		// keystrokes
		
		editor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 65, anchorDialogCmdName);
		editor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 76, linkDialogCmdName);
		editor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + 85, updateCmdName);
		
		// double click
		
		editor.on('doubleclick', function(evt) {
			if (evt.data.element && !evt.data.element.isReadOnly() && evt.data.element.getName() === 'a' 
					&& evt.data.element.hasAttribute('cross-reference')) {
				editor.getSelection().selectElement(evt.data.element);
				if (evt.data.element.hasAttribute('cross-anchor')) {
					evt.data.dialog = anchorDialogCmdName;
				} else if (evt.data.element.hasAttribute('cross-link')) {
					evt.data.dialog = linkDialogCmdName;
				}
			}
		});
		
		// menu
		
		var updateMenuItemName = 'updateCrossReferences';
		var setAnchorMenuItemName = 'setCrossReferenceAnchor';
		var setLinkMenuItemName = 'setCrossReferenceLink';
		
		var getMenuState = function(element, alwaysAllowEditItems) {
			var items = {};
			items[updateMenuItemName] = CKEDITOR.TRISTATE_OFF;
			if (alwaysAllowEditItems == true) {
				items[setAnchorMenuItemName] = CKEDITOR.TRISTATE_OFF;
				items[setLinkMenuItemName] = CKEDITOR.TRISTATE_OFF;
			}
			if (element && element.getName() === 'a' && element.hasAttribute('cross-reference')) {
				items[setAnchorMenuItemName] = CKEDITOR.TRISTATE_OFF;
				items[setLinkMenuItemName] = CKEDITOR.TRISTATE_OFF;
				if (element.hasAttribute('cross-anchor')) {
					items[setAnchorMenuItemName] = CKEDITOR.TRISTATE_ON;
					items[setLinkMenuItemName] = CKEDITOR.TRISTATE_DISABLED;
				}
				if (element.hasAttribute('cross-link')) {
					items[setAnchorMenuItemName] = CKEDITOR.TRISTATE_DISABLED;
					items[setLinkMenuItemName] = CKEDITOR.TRISTATE_ON;
				}
			}
			return items;
		}
		if (editor.addMenuItem) {
			editor.addMenuGroup('crossreferenceGroup');
			editor.addMenuItem(updateMenuItemName, {
				label : editor.lang.crossreference.updateCrossReferences,
				command : updateCmdName,
				icon: 'crossreference-update',
				group : 'crossreferenceGroup'
			});
			editor.addMenuItem(setAnchorMenuItemName, {
				label : editor.lang.crossreference.setCrossReferenceAnchor,
				command : anchorDialogCmdName,
				icon: 'crossreference-anchor',
				group : 'crossreferenceGroup'
			});
			editor.addMenuItem(setLinkMenuItemName, {
				label : editor.lang.crossreference.setCrossReferenceLink,
				command : linkDialogCmdName,
				icon: 'crossreference-link',
				group : 'crossreferenceGroup'
			});
		}
		if (editor.contextMenu) {
			editor.contextMenu.addListener(function(element, selection) {
				if (element.getName() === 'a' && element.hasAttribute('cross-reference')) {
					selection.selectElement(element);
				}
				var state = getMenuState(element, false);
				return state;
			});
		}
		
		function getConfig() {
			var defaultConfig = {
				activeTypes: ['chapter', 'image', 'table', 'reference'],
				overrideTypes: false,
				types: {}
			};
			defaultConfig.types.chapter = {
				name: editor.lang.crossreference.chapter,
				anchorTextTemplate: '${number}. ${name}.',
				linkTextTemplate: '${number}',
				numeration: {
					enabled: true,
					firstNumber: '1',
					increase: function(number) {
						var n = parseInt(number);
						return ++n;
					}
				},
				anchorsProvider: 'default',
				allowCreateAnchors: true,
				groupAnchors: false
			};
			defaultConfig.types.image = {
				name: editor.lang.crossreference.figure,
				anchorTextTemplate: editor.lang.crossreference.fig + ' ${number}. ${name}.',
				linkTextTemplate: '${number}',
				numeration: {
					enabled: true,
					firstNumber: '1',
					increase: function(number) {
						var n = parseInt(number);
						return ++n;
					}
				},
				anchorsProvider: 'default',
				allowCreateAnchors: true,
				groupAnchors: false
			};
			defaultConfig.types.table = {
				name: editor.lang.crossreference.table,
				anchorTextTemplate: editor.lang.crossreference.table + ' ${number}. ${name}.',
				linkTextTemplate: '${number}',
				numeration: {
					enabled: true,
					firstNumber: '1',
					increase: function(number) {
						var n = parseInt(number);
						return ++n;
					}
				},
				anchorsProvider: 'default',
				allowCreateAnchors: true,
				groupAnchors: false
			};
			defaultConfig.types.reference = {
				name: editor.lang.crossreference.reference,
				anchorTextTemplate: '[${number}] ${name}.',
				linkTextTemplate: '[${number}]',
				numeration: {
					enabled: true,
					firstNumber: '1',
					increase: function(number) {
						var n = parseInt(number);
						return ++n;
					}
				},
				anchorsProvider: 'default',
				allowCreateAnchors: true,
				groupAnchors: false
			};
			
			var config = CKEDITOR.tools.clone(defaultConfig);
			if (editor.config.crossreference) {
				config = CKEDITOR.tools.extend(config, editor.config.crossreference, true);
				if (!config.overrideTypes) {
					for (var typeName in defaultConfig.types) {
						var type = defaultConfig.types[typeName];
						if (!(typeName in config.types))
							config.types[typeName] = type;
					}
				}
			}
			for (var typeName in config.types) {
				var type = config.types[typeName];
				type.type = typeName;
			}
			for (var typeName in config.types) {
				if ($.inArray(typeName, config.activeTypes) == -1) {
					delete config.types[typeName];
				}
			}
			
			// shared methods
			
			config.findAnchors = function(config, editor, type, callback) {
				var anchors = [];
				
				if (type == null) {
					callback(anchors);
					return;
				}
				
				var number = null;
				if (type.numeration && type.numeration.enabled)
					number = type.numeration.firstNumber + '';
				
				var html = null;
				if (editor.mode == 'source')
					html = $('<div>' + editor.getData() + '</div>');
				else
					html = $(editor.editable().$);
				
				$('a[cross-reference="' + type.type + '"][cross-anchor]', html).each(function() {
					var element = $(this);
					var anchor = {
						type: element.attr('cross-reference'),
						guid: element.attr('cross-guid'),
						name: element.attr('cross-name'),
						number: number,
						text: element.text()
					}
					anchors.push(anchor);
					if (type.numeration && type.numeration.enabled)
						number = type.numeration.increase(number);
				});
				
				function postProcessAnchors(anchors) {
					for(var i = 0; i < anchors.length; i++) {
						var anchor = anchors[i];
						
						if (anchor.type != type.type)
							throw 'Incompatible type: ' + type.type;
						
						var text = anchor.name;
						if (type.anchorTextTemplate) {
							text = config.formatText(type.anchorTextTemplate, anchor);
						}
						anchor.text = text;
					}
					callback(anchors);
				}
				
				if (type.anchorsProvider && type.anchorsProvider !== 'default') {
					type.anchorsProvider(postProcessAnchors, anchors, type, editor);
				} else {
					postProcessAnchors(anchors);
				}
			};
			
			config.formatText = function(template, anchor) {
				var text = template;
				
				for (var propName in anchor) {
					var propValue = anchor[propName];
					var regexp = new RegExp('\\$\\{' + propName + '\\}', 'g');
					if (propValue)
						text = text.replace(regexp, propValue);
					else
						text = text.replace(regexp, '');
				}
				
				if (anchor.level != null) {
					var shift = '';
					for (var i = 0; i < anchor.level; i++)
						shift += '&nbsp;&nbsp;';
					
					text = text.replace(/\$\{levelShift\}/g, shift);
				}
				
				text = text.replace(/\s+/g, ' ');
				text = text.trim();
				
				return text;
			}
			
			return config;
		}
	}
});
