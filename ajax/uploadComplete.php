<?php

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_uploadComplete',
    function ($File) {

        $filePath = $File->getAttribute('filepath');

        $Manager = new \QUI\Ckeditor\Plugins\Manager();
        try {
            $Manager->installPlugin($filePath);
        } catch (\Exception $Exception) {
            QUI::getMessagesHandler()->addError($Exception->getMessage());
        }
    },
    array('File')
);
