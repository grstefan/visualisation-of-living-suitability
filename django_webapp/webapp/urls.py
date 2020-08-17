from django.urls import path
from django.conf.urls import url

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    url(r'^image\.(?P<image>[a-z]+)$', views.my_image, name='image'),
    url(r'^school\.(?P<save>[01])$', views.get_school, name='school'),
    url(r'^church\.(?P<save>[01])$', views.get_church, name='church'),
    url(r'^restaurant\.(?P<save>[01])', views.get_restaurants, name='restaurant'),
    url(r'^mydata$', views.get_data, name='get_data'),
    url(r'^crimes$', views.get_crimes, name='get_crimes'),
    url(r'^subregions\.population\.(?P<population>[0,1])'
        r'\.crime\.(?P<crime>[0,1])'
        r'\.park\.(?P<parks>[0,1])'
        r'\.school\.(?P<school>[0,1])'
        r'\.church\.(?P<church>[0,1])'
        r'\.restaurant\.(?P<restaurant>[0,1])$', views.get_subregions, name='get_subregions'),
]