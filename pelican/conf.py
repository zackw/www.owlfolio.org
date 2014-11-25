#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

import os
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), 'lib'))

AUTHOR              = u'Zack Weinberg'
SITENAME            = u'Owl\u2019s Portfolio'
SITEURL             = ''
TIMEZONE            = 'America/New_York'
DEFAULT_DATE        = 'fs'
DEFAULT_DATE_FORMAT = '%-d %B %Y'
DEFAULT_LANG        = u'en'
DEFAULT_PAGINATION  = 10
RELATIVE_URLS       = True

PATH                = 'content'
PAGE_PATHS          = ['pages']
STATIC_PATHS        = ['media']
ARTICLE_EXCLUDES    = ['media']
IGNORE_FILES        = ['.#*', '*~', '#*#']

THEME               = '../style'
THEME_STATIC_DIR    = 's'
CSS_FILE            = 'style.css'

ARTICLE_URL         = '{category}/{slug}/'
ARTICLE_SAVE_AS     = '{category}/{slug}/index.html'
PAGE_URL            = '{slug}/'
PAGE_SAVE_AS        = '{slug}/index.html'
CATEGORY_URL        = '{slug}/'
CATEGORY_SAVE_AS    = '{slug}/index.html'

AUTHOR_SAVE_AS      = ''
TAG_SAVE_AS         = ''

PLUGIN_PATHS        = ['plugins']
PLUGINS             = ['neighbors', 'sitemap', 'summary', 'read_more_link',
                       'pandoc_reader']

PANDOC_ARGS         = ['--smart', '--normalize', '--html-q-tags', '--mathml']

# Setting SUMMARY_MAX_LENGTH to None breaks read_more_link.
# The <span> around the space and link is necessary because
# read_more_link will only insert _one element_.
SUMMARY_MAX_LENGTH    = 1e10
SUMMARY_END_MARKER    = '<!--more-->'
READ_MORE_LINK        = '(Continued…)'
READ_MORE_LINK_FORMAT = '<span> <a class="read-more" href="/{url}">{text}</a></span>'

# This is the default, but it complains if you don't set it explicitly.
SITEMAP             = { 'format': 'xml' }

# Outbound top-menu links.
MENUITEMS = [
    ('Publications', 'https://hacks.owlfolio.org/pubs/'),
    ('Hacks',        'https://hacks.owlfolio.org/',),
    ('Readings',     'https://readings.owlfolio.org/')
]

# Recent-posts widget
RECENT_POSTS_LENGTH = 5

# Blogroll
#LINKS = (('Pelican', 'http://getpelican.com/'),
#         ('Python.org', 'http://python.org/'),
#         ('Jinja2', 'http://jinja.pocoo.org/'),
#         ('You can modify those links in your config file', '#'),)

# Social widget
#SOCIAL = (('You can add links in your config file', '#'),
#          ('Another social link', '#'),)

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

