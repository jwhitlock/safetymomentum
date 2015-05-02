# -*- coding: utf-8 -*-
"""Tests for safetymomentum views."""
from django.test import TestCase


class TestHome(TestCase):

    """Test the home page."""

    def test_get_home(self):
        """Test GET /."""
        response = self.client.get('/')
        expected_html = (
            '<h1 class="smaller">'
            'Welcome to Safety Momentum'
            '</h1>')
        self.assertContains(response, expected_html, html=True)
