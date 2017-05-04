<?php


namespace QUI\Ckeditor\Plugins;

class Manager
{

    protected $pluginDir;
    protected $pluginConfig;

    public function __construct()
    {
        $this->pluginDir = \QUI::getPackage("quiqqer/ckeditor4")->getVarDir()."/plugins";
        $this->pluginConfig = "";
    }

    public function activate($pluginName){

    }

    public function deactivate($pluginName){

    }

    public function install($pluginName){

    }

    public function deinstall($pluginName){

    }


}