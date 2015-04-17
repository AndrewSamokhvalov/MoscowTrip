# -*- coding: utf-8 -*-
from django.core.exceptions import ValidationError

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from card.models import *
from django.contrib.auth.decorators import login_required
import json
from card.utils import address_to_coordinates


@csrf_exempt
def get_user_places(request):
    places = Place.objects.filter(user_id=request.user)
    res = []
    for place in places:
        data = {
            'id': place.id,
            'name': place.name,
            'edit_url': '#editPlace/%d' % place.id,
            'create_time': place.create_date.strftime("%Y-%m-%d %H:%M:%S"),
            'edit_time': place.last_edit_date.strftime("%Y-%m-%d %H:%M:%S")
        }
        res.append(data)

    return HttpResponse(json.dumps(res))


def get_supported_types():
    types = Type.objects.all()
    res = []
    for t in types:
        res.append(
            {
                'id': t.id,
                'name': t.name
            }
        )
    return res


@csrf_exempt
@login_required(login_url='/managePlaces/login/')
def base_manage_places(request):
    return render_to_response('manage_places/base.html', {'username': request.user.username})


@csrf_exempt
@login_required(login_url='/managePlaces/login/')
def manage_places(request):
    if 'place_types' not in request.session:
        request.session['place_types'] = get_supported_types()

    return render_to_response('manage_places/manage_places.html')


@csrf_exempt
@login_required(login_url='/managePlaces/login/')
def add_place(request):
    if request.method == 'GET':
        if 'place_types' not in request.session:
            request.session['place_types'] = get_supported_types()
        return render_to_response('manage_places/add_place.html',
                                  {
                                      'types': request.session['place_types']
                                  })
    elif request.method == 'POST':
        str_response = request.body.decode('utf-8')
        received_json_data = json.loads(str_response)
        print(received_json_data)

        return save_place(received_json_data, request.user, False)


def get_user_place_info(request):
    if request.method == 'GET':
        try:
            place_id = int(request.GET.get('place_id'))
            place = Place.objects.select_related().get(id=place_id, user_id=request.user)

            res = [{
                       'fields':
                           {
                               'id': place.id,
                               'name': place.name,
                               'id_type': place.id_type.name,
                               'address': place.address,
                               'description': place.description,
                               'working_hours': place.working_hours,
                               'cost': place.cost,
                               'e_mail': place.e_mail,
                               'website': place.website,
                               'vk_link': place.vk_link,
                               'phone': place.phone,
                               'main_pic_url': place.main_pic_url,
                               'tagNames': [t.tag for t in place.id_tag.all()],
                               'images': [image.url_image for image in Image.objects.filter(id_place=place.id)]
                           }
                   }]
            print(res)
            return HttpResponse(json.dumps(res))
        except:
            return HttpResponse("Incorrect placeId value")


def get_tags(request):
    tags = Tag.objects.all()
    res = []
    for tag in tags:
        data = {
            'id': tag.id,
            'name': tag.tag
        }
        res.append(data)

    return HttpResponse(json.dumps(res))


@csrf_exempt
@login_required(login_url='/managePlaces/login/')
def edit_place(request):
    if request.method == 'GET':
        if 'place_types' not in request.session:
            request.session['place_types'] = get_supported_types()
        return render_to_response('manage_places/edit_place.html',
                                  {
                                      'types': request.session['place_types'],
                                  })
    elif request.method == 'POST':
        str_response = request.body.decode('utf-8')
        received_json_data = json.loads(str_response)
        # print(received_json_data)

        return save_place(received_json_data, request.user)


def delete_user_place(request):
    if request.method == 'GET':
        try:
            place_id = int(request.GET.get('place_id'))
            place = Place.objects.select_related().get(id=place_id, user_id=request.user)
            place.delete()
            return HttpResponse("ok")
        except:
            return HttpResponse("Incorrect placeId value")


def save_place(received_json_data, user, is_edit=True):

    fields = [
        'name',
        'address',
        'description',
        'working_hours',
        'cost',
        'e_mail',
        'website',
        'vk_link',
        'phone',
        'main_pic_url'
    ]

    try:
        if is_edit:
            place = Place.objects.get(id=received_json_data['id'])
        else:
            place = Place()

        for field in fields:
            if field in received_json_data:
                if getattr(place, field) != received_json_data[field]:
                    setattr(place, field, received_json_data[field])
                    if field == fields[1]:
                        coordinates = address_to_coordinates(place.address)
                        if coordinates is None:
                            return HttpResponse(
                                json.dumps(
                                    {
                                        'address':
                                            [u'Адрес некорректен. Из адреса не могут быть получены координаты.']
                                    }
                                ))
                        lon, lat = coordinates
                        place.lon = lon
                        place.lat = lat

        place.id_type = Type.objects.get(name=received_json_data['id_type'])
        place.user_id = user

        try:
            place.full_clean()
        except ValidationError as exp:
            print(exp)
            return HttpResponse(str(exp))

        place.save()

        place.id_tag = []
        for tag_name in received_json_data['tagNames']:

            try:
                Tag(tag=tag_name['text']).full_clean()
            except ValidationError as exp:
                print(exp)
                return HttpResponse(str(exp))

            tag, created = Tag.objects.get_or_create(tag=tag_name['text'])
            if not created:
                if place.id_tag.filter(id=tag.id).count() == 0:
                    print('add existing tag')
                    place.id_tag.add(tag)
            else:
                print('add new tag')
                place.id_tag.add(tag)

        images = received_json_data['images']

        for image in Image.objects.filter(id_place=place.id):
            image.delete()

        for image in images:
            Image(id_place_id=place.id, url_image=image).save()

    except KeyError as exp:
        print(exp)
        return HttpResponse('incorrect place format')

    return HttpResponse('ok')