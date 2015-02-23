# -*- coding: utf-8 -*-

import json

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from urllib.parse import unquote


from card.models import *


def card(request):
    return render_to_response('index.html')


def test(request):
    return render_to_response('test.html')


@csrf_exempt
def get_places(request):
    if request.method == 'GET':
        try:
            filters = request.GET.get('filters');

            places = Place.objects.select_related() \
                .filter(
                id_type_id__in=filters
            )

            places = places[:20]

            res = []
            for place in places:
                d = {}
                d["id"] = place.id
                d["coords"] = [
                    place.id_location.latitude,
                    place.id_location.longitude
                ]
                d["type"] = place.id_type.id
                d["properties"] = \
                    {
                        "hintContent": place.common_name,
                        "balloonContent": place.description
                    }
                res.append(d)

            return HttpResponse(json.dumps(res))

        except ValueError:
            return HttpResponse("error in json format")
    return HttpResponse("")


@csrf_exempt
def get_test(request):
    if request.method == 'GET':
        try:

            types = request.COOKIES.get('roadtrippers-types')
            callback = request.GET.get('callback')
            bbox = request.GET.get('bbox')

            # print("types: %s" % types)
            # print("callback: %s" % callback)
            # print("bbox: %s" % bbox)
            # r = render_to_response('ballon_content.html')
            # print(r.content)
            places = filter_places(types, bbox)

            # print(serialize_places(places[:2]))
            return HttpResponse(serialize_places(places[:100], callback))

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")


def filter_places(types, bbox):
    # convert string to list of strings
    types = unquote(types)
    types = types[types.find('[') + 1: types.find(']')]
    types = types.split(',')

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
    for place in places:
        feature = {
            "type": 'Feature',
            "geometry": {
                "type": "Point",
                "coordinates": [place.id_location.latitude, place.id_location.longitude]
            },
            "id": place.id,
            "properties": {
                "balloonContent": render_to_response('ballon_content.html').content.decode('utf-8'),
                "clusterCaption": "Метка 2",
                "hintContent": "Текст подсказки"
                # "iconContent": 'Содержимое метки'
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