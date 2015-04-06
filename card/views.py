# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import RequestContext
from django.core import serializers
from card.models import *
from django.core.cache import cache

from card.polygon import *
import json

def card(request):
    return render_to_response('index.html')


@csrf_exempt
def get_places(request):
    if request.method == 'GET':
        try:
            types = request.session.get('types')
            callback = request.GET.get('callback')
            bbox = request.GET.get('bbox')
            route = request.session.get('route')

            if types == None:
                print("ERROR: Types is none!")
                return HttpResponse("ERROR: Types is none!")

            if route == None:
                print("ERROR: Types is none!")
                return HttpResponse("ERROR: Types is none!")


            # print("types: %s" % types)
            # print("callback: %s" % callback)
            # print("bbox: %s" % bbox)

            # places = cache.get(bbox)

            # if not places:
            places = filter_places(route, types, bbox)
            #cache.set(bbox, list(places))

            # if route not None:
            #     filter_by_route()

            return HttpResponse(serialize_places(places, callback))

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")


def filter_places(route, types, bbox):
    bbox = list(map(lambda x: float(x), bbox.split(',')))

    lat_left_down = bbox[0]
    lon_left_down = bbox[1]
    lat_right_up = bbox[2]
    lon_right_up = bbox[3]

    places = Place.objects.select_related().filter(id_type__in=types,
                                                   lat__gt=lat_left_down,
                                                   lat__lt=lat_right_up,
                                                   lon__gt=lon_left_down,
                                                   lon__lt=lon_right_up)

    if route is not None:

        # worst method which can only be
        R = 0.02
        idplaces = []
        for place in places:

            lat1 = place.lat
            lon1 = place.lon
            for point in route:
                lat2 = point[0]
                lon2 = point[1]

                d = math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2)
                if d < R:
                    idplaces.append(place.id)
                    break

        places = places.filter(id__in=idplaces)
        # parameters = []
        # condition = []
        # for point in route:
        # x = point[0]
        #     y = point[1]
        #
        #     condition += ["          acos(   sin(t.lat * 0.0175) * sin(%s * 0.0175)                     " \
        #                  "                + cos(t.lat * 0.0175) * cos(%s * 0.0175)                      " \
        #                  "                * cos((%s * 0.0175) - (t.lon * 0.0175))                       " \
        #                  "              ) * 3959 <= %s                                                  "]
        #
        #     parameters += [x, y, 0.02]
        #
        # condition = 'OR'.join(condition)
        # places = places.raw("SELECT * FROM card_place WHERE (" + condition + " )", parameters)


    return places


def serialize_places(places, callback):
    features = []
    idplaces = set(place.id for place in places)
    images = Image.objects.all().filter(id_place__in=idplaces).values('id', 'url_image')


    for place in places:

        image = next((image for image in images if image['id'] == place.id), None)
        url = ""

        # TODO: Как сделать лучше?
        if image is not None:
            url = image['url_image']
        else:
            url = ""

        context = {
            'image': url,
            'name': place.name,
            'rating': place.rating * 10
        }

        feature = {
            "type": 'Feature',
            "geometry": {
                "type": "Point",
                "coordinates": [place.lat, place.lon]
            },
            "id": place.id,
            "properties": {
                "balloonContent": render_to_response('balloon_content.html', context).content.decode('utf-8'),
            },
            "options": {
                "iconLayout": "default#image",
                "iconImageHref": place.id_type.url_image_marker,
                "iconImageSize": [30, 40],
            },
            "fields": {
                "rating": place.rating * 10,
                "name": place.name,
                "image": url
            }
        }

        features.append(feature)

    data = {
        "error": None,
        "data": {
            "type": 'FeatureCollection',
            "features": features,
        }
    }

    return callback + "(" + json.dumps(data) + ");"


@csrf_exempt
def set_types(request):
    if request.method == 'POST':
        try:
            str_response = request.body.decode('utf-8')
            received_json_data = json.loads(str_response)
            types = json.loads(received_json_data['types'])

            if types == None:
                print("ERROR: Types is none!")
                return HttpResponse("ERROR: Types is none!")

            request.session['types'] = types
            print('Types %s ' % str(types))

            return HttpResponse("Good!")

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")

    return HttpResponse("Not POST request!")


@csrf_exempt
def set_route(request):
    if request.method == 'POST':
        try:
            str_response = request.body.decode('utf-8')
            received_json_data = json.loads(str_response)

            route = json.loads(received_json_data['points'])

            if route == None:
                print("ERROR: Route is none!")
                return HttpResponse("ERROR: route is none!")

            # use django session and save route param for current session
            request.session['route'] = route
            print('Route %s ' % str(route))

            return HttpResponse(get_polygons(0.02, route))

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")

    return HttpResponse("Not POST request!")


def get_place_info(request):
    if request.method == 'GET':
        try:
            place_id = request.GET.get('place_id')
            place_id = json.loads(place_id)

            place = Place.objects.select_related().filter(id=place_id)
            return HttpResponse(serializers.serialize("json", place))

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")



