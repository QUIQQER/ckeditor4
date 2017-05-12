<?php

/**
 * Retrieves data about the active plugins
 *
 * Returnformat:
 * array(
 *  'plugins' => array('plugin1','plugin2','plugin3'...),
 *  'pluginpath' => 'path/to/plugins'
 * )
 *
 * @param pluginName
 *
 */

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_getPluginData',
    function () {

        if (QUI::getUserBySession()->getId() === 0) {
            throw new \QUI\Exception("Invalid external function call. Caller must be logged in!");
        }


        try {
            return \QUI\Cache\Manager::get("quiqqer/ckeditor/plugins/data");
        } catch (\Exception $Exception) {
        }


        $Manager = new \QUI\Ckeditor\Plugins\Manager();

        // Build the web reachable path for the plugin directory
        $pluginPath = QUI::getPackage("quiqqer/ckeditor4")->getVarDir() . "plugins";
        $varParent  = dirname(VAR_DIR);

        # Parse the URL directory
        $pluginUrlPath = str_replace($varParent, "", $pluginPath);


        $data = array(
            'plugins'    => $Manager->getActivePlugins(),
            'pluginPath' => $pluginUrlPath
        );


        \QUI\Cache\Manager::set("quiqqer/ckeditor/plugins/data", $data);


        return $data;
    },
    array()
);
