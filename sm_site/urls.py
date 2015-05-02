# -*- coding: utf-8 -*-
"""URL routing patterns for safetymomentum."""

from django.conf.urls import patterns, include, url
from django.contrib import admin

from safetymomentum.urls import (
    urlpatterns as safetymomentum_urlpatterns)

admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^admin/', include(admin.site.urls)),
    url(r'', include(safetymomentum_urlpatterns)),
)
