---
title: some trivia about the Alexa 1M
date: 2013-09-30 13:15
slug: some-trivia-about-the-alexa-1m
...

[Alexa](http://www.alexa.com/) publishes a list of "the top 1,000,000
sites on the web." Here is some trivia about this list (as it was on
September 27, 2013):

* No entries contain an URL scheme.
* Only 247 entries contain the string "`www.`"
* Only 13,906 entries contain a path component.
* There are 987,661 unique hostnames and 967,933 unique domains
  ([public suffix](https://publicsuffix.org/) + 1).
* If you tack "`http://`" on the beginning of each entry and "`/`"
  on the end (if there wasn't a path component already), then issue a GET
  request for that URL and chase HTTP redirects as far as you can (without
  leaving the site root, unless there was a path component already), you
  get 916,228 unique URLs.
* Of those 916,228 unique URLs, only 352,951 begin their hostname
  component with "`www.`" and only 14,628 are HTTPS.
* 84,769 of the 967,933 domains do not appear anywhere in the list of
  canonicalized URLs; these either redirected to a different domain or
  responded with a network or HTTP error.
* 52,139 of those 84,769 domains do respond to a GET request if you
  tack "`www.`" on the beginning of the domain name and then proceed as
  above.
* But only 41,354 new unique URLs are produced; the other 10,785
  domains duplicate entries in the earlier set.
* 39,966 of the 41,354 new URLs begin their hostname component with
  "`www.`"
* 806 of the new URLs are HTTPS.
* Merging the two sets produces 957,582 unique URLs (of which 392,917
  begin the hostname with "`www.`" and 15,434 are HTTPS), 947,474 unique
  hostnames and 928,816 unique domains.
* 42,734 registration names (that is, the +1 component in a "public
  suffix + 1" name) appear in more than one public suffix. 11,748 appear
  in more than two; 5516 in more than three; 526 in more than ten.
* 44,299 of the domains in the original list do not appear in the
  canonicalized set.
* 5,183 of the domains in the canonicalized set do not appear in the
  original list.

Today's exercise in data cleanup was brought to you by the I Can't
Believe This Took Me An Entire Week Foundation. If you ever need to do
something similar,
[this script](https://research.owlfolio.org/scratchpad/canonurls) may be
useful.
