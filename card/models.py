import datetime
from django.db import models
from django.contrib.auth.models import User


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
    description = models.CharField(max_length=10000)
    working_hours = models.CharField(max_length=200, blank=True)
    cost = models.FloatField(blank=True, null=True, default=None)
    lat = models.FloatField()
    lon = models.FloatField()
    rating = models.FloatField(default=0)
    e_mail = models.EmailField(max_length=100, blank=True)
    vk_link = models.URLField(max_length=100, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    id_type = models.ForeignKey(Type)
    id_tag = models.ManyToManyField(Tag, blank=True)
    create_date = models.DateTimeField(auto_now_add=True, default=datetime.datetime.now())
    last_edit_date = models.DateTimeField(auto_now=True, default=datetime.datetime.now())
    main_pic_url = models.URLField(max_length=100, default='http://img.vos.uz/pjp05.jpg')
    user_id = models.ForeignKey(User, null=True, blank=True, default=None)
    likes = models.IntegerField(default=0)


class Image(models.Model):
    id_place = models.ForeignKey(Place)
    url_image = models.URLField()