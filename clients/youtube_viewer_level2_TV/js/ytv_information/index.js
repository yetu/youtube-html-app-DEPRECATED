module.exports = angular.module('ytv_information',[])
    .service('ytv_informationService', require('./ytv_informationService'))
    .service('ytv_dataGenerator', require('./ytv_dataGenerator'));
