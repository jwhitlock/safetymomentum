"""Admin configuration for safetymomentum app."""

from django.contrib import admin
from .models import Image, Keyword, Moment

admin.site.register(Image)
admin.site.register(Keyword)
admin.site.register(Moment)
