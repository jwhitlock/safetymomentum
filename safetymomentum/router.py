"""API router for safetymomentum."""
from rest_framework.routers import DefaultRouter

from .viewsets import (
    KeywordViewSet, ImageViewSet, MomentViewSet, UserViewSet)

router = DefaultRouter()
router.register(r'keywords', KeywordViewSet)
router.register(r'images', ImageViewSet)
router.register(r'moments', MomentViewSet)
router.register(r'users', UserViewSet)
