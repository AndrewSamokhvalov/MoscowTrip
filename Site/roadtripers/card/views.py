from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.template import RequestContext, loader

from django.views.decorators.csrf import csrf_exempt
from card.models import Event
from django.core import serializers


def card(request):
    return render_to_response('card/roadtrippers.html')


@csrf_exempt
def map_update(request):

    if request.method == 'POST' and request.is_ajax():

        filters = request.POST.dict()
        objects = []
        if filters != None:
            for key in filters:
                value = filters[key]
                isFiltred = value.lower() in ("yes", "true", "t", "1")
                if not isFiltred:
                    objects += Event.objects.filter(type=key)
                    # data += serializers.serialize("json", objects)
        else:
            objects = Event.objects.all()

        data = serializers.serialize("json", objects)

        return HttpResponse(data, content_type="application/json")

    return None