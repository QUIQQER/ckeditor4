CrossReference Plugin for CKEditor 4
=================================

Adds cross references links with optional auto-numeration for chapters, images, tables and references. Other types of references can be defined in config.

## Online demo

Try the plugin demo at <http://indvd00m.com/crossreference-demo/>.

## CKEditor plugin page

http://ckeditor.com/addon/crossreference

## Requirements

CrossReference Plugin require CKEditor 4.5+ version and dependent from plugins: dialog, notification.

## Installation

 1. Download the plugin: https://github.com/indvd00m/crossreference/releases.
 
 2. Extract (decompress) the downloaded file into the plugins folder of your
	CKEditor installation.
	Example: http://example.com/ckeditor/plugins/crossreference
	
 3. Enable the plugin by using the extraPlugins configuration setting.
	Example: CKEDITOR.config.extraPlugins = 'crossreference';

## Description

Two main conceptions - anchor and link to anchor. There are 4 type of references defined by default: chapter, image, table, reference. Example of anchor of type `image` in raw html:
```html
<a 
	class="cross-reference cross-anchor" 
	cross-reference="image" 
	cross-anchor="" 
	cross-guid="7d24373b-0756-481d-bf97-5a17ffdf3a28" 
	cross-name="Experimental result" 
	cross-number="1" 
	name="image-7d24373b-0756-481d-bf97-5a17ffdf3a28"
	>
		Fig. 1. Experimental result.
</a>
```
Example of link to this anchor in raw html:
```html
<a 
	class="cross-reference cross-link" 
	cross-reference="image" 
	cross-link="" 
	cross-guid="7d24373b-0756-481d-bf97-5a17ffdf3a28" 
	cross-name="Experimental result" 
	cross-number="1" 
	href="#image-7d24373b-0756-481d-bf97-5a17ffdf3a28" 
	title="Fig. 1. Experimental result."
	>
		1
</a>
```
After every inserting of anchor or links to anchor all references will be updated to be a concerted. Or you can manually update cross-references by selecting option in menu (for example after deleting of anchors).

## Configuration

You can switch which types is active by config option `config.crossreference.activeTypes = ['type1', 'type2']`. You can define other types also.

### Default config:

```javascript
{
	activeTypes: ['chapter', 'image', 'table', 'reference'],
	overrideTypes: false,
	types: {
		chapter: {
			name: 'Chapter',
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
		},
		image: {
			name: 'Figure',
			anchorTextTemplate: 'Fig. ${number}. ${name}.',
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
		},
		table: {
			name: 'Table',
			anchorTextTemplate: 'Table ${number}. ${name}.',
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
		},
		reference: {
			name: 'Reference',
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
		}
	}
}
```
| Property | Description | Type | Default value |
| --- | --- | --- | --- |
| `activeTypes` | Which type of anchors would be activated. | Array | `['chapter', 'image', 'table', 'reference']` |
| `overrideTypes` | If you define your own types, enabling this option lead to mixing of your types with types from default config which not yet defined in your config. | Boolean | false |
| `types` | Types definition. | Object | see [Example of type definition](https://github.com/indvd00m/crossreference#example-of-type-definition) section|

### Example of type definition

```javascript
image: {
	name: 'Figure',
	anchorTextTemplate: 'Fig. ${number}. ${name}.',
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
}
```
| Property | Description | Type | Required |
| --- | --- | --- | --- |
| `name` | Type name. | String | Yes |
| `anchorTextTemplate` | Template for anchor text. This text will be put in `a` tag. You can use variables in format `${variableName}`. Variables is a properties of an anchor object (see [Example of an anchor object](https://github.com/indvd00m/crossreference#example-of-an-anchor-object) section). | String | No |
| `linkTextTemplate` | Template for link text. This text will be put in `a` tag. You can use variables in format `${variableName}`. Variables is a properties of an anchor object (see [Example of an anchor object](https://github.com/indvd00m/crossreference#example-of-an-anchor-object) section). | String | No |
| `numeration` | Definition of type numeration. See [Example of a numeration definition](https://github.com/indvd00m/crossreference#example-of-a-numeration-definition) section. | Object | No |
| `anchorsProvider` | See [Example of type with anchors provider](https://github.com/indvd00m/crossreference#example-of-type-with-anchors-provider) section. | String `'default'` or function | No |
| `allowCreateAnchors` | Can user create anchors of this type in anchors dialog. | Boolean | No |
| `groupAnchors` | If `true`, anchors can be filtered by group in link dialog. | Boolean | No |

### Example of a numeration definition

```javascript
numeration: {
	enabled: true,
	firstNumber: '1',
	increase: function(number) {
		var n = parseInt(number);
		return ++n;
	}
}
```
| Property | Description | Type |
| --- | --- | --- |
| `enabled` | Enabling/disabling numeration of anchors. | Boolean |
| `firstNumber` | First number. For example you may define `firstNumber` as `I` for Roman numerals. | String |
| `increase` | Function which must return number (as string) which is next after `number` argument (string). | Function |

### Example of an anchor object

JSON object:

```javascript
{
	type: 'image',
	guid: '7d24373b-0756-481d-bf97-5a17ffdf3a28',
	name: 'Experimental result',
	number: '1',
	text: 'Fig. 1. Experimental result.',
	groupName: 'Group name',
	groupGuid: '6c848dff-cde3-421f-b926-695c8de37d80'
}
```
| Property | Description | Type | Required |
| --- | --- | --- | --- |
| `type` | Type name of this anchor (`config.types.typeName`). | String | Yes |
| `guid` | Unique guid of this anchor. | String | Yes |
| `name` | Name of this anchor. | String | Yes |
| `number` | Number of this anchor (if type contains numeration definition). | String | Depends of type |
| `text` | Text of this anchor. Optional property because of text will generated by `type.anchorTextTemplate` template. | String | No |
| `groupName` | Name of anchor group. | String | No |
| `groupGuid` | Unique guid of anchor group. | String | No |

### Example of type with anchors provider

You can define your own anchors provider. By default plugin search anchors in content of editor and use this anchors for links. But if you want refer to anchors outside of editor you can define another type of anchor with `anchorsProvider` function.

```javascript
myType: {
	name: 'My type',
	anchorTextTemplate: '${name}',
	linkTextTemplate: '${name}',
	anchorsProvider: function(callback, editorAnchors, type, editor) {
		var anchors = [];
		anchors.push({
			type: 'myType',
			guid: '7d24373b-0756-481d-bf97-5a17ffdf3a28',
			name: 'Anchor name',
			number: '1'
		});
		callback(anchors);
	},
	allowCreateAnchors: false,
	groupAnchors: false
},
```

`anchorsProvider` method attributes:

| Name | Description | Type |
| --- | --- | --- |
| `callback` | Callback method which must be called with arrays of anchors as argument. | Function |
| `editorAnchors` | Anchors of this type (`myType` in this case) which already contains in editor. You can merge this anchors with your own anchors if need. | Array |
| `type` | Type definition (Object `myType` in this case). | Object |
| `editor` | Instance of ckeditor. | Object |


## Roadmap

See https://github.com/indvd00m/crossreference/issues.

## Icons:

https://icons8.com/web-app/21792/unicast

https://icons8.com/web-app/15117/anchor

https://icons8.com/web-app/38051/link

https://icons8.com/web-app/21100/refresh

## License & Author

CrossReference Plugin is distributed under GPL/LGPL/MPL. For license terms, see LICENSE.md.

CrossReference Plugin is written by David E. Veliev.
