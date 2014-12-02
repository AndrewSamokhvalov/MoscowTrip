from django.db import models

# Create your models here.

class Event(models.Model):
    type = models.CharField(max_length=200, default="none")
    longitude = models.FloatField()
    latitude = models.FloatField()

    event_date = models.DateTimeField()
    event_place = models.CharField(max_length=200)