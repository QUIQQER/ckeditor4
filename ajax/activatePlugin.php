<?php

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_activatePlugin',
    function ($pluginName) {
        $PluginManager = new \QUI\Ckeditor\Plugins\Manager();

        $PluginManager->activate($pluginName);
    },
    array('pluginName')
);