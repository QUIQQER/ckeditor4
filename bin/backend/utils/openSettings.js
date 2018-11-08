/**
 * @module package/quiqqer/ckeditor4/bin/backend/utils/openSettings
 * @author www.pcsg.de (Henning Leutz)
 */
define('package/quiqqer/ckeditor4/bin/backend/utils/openSettings', function () {
    "use strict";

    return function (Panel) {
        require([
            'controls/editors/Settings',
            'utils/Panels'
        ], function (Editor, PanelUtils) {
            PanelUtils.openPanelInTasks(new Editor());
        });

        Panel.getCategoryBar().getChildren()[0].click();
    };
});