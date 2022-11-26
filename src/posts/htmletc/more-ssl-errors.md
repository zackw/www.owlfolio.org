---
title: More on SSL errors
date: 2010-05-25 16:11
---

I got some great responses to my [ideas for SSL errors][] and I
thought I'd make a new post to talk about them, since that post is old
enough that you can't comment on it anymore. I should probably
emphasize up front that I'm not on Firefox's UX team, I don't know if
they're listening to my suggestions, and anyway they were meant as a
starting point rather than completely finished designs.

<!--more-->

[David Bolton][] wanted to know why some of the error screens asked
the user to visit other sites manually, rather than doing checks
behind the scenes. The main reason, honestly, is that that made a good
example thing the user could do next. In practice we probably _would_
want to do at least some checks in the background. Right now, another
reason would be that error pages do not have "chrome" privileges so
they can't do anything of the sort (this is part of why the
certificate error screen pops up a separate dialog box if you say you
want to add an exception) but we may be able to get around that in a
real implementation.

John Barton, in email, points out that SSL errors often come up in
practice because of server-side configuration changes that ought to
have been transparent to users, but a sysadmin goofed. I've been using
the [Certificate Patrol][] extension, which brings up warnings when a
site's cert changes in any way; this reveals that cert handling
mistakes happen even on very popular and well-staffed sites (recently,
for instance, `mail.google.com` flipped back and forth between its own
cert and the generic `*.google.com` cert several times in one day). Of
course _that_ would have been invisible to most people, but it's not
much harder to make mistakes that do trigger warnings in a stock
browser.

My general feeling on that is, yes, it is way too hard to administer
an SSL-encrypted web site, and I would wholeheartedly support an
initiative to make it easier, especially for sites that carry
information of only moderate sensitivity (e.g. the plethora of
Bugzilla instances with self-signed certs out there in the wild). I
don't think that should stop us from raising the visibility of SSL
administration mistakes, as long as we improve the presentation and
advice on those mistakes so we are not just training people to click
through the errors.

John also points out that most people won't have any idea what
"[Herdict][]" is or why they are trustworthy. The explicit mention of
Herdict was mainly because I was riffing off Boriss' earlier
[proposal to use Herdict information to improve page not found errors][boriss-404]. Indeed,
we should probably put it more like "Other people who try to visit
this website get (something) which (is/isn't) what you got." We should
credit whatever service we use for that information, but it doesn't
have to be as prominent as I made it.

Someone else (whose name I have lost; sorry, whoever you were!)
pointed me at the [Perspectives][] extension, which is said to do more
or less exactly what I proposed, as far as comparing certificates seen
by the user with those seen by "notaries" at other network
locations. I like the use of the term "notary" and the proof of
concept; unfortunately, Perspectives seems not to be actively
maintained at the moment, and doesn't work with Firefox 3.6. Also, for
privacy, we want to make the queries to the notaries as uninformative
as possible to an adversary that can observe network traffic. Reusing
the same system that is used for "is this site down?" requests would
help there. (Ideally, the *notaries* would also be unable to tell
which users are asking what about which sites, but that might not be
tractable.)

[ideas for SSL errors]: /htmletc/ssl-errors/
[David Bolton]: http://davidbolton.info/
[Certificate Patrol]: https://addons.mozilla.org/en-US/firefox/addon/certificate-patrol/
[Perspectives]: http://perspectives-project.org/
[Herdict]: https://www.herdict.org/
[boriss-404]: http://www.donotlick.com/2010/01/04/herdict-and-its-tasty-anonymized-aggregated-data/
