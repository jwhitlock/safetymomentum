# -*- coding: utf-8 -*-
"""Tests for safetymomentum models."""
from django.test import TestCase

from ..models import Image, Keyword, Moment


class ImageTest(TestCase):

    """Tests for Image model."""

    def test_str(self):
        """Test .str method."""
        image = Image()
        self.assertEqual(str(image), '')


class KeywordTest(TestCase):

    """Tests for Keyword model."""

    def test_str(self):
        """Test .str method."""
        keyword = Keyword(name='Category 1')
        self.assertEqual(str(keyword), 'Category 1')


class MomentTest(TestCase):

    """Tests for Moment model."""

    def test_str(self):
        """Test .str method."""
        moment = Moment(title="Be safe plz.")
        self.assertEqual(str(moment), 'Be safe plz.')
