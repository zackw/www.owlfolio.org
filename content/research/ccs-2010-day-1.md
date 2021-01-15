---
title: CCS 2010, day 1
date: 2010-10-06 09:38
slug: ccs-2010-day-1
...

I'm attending the
[2010 ACM Conference on Computer and Communications Security][ccs10]
(in Chicago this year), from yesterday (I'm skipping the workshops on
Monday and Friday). Was a little to tired to write up what I thought
of yesterday's talks yesterday, so here are some brief thoughts about
them now.

Before lunch, I probably should have gone to the security analysis
session, but I really wanted to see [Justin Samuel][jsam]'s talk on
[practical advice for dealing with compromised keys][keycomp], mostly
aimed at people doing signed software distribution---which could also
be relevant for people running secure web sites, especially if
browsers start paying more attention to changes in the server
certificates. The other two talks in this session didn't really grab
me.

After lunch, there was lots of good stuff in the session on wireless
and phone security. [Husted and Myers][hm] described how a malicious
group of cooperating cell phones can track the majority of other cell
phone users in an area---this is not easy now but will only get
easier. Halevi and Saxena (no link available) comprehensively broke
all the current schemes for acoustically pairing small widgets
together (you put your Bluetooth earbud against your phone, for
instance, and it vibrates a code, which your phone detects), even at
distance thanks to the magic of parabolic microphones. And a large
group from Georgia Tech showed their
[technique for fingerprinting the networks through which a phone call passes][pindr0p],
based on the characteristics of each network's acoustic compression
algorithm.

After that I decided to skip the tutorials and go for a walk. The
conference hotel is right on the south bank of the Chicago River and
only a few blocks from Lake Michigan, so I walked down the riverfront
to the lake and then looped around to the south and back. I've never
been to Chicago before and it's very interesting, architecturally. I
will post more on this when I can upload photos (left the cable at
home, silly me).

The poster session was, unfortunately, a bit of a blur; by that point my
brain was full. Collin introduced me to a bunch of people doing 'net
security at Cal and we all went out to dinner, which involved more
wandering around the downtown looking for a restaurant that had a table
for eight.

[ccs10]: http://www.sigsac.org/ccs/CCS2010/
[jsam]: http://justinsamuel.com/
[keycomp]: http://justinsamuel.com/papers/survivable-key-compromise-ccs2010.pdf
[hm]: https://dl.acm.org/citation.cfm?id=1866307.1866318
[pindr0p]: http://www.gatech.edu/newsroom/release.html?nid=61428
