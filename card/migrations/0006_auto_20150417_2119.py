# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('card', '0005_auto_20150412_1845'),
    ]

    operations = [
        migrations.AddField(
            model_name='place',
            name='likes',
            field=models.IntegerField(default=0),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='place',
            name='create_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 4, 17, 21, 19, 38, 222000), auto_now_add=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='place',
            name='last_edit_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 4, 17, 21, 19, 38, 223000), auto_now=True),
            preserve_default=True,
        ),
    ]
