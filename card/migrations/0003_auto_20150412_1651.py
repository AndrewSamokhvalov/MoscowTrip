# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('card', '0002_auto_20150307_0218'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='create_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 4, 12, 16, 51, 46, 356000), auto_now_add=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='place',
            name='last_edit_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 4, 12, 16, 51, 46, 356000), auto_now=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='place',
            name='main_pic_url',
            field=models.URLField(default=b'http://img.vos.uz/pjp05.jpg', max_length=100),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='place',
            name='user_id',
            field=models.ForeignKey(default=None, blank=True, to=settings.AUTH_USER_MODEL, null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='place',
            name='cost',
            field=models.FloatField(default=None, null=True, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='place',
            name='e_mail',
            field=models.EmailField(max_length=100, blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='place',
            name='vk_link',
            field=models.URLField(max_length=100, blank=True),
            preserve_default=True,
        ),
    ]
