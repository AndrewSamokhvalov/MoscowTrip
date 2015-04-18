# -*- coding: utf-8 -*-

__author__ = 'Constantine-pc'

import requests
import json
from card.models import *


def address_to_coordinates(address):
    res = requests.get(u"http://geocode-maps.yandex.ru/1.x/?format=json&geocode=%s" % address)
    json_res = json.loads(res.content.decode('utf-8'))
    if len(json_res["response"]["GeoObjectCollection"]["featureMember"]) == 0:
        return None
    lon, lat = json_res["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["Point"]["pos"].split(" ")
    return float(lon), float(lat)


def recalculate_rating():
    places = Place.objects.all()
    max_likes = max(map(lambda x: x.likes, places))

    for place in places:
        place.rating = 5.0 * place.likes / max_likes
        place.save()