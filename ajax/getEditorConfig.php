<?php

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_getEditorConfig',
    function () {
        $config = array();

        $Pluginmanager = new \QUI\Ckeditor\Plugins\Manager();

        $PackageConfig = QUI::getPackage("quiqqer/ckeditor4")->getConfig();

        $config['plugins']    = $Pluginmanager->getActivePlugins();
        $config['pluginPath'] = $Pluginmanager->getPluginUrlPath();

        $config['disableNativeSpellChecker'] = $PackageConfig->get("general", "disablenativeSpellcheck");

        return $config;
    },
    array()
);
