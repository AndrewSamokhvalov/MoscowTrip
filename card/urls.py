from django.conf.urls import patterns, url

from card import views

urlpatterns = patterns('',

    url(r'^$', views.card, name='index'),
    # url(r'^events', views.map_update, name='index'),
    url(r'^filters/?', views.get_types),

    url(r'^places/?', views.get_places)
    #url(r'^places/id', views.)
)
