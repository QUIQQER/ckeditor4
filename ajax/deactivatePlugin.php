<?php

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_deactivatePlugin',
    function ($pluginName) {
        $PluginManager = new \QUI\Ckeditor4\Plugins\Manager();
    },
    array('pluginName')
);