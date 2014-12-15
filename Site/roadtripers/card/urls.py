from django.conf.urls import patterns, url

import views

urlpatterns = patterns('',

    url(r'^$', views.card, name='index'),
    url(r'^ajax_map_update', views.map_update, name='index'),

    url(r'^places/?$', views.get_places)
)
