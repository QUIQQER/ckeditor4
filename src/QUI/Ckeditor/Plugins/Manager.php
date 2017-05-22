<?php


namespace QUI\Ckeditor\Plugins;

use QUI\Archiver\Zip;
use QUI\Exception;
use QUI\System\Log;
use QUI\Utils\Security\Orthos;
use QUI\Utils\System\File;

/**
 * Class Manager
 *
 * @package QUI\Ckeditor\Plugins
 */
class Manager
{

    protected $activePluginDir;
    protected $installedPluginDir;

    protected $dependencies;


    /**
     * List of plugins which should not be installed
     *
     * @var array
     */
    protected $blacklist = array(
        "ckawesome",
        "copyformatting",
        "crossreference",
        "ckeditortablecellsselection",
        "divarea",
        "enhancedcolorbutton",
        "footnotes",
        "textselection"
    );


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

    #########################################
    #             Installation              #
    #########################################

    /**
     * Updates the plugins
     */
    public function updatePlugins()
    {
        $srcDirs = array(
            OPT_DIR . "ckeditor/ckeditor/plugins",
            OPT_DIR . "quiqqer/ckeditor4/plugins/quiqqer",
            OPT_DIR . "quiqqer/ckeditor4/plugins/ckeditor4",

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
     * Installs the plugins from the source packages quiqqer/ckeditor4 and ckeditor4/ckeditor4
     *
     */
    public function installPluginsFromSource()
    {
        $srcDirs = array(
            OPT_DIR . "ckeditor/ckeditor/plugins",
            OPT_DIR . "quiqqer/ckeditor4/plugins/quiqqer",
            OPT_DIR . "quiqqer/ckeditor4/plugins/ckeditor4"

        );

        $activePlugins    = array();
        $defaultStateFile = dirname(dirname(dirname(dirname(dirname(__FILE__))))) . "/plugins/activePlugins.json";
        if (file_exists($defaultStateFile)) {
            $json          = file_get_contents($defaultStateFile);
            $activePlugins = json_decode($json, true);
        }


        foreach ($srcDirs as $srcDir) {
            if (!is_dir($srcDir)) {
                return;
            }

            foreach (scandir($srcDir) as $entry) {
                $targetDir = $this->installedPluginDir;
                if (in_array($entry, $activePlugins)) {
                    $targetDir = $this->activePluginDir;
                }

                if ($entry == "." || $entry == "..") {
                    continue;
                }

                if (!is_dir($srcDir . "/" . $entry)) {
                    continue;
                }

                if (is_dir($this->installedPluginDir . "/" . $entry)) {
                    continue;
                }

                if (is_dir($this->activePluginDir . "/" . $entry)) {
                    continue;
                }

                if (in_array($entry, $this->blacklist)) {
                    continue;
                }

                $this->copyDir(
                    $srcDir . "/" . $entry,
                    $targetDir . "/" . $entry
                );
            }
        }

        if (file_exists(OPT_DIR . "quiqqer/ckeditor4/plugins/dependencies.json")) {
            copy(
                OPT_DIR . "quiqqer/ckeditor4/plugins/dependencies.json",
                $this->getPluginDir() . "/dependencies.json"
            );
        }

        #File::deleteDir(OPT_DIR . "ckeditor/ckeditor/plugins");
    }

    /**
     * Returns all installed (not active) plugins
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
     * Installs a plugin zip file from the given path
     *
     * @param $pluginpath - path to the plugins zip file
     *
     * @throws Exception
     */
    public function installPlugin($pluginpath)
    {
        # Check if file exists
        if (!file_exists($pluginpath)) {
            throw new Exception(array("quiqqer/ckeditor4", "exception.install.file.not.found"));
        }

        $tmpDir = \QUI::getTemp()->createFolder();
        copy(
            $pluginpath,
            $tmpDir . "/archive.zip"
        );


        $Zip = new \ZipArchive();

        if ($Zip->open($tmpDir . "/archive.zip") === false) {
            throw new Exception(array("quiqqer/ckeditor4", "exception.install.file.invalid.format"));
        }

        if ($Zip->extractTo($tmpDir . "/content") === false) {
            throw new Exception(array("quiqqer/ckeditor4", "exception.install.file.extract.failed"));
        }


        // Scan dir and remove '.' and '..'
        $contents = scandir($tmpDir . "/content");
        foreach (array_keys($contents, ".", true) as $key) {
            unset($contents[$key]);
        }

        foreach (array_keys($contents, "..", true) as $key) {
            unset($contents[$key]);
        }


        // Check if the zip contains only one folder
        if (count($contents) !== 1) {
            throw new Exception(array(
                "quiqqer/ckeditor4",
                "exception.plugin.install.wrong.format"
            ));
        }


        // Process the content
        foreach ($contents as $entry) {
            if ($entry == "." || $entry == "..") {
                continue;
            }


            if (is_dir($this->installedPluginDir . "/" . $entry)) {
                throw new Exception(array("quiqqer/ckeditor4", "exception.install.file.exists"));
            }

            if (is_dir($this->activePluginDir . "/" . $entry)) {
                throw new Exception(array("quiqqer/ckeditor4", "exception.install.file.exists"));
            }

            rename(
                $tmpDir . "/content/" . $entry,
                $this->installedPluginDir . "/" . $entry
            );
        }

        File::deleteDir($tmpDir);

        \QUI::getMessagesHandler()->addSuccess(
            \QUI::getLocale()->get(
                "quiqqer/ckeditor4",
                "message.plugin.install.success"
            )
        );
    }

    #########################################
    #             Enable/Disable            #
    #########################################

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

        if (in_array($pluginName, $this->blacklist)) {
            throw new Exception(array(
                "quiqqer/ckeditor4",
                "exception.plugin.activate.blacklisted"
            ));
        }

        if (!is_dir($this->installedPluginDir . "/" . $pluginName)) {
            throw new Exception(array("quiqqer/ckeditor4", "exception.plugin.activate.plugin.not.found"));
        }

        if (is_dir($this->activePluginDir . "/" . $pluginName)) {
            throw new Exception(array("quiqqer/ckeditor4", "exception.plugin.already.active"));
        }

        $deps = $this->getDependencies($pluginName);
        foreach ($deps as $dep) {
            try {
                $this->activate($dep);
            } catch (\Exception $Exception) {
            }
        }

        rename($this->installedPluginDir . "/" . $pluginName, $this->activePluginDir . "/" . $pluginName);


        \QUI\Cache\Manager::clear("quiqqer/ckeditor/plugins/data");
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

        foreach ($this->getDependentPlugins($pluginName) as $depName) {
            try {
                $this->deactivate($depName);
            } catch (\Exception $Exception) {
            }
        }

        rename($this->activePluginDir . "/" . $pluginName, $this->installedPluginDir . "/" . $pluginName);

        \QUI\Cache\Manager::clear("quiqqer/ckeditor/plugins/data");
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

    #########################################
    #             Dependencies            #
    #########################################

    /**
     * Gets all dependencies for the given plugin.
     * Including dependencies fo dependencies
     * Returns false on error
     *
     * @param $pluginName
     *
     * @return array|false
     */
    public function getDependencies($pluginName)
    {
        try {
            $this->loadDependencies();
        } catch (\Exception $Exception) {
            return false;
        }

        $result = array();

        if (!isset($this->dependencies[$pluginName])) {
            return array();
        }

        $deps = $this->dependencies[$pluginName];
        foreach ($deps as $dep) {
            $result[] = $dep;

            $subDeps = $this->getDependencies($dep);

            $result = array_merge($result, $subDeps);
        }

        $result = array_unique($result);

        return $result;
    }

    /**
     * Returns an array of packages that depend on the given plugin
     * Returns false on error
     *
     * @param $pluginName
     *
     * @return array|bool
     */
    public function getDependentPlugins($pluginName)
    {
        $result = array();

        try {
            $this->loadDependencies();
        } catch (\Exception $Exception) {
            return false;
        }


        foreach ($this->dependencies as $pkg => $deps) {
            if (in_array($pluginName, $deps)) {
                $result[] = $pkg;
            }
        }

        $result = array_unique($result);

        return $result;
    }

    /**
     * Loads the dependencies for the installed modules
     *
     * @throws Exception
     */
    protected function loadDependencies()
    {
        if (isset($this->dependencies) && !empty($this->dependencies)) {
            return;
        }

        if (!file_exists($this->getPluginDir() . "/dependencies.json")) {
            Log::addWarning("Missing dependency file: " . $this->getPluginDir() . "/dependencies.json");

            throw new Exception("missing.dependency.file");
        }

        $json = file_get_contents($this->getPluginDir() . "/dependencies.json");
        $deps = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception(json_last_error_msg());
        }

        $this->dependencies = $deps;
    }

    #########################################
    #               Helper                  #
    #########################################

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

    /**
     * Gets the plugin dirctory URL path
     *
     * @return mixed
     */
    public function getPluginUrlPath()
    {
        // Build the web reachable path for the plugin directory
        $pluginPath = \QUI::getPackage("quiqqer/ckeditor4")->getVarDir() . "plugins";
        $varParent  = dirname(VAR_DIR);

        # Parse the URL directory
        $pluginUrlPath = str_replace($varParent, "", $pluginPath);

        return $pluginUrlPath;
    }
}
