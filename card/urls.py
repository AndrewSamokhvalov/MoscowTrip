from django.conf.urls import patterns, url

from card import views

urlpatterns = patterns('',

    url(r'^getPlaces/?', views.get_places),
    url(r'^getPlaceInfo/?', views.get_place_info),
    url(r'^types/?', views.types),
    url(r'^setRoute/?', views.set_route),
    url(r'^radius/?', views.radius),

    url(r'^$', views.card, name='index'),
    url(r'managePlaces/addedPlaces/?', views.manage_places),
    url(r'^managePlaces/addPlace/?', views.add_place),
    url(r'^managePlaces/editPlace/?', views.edit_place),
    url(r'^managePlaces/login/?$', 'django.contrib.auth.views.login',
        {
            'template_name': 'auth/login.html',
        }),

    url(r'^managePlaces/logout/?$', 'django.contrib.auth.views.logout',
        {
            'next_page': '/managePlaces'
        }),

    url(r'^managePlaces/?', views.base_manage_places),

    url(r'^getUserPlaces/?', views.get_user_places),

    url(r'^getUserPlaceInfo/?', views.get_user_place_info),

    url(r'^getTags/?', views.get_tags),

    url(r'^deleteUserPlace/?', views.delete_user_place),
)
