#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR             = u'Zack Weinberg'
SITENAME           = u'Owl\u2019s Portfolio'
SITEURL            = ''
TIMEZONE           = 'America/New_York'
DEFAULT_DATE       = 'fs'
DEFAULT_LANG       = u'en'
DEFAULT_PAGINATION = 10
RELATIVE_URLS      = True

PATH               = 'content'
PAGE_PATHS         = ['pages']
STATIC_PATHS       = ['media']
ARTICLE_EXCLUDES   = ['media']

ARTICLE_URL        = '{category}/{slug}/'
ARTICLE_SAVE_AS    = '{category}/{slug}/index.html'
PAGE_URL           = '{slug}/'
PAGE_SAVE_AS       = '{slug}/index.html'
CATEGORY_URL       = '{slug}/'
CATEGORY_SAVE_AS   = '{slug}/index.html'

AUTHOR_SAVE_AS     = ''
TAG_SAVE_AS        = ''


# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
#LINKS = (('Pelican', 'http://getpelican.com/'),
#         ('Python.org', 'http://python.org/'),
#         ('Jinja2', 'http://jinja.pocoo.org/'),
#         ('You can modify those links in your config file', '#'),)

# Social widget
#SOCIAL = (('You can add links in your config file', '#'),
#          ('Another social link', '#'),)
