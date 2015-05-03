# -*- coding: utf-8 -*-
"""URL routing patterns for safetymomentum."""

from django.conf.urls import include, patterns, url
from django.views.generic import TemplateView

from . import views
from .router import router
assert views  # Remove when views are used

urlpatterns = patterns(
    '',
    url(r'^$', TemplateView.as_view(
        template_name='safetymomentum/home.jinja2'),
        name='home'),
    url(r'^about$', TemplateView.as_view(
        template_name='safetymomentum/about.jinja2'),
        name='about'),
    url(r'^api/', include(router.urls)),
    url(r'^api-auth/',
        include('rest_framework.urls', namespace='rest_framework')),
    url(r'^moments$', TemplateView.as_view(
        template_name='safetymomentum/moments.jinja2'),
        name='moments'),
)
