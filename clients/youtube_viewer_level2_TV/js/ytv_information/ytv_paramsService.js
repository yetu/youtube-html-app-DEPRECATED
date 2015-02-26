module.exports = function () {
    'use strict';
    this.getParams = function(){
        return location.search.split('\?').join('').split('\&').reduce(function(acc, pair){
            var res= pair.split('=');
            acc[res[0]] = res[1];
            return acc
        }, {})}

};
