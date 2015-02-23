module.exports = angular.module('ytv_information',[])
    .service('informationService', require('./informationService'))
    .service('feedDataGenerator', require('./feedDataGenerator'));
