angular.module('index-map-module',['ymaps']).config(function(ymapsConfig) {
    //нужно сменить preset у карты на специальный текстовый
    ymapsConfig.markerOptions.preset = 'islands#darkgreenStretchyIcon';
})