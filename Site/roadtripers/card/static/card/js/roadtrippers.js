/**
 * Created by andrey on 30.11.14.
 */

var map;

var filter = {
    'cinema': true ,
    'food'  : true ,
    'club'  : true ,
    'park'  : true
};

ymaps.ready(init);

function init(){
    map = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 7
    });
}

function toogle_filter(filter_name){

    isFiltred = filter[filter_name]
    if (isFiltred) {
        filter[filter_name] = false
    } else {
        filter[filter_name] = true
    }

    map_update(filter)
}

function map_update(event_filter){

     map.geoObjects.removeAll()
     $.ajax({
        url : "ajax_map_update", // the endpoint
        type : "POST", // http method
        data : filter, // data sent with the post request

        // handle a successful response
        success : function(json) {
            $('#post-text').val(''); // remove the value from the input
                map.geoObjects.removeAll()

                for (var i in json){
                    var event = json[i];

                    placemark = new ymaps.Placemark([event.fields.longitude,event.fields.latitude], {
                                    balloonContent: event.fields.event_place
                                    });

                    map.geoObjects.add(placemark);
                }
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
        }
    });


}