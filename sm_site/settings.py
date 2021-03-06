"""
Django settings for safetymomentum project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/

Designed for Heroku and http://12factor.net/config.  Configuration is
overriden by environment variables.

One way to set environment variables for local development in a virtualenv:

$ vi $VIRTUAL_ENV/bin/postactivate
export DJANGO_DEBUG=1
$ vi $VIRTUAL_ENV/bin/predeactivate
unset DJANGO_DEBUG
$ source $VIRTUAL_ENV/bin/postactivate

To set environment variables in heroku environment
$ heroku config
$ heroku config:set DJANGO_DEBUG=1

Environment variables:
ALLOWED_HOSTS - comma-separated list of allowed hosts
DATABASE_URL - See https://github.com/kennethreitz/dj-database-url
DEBUG - 1 to enable, 0 to disable, default disabled
DEFAULT_FILE_STORAGE - See django-storages docs
EXTRA_INSTALLED_APPS - comma-separated list of apps to add to INSTALLED_APPS
SECRET_KEY - Overrides SECRET_KEY
SECURE_PROXY_SSL_HEADER - "HTTP_X_FORWARDED_PROTOCOL,https" to enable
STATIC_ROOT - Overrides STATIC_ROOT
"""

# Build paths inside the project like this: rel_path('folder', 'file')
from os import environ, path
import sys
import dj_database_url

BASE_DIR = path.dirname(path.dirname(__file__))


def rel_path(*subpaths):
    """Generate project-relative path."""
    return path.join(BASE_DIR, *subpaths)


# Detect that we're running tests
TESTING = sys.argv[1:2] == ['test']


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# TODO: Generate a new default secret key for your project
SECRET_KEY = environ.get(
    'SECRET_KEY', 'THIS_IS_A_SUPER_BAD_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = environ.get("DEBUG", '0') in (1, '1')
TEMPLATE_DEBUG = DEBUG

ALLOWED_HOSTS = environ.get('ALLOWED_HOSTS', '').split(',')
if environ.get('SECURE_PROXY_SSL_HEADER'):
    raw = environ['SECURE_PROXY_SSL_HEADER']
    SECURE_PROXY_SSL_HEADER = tuple(raw.split(','))

# Application definition

INSTALLED_APPS = [
    # Django applications
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 3rd party applications
    'django_extensions',
    'django_nose',
    'rest_framework',
    'storages',

    # Our applications
    'safetymomentum',
]
if environ.get('EXTRA_INSTALLED_APPS'):
    INSTALLED_APPS + environ['EXTRA_INSTALLED_APPS'].split(',')

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'sm_site.urls'

WSGI_APPLICATION = 'sm_site.wsgi.application'

# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

DATABASES = {
    'default':
        dj_database_url.config(default='sqlite:///' + rel_path('db.sqlite3'))
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Switch to Jinja2 templates
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        }
    }, {
        'BACKEND': 'django.template.backends.jinja2.Jinja2',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'environment': 'sm_site.jinja2.environment',
        },
    },
]

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/
if environ.get('STATIC_ROOT'):
    STATIC_ROOT = environ['STATIC_ROOT']
else:
    STATIC_ROOT = 'static'
STATIC_URL = '/static/'

#
# 3rd Party Libraries
#

# Django nose
TEST_RUNNER = 'django_nose.NoseTestSuiteRunner'

# Django Debug Toolbar
if DEBUG:
    try:
        import debug_toolbar
    except ImportError:
        pass
    else:
        assert debug_toolbar
        INSTALLED_APPS.append('debug_toolbar')

# REST Framework IDs
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': (
        'rest_framework.filters.DjangoFilterBackend',)
}

# Django Storages
if environ.get('DEFAULT_FILE_STORAGE'):
    DEFAULT_FILE_STORAGE = environ['DEFAULT_FILE_STORAGE']
AWS_ACCESS_KEY_ID = environ.get('AWS_ACCESS_KEY_ID', '')
AWS_SECRET_ACCESS_KEY = environ.get('AWS_SECRET_ACCESS_KEY', '')
AWS_STORAGE_BUCKET_NAME = environ.get('AWS_STORAGE_BUCKET_NAME', '')
