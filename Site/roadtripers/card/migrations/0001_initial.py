# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('address', models.CharField(default=b'none', max_length=200)),
                ('longitude', models.FloatField()),
                ('latitude', models.FloatField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Place',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('common_name', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=300)),
                ('full_name', models.CharField(max_length=200)),
                ('short_name', models.CharField(max_length=100)),
                ('public_phone', models.CharField(max_length=50)),
                ('working_hours', models.CharField(max_length=200)),
                ('web_site', models.URLField()),
                ('rating', models.FloatField()),
                ('id_location', models.ForeignKey(to='card.Location')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Type',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='place',
            name='id_type',
            field=models.ForeignKey(to='card.Type'),
            preserve_default=True,
        ),
    ]
