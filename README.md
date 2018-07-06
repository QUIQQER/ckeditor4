![Readme.jpg](bin/images/Readme.jpg)

QUIQQER CKEditor 4 Bridge
========

Packagename:

    quiqqer/ckeditor4


Features 
----------

- CKEditor4 für QUIQQER


CKEditor Plugin Management
--------------------------

The package adds a management interface for CKEditor plugin ([Plugin Store](http://ckeditor.com/addons/plugins/all)).

Some plugins will be bundled with this package by default. They get distributed in two directories:
* ckeditor4/plugins/ckeditor4 (Plugins from the plufin store)
* ckeditor4/plugins/quiqqer (Plugins that were developed for QUIQQER by PCSG)

These plugins will get moved into the correct directories of your QUIQQER installation during the package setup.

You can find your installed plugins in the `var`-directory:

* \<CMD_DIR>/var/package/quiqqer/ckedito4/plugins/installed (Installed,but deactivated)
* \<CMD_DIR>/var/package/quiqqer/ckedito4/plugins/bin (Installed and active)


You can open the plugin management in QUIQQERs Admin interface `Settings -> CKEditor`:


Install plugins
---------------

Open the plugin manager in your QUIQQER admin interface:   
`Adminarea -> Settings -> CKEditor`  

1) Press the `Upload` button.
2) Press `Select file`
3) Pick an archive in the correct format*
4) Confirm with `Upload`
5) The plugin gets uploaded and installed

__**The correct ZIP-Archive format:**__  

The ZIP-File needs to be in a certain format to be valid.

Following directory structure needs to be adhered:  
The first directory level must only contain one directory named like the plugin.  
The plugin files are within that directory.

Installation
------------

The package name is: quiqqer/ckeditor4

Install with composer:
```
composer require quiqqer/ckeditor4
```


Contribute
----------

- Issue Tracker: https://dev.quiqqer.com/quiqqer/ckeditor4/issues
- Source Code: https://dev.quiqqer.com/quiqqer/ckeditor4/tree/master


Support
-------

Feel free to send us an email, if you encountered an error,want to provide feedback or suggest an idea.
Our E-Mail is: support@pcsg.de


Lizenz
-------

- GPL-2.0+

