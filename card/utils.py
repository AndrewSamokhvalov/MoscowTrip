# -*- coding: utf-8 -*-

__author__ = 'Constantine-pc'

import requests
import json


def address_to_coordinates(address):
    res = requests.get(u"http://geocode-maps.yandex.ru/1.x/?format=json&geocode=%s" % address)
    json_res = json.loads(res.content.decode('utf-8'))
    if len(json_res["response"]["GeoObjectCollection"]["featureMember"]) == 0:
        return None
    lon, lat = json_res["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["Point"]["pos"].split(" ")
    return float(lon), float(lat)