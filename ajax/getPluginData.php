<?php

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_getPluginData',
    function () {
        $Manager = new \QUI\Ckeditor\Plugins\Manager();

        // Build the web reachable path for the plugin directory
        $pluginPath = QUI::getPackage("quiqqer/ckeditor4")->getVarDir() . "plugins";
        $varParent = dirname(VAR_DIR);
        $pluginPath = str_replace($varParent, "", $pluginPath);


        $data = array(
            'plugins'    => $Manager->getActivePlugins(),
            'pluginPath' => $pluginPath
        );

        return $data;
    },
    array()
);
