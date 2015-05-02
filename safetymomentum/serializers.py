"""DRF Serializers for safetymomentum."""
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer

from .models import Image, Keyword, Moment


class ImageSerializer(ModelSerializer):

    """DRF Image Serializer."""

    class Meta:
        model = Image
        read_only_fields = ['original']


class KeywordSerializer(ModelSerializer):

    """DRF Keyword Serializer."""

    class Meta:
        model = Keyword


class MomentSerializer(ModelSerializer):

    """DRF Moment Serializer."""

    class Meta:
        model = Moment


class UserSerializer(ModelSerializer):

    """DRF User Serializer."""

    class Meta:
        model = User
        fields = ['username']
        read_only_fields = ['date_joined']
