# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('card', '0004_auto_20150412_1811'),
    ]

    operations = [
        migrations.AlterField(
            model_name='place',
            name='create_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 4, 12, 18, 45, 32, 916000), auto_now_add=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='place',
            name='last_edit_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 4, 12, 18, 45, 32, 916000), auto_now=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='place',
            name='rating',
            field=models.FloatField(default=0),
            preserve_default=True,
        ),
    ]
