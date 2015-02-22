import json

from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from card.models import *


def card(request):
    return render_to_response('roadtrippers.html')


@csrf_exempt
def get_places(request):
    if request.method == 'POST':
        try:

            json_data = json.loads(request.body.decode())
            filters = json_data["filters"]
            # activeArea = json_data["activeArea"]
            #
            # lon1, lat1 = activeArea[0]
            # lon2, lat2 = activeArea[1]

            places = Place.objects.select_related()\
                .filter(
                    id_type_id__in=filters
                )

            # places = filter(lambda place:
            #                 lon1 < place.id_location.longitude < lon2 and
            #                 lat2 < place.id_location.latitude < lat1,
            #                 places)

            places = places[:20]

            res = []
            for place in places:
                d = {}
                d["id"] = place.id
                d["coords"] = [
                    place.id_location.latitude,
                    place.id_location.longitude
                ]
                d["type"] = place.id_type.id
                d["properties"] = \
                    {
                        "hintContent": place.common_name,
                        "balloonContent": place.description
                    }
                res.append(d)

            return HttpResponse(json.dumps(res))

        except ValueError:
            return HttpResponse("error in json format")

    return HttpResponse("")


@csrf_exempt
def get_types(request):

    return HttpResponse("")


@csrf_exempt
def map_update(request):
    # if request.method == 'POST' and request.is_ajax():
    #
    #     filters = request.POST.dict()
    #     objects = []
    #     if filters != None:
    #         for key in filters:
    #             value = filters[key]
    #             isFiltred = value.lower() in ("yes", "true", "t", "1")
    #             if not isFiltred:
    #                 objects += Event.objects.filter(type=key)
    #                 # data += serializers.serialize("json", objects)
    #     else:
    #         objects = Event.objects.all()
    #
    #     data = serializers.serialize("json", objects)
    #
    #     return HttpResponse(data, content_type="application/json")

    return None