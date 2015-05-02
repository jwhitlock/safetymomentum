# -*- coding: utf-8 -*-
"""Django models for safetymomentum."""
from __future__ import unicode_literals

from django.conf import settings
from django.db import models
from django.utils.encoding import python_2_unicode_compatible
from django_extensions.db.fields import (
    CreationDateTimeField, ModificationDateTimeField)

user_model = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')


@python_2_unicode_compatible
class Image(models.Model):

    """A base image."""

    SPEC_ORIGINAL = 'original'
    SPEC_CHOICES = (
        (SPEC_ORIGINAL, SPEC_ORIGINAL),
    )

    image = models.ImageField()
    original = models.ForeignKey(
        "Image", help_text="Original image", related_name="derived_images")
    spec = models.CharField(
        help_text="Specification for image",
        blank=False, max_length=20, default=SPEC_ORIGINAL,
        choices=SPEC_CHOICES)

    def __str__(self):
        """String representation of Image."""
        return "%s" % self.image


@python_2_unicode_compatible
class Keyword(models.Model):

    """A keyword for categoriation."""

    name = models.TextField()

    def __str__(self):
        """String representation of Keyword."""
        return "%s" % self.name


@python_2_unicode_compatible
class Moment(models.Model):

    """A safety moment."""

    created = CreationDateTimeField()
    modified = ModificationDateTimeField()
    author = models.ForeignKey(user_model, related_name="moments")
    title = models.TextField()
    slug = models.SlugField(unique=True)
    header_image = models.ForeignKey(Image, blank=True, null=True)
    summary = models.TextField(
        help_text="Summary text, markdown format")
    detail = models.TextField(
        help_text="Detail text, markdown format")
    keywords = models.ManyToManyField(
        Keyword, related_name='moments')

    def __str__(self):
        """String representation of Moment."""
        return "%s" % self.title
