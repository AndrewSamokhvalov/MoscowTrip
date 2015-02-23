from django.conf.urls import patterns, url

from card import views

urlpatterns = patterns('',

    url(r'^places/?', views.get_places),
    url(r'^testPlaces/?', views.get_test),

    url(r'^test', views.test),
    url(r'^$', views.card, name='index'),

)
