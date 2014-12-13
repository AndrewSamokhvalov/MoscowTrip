from django.db import models

# Create your models here.

class Place(models.Model):
	Place_ID = models.IntegerField(primary_key=True)
    Location_ID = models.ForeignKey(Location)
    Common_Name = models.CharField(max_length=100)
    Description = models.FloatField()
	Full_Name = models.CharField(max_length=200)
    Short_Name = models.CharField(max_length=100)
	Public_Phone = models.CharField(max_length=50)
	Working_Hours = models.CharField(max_length=200)
	Web_Site = models.URLField()
	Rating = models.FloatField()
	Type_ID = models.ForeignKey(Types)

class Location(models.Model):
	Location_ID_ID = models.IntegerField(primary_key=True)
    Address = models.CharField(max_length=200, default="none")
    Longitude = models.FloatField()
    Latitude = models.FloatField()

class Types(models.Model):
    Type_ID = models.IntegerField(primary_key=True)
    Name = models.CharField(max_length=200)
