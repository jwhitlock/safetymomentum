# -*- coding: utf-8 -*-
"""Tests for safetymomentum views."""
from django.test import TestCase


class TestHome(TestCase):

    """Test the home page."""

    def test_get_home(self):
        """Test GET /."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
