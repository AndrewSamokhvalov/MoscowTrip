# -*- coding: utf-8 -*-

__author__ = 'Constantine-pc'

import urllib2
import sqlite3
from BeautifulSoup import BeautifulSoup

filter_words = [u'расформирован', u'демонтирован', u'закрыт']

con = sqlite3.connect('db.sqlite3')
cursor = con.cursor()


def insert_tags(cur, place, place_id):
    select_tag_query = u'SELECT id FROM card_tag WHERE tag=%s'
    insert_new_tags_query = u'INSERT INTO card_tag (tag) VALUES ("%s")'
    insert_query = u'INSERT INTO card_place_id_tag (place_id, tag_id) VALUES (%d, %d)'

    tags = place.tags

    for tag in tags:
        try:
            cur.execute(select_tag_query % tag)
            tag_id = cur.fetchone()
        except:
            cur.execute(insert_new_tags_query % tag)
            tag_id = cur.lastrowid

        cur.execute(insert_query % (place_id, tag_id))


def insert_images(cur, place, place_id):
    global current_image_id
    insert_query = u'INSERT INTO card_image (id_place_id, url_image) VALUES (%d, "%s")'

    insert_query = insert_query % (place_id, place.image)

    try:
        cur.execute(insert_query)
    except:
        print insert_query


def insert_data(cur, place):
    attrlist = ['cost', 'name', 'address', 'website', 'description', 'working_hours', 'lat', 'lon', 'rating', 'e_mail', 'vk_link', 'phone', 'id_type_id']
    insert_query = u'INSERT INTO card_place (%s) VALUES (%s)'

    columns = u''
    values = u''
    for attr in attrlist:
        value = getattr(place, attr)
        if attr == 'working_hours' and value is None:
            value = u'Нет данных'
        if value is not None:
            try:
                value = value.replace('\'', '"')
            except:
                pass

            columns += (u"'%s'" % attr) + u','
            values += (u"'%s'" % value) + u','


    columns = columns[:-1]
    values = values[:-1]

    insert_query = insert_query % (columns, values)

    try:
        cur.execute(insert_query)
        place_id = cur.lastrowid
    except:
        print insert_query

    insert_images(cur, place, place_id)
    insert_tags(cur, place, place_id)


class Place:
    def __init__(self, name, url, type):
            place_page = urllib2.urlopen(url)
            soup = BeautifulSoup(place_page)
            place_info = soup.find('div', {'class': 'place-info'})

            self.cost = 0
            self.name = name
            self.id_type_id = type

            self.tags = map(lambda x: x.text, place_info.findAll('div', {'class': 'place-info_row'})[0].findAll('a'))

            self.image = soup.find('a', {'class': 'place-ava_link'})['href']

            self.rating = place_info.find('div', {'itemprop': 'aggregateRating'})

            if self.rating is not None:
                self.rating = self.rating.meta['content']

            self.address = place_info.find('div', {'itemprop': 'streetAddress'}).text
            self.lat = place_info.find('meta', {'itemprop': 'latitude'})['content']
            self.lon = place_info.find('meta', {'itemprop': 'longitude'})['content']

            self.description = soup.find('div', {'itemprop': 'description'})
            if self.description is not None:
                self.description = self.description.text
            else:
                self.description = u'Нет данных'

            self.phone = place_info.find('span', {'itemprop': 'telephone'})

            if self.phone is not None:
                self.phone = self.phone.text
            else:
                self.phone = ""

            self.website = place_info.find('a', {'itemprop': 'sameAs'})

            if self.website is not None:
                self.website = self.website['href']
            else:
                self.website = ""

            self.working_hours = place_info.find('div', {'itemprop': 'openingHours'})

            if self.working_hours is not None:
                self.working_hours = self.working_hours.text
            else:
                self.working_hours = ""

            self.e_mail = place_info.find('div', {'itemprop': 'email'})
            if self.e_mail is not None:
                self.e_mail = self.e_mail.text
            else:
                self.e_mail = ""

            self.vk_link = soup.find(lambda tag: (tag.name == 'a' and tag.text == u'ВКонтакте'), href=True)
            if self.vk_link is not None:
                self.vk_link = self.vk_link['href']
            else:
                self.vk_link = ""

# dostoprimechatelnosti:
interesting_places_url = 'http://www.2do2go.ru/msk/places/pogulyat/dostoprimechatelnosti/usadby'
# parki
park_places_url = 'http://www.2do2go.ru/msk/places/parki'
# restorany
restaurant_places_url = 'http://www.2do2go.ru/msk/places/posidet/restorany'

urls = [interesting_places_url, restaurant_places_url, park_places_url]

places = []

# proxy = urllib2.ProxyHandler({'http': '127.0.0.1:8080'})
# opener = urllib2.build_opener(proxy)
# urllib2.install_opener(opener)

for type, url in enumerate(urls):

    page_url = url + '?page=%d'


    for i in xrange(1, 100, 1):

        print page_url % i
        page = urllib2.urlopen(page_url % i)
        soup = BeautifulSoup(page)
        places_data = soup.findAll('li', {'class': 'medium-places-list_item'})

        for place_data in places_data:
            a_tag = place_data.find('div', {'class': 'medium-places-list_title'}).a
            href = a_tag['href']
            name = a_tag.text

            if len(filter(lambda x: x in name.lower(), filter_words)) != 0:
                continue

            try:
                place = Place(name, href, type+1)
                places.append(place)

                insert_data(cursor, place)

                print place.name
            except:
                pass

        if soup.find('a', {'href': (page_url % (i + 1))[20:]}) is None or \
                soup.find('a', {'href': (page_url % (i + 2))[20:]}) is None:
            break


con.commit()