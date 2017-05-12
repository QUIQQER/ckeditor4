<?php

/**
 * Gets the current users permissions.
 * WARNING: The result can be altered clientside, do not use for security checks.
 */

QUI::$Ajax->registerFunction(
    'package_quiqqer_ckeditor4_ajax_getPermissions',
    function () {

        $result = array(
            'toggle' => false,
            'upload' => false
        );

        if (QUI::getUserBySession()->getId() === 0) {
            return $result;
        }


        $User = QUI::getUserBySession();
        if ($User->isSU()) {
            $result['toggle'] = true;
            $result['upload'] = true;
            return $result;
        }


        if ($User->getPermission("quiqqer.editors.ckeditor.plugins.toggle")) {
            $result['toggle'] = true;
        }

        if ($User->getPermission("quiqqer.editors.ckeditor.plugins.upload")) {
            $result['upload'] = true;
        }

        return $result;
    },
    array()
);
