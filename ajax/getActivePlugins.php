<?php

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_getActivePlugins',
    function () {
        $Manager = new \QUI\Ckeditor\Plugins\Manager();

        return $Manager->getActivePlugins();
    },
    array()
);
