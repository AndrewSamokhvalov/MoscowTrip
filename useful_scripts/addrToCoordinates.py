# -*- coding: utf-8 -*-

__author__ = 'Constantine-pc'

import requests
import json

def address_to_coords(address):
    res = requests.get("http://geocode-maps.yandex.ru/1.x/?format=json&geocode=%s" % address).text
    json_res = json.loads(res)
    lon, lat = json_res["response"]["GeoObjectCollection"]["featureMember"][0]["GeoObject"]["Point"]["pos"].split(" ")
    return lon, lat
