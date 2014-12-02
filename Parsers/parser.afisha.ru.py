__author__ = 'andrey'

import lxml.html as html

DEBUG = "Y"

def dprint(str):
    if DEBUG == "Y":
        print(str)

class Event():
    date = None
    address = None
    time = None
    description = None

    def __init__(self, date=None, address=None, time=None, description=None):
        self.date = date
        self.address = address
        self.time = time
        self.description = description

    def json(self):
        return {'Date': self.date, 'Address': self.address, 'Description': self.description}


class Parser():
    regex_date = ".//*[@id='recommendations-main-holder']/div/div[7]/div/div/h2"
    regex_event = ".//*[@id='recommendations-main-holder']/div/div/div/div/div/div/h3/span/a"
    regex_event_description = ".//*[@id='ctl00_CenterPlaceHolder_ucMainPageContent_pEditorComments']"
    regex_address = ".//*[@id='content']/div[1]/div[1]/div/div[2]/a"
    regex_date = ".//*[@id='Span2']"

    def parse(self, html):
        pass


class ConcertParser(Parser):
    address_and_date = ".//*[@id='content']/div[1]/div[1]/div/div[2]"

    def parse(self, url):
        page = html.parse(url)
        dates = page.xpath(self.regex_date)
        exhibitions = page.xpath(self.regex_event)

        for date in dates:
            dprint("Date: %s" % date.text)

        events_list = []
        for exhibition in exhibitions:

            dprint("=" * 20)
            dprint("Exhibition name: %s" % exhibition.text)
            dprint("Additional info: %s" % exhibition.attrib['href'])
            url_decription = exhibition.attrib['href']
            page_additional_info = html.parse(url_decription)

            event_description = "Пусто"
            try:
                event_description = page_additional_info.xpath(self.regex_event_description).pop().text
            except Exception:
                pass

            dprint("Description: %s" % event_description)

            event_address = page_additional_info.xpath(self.regex_address).pop().text
            event_date = page_additional_info.xpath(self.regex_date).pop().text

            dprint("Address: %s" % event_address)
            dprint("Date: %s" % event_date)

            event = Event(description=event_description, address=event_address, date=event_date)
            events_list.append(event)

        return events_list

url_main = "http://www.afisha.ru/"
url_restaurants = "msk/restaurants/"
url_cinema = "msk/cinema/"
url_concert = "msk/concerts/"
url_exhibition = "msk/exhibitions/"

cp = ConcertParser()
concerts = cp.parse(url_main + url_concert)

geo_objects = []

for concert in concerts:
    geo_objects.append(concert.json())
