<?php

/**
 * This file contains QUI\Ckeditor\EventHandler
 */

namespace QUI\Ckeditor;

use QUI\Ckeditor\Plugins\Manager;
use QUI\Package\Package;
use QUI\Utils\System\File;

/**
 * Class EventHandler
 *
 * @package QUI\Ckeditor
 */
class EventHandler
{
    /**
     * @param Package $Package
     */
    public static function onPackageSetup($Package)
    {
        if ($Package->getName() != "quiqqer/ckeditor4") {
            return;
        }

        $PluginManager = new Manager();

        // ----- Begin tempfix -----
        // This is a temporary fix for updating the systems
        // there was a bug in the utils package which compromised the update process of the ckeditor, thus rendering the ckeditor useless
        
        if (!file_exists(VAR_DIR . "package/quiqqer/ckeditor4/plugins/bin/image/dialogs/image.js")) {
            $newFolder = VAR_DIR . "package/quiqqer/ckeditor4/plugins." . time() . ".bak";
            rename(
                VAR_DIR . "package/quiqqer/ckeditor4/plugins",
                $newFolder
            );

            file_put_contents(
                $newFolder . "/README.md",
                "This directory was created as backup. If your ckeditor is working as intended you can delete this directory if you do not need it anymore"
            );
        }

        // ----- End tempfix -----


        $PluginManager->installPluginsFromSource();
    }

    /**
     * @param Package $Package
     */
    public static function onPackageUpdate($Package)
    {
        if ($Package->getName() != "quiqqer/ckeditor4") {
            return;
        }

        $PluginManager = new Manager();
        $PluginManager->updatePlugins();
    }
}
