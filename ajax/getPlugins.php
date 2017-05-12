<?php

/**
 * Gets all plugins and their state
 */

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_getPlugins',
    function () {

        if(QUI::getUserBySession()->getId() === 0){
            throw new \QUI\Exception("Invalid external function call. Caller must be logged in!");
        }

        $Pluginmanager = new \QUI\Ckeditor\Plugins\Manager();

        return $Pluginmanager->getAllPlugins();
    },
    array()
);
