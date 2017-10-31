#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

# Uncomment to disable caching temporarily (for heavy theme/plugin development)
#CACHE_CONTENT = False

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

PLUGIN_PATHS        = ['../../pelican-plugins']
PLUGINS             = ['assets',
                       'neighbors',
                       'sitemap',
                       'summary',
                       'category_meta',
                       'pelican_comment_system',
                       'pandoc_reader']

PANDOC_ARGS         = ['--smart', '--normalize', '--html-q-tags', '--mathml']
PANDOC_EXTENSIONS   = ['-citations']

SUMMARY_MAX_LENGTH    = None
SUMMARY_END_MARKER    = '<!--more-->'

# This is the default, but it complains if you don't set it explicitly.
SITEMAP             = { 'format': 'xml' }

PELICAN_COMMENT_SYSTEM = True
PELICAN_COMMENT_SYSTEM_FEED = None

# Outbound top-menu links.
MENUITEMS = [
    ('Publications', 'https://research.owlfolio.org/pubs/',  'left'),
    ('Research',     'https://research.owlfolio.org/',       'right'),
    ('Readings',     'https://readings.owlfolio.org/',       'right'),
    ('Photography',  'https://www.flickr.com/photos/zackw/', 'right')
]

# Recent-posts widget
RECENT_POSTS_LENGTH = 5

# Blogroll
BLOGROLL = [
    ("Tribe", '', [
        ("Pam",
         "Pamela Griffith ♥",
         "http://www.pamgriffith.net/"),

        ("Dara",
         "Dara Weinberg",
         "http://darastrata.com/"),

        ("Adam",
         "Adam Burr",
         "https://twitter.com/madmanatw"),

        ("Brendan",
         "Brendan Adkins",
         "http://www.xorph.com/nfd/"),

        ("Caroline",
         "Caroline Ratajski",
         "http://www.geardrops.net/"),

        ("Janna",
         None,
         "http://readingwatchinglookingandstuff.blogspot.com/"),

        ("Jo",
         "Jo Walton",
         "http://papersky.livejournal.com/"),

        ("Jon",
         "Jon Evans",
         "http://www.rezendi.com/"),

        ("Kashy",
         "Kashmiri Stec",
         "http://lutin.livejournal.com/profile"),

        ("Leonard",
         "Leonard Richardson",
         "http://www.crummy.com/"),

        ("Mris",
         "Marissa Lingen",
         "http://marissalingen.com/"),

        ("Rysmiel",
         None,
         "http://rysmiel.livejournal.com/profile"),

        ("Shweta",
         "Shweta Narayan",
         "http://shwetanarayan.org/"),

        ("Sumana",
         "Sumana Harihareswara",
         "http://www.harihareswara.net/"),

        ("Turadg",
         "Turadg Aleahmad",
         "http://turadg.aleahmad.net/"),
    ]),
    ("Affiliated", '', [
        ("Tor",
         "Tor Project (anonymity online), 2012–",
         "https://www.torproject.org"),

        ("CMU/ECE",
         "Computer security PhD program at CMU, 2010–",
         "https://www.ece.cmu.edu/"),

        ("Mozilla",
         "Mozilla Project, 2008–",
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
         "https://ntl.icsi.berkeley.edu/ntl/"),

        ("CodeSourcery",
         "Bespoke GCC development and support, 2001–2006",
         "http://www.codesourcery.com/"),

        ("Rabi",
         "I.I. Rabi Science Scholars Program at Columbia, 1995–1999",
         "https://www.college.columbia.edu/academics/rabi"),

        ("CUMB",
         "The Cleverest Band in the World, 1995–1999",
         "http://cuband.org/"),

        ("SSP",
         "Summer Science Program (1994)",
         "http://www.summerscience.org/"),
    ]),

    ("Also Me", 'rel="me"', [
        ("Twitter",
         "Chitchat",
         "https://twitter.com/elwoz/"),

        ("Newsblur",
         "Link scrapbooking",
         "https://zwol.newsblur.com/"),

        ("Stack Overflow",
         "The dusty corners of C",
         "https://stackoverflow.com/users/388520"),

        ("Github",
         "Code",
         "https://github.com/zackw/"),

        ("Flickr",
         "Architecture, trees, and relatives",
         "http://flickr.com/photos/zackw/"),

        ("Keybase",
         "The Web of Trust (this time for sure!)",
         "https://keybase.io/zackw"),

        ("Dreamwidth",
         "Old personal journal, no longer updated",
         "https://zwol.dreamwidth.org/"),

        ("Google+",
         "Longer chitchat and Breakfast Combo",
         "https://plus.google.com/108735008363901796353/about"),

        ("LinkedIn",
         "I AM NOT LOOKING FOR A JOB. DO NOT SEND ME JOB OFFERS.",
         "https://www.linkedin.com/in/zackweinberg"),
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

# If assets is allowed to run in debug mode, it puts the CSS files in
# the wrong place, breaking links to subresources.
ASSET_DEBUG = False

# Compass fine-tuning
ASSET_CONFIG = {
    'COMPASS_CONFIG': {
    }
}
