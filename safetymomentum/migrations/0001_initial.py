# -*- coding: utf-8 -*-
# flake8: noqa
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
from django.conf import settings
import django_extensions.db.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image', models.ImageField(upload_to=b'')),
                ('spec', models.CharField(default='original', help_text='Specification for image', max_length=20, choices=[('original', 'original')])),
                ('original', models.ForeignKey(related_name='derived_images', to='safetymomentum.Image', help_text='Original image')),
            ],
        ),
        migrations.CreateModel(
            name='Keyword',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Moment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('created', django_extensions.db.fields.CreationDateTimeField(default=django.utils.timezone.now, editable=False, blank=True)),
                ('modified', django_extensions.db.fields.ModificationDateTimeField(default=django.utils.timezone.now, editable=False, blank=True)),
                ('title', models.TextField()),
                ('slug', models.SlugField(unique=True)),
                ('summary', models.TextField(help_text='Summary text, markdown format')),
                ('detail', models.TextField(help_text='Detail text, markdown format')),
                ('author', models.ForeignKey(related_name='moments', to=settings.AUTH_USER_MODEL)),
                ('header_image', models.ForeignKey(to='safetymomentum.Image')),
                ('keywords', models.ManyToManyField(related_name='moments', to='safetymomentum.Keyword')),
            ],
        ),
    ]
