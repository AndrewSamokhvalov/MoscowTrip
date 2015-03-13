# -*- coding: utf-8 -*-

import json
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import unquote
from django.core import serializers
from card.models import *
from django.core.cache import cache

from card.polygon import *

def card(request):
    return render_to_response('index.html')

@csrf_exempt
def get_places(request):
    if request.method == 'GET':
        try:
            types = request.GET.get('types')
            callback = request.GET.get('callback')
            bbox = request.GET.get('bbox')

            types = "[1,2]"
            if types == None:
                print("ERROR: Types is none!")
                return HttpResponse("ERROR: Types is none!")

            # print("types: %s" % types)
            # print("callback: %s" % callback)
            # print("bbox: %s" % bbox)

            #places = cache.get(bbox)
            #if not places:
            places = filter_places(types, bbox)[:100]
            #cache.set(bbox, list(places))

            return HttpResponse(serialize_places(places, callback))

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")


def filter_places(types, bbox):
    # convert string to list of strings
    types = unquote(types)
    types = eval(types)

    bbox = list(map(lambda x: float(x), bbox.split(',')))

    lat_left_down = bbox[0]
    lon_left_down = bbox[1]
    lat_right_up = bbox[2]
    lon_right_up = bbox[3]

    # get points in rectangle are specified by two point (lat_left_down,lon_left_down) and (lat_right_up,lon_right_up)
    return Place.objects.select_related().filter(id_type__in=types,
                                                 lat__gt=lat_left_down,
                                                 lat__lt=lat_right_up,
                                                 lon__gt=lon_left_down,
                                                 lon__lt=lon_right_up)


def serialize_places(places, callback):
    features = []
    content = iter(eval(serializers.serialize('json', places)))

    for place in places:
        feature = {
            "type": 'Feature',
            "geometry": {
                "type": "Point",
                "coordinates": [place.lat, place.lon]
            },
            "id": place.id,
            "properties": {
                "balloonContent": render_to_response('balloon_content.html', next(content)['fields']).content.decode('utf-8'),
            },
            "options": {
                "iconLayout": "default#image",
                "iconImageHref": "static/app/images/metka2.png",
                "iconImageSize": [40, 60],
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
            received_json_data = eval(str_response)

            types = received_json_data['types']

            if types == None:
                print("ERROR: Types is none!")
                return HttpResponse("ERROR: Types is none!")

            # use django session and save type
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

            # Function 'eval' is not secure!
            received_json_data = eval(str_response)

            route = eval(received_json_data['points'])

            if route == None:
                print("ERROR: Route is none!")
                return HttpResponse("ERROR: route is none!")

            # use django session and save route param for current session
            print('Route %s ' % str(route))

            return HttpResponse(get_polygons(0.02, route))

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")

    return HttpResponse("Not POST request!")
