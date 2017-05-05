<?php

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_getPlugins',
    function () {
        $Pluginmanager = new \QUI\Ckeditor\Plugins\Manager();

        return $Pluginmanager->getAllPlugins();
    },
    array()
);