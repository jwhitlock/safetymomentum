"""Helper functions for Jinja2 templates."""
from __future__ import absolute_import

from django.contrib.staticfiles.storage import staticfiles_storage
from django.core.urlresolvers import reverse

from jinja2 import Environment


def environment(**options):
    """Construct environment for jinja2 templates."""
    env = Environment(**options)
    env.globals.update({
        'static': staticfiles_storage.url,
        'url': reverse,
    })
    return env
