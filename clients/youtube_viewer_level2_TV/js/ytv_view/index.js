module.exports = angular.module('ytv_view', ['ytv_information', 'pascalprecht.translate'])
    .service('ytv_playerState', require('./ytv_playerState'))
    .controller('ytv_MainController', require('./ytv_mainController'))
    .directive('ytvPlayer', require('./ytv_player/ytv_playerDirective'))
    .directive('ytvPreviewOverlay', require('./ytv_preview/ytv_previewOverlayDirective'))
    .directive('ytvTopbar', require('./ytv_topbar/ytv_topbarDirective'))
    .directive('ytvControlbar', require('./ytv_controlbar/ytv_controlbarDirective'))
    .filter('ytv_ControlbarTimeFilter', require('./ytv_controlbar/ytv_controlbarTimeFilter'))
;
