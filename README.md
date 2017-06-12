QUIQQER CKEditor 4 Bridge
========

Paketname:

    quiqqer/ckeditor4


Features (Funktionen)
--------

- CKEditor4 für QUIQQER


Pluginverwaltung
--------

Das Paket liefert eine Pluginverwaltung für CKEditor Plugins ([Plugin Store](http://ckeditor.com/addons/plugins/all)).

Das Paket liefert eine Auswahl von Plugins mit, diese werden in zwei Ordnern im Paket mitgelifert:
* ckeditor4/plugins/ckeditor4 (Plugins aus dem Pluginstore)
* ckeditor4/plugins/quiqqer (Von PCSG für QUIQQER entwickelte Editorplugins)

Bei einem Paketsetup werden diese Plugins in das entsprechende QUIQQER-System installiert.

Zu finden sind die installiert Pakete im "Var-Verzeichnis":

* \<CMD_DIR>/var/package/quiqqer/ckedito4/plugins/installed (Installiert, aber inaktiv)
* \<CMD_DIR>/var/package/quiqqer/ckedito4/plugins/bin (Installiert und aktiviert)


Die Pluginverwaltung kann im Adminbereich unter `Einstellungen -> CKEditor` aufgerufen werden:


Plugins installieren
-------

Um zusätzliche Plugins zu installieren rufen Sie bitte die pluginverwaltung auf:   
`ADMINBEREICH -> Einstellungen -> CKEditor`  

1) Dort finden Sie eine Schaltfläche `Hochladen`.
2) Wählen Sie die Schaltfläche `Datei auswählen`
3) Selektieren Sie ein ZIP-Archiv im korrekten Format*
4) Betätigen Sie `Hochladen`
5) Das Plugin wird hochgeladen und installiert

__**Das korrekte ZIP-Archiv Format:**__  

Das ZIP muss in einem bestimmten Format aufgebaut sein.

Folgende Struktur muss eingehalten werden:  
Das ZIP-Archiv darf in der ersten Ebene nur einen Ordner enthalten, der den Namen des Plugins trägt.  
In diesem Ordner sind die Plugindateien enthalten. 

Installation
------------

Der Paketname ist: quiqqer/ckeditor4


Mitwirken
----------

- Issue Tracker: https://dev.quiqqer.com/quiqqer/ckeditor4/issues
- Source Code: https://dev.quiqqer.com/quiqqer/ckeditor4/tree/master


Support
-------

Falls Sie ein Fehler gefunden haben, oder Verbesserungen wünschen,
dann können Sie gerne an support@pcsg.de eine E-Mail schreiben.


Lizenz
-------

- GPL-2.0+

Entwickler
--------
