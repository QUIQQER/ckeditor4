<?php

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_deactivatePlugin',
    function ($pluginName) {
        $PluginManager = new \QUI\Ckeditor\Plugins\Manager();

        $PluginManager->deactivate($pluginName);
    },
    array('pluginName')
);