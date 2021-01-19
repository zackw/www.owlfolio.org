#!/usr/bin/env python3
# -*- coding: utf-8 -*- #

import os
import sys

# The 'webassets' plugin isn't in a namespace yet, but it's importable
# normally.
import pelican_webassets

# This is icky but it's not as icky as sticking the
# pelican directory on sys.path permanently.
import os.path
from pelican.settings import load_source
summary = load_source("summary",
                      os.path.join(os.path.dirname(__file__),
                                   "local-plugins/summary.py"))

# Uncomment to disable caching temporarily (for heavy theme/plugin development)
#CACHE_CONTENT = False

AUTHOR              = 'Zack Weinberg'
SITENAME            = 'Owl\u2019s Portfolio'
SITEURL             = ''
TIMEZONE            = 'America/New_York'
DEFAULT_DATE        = 'fs'
DEFAULT_DATE_FORMAT = '%-d %B %Y'
DEFAULT_LANG        = 'en'
DEFAULT_PAGINATION  = 10
RELATIVE_URLS       = True

PATH                = 'content'
PAGE_PATHS          = ['pages']
STATIC_PATHS        = ['',]
STATIC_EXCLUDES     = ['comments']
IGNORE_FILES        = ['.#*', '*~', '#*#', '*.scss']
ARTICLE_EXCLUDES    = ['comments',
    # this directory contains HTML mockups that should be processed
    # as static files, not articles
    'htmletc/ssl-errors'
]

THEME               = '../style'
THEME_STATIC_DIR    = 's'

ARTICLE_URL         = '{category}/{slug}/'
ARTICLE_SAVE_AS     = '{category}/{slug}/index.html'
PAGE_URL            = '{slug}/'
PAGE_SAVE_AS        = '{slug}/index.html'
CATEGORY_URL        = '{slug}/'
CATEGORY_SAVE_AS    = '{slug}/index.html'

AUTHOR_SAVE_AS      = ''
TAG_SAVE_AS         = ''
ARCHIVES_SAVE_AS    = ''
AUTHORS_SAVE_AS     = ''
CATEGORIES_SAVE_AS  = ''
TAGS_SAVE_AS        = ''

PAGINATION_PATTERNS = [
    (1, '{base_name}/', '{base_name}/index.html'),
    (2, '{base_name}/{number}/', '{base_name}/{number}/index.html'),
]

PLUGINS             = [
    pelican_webassets,
    summary,
    'category_metadata',
    'neighbors',
    'pandoc_reader',
    #'pelican_comment_system',
    'sitemap',
]

PANDOC_ARGS         = ['--html-q-tags', '--mathml']
PANDOC_EXTENSIONS   = ['+smart', '-citations']

SUMMARY_MAX_LENGTH    = None
SUMMARY_END_MARKER    = '<!--more-->'

# This is the default, but it complains if you don't set it explicitly.
SITEMAP             = { 'format': 'xml' }

PELICAN_COMMENT_SYSTEM = True
PELICAN_COMMENT_SYSTEM_FEED = None

# Outbound top-menu links.
MENUITEMS = [
    ('Publications', 'https://research.owlfolio.org/pubs/',  'right'),
    ('Research',     'https://research.owlfolio.org/',       'right'),
    ('Readings',     'https://readings.owlfolio.org/',       'right'),
#    ('Photography',  'https://www.flickr.com/photos/zackw/', 'right')
]

# Recent-posts widget
RECENT_POSTS_LENGTH = 5

# Blogroll
BLOGROLL = [
    ("Tribe", '', [
        ("Pam",
         "Pamela Griffith ♥",
         "https://pamgriffith.net/"),

        ("Dara",
         "Dara Weinberg",
         "https://darastrata.com/"),

        ("Abbas",
         "Abbas Razaghpanah",
         "http://abbas.rpanah.ir/"),

        ("Arian",
         "Arian Akhavan Niaki",
         "https://people.cs.umass.edu/~arian/"),

        ("Brendan",
         "Brendan Adkins",
         "http://www.xorph.com/nfd/"),

        ("Caroline",
         "Caroline Ratajski",
         "https://www.geardrops.net/"),

        ("Janna",
         None,
         "https://readingwatchinglookingandstuff.blogspot.com/"),

        ("Leonard",
         "Leonard Richardson",
         "https://www.crummy.com/"),

        ("Mris",
         "Marissa Lingen",
         "https://marissalingen.com/"),

        ("Phong",
         "Hoàng Nguyên Phong",
         "https://homepage.np-tokumei.net/"),

        ("Shinyoung",
         "Shinyoung Cho",
         "https://www3.cs.stonybrook.edu/~shicho/"),

        ("Shweta",
         "Shweta Narayan",
         "http://shwetanarayan.org/"),

        ("Sumana",
         "Sumana Harihareswara",
         "http://www.harihareswara.net/"),
    ]),
    ("Affiliated", '', [
        ("ICLab",
         "Information Controls Lab at UMass Amherst, 2016–",
         "https://iclab.org/"),

        ("Tor",
         "Tor Project (anonymity online), 2012–",
         "https://www.torproject.org"),

        ("CyLab",
         "Institute for security and privacy research at CMU, 2010–",
         "https://cylab.cmu.edu/"),

        ("CMU/ECE",
         "Computer security PhD program at CMU, 2010–2018",
         "https://www.ece.cmu.edu/"),

        ("Mozilla",
         "Mozilla Project, 2008–2014",
         "https://www.mozilla.org/"),

        ("monotone",
         "Monotone version control system, 2007–2009",
         "http://www.monotone.ca/"),

        ("GCC",
         "GNU Compiler Collection, 1998–2006 (plus a couple of relapses)",
         "https://gcc.gnu.org/"),

        ("UCSD",
         "Cognitive Science department at UC San Diego, 2006–2008",
         "http://www.cogsci.ucsd.edu/"),

        ("NTL",
         "Neural Theory of Language group at UC Berkeley, 2001–2006",
         "https://www.icsi.berkeley.edu/icsi/projects/ai/ntl"),

        ("CodeSourcery",
         "Bespoke GCC development and support, 2001–2006",
         "http://www.codesourcery.com/"),

        ("Rabi",
         "I.I. Rabi Science Scholars Program at Columbia College, 1995–1999",
         "https://urf.columbia.edu/urf/research/rabi"),

# https://www.columbiaspectator.com/sports/2020/09/15/columbia-university-marching-band-votes-to-disband-after-116-years/
#        ("CUMB",
#         "The Cleverest Band in the World, 1995–1999",
#         "http://cuband.org/"),

        ("SSP",
         "Summer Science Program, 1994",
         "https://summerscience.org/"),
    ]),

    ("Also Me", 'rel="me"', [
        ("Mastodon",
         "Chitchat",
         "https://mastodon.social/@zwol"),

        ("Newsblur",
         "Link scrapbooking",
         "https://zwol.newsblur.com/"),

        ("Stack Overflow",
         "The dusty corners of C",
         "https://stackoverflow.com/users/388520"),

        ("Sourcehut",
         "Code",
         "https://sr.ht/~zackw/"),

        ("Dreamwidth",
         "Old personal journal, no longer updated",
         "https://zwol.dreamwidth.org/"),

        ("Twitter",
         "Old chitchat, no longer updated",
         "https://twitter.com/elwoz/"),
    ])
]

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Most extra-path objects are not useful when developing, but the favicon is,
# if only to stop 404 log spam from SimpleHTTPServer.
EXTRA_PATH_METADATA = {
    '../meta/favicon.ico' : { 'path': 'favicon.ico' },
}
