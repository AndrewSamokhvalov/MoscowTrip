# -*- coding: utf-8 -*-

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from card.models import *
from django.core.cache import cache
import random

from card.polygon import *
import json


def card(request):
    return render_to_response('main.html')


@csrf_exempt
def get_places(request):
    if request.method == 'GET':
        try:
            types = request.session.get('types')
            radius = request.session.get('radius')
            route = request.session.get('route')
            callback = request.GET.get('callback')
            bbox = request.GET.get('bbox')

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
            places = filter_places(route, types, radius, bbox)
            # cache.set(bbox, list(places))

            # if route not None:
            # filter_by_route()

            return HttpResponse(serialize_places(places, callback))

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")


def filter_places(route, types, radius, bbox):
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
        idplaces = []
        for place in places:

            lat1 = place.lat
            lon1 = place.lon
            for point in route:
                lat2 = point[0]
                lon2 = point[1]

                d = math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2)
                if d < radius:
                    idplaces.append(place.id)
                    break

        places = places.filter(id__in=idplaces)

    return places.order_by('-rating')[:20]


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
            'rating': place.rating
        }

        feature = {
            "type": 'Feature',
            "geometry": {
                "type": "Point",
                "coordinates": [place.lat, place.lon]
            },
            "id": place.id,
            "options": {
                "iconLayout": "default#image",
                "iconImageHref": place.id_type.url_image_marker,
                "iconImageSize": [30, 40],
            },
            "fields": {
                "rating": str(float(place.rating)),
                "name": place.name,
                "image": url,
                "type": place.id_type_id,
                "id": place.pk
            }

        }

        features.append(feature)
    # Последний элемент с отрицательныйм id отправляется для того чтобы на клиенте понять что сегмент полностью загрузился
    feature = {
        "type": 'Feature',
        "geometry": {
            "type": "Point",
            "coordinates": [0, 0]
        },
        "id": (-1) * random.randint(1, math.pow(10, 10))
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
def get_area(request):
    if request.method == 'POST':
        try:
            str_response = request.body.decode('utf-8')
            received_json_data = json.loads(str_response)

            if radius == None:
                print("ERROR: Types is none!")
                return HttpResponse("ERROR: Types is none!")

            request.session['radius'] = radius / 50000
            print('Radius %s ' % str(radius))

            return HttpResponse("Good!")

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")

    return HttpResponse("Not POST request!")


@csrf_exempt
def set_radius(request):
    if request.method == 'POST':
        try:
            str_response = request.body.decode('utf-8')
            received_json_data = json.loads(str_response)
            radius = float(json.loads(received_json_data['radius']))

            if radius == None:
                print("ERROR: Types is none!")
                return HttpResponse("ERROR: Types is none!")

            request.session['radius'] = radius / 50000
            print('Radius %s ' % str(radius))

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

            radius = request.session.get('radius')
            route = json.loads(received_json_data['points'])

            if route == None:
                print("ERROR: Route is none!")
                return HttpResponse("ERROR: route is none!")

            # use django session and save route param for current session
            request.session['route'] = route
            print('Route %s ' % str(route))

            return HttpResponse(get_polygons(radius, route))

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
            return HttpResponse(serializers.serialize("json", place, fields=(
                'name',
                'address',
                'website',
                'description',
                'working_hours',
                'cost',
                'e_mail',
                'vk_link',
                'website',
                'phone',
            )))

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")



