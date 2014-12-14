# -*- coding: utf-8 -*-

__author__ = 'Constantine-pc'

import json
import requests
import sqlite3
import places
import sys

# leisureAndEntertainmentId = 162   Досуг и отдых
# cultureId = 5                     Культура
# pedestrianInfrastructureId = 202  Пешеходная инфраструктура
# sportId = 15                      Физическая культура и спорт

categories = [162, 5, 15]

api_key = "eba60fcb620425ace74c1b3b0a610c86"

datasets_json = requests.get("http://api.data.mos.ru/v1/datasets").text

datasets = json.loads(datasets_json)

filteredData = []

for categoryId in categories:
    filteredData.append(
        map(
            lambda x: x["Id"],
            filter(lambda x: x["CategoryId"] == categoryId, datasets)
        )
    )

con = sqlite3.connect('db.sqlite3')
cursor = con.cursor()


def insert_types(cur):
    query = u'INSERT INTO card_type (name)  VALUES ("%s")'

    cur.execute(query % u"Досуг и отдых")
    cur.execute(query % u"Культура")
    cur.execute(query % u"Физическая культура и спорт")


def insert_data(cur, place, type_id):
    insert_place_query = \
        u'INSERT INTO ' \
        u'card_place ' \
        u'(common_name, description, full_name, short_name, ' \
        u'public_phone, working_hours, web_site, rating, id_location_id, id_type_id) ' \
        u'VALUES ("%s", "%s", "%s", "%s", "%s", "%s", "%s", %s, %s, %s)'

    insert_location_query = \
        u'INSERT INTO ' \
        u'card_location ' \
        u'(address, longitude, latitude)  ' \
        u'VALUES ("%s", %s, %s)'

    location = place.get_location()

    select_loc_query = \
        u'SELECT ' \
        u'id ' \
        u'FROM card_location ' \
        u'WHERE address="%s" AND ' \
        u'longitude=%s AND ' \
        u'latitude=%s' % (location.address.replace('\"', '\''), location.lon, location.lat)

    cur.execute(select_loc_query)
    loc_id = cur.fetchone()

    if loc_id is None:
        cur.execute(insert_location_query % (location.address.replace('\"', '\''), location.lon, location.lat))
        cur.execute(select_loc_query)
        location_id = cur.fetchone()[0]
    else:
        location_id = loc_id[0]

    cur.execute(
        insert_place_query %
        (
            place.get_common_name().replace('\"', '\'') if place.get_common_name() is not None else None,
            place.get_description().replace('\"', '\'') if place.get_description() is not None else None,
            place.get_full_name().replace('\"', '\'') if place.get_full_name() is not None else None,
            place.get_short_name().replace('\"', '\'') if place.get_short_name() is not None else None,
            place.get_public_phone(),
            place.get_working_hours(),
            place.get_web_site(),
            place.get_rating(),
            location_id,
            type_id
        ))

# insert_types(cursor)

for type_index, categoryData in enumerate(filteredData):
    print type_index

    for detailed_type_index, dataId in enumerate(categoryData):

        if type_index == 1:
            if detailed_type_index == 5 or \
                            detailed_type_index == 6 or \
                            detailed_type_index == 9:
                continue

        data_json = requests.get("http://api.data.mos.ru/v1/datasets/%d/rows" % dataId).text

        objects_data = json.loads(data_json)

        print "\t%d: total - %d" % (detailed_type_index, len(objects_data))

        ###############

        if len(objects_data) > 1000:
            objects_data = objects_data[:100]

        ###############

        objects_number = len(objects_data)
        number_chars = 50
        freq = objects_number / number_chars

        i = 0
        num_out_chars = 0
        for data in objects_data:
            place = places.get_place(type_index, detailed_type_index, data)
            insert_data(cursor, place, type_index + 1)

            if i >= freq:
                sys.stdout.write('#')
                num_out_chars += 1
                i = 0

        sys.stdout.write('#'*(number_chars-num_out_chars) + "\n")

con.commit()