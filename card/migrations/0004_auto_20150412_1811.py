# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('card', '0003_auto_20150412_1651'),
    ]

    operations = [
        migrations.AlterField(
            model_name='place',
            name='create_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 4, 12, 18, 11, 40, 885000), auto_now_add=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='place',
            name='description',
            field=models.CharField(max_length=10000),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='place',
            name='last_edit_date',
            field=models.DateTimeField(default=datetime.datetime(2015, 4, 12, 18, 11, 40, 885000), auto_now=True),
            preserve_default=True,
        ),
    ]
