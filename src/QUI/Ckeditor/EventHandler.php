<?php

/**
 * This file contains QUI\Ckeditor\EventHandler
 */

namespace QUI\Ckeditor;

use QUI\Ckeditor\Plugins\Manager;
use QUI\Package\Package;

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
