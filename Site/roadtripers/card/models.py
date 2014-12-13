from django.db import models

# Create your models here.

# class Event(models.Model):
# type = models.CharField(max_length=200, default="none")
# longitude = models.FloatField()
#     latitude = models.FloatField()
#
#     event_date = models.DateTimeField()
#     event_place = models.CharField(max_length=200)


class Location(models.Model):
    address = models.CharField(max_length=200, default="none")

    longitude = models.FloatField()
    latitude = models.FloatField()


class Type(models.Model):
    name = models.CharField(max_length=200)


class Place(models.Model):
    id_location = models.ForeignKey(Location)
    id_type = models.ForeignKey(Type)

    common_name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)

    full_name = models.CharField(max_length=200)
    short_name = models.CharField(max_length=100)

    public_phone = models.CharField(max_length=50)
    working_hours = models.CharField(max_length=200)

    web_site = models.URLField()
    rating = models.FloatField()