<?php

/**
 * Activates the plugin
 *
 * @param pluginName
 *
 */

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_activatePlugin',
    function ($pluginName) {
        $PluginManager = new \QUI\Ckeditor\Plugins\Manager();

        $PluginManager->activate($pluginName);
    },
    array('pluginName'),
    "quiqqer.editors.ckeditor.plugins.toggle"
);
