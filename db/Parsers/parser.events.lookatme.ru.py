# -*- coding: utf-8 -*-
__author__ = 'Constantine-pc'

import urllib2
from BeautifulSoup import BeautifulSoup

class Event:
    def __repr__(self):
        res = 'name: %s\ntype: %s\ndate: %s\ntime: %s\naddr: %s\nprice: %s'
        return (res % (self._name_, self._type_, self._date_, self._time_, self._addr_, self._price_)).encode('utf-8')

    def __init__(self, url, date, name, type):
        page = urllib2.urlopen(url)
        soup = BeautifulSoup(page)

        self._date_ = date
        self._type_ = type
        self._name_ = name

        info = soup.find(attrs={'class': 'info'}).findAll('dd')

        self._time_ = info[0].text
        self._addr_ = info[1].text
        self._price_ = info[2].text

baseurl = 'http://events.lookatme.ru'
page = urllib2.urlopen(baseurl + '/cities/moscow/events')
soup = BeautifulSoup(page)

events_data = soup.findAll('div', {'class': 'caption'})

events = []

for event_data in events_data:
    data = event_data.findAll('div')
    date = data[0].text
    type = data[1].a.text
    url  = data[2].a["href"]
    name = data[2].a.text

    events.append(Event(baseurl + url, date, name, type))


for event in events:
    print '======================================='
    print event