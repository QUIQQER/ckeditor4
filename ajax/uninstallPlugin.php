<?php

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_uninstallPlugin',
    function ($pluginName) {
        $PluginManager = new \QUI\Ckeditor4\Plugins\Manager();
    },
    array('pluginName')
);