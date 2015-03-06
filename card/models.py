from django.db import models


# class Location(models.Model):
#     address = models.CharField(max_length=200, default="none")
#
#     longitude = models.FloatField()
#     latitude = models.FloatField()
#
#
# class Type(models.Model):
#     name = models.CharField(max_length=200)
#
#
# class Place(models.Model):
#     id_location = models.ForeignKey(Location)
#     id_type = models.ForeignKey(Type)
#
#     common_name = models.CharField(max_length=100)
#     description = models.CharField(max_length=300)
#
#     full_name = models.CharField(max_length=200)
#     short_name = models.CharField(max_length=100)
#
#     public_phone = models.CharField(max_length=50)
#     working_hours = models.CharField(max_length=200)
#
#     web_site = models.URLField()
#     rating = models.FloatField()


class Type(models.Model):
    name = models.CharField(max_length=100)
    url_image_marker = models.URLField()
    url_image_mini_marker = models.URLField() # if place has small rating


class Tag(models.Model):
    tag = models.CharField(max_length=100)


class Place(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    website = models.CharField(max_length=100, blank=True)
    description = models.CharField(max_length=1500)
    working_hours = models.CharField(max_length=200, blank=True)
    cost = models.FloatField(blank=True, null=True)
    lat = models.FloatField()
    lon = models.FloatField()
    rating = models.FloatField()
    e_mail = models.EmailField(blank=True)
    vk_link = models.URLField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    id_type = models.ForeignKey(Type)
    id_tag = models.ManyToManyField(Tag, blank=True)


class Image(models.Model):
    id_place = models.ForeignKey(Place)
    url_image = models.URLField()