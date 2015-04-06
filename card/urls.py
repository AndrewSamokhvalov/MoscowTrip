from django.conf.urls import patterns, url

from card import views

urlpatterns = patterns('',

    url(r'^getPlaces/?', views.get_places),
    url(r'^getPlaceInfo/?', views.get_place_info),
    url(r'^setTypes/?', views.set_types),
    url(r'^setRoute/?', views.set_route),
    url(r'^$', views.card, name='index'),
    url(r'^managePlaces/addPlace/?', views.add_place),
    url(r'^managePlaces/editPlace/?', views.edit_place),
    url(r'^managePlaces/?', views.manage_places),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login', {'template_name': 'auth/login.html'}),
)
