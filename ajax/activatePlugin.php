<?php

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_activatePlugin',
    function ($pluginName) {
        $PluginManager = new \QUI\Ckeditor4\Plugins\Manager();
    },
    array('pluginName')
);