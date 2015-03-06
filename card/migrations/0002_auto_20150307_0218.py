# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('card', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='type',
            old_name='url_image_mini_filter',
            new_name='url_image_mini_marker',
        ),
        migrations.RemoveField(
            model_name='type',
            name='url_image_filter',
        ),
    ]
