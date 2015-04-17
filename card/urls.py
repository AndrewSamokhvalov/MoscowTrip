from django.conf.urls import patterns, url

from card import views
from card.manage_places import views as manage_places_views

urlpatterns = patterns('',

    url(r'^getPlaces/?', views.get_places),
    url(r'^getPlaceInfo/?', views.get_place_info),
    url(r'^types/?', views.types),
    url(r'^setRoute/?', views.set_route),
    url(r'^radius/?', views.radius),

    url(r'^$', views.card, name='index'),
    url(r'managePlaces/addedPlaces/?', manage_places_views.manage_places),
    url(r'^managePlaces/addPlace/?', manage_places_views.add_place),
    url(r'^managePlaces/editPlace/?', manage_places_views.edit_place),
    url(r'^managePlaces/login/?$', 'django.contrib.auth.views.login',
        {
            'template_name': 'auth/login.html',
        }),

    url(r'^managePlaces/logout/?$', 'django.contrib.auth.views.logout',
        {
            'next_page': '/managePlaces'
        }),

    url(r'^managePlaces/?', manage_places_views.base_manage_places),

    url(r'^getUserPlaces/?', manage_places_views.get_user_places),

    url(r'^getUserPlaceInfo/?', manage_places_views.get_user_place_info),

    url(r'^getTags/?', manage_places_views.get_tags),

    url(r'^deleteUserPlace/?', manage_places_views.delete_user_place),
)