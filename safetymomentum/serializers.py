"""DRF Serializers for safetymomentum."""
from django.contrib.auth.models import User
from rest_framework.fields import CurrentUserDefault, SerializerMethodField
from rest_framework.reverse import reverse
from rest_framework.serializers import ModelSerializer

from .models import Image, Keyword, Moment


class ImageSerializer(ModelSerializer):

    """DRF Image Serializer."""

    class Meta:
        model = Image
        read_only_fields = ('original',)


class KeywordSerializer(ModelSerializer):

    """DRF Keyword Serializer."""

    moments_count = SerializerMethodField()
    moments_url = SerializerMethodField()

    def get_moments_count(self, obj):
        """Get the count of related moments."""
        return obj.moments.count()

    def get_moments_url(self, obj):
        """Get the url to retrieve related moments."""
        list_url = reverse('moment-list', request=self.context['request'])
        return list_url + '?keyword=%s' % obj.id

    class Meta:
        model = Keyword
        fields = ('id', 'name', 'moments_count', 'moments_url')


class UserSerializer(ModelSerializer):

    """DRF User Serializer."""

    class Meta:
        model = User
        fields = ('id', 'username')
        read_only_fields = ('date_joined',)


class MomentSerializer(ModelSerializer):

    """DRF Moment Serializer."""

    author = UserSerializer(default=CurrentUserDefault)
    keywords = SerializerMethodField()
    header_image = SerializerMethodField()

    def get_header_image(self, obj):
        """Serialize the header image."""
        if obj.header_image:
            return ImageSerializer(obj.header_image).data
        else:
            return {}

    def get_keywords(self, obj):
        """Serialize the header image."""
        keywords = []
        for k in obj.keywords.order_by('id'):
            keywords.append({'id': k.id, 'name': k.name})
        return keywords

    class Meta:
        model = Moment
