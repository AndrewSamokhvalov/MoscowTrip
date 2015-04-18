# -*- coding: utf-8 -*-
from django.core.exceptions import ValidationError

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from card.models import *
from card.polygon import *
import json
import random


def card(request):
    request.session.clear()
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

            if types is None:
                print("ERROR: Types is none!")
                return HttpResponse("ERROR: Types is none!")

            if route is None:
                print("ERROR: Route is none!")
                return HttpResponse("ERROR: Route is none!")

            if radius is None:
                print("ERROR: Radius is none!")
                return HttpResponse("ERROR: Radius is none!")

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

    return places.order_by('-rating')[:50]


def serialize_places(places, callback):
    features = []
    idplaces = set(place.id for place in places)
    #images = Image.objects.all().filter(id_place__in=idplaces).values('id', 'url_image')

    for place in places:

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
                "image": place.main_pic_url,
                "likes": place.likes,
                "type": place.id_type_id,
                "id": place.pk
            }

        }

        features.append(feature)
    # Последний элемент с отрицательныйм id отправляется для того чтобы на клиенте понять что сегмент полностью загрузился


    objectid = (-1) * random.randint(1, math.pow(10, 10))
    feature = {
        "type": 'Feature',
        "geometry": {
            "type": "Point",
            "coordinates": [0, 0]
        },
        "id": objectid,
        "fields": {
            "id": objectid
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
def types(request):
    if request.method == 'PUT':
        try:
            str_response = request.body.decode('utf-8')
            received_json_data = json.loads(str_response)
            types = json.loads(received_json_data['types'])

            if types is None:
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

    if request.method == 'GET':
        try:
            types = request.session.get('types')

            if types is None:
                types = []
                request.session['types'] = types
                #return HttpResponse("ERROR: Types is none!")

            print('Types %s ' % str(types))

            return HttpResponse(json.dumps(types))

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")

    return HttpResponse("Not POST request!")


@csrf_exempt
def radius(request):
    if request.method == 'PUT':
        try:
            str_response = request.body.decode('utf-8')
            received_json_data = json.loads(str_response)
            radius = float(json.loads(received_json_data['radius']))
            route = request.session.get('route')

            if radius is None:
                print("ERROR: Radius is none!")
                return HttpResponse("ERROR: Radius is none!")

            if route is None:
                print("ERROR: Route is none!")
                return HttpResponse("ERROR: Route is none!")


            radius = radius / 50000
            request.session['radius'] = radius
            print('Radius %s ' % str(radius))

            return HttpResponse(get_polygons(radius, route))

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")

    if request.method == 'GET':
        try:
            radius = request.session.get('radius')
            if radius is None:
                radius = 1000
                request.session['radius'] = float(radius / 50000)

            if radius is float('nan'):
                radius = 1000
                request.session['radius'] = float(radius / 50000)

            print('Radius %s ' % str(radius))

            return HttpResponse(json.dumps(radius))

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
            radius = json.loads(received_json_data['radius'])

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
            # images = Image.objects.select_related().filter(id_place=place_id)
            json_place = serializers.serialize("json", place, fields=(
                'address',
                'website',
                'description',
                'working_hours',
                'cost',
                'e_mail',
                'vk_link',
                'website',
                'C',
                'lat',
                'lon',
                'id_tag',
            ))

            place = json.loads(json_place)[0]

            id_tags = place['fields']['id_tag']
            del place['fields']['id_tag']
            tags = Tag.objects.select_related().filter(id__in=id_tags)
            json_tags = serializers.serialize("json", tags)
            tags = json.loads(json_tags)
            ltags = []
            for tag in tags:
                ltags.append(tag['fields']['tag'])
            place['fields']['tags'] = ltags

            # add places images
            place['fields']['additional_images'] = \
                [image.url_image for image in Image.objects.filter(id_place=place_id)]

            return HttpResponse(json.dumps(place['fields']))

        except Exception as inst:
            print("=" * 150)
            print(type(inst))  # the exception instance
            print(inst.args)  # arguments stored in .args
            print(inst)  # __str__ allows args to be printed directly
            return HttpResponse("error!")


@csrf_exempt
def add_place_like(request):
    if request.method == 'POST':
        str_response = request.body.decode('utf-8')
        received_json_data = json.loads(str_response)
        place_id = received_json_data['place_id']

        place = Place.objects.get(id=place_id)
        place.likes += 1
        place.save()

        return HttpResponse('ok')
