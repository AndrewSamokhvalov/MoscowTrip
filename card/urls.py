from django.conf.urls import patterns, url

from card import views

urlpatterns = patterns('',

    url(r'^getPlaces/?', views.get_places),
    url(r'^getPlaceInfo/?', views.get_place_info),
    url(r'^setTypes/?', views.set_types),
    url(r'^setRoute/?', views.set_route),
    url(r'^radius/?', views.radius),

    url(r'^$', views.card, name='index'),

)
