# -*- coding: utf-8 -*-
# flake8: noqa
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('safetymomentum', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='moment',
            name='header_image',
            field=models.ForeignKey(blank=True, to='safetymomentum.Image', null=True),
        ),
    ]
