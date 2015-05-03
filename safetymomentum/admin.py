"""Admin configuration for safetymomentum app."""

from django.contrib import admin
from .models import Image, Keyword, Moment


class MomentAdmin(admin.ModelAdmin):

    """Admin for Moment model."""

    prepopulated_fields = {"slug": ("title",)}
    exclude = ('author',)

    def save_model(self, request, obj, form, change):
        """Set the user to the request.user."""
        if not change:
            obj.author = request.user
        obj.save()

admin.site.register(Image)
admin.site.register(Keyword)
admin.site.register(Moment, MomentAdmin)
