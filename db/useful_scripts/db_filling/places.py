# -*- coding: utf-8 -*-

__author__ = 'Constantine-pc'

from abc import ABCMeta, abstractmethod
from addrToCoordinates import address_to_coords


class Location:
    def __init__(self, address, lon, lat):
        self.address = address
        self.lon = lon
        self.lat = lat

    def __eq__(self, other):
        return isinstance(other, self.__class__) and self.__dict__ == other.__dict__

    def __ne__(self, other):
        return not self.__eq__(other)


class AbstractPlace(object):
    __metaclass__ = ABCMeta
    json = None
    cells = None
    type = None
    detailed_type = None

    def get_common_name(self):
        try:
            return self.cells["CommonName"]
        except KeyError:
            return self.cells["Name"]

    def get_full_name(self):
        try:
            return self.cells["FullName"]
        except KeyError:
            return self.get_common_name()

    def get_short_name(self):
        try:
            return self.cells["ShortName"]
        except KeyError:
            return self.get_common_name()

    def get_public_phone(self):
        try:
            return self.cells["PublicPhone"]
        except KeyError:
            try:
                return self.cells["Phone"]
            except KeyError:
                try:
                    return self.cells["HelpPhone"]
                except KeyError:
                    return None

    def get_working_hours(self):
        try:
            return self.cells["WorkingHours"]
        except KeyError:
            try:
                return self.cells["SportZoneWorkingHours"]
            except KeyError:
                return None

    def get_web_site(self):
        try:
            return self.cells["WebSite"]
        except KeyError:
            return None

    def get_rating(self):
        return 0

    def get_location(self):
        try:
            address = self.cells["Address"]
        except KeyError:
            address = self.cells["Location"]

        try:
            lon = self.json["Lon"]
            lat = self.json["Lat"]
        except KeyError:
            lon, lat = address_to_coords(address)

        return Location((u"Москва, %s" % address), lon, lat)

    def get_detailed_type(self):
        return self.detailed_type

    def get_type(self):
        return self.type

    @abstractmethod
    def get_description(self):
        pass


class Attraction(AbstractPlace):
    def __init__(self, json):
        self.json = json
        self.cells = json["Cells"]
        self.type = 0
        self.detailed_type = u"Аттракционы в скверах и парках"

    def get_description(self):
        res = u"Состояние: %s" % self.cells["State"]
        return res


class Cinema(AbstractPlace):
    def __init__(self, json):
        self.json = json
        self.cells = json["Cells"]
        self.type = 0
        self.detailed_type = u"Кинотеатры"

    def get_description(self):
        res = u"Кол-во залов: %s\n" \
              u"Общее кол-во мест: %s" % \
              (self.cells["NumberOfHalls"], self.cells["TotalSeatsAmount"])
        return res


# Места катания на лошадях
# Площадки для настольных игр
# Летние эстрады, сцены
# Лодочные станции
# Роллердромы, скейтпарки
# Мини-зоопарки
# Автодромы аттракционные
# Зоны отдыха у воды
# Детские игровые площадки в парках
# Места для летнего купания
# Места для пикника

# Площадки пейнтбольные
# Поля для гольфа
# Поля регбийные
# Прокаты спортивного инвентаря
# Стрелковые тиры
# Стрельбища
# Теннисные корты
# Площадки для мини-гольфа
# Бассейны плавательные открытые
# Веревочные городки
# Автодромы детские учебные
# Площадки для городошного спорта
# Площадки для пляжных видов спорта
# Поля футбольные
# Бассейны плавательные крытые
# Тренажерные городки (воркауты)
# Поля конно-спортивные для конкура и выездки
# Автодромы спортивные крытые
# Скалодромы открытые
# Автодромы спортивные открытые
# Спортивные площадки
# Беговые дорожки
# Скалодромы крытые
# Места для кайтинга (вейкбординга)
# Гребные базы и каналы

class SportZone(AbstractPlace):
    def __init__(self, json, type_id=None, detailed_type=None):
        self.json = json
        self.cells = json["Cells"]
        self.type = type_id
        self.detailed_type = detailed_type

    def get_common_name(self):
        try:
            return self.cells["ObjectShortName"]
        except KeyError:
            return self.cells["ObjectName"]

    def get_description(self):
        res = u"Тип услуг: %s\n" \
              u"Аренда экипировки: %s\n" \
              u"Тех. сервис: %s\n" \
              u"Раздевалка: %s\n" \
              u"Столовая: %s\n" \
              u"Туалет: %s\n" \
              u"wi-fi: %s\n" \
              u"Банкомат: %s\n" \
              u"Пункт скорой помощи: %s\n" \
              u"Длина спортивной зоны: %s\n" \
              u"Освещение %s\n" \
              u"Адаптация для инвалидов: %s\n" \
              u"Наличие музыки: %s" % \
              (self.cells["SportZonePaid"],
               self.cells["ObjectHasEquipmentRental"] if "ObjectHasEquipmentRental" in self.cells else None,
               self.cells["ObjectHasTechService"],
               self.cells["ObjectHasDressingRoom"],
               self.cells["ObjectHasEatery"],
               self.cells["ObjectHasToilet"],
               self.cells["ObjectHasWifi"],
               self.cells["ObjectHasCashMachine"],
               self.cells["ObjectHasFirstAidPost"] if "ObjectHasFirstAidPost" in self.cells else None,
               self.cells["SportZoneLength"],
               self.cells["SportZoneLighting"],
               self.cells["SportZoneDisabilityFriendly"] if "SportZoneDisabilityFriendly" in self.cells else None,
               self.cells["SportZoneHasMusic"]) if "SportZoneHasMusic" in self.cells else None
        return res


class ActiveRestPlace(AbstractPlace):
    def __init__(self, json):
        self.json = json
        self.cells = json["Cells"]
        self.type = 0
        self.detailed_type = u"Места для активного отдыха"

    def get_description(self):
        res = u"Вид: %s\n" \
              u"Ограничения: %s\n" \
              u"Ближайшая станция метро: %s\n" \
              u"Дополнительная информация: %s" % \
              (self.cells["ExtremeForm"],
               self.cells["Restrictions"],
               self.cells["NearestMetroStation"],
               self.cells["ExtraInfo"])
        return res


class FirePlace(AbstractPlace):
    def __init__(self, json):
        self.json = json
        self.cells = json["Cells"]
        self.type = 0
        self.detailed_type = u"Площадки для запуска фейерверков в Новогодние и " \
                             u"Рождественские праздники"

    def get_common_name(self):
        return None

    def get_location(self):
        return Location(
            u"Москва, %s" % self.cells["Landmark_address"],
            self.cells["X_wgs"].replace(',', '.'),
            self.cells["Y_wgs"].replace(',', '.'),
        )

    def get_description(self):
        res = u"Число мест: %s\n" \
              u"Вместимость мест: %s" % \
              (self.cells["Number_of_sites"],
               self.cells["Capacity_sites"])

        return res


class SummerCinema(AbstractPlace):
    def __init__(self, json):
        self.json = json
        self.cells = json["Cells"]
        self.type = 0
        self.detailed_type = u"Летние кинотеатры"

    def get_working_hours(self):
        return self.cells["ShowTimes"]

    def get_description(self):
        res = u"Стоимость: %s\n" \
              u"Ближайшая станция метро: %s" % \
              (self.cells["Cost"],
               self.cells["NearestMetroStation"])
        return res


class Library(AbstractPlace):
    def __init__(self, json):
        self.json = json
        self.cells = json["Cells"]
        self.type = 1
        self.detailed_type = u"Библиотеки"

    def get_description(self):
        res = u"Число мест: %s\n" \
              u"Число читателей: %s\n" \
              u"Чило посетителей: %s" % \
              (self.cells["NumOfSeats"],
               self.cells["NumOfReaders"],
               self.cells["NumOfVisitors"])
        return res


class ConcertOrg(AbstractPlace):
    def __init__(self, json):
        self.json = json
        self.cells = json["Cells"]
        self.type = 1
        self.detailed_type = u"Концертные организации"

    def get_description(self):
        return None


class HistoryCulturePlace(AbstractPlace):
    def __init__(self, json):
        self.json = json
        self.cells = json["Cells"]
        self.type = 1
        self.detailed_type = u"Объекты культурного наследия и " \
                             u"Выявленные объекты культурного наследия"

    def get_common_name(self):
        return self.cells["ObjectName"]

    def get_full_name(self):
        return self.cells["EnsembleName"]

    def get_description(self):
        res = u"Статус: %s\n" \
              u"Категория: %s" % \
              (self.cells["SecurityStatus"],
               self.cells["Category"])
        return res


class Theater(AbstractPlace):
    def __init__(self, json):
        self.json = json
        self.cells = json["Cells"]
        self.type = 1
        self.detailed_type = u"Театры"

    def get_description(self):
        res = u"Кол-во мест в главном зале: %s" % \
              (self.cells["MainHallCapacity"])
        return res


class CultureHouse(AbstractPlace):
    def __init__(self, json):
        self.json = json
        self.cells = json["Cells"]
        self.type = 1
        self.detailed_type = u"Дома культуры и клубы"

    def get_description(self):
        return None


class EducationalPlace(AbstractPlace):
    def __init__(self, json):
            self.json = json
            self.cells = json["Cells"]
            self.type = 1
            self.detailed_type = u"Образовательные учреждения Департамента культуры"

    def get_description(self):
        return None


class CultureManagementPlace(AbstractPlace):
    def __init__(self, json):
            self.json = json
            self.cells = json["Cells"]
            self.type = 1
            self.detailed_type = u"Учреждения Департамента культуры, " \
                                 u"осуществляющие управленческие функции"

    def get_description(self):
        return None


class ExibitionPlace(AbstractPlace):
    def __init__(self, json):
            self.json = json
            self.cells = json["Cells"]
            self.type = 1
            self.detailed_type = u"Выставочные залы"

    def get_description(self):
        return None


class Museum(AbstractPlace):
    def __init__(self, json):
            self.json = json
            self.cells = json["Cells"]
            self.type = 1
            self.detailed_type = "Музеи"

    def get_description(self):
        res = u"Выстовочная площадь: %s\n" \
              u"Общее количество экспонатов: %s" % \
              (self.cells["ExpositionArea"],
               self.cells["TotalObjAmount"])
        return res


class Toilet(AbstractPlace):
    def __init__(self, json):
            self.json = json
            self.cells = json["Cells"]
            self.type = 2
            self.detailed_type = u"Передвижные туалетные модули"

    def get_description(self):
        res = u"Состояние: %s\n" \
              u"Тип услуг: %s\n" \
              u"Возможность оплатить через терминал: %s\n" \
              u"Адаптация для инвалидов: %s" % \
              (self.cells["CloseFlag"],
               self.cells["PaidService"],
               self.cells["PaymentTerminalAvailability"],
               self.cells["DisabilityFriendly"])
        return res


class Fountain(AbstractPlace):
    def __init__(self, json):
            self.json = json
            self.cells = json["Cells"]
            self.type = 2
            self.detailed_type = u"Фонтаны"

    def get_description(self):
        return None


class SportObject(AbstractPlace):
    def __init__(self, json):
            self.json = json
            self.cells = json["Cells"]
            self.type = 3
            self.detailed_type = u"Спортивные объекты города Москвы"

    def get_location(self):
        return Location(
            u"Москва, %s" % self.cells["AddressBti"],
            self.json["Lon"],
            self.json["Lat"]
        )

    def get_description(self):
        res = u"Тип: %s\n" \
              u"Адаптация для инвалидов: %s" % \
              (self.cells["PropertyType"],
               u"да" if self.cells["PrisposoblenDlyaInvalidov"] == True else u"нет")
        return res


class BicyclePaths(AbstractPlace):
    def __init__(self, json):
            self.json = json
            self.cells = json["Cells"]
            self.type = 3
            self.detailed_type = u"Велодорожки"

    def get_description(self):
        res = u"Тип: %s\n" \
              u"Ширина: %s" % \
              (self.cells["Type"],
               self.cells["Width"])
        return res

    def get_location(self):
        return Location(
            self.cells["Location"],
            *self.cells["BeginCoords"].split(",")
        )

types = [
    [
        "Attraction",
        "Cinema",
    ] + ["SportZone"]*8 +
    [
        "ActiveRestPlace",
        "FirePlace",
        "SummerCinema"
    ] + ["SportZone"]*3,

    [
        "Library",
        "ConcertOrg",
        "HistoryCulturePlace",
        "Theater",
        "CultureHouse",
        None,
        None,
        "EducationalPlace",
        "CultureManagementPlace",
        None,
        "ExibitionPlace",
        "Museum"
    ],

    ["SportObject"] + ["SportZone"]*19 + ["BicyclePaths"] + ["SportZone"]*6
]

def get_place(type_id, detailed_type_id, json):
    global types

    return eval("%s(json)" % types[type_id][detailed_type_id])