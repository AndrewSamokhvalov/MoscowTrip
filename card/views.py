# -*- coding: utf-8 -*-

import json
import ast
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import unquote
from django.core import serializers

from card.models import *
from django.core.cache import cache

def card(request):
    return render_to_response('index.html')

@csrf_exempt
def get_places(request):
    if request.method == 'GET':
        try:
            types = request.GET.get('types')
            callback = request.GET.get('callback')
            bbox = request.GET.get('bbox')

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
                                                 id_location__latitude__gt=lat_left_down,
                                                 id_location__latitude__lt=lat_right_up,
                                                 id_location__longitude__gt=lon_left_down,
                                                 id_location__longitude__lt=lon_right_up)


def serialize_places(places, callback):
    features = []
    content = iter(eval(serializers.serialize('json', places)))

    for place in places:
        feature = {
            "type": 'Feature',
            "geometry": {
                "type": "Point",
                "coordinates": [place.id_location.latitude, place.id_location.longitude]
            },
            "id": place.id,
            "properties": {
                "balloonContent": render_to_response('balloon_content.html', next(content)['fields']).content.decode('utf-8'),
            },
            "options": {
                "preset": 'islands#circleIcon',
                "iconColor": '#4d7198'
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