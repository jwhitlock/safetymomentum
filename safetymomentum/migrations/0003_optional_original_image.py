# -*- coding: utf-8 -*-
# flake8: noqa
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('safetymomentum', '0002_optional_header_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='original',
            field=models.ForeignKey(related_name='derived_images', blank=True, to='safetymomentum.Image', help_text='Original image', null=True),
        ),
    ]
