#!/usr/bin/env python
# -*- coding: utf-8 -*- #

# This file is only used if you use `make publish` or
# explicitly specify it as your config file.

from __future__ import unicode_literals

# This is icky but it's not as icky as sticking the
# pelican directory on sys.path permanently.
import os.path
from pelican.settings import load_source
load_source("conf_base",
            os.path.join(os.path.dirname(__file__),
                         "conf.py"))
from conf_base import *

SITEURL            = 'https://www.owlfolio.org'
FEED_DOMAIN        = SITEURL
FEED_MAX_ITEMS     = DEFAULT_PAGINATION
FEED_ALL_ATOM      = 'index.atom'
CATEGORY_FEED_ATOM = '%s/index.atom'

PLUGINS.extend(['gzip_cache'])
STATIC_PATHS.append('../meta')
ARTICLE_EXCLUDES.append('../meta')

EXTRA_PATH_METADATA.update({
    '../meta/robots.txt'  : { 'path': 'robots.txt' },
    '../meta/keybase.txt' : { 'path': '.well-known/keybase.txt' },
    '../meta/htaccess'    : { 'path': '.htaccess' },
    '../meta/googleaf54bcfc4c61887c.html'
                          : { 'path' : 'googleaf54bcfc4c61887c.html' },
})

DELETE_OUTPUT_DIRECTORY = True
