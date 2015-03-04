from django.conf.urls import patterns, url

from card import views

urlpatterns = patterns('',

    url(r'^places/?', views.get_places),
    url(r'^$', views.card, name='index'),

)
