<?php


namespace QUI\Ckeditor\Plugins;

use QUI\Exception;
use QUI\Utils\Security\Orthos;
use QUI\Utils\System\File;

class Manager
{

    protected $activePluginDir;
    protected $installedPluginDir;


    /**
     * Manager constructor.
     */
    public function __construct()
    {
        $this->activePluginDir    = \QUI::getPackage("quiqqer/ckeditor4")->getVarDir() . "/plugins/bin";
        $this->installedPluginDir = \QUI::getPackage("quiqqer/ckeditor4")->getVarDir() . "/plugins/installed";


        if (!is_dir($this->activePluginDir)) {
            mkdir($this->activePluginDir, 0755, true);
        }

        if (!is_dir($this->installedPluginDir)) {
            mkdir($this->installedPluginDir, 0755, true);
        }
    }

    /**
     * Activates the given plugin name
     *
     * @param $pluginName
     *
     * @throws Exception
     */
    public function activate($pluginName)
    {
        $pluginName = Orthos::clearPath($pluginName);
        $pluginName = str_replace("/", "", $pluginName);

        if (!is_dir($this->installedPluginDir . "/" . $pluginName)) {
            throw new Exception(array("quiqqer/ckeditor4", "exception.plugin.activate.plugin.not.found"));
        }

        if (is_dir($this->activePluginDir . "/" . $pluginName)) {
            throw new Exception(array("quiqqer/ckeditor4", "exception.plugin.already.active"));
        }

        rename($this->installedPluginDir . "/" . $pluginName, $this->activePluginDir . "/" . $pluginName);
    }

    /**
     * Deactivates the given plugin name
     *
     * @param $pluginName
     *
     * @throws Exception
     */
    public function deactivate($pluginName)
    {
        $pluginName = Orthos::clearPath($pluginName);
        $pluginName = str_replace("/", "", $pluginName);

        if (!is_dir($this->activePluginDir . "/" . $pluginName)) {
            throw new Exception(array("quiqqer/ckeditor4", "exception.plugin.activate.plugin.not.active"));
        }

        if (is_dir($this->installedPluginDir . "/" . $pluginName)) {
            File::deleteDir($this->activePluginDir . "/" . $pluginName);

            return;
        }

        rename($this->activePluginDir . "/" . $pluginName, $this->installedPluginDir . "/" . $pluginName);
    }

    /**
     * Returns a list of all plugins and their details
     * Format:
     * array(
     *  [0] => array(
     *      ["name"] => "pluginname",
     *      ["state"] => 0|1  (1 for active; 0 for inactive)
     *  )
     * )
     *
     * @return array
     */
    public function getAllPlugins()
    {
        $result = array();

        foreach ($this->getActivePlugins() as $plugin) {
            $result[] = array(
                'name'  => $plugin,
                'state' => 1
            );
        }

        foreach ($this->getInstalledPlugins() as $plugin) {
            $result[] = array(
                'name'  => $plugin,
                'state' => 0
            );
        }

        return $result;
    }

    /**
     * Returns all installed plugins
     *
     * @return string[] - array of plugin names
     */
    public function getInstalledPlugins()
    {
        $result = array();

        $content = scandir($this->installedPluginDir);
        if ($content === false) {
            return array();
        }

        foreach ($content as $entry) {
            if ($entry == "." || $entry == "..") {
                continue;
            }
            $fullpath = $this->installedPluginDir . "/" . $entry;


            if (!is_dir($fullpath)) {
                continue;
            }


            $result[] = $entry;
        }

        return $result;
    }

    /**
     * Returns all active plugins
     *
     * @return string[] - Array of active plugin names
     */
    public function getActivePlugins()
    {
        $result = array();

        $content = scandir($this->activePluginDir);
        if ($content === false) {
            return array();
        }

        foreach ($content as $entry) {
            if ($entry == "." || $entry == "..") {
                continue;
            }
            $fullpath = $this->activePluginDir . "/" . $entry;

            if (!is_dir($fullpath)) {
                continue;
            }

            $result[] = $entry;
        }

        return $result;
    }

    /**
     * Installs the plugins from the source packages quiqqer/ckeditor4 and ckeditor4/ckeditor4
     *
     */
    public function installPluginsFromSource()
    {
        $srcDirs = array(
            OPT_DIR . "ckeditor/ckeditor/plugins",
            OPT_DIR . "quiqqer/ckeditor4/plugins"

        );

        foreach ($srcDirs as $srcDir) {
            $targetDir = $this->installedPluginDir;

            if (!is_dir($srcDir)) {
                return;
            }

            foreach (scandir($srcDir) as $entry) {
                if ($entry == "." || $entry == "..") {
                    continue;
                }

                if (!is_dir($srcDir . "/" . $entry)) {
                    continue;
                }

                if (is_dir($targetDir . "/" . $entry)) {
                    continue;
                }

                if (is_dir($this->activePluginDir . "/" . $entry)) {
                    continue;
                }


                $this->copyDir(
                    $srcDir . "/" . $entry,
                    $targetDir . "/" . $entry
                );
            }
        }
    }

    /**
     * Updates the plugins
     */
    public function updatePlugins()
    {
        $srcDirs = array(
            OPT_DIR . "ckeditor/ckeditor/plugins",
            OPT_DIR . "quiqqer/ckeditor4/plugins"

        );

        foreach ($srcDirs as $srcDir) {
            if (!is_dir($srcDir)) {
                return;
            }


            foreach (scandir($srcDir) as $entry) {
                if ($entry == "." || $entry == "..") {
                    continue;
                }

                if (!is_dir($srcDir . "/" . $entry)) {
                    continue;
                }

                # Check if/where the plugin is installed
                $targetDir = $this->installedPluginDir . "/" . $entry;
                if (is_dir($this->activePluginDir . "/" . $entry)) {
                    $targetDir = $this->activePluginDir . "/" . $entry;
                }

                if (is_dir($targetDir)) {
                    File::deleteDir($targetDir);
                }


                File::dircopy(
                    $srcDir . "/" . $entry,
                    $targetDir
                );
            }
        }
    }

    /**
     * Returns the plugin dir
     *
     * @return string
     */
    public function getPluginDir()
    {
        return \QUI::getPackage("quiqqer/ckeditor4")->getVarDir() . "/plugins";
    }

    /**
     * Recursively copies the target directory to the target location
     *
     * @param $src
     * @param $target
     */
    public function copyDir($src, $target)
    {
        if (!is_dir($target)) {
            mkdir($target, 0755);
        }

        $entries = scandir($src);

        foreach ($entries as $entry) {
            if ($entry == "." || $entry == "..") {
                continue;
            }

            $fullpath = $src . "/" . $entry;

            if (is_dir($fullpath)) {
                $this->copyDir($fullpath, $target . "/" . $entry);
                continue;
            }

            copy($fullpath, $target . "/" . $entry);
        }
    }
}
