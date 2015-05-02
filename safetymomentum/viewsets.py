"""DRF Viewsets for safetymomentum."""
from django.contrib.auth.models import User
from rest_framework.viewsets import ModelViewSet

from .models import Image, Keyword, Moment
from .serializers import (
    ImageSerializer, KeywordSerializer, MomentSerializer, UserSerializer)


class ImageViewSet(ModelViewSet):

    """DRF Image Viewset."""

    queryset = Image.objects.order_by('id')
    serializer_class = ImageSerializer


class KeywordViewSet(ModelViewSet):

    """DRF Keyword Serializer."""

    queryset = Keyword.objects.order_by('id')
    serializer_class = KeywordSerializer


class MomentViewSet(ModelViewSet):

    """DRF Moment Serializer."""

    queryset = Moment.objects.order_by('id')
    serializer_class = MomentSerializer


class UserViewSet(ModelViewSet):

    """DRF User Serializer."""

    queryset = User.objects.order_by('id')
    serializer_class = UserSerializer
