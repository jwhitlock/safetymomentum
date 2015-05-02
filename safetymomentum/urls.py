# -*- coding: utf-8 -*-
"""URL routing patterns for safetymomentum."""

from django.conf.urls import patterns, url
from django.views.generic import TemplateView

from . import views
assert views  # Remove when views are used

urlpatterns = patterns(
    '',
    url(r'^$', TemplateView.as_view(
        template_name='safetymomentum/home.jinja2'),
        name='home'),
)
