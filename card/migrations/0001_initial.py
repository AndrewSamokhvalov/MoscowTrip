# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('url_image', models.URLField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Place',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=200)),
                ('website', models.CharField(max_length=100, blank=True)),
                ('description', models.CharField(max_length=1500)),
                ('working_hours', models.CharField(max_length=200, blank=True)),
                ('cost', models.FloatField(null=True, blank=True)),
                ('lat', models.FloatField()),
                ('lon', models.FloatField()),
                ('rating', models.FloatField()),
                ('e_mail', models.EmailField(max_length=75, blank=True)),
                ('vk_link', models.URLField(blank=True)),
                ('phone', models.CharField(max_length=50, blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('tag', models.CharField(max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Type',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('url_image_marker', models.URLField()),
                ('url_image_filter', models.URLField()),
                ('url_image_mini_filter', models.URLField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='place',
            name='id_tag',
            field=models.ManyToManyField(to='card.Tag', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='place',
            name='id_type',
            field=models.ForeignKey(to='card.Type'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='image',
            name='id_place',
            field=models.ForeignKey(to='card.Place'),
            preserve_default=True,
        ),
    ]
