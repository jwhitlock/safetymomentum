# -*- coding: utf-8 -*-
"""Tests for safetymomentum serializers."""
from django.contrib.auth.models import User
from django.test import TestCase

from ..models import Keyword, Moment
from ..serializers import MomentSerializer


class MomentSerializerTest(TestCase):

    """Tests for MomentSerializer class."""

    def setUp(self):
        """Setup basic moment."""
        author = User.objects.create(username='user')
        self.moment = Moment.objects.create(
            title="Test Moment",
            author=author
        )

    def test_basic(self):
        """Test basic instance."""
        data = MomentSerializer(self.moment).data
        self.assertEqual(data['title'], 'Test Moment')
        self.assertEqual(0, len(data['keywords']))

    def test_with_keywords(self):
        """Test with keywords assigned."""
        keyword = Keyword.objects.create(name='Keyword')
        self.moment.keywords.add(keyword)
        data = MomentSerializer(self.moment).data
        self.assertEqual(len(data['keywords']), 1)
        self.assertEqual(data['keywords'][0]['name'], 'Keyword')
