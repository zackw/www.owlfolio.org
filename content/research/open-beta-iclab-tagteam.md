Title: Open beta for ICLab TagTeam
Date: 2018-03-19 11:39

I'm pleased to announce the open beta test of [ICLab][iclab]'s clearinghouse
for data about censored websites,
<https://iclab-tagteam.cs.umass.edu/> (temporary hostname, will be
moved under [iclab.org][iclab] Real Soon Now).  This site
will aggregate manual and automated test reports, facilitate more
efficient use of automated test resources, and help policy analysts
draw conclusions about _what_ gets censored in particular countries.

... Well, that's the aspiration, anyway.  Right now what we have is a
slightly reskinned instance of the [Berkman Center][]'s [TagTeam][]
software, loaded up with a set of sites reported as censored in leaks
and so on (mostly about five years old) and the automated topic
analysis I described in my [PETS paper last year][toc], and taking one
ongoing input feed, from [Herdict][].  I said it was a beta test. `:-)`

If any of the above sounds interesting to you, there are a bunch of
ways you can help:

 *  The most important thing I need right now is additional inputs:

    - Ongoing, manually curated reports of censored websites in a
      specific country (e.g. Engelli Web, rublacklist.net).
    - Ongoing crowdsourced reports of inaccessible websites
      (like Herdict).
    - Recent, credible one-time leaks of the actual blacklist
      used in some country, or shipped with some specific
      commercial "filtering" software.
    - Control groups: relatively low-volume feeds of long-tail
      material that *isn't* particularly likely to get censored.
      (We already have the tall head.)

    The optimal format for a continuously updated data source is an RSS
    feed that can be directly added to TagTeam as an "input."  If
    that's not available, the next best thing is a screen-scraper that
    takes the existing website or whatever and converts it to an RSS
    feed (we already have infrastructure for this; send a pull request
    to <https://bitbucket.org/elwoz/iclab-topic-pipeline>, adding a
    program to the "input-feeds" directory, and I'll take it from
    there).

    The optimal format for a one-time source is whatever you have, I'm
    going to have to write a custom import script for it regardless. `:-/`

 *  The second most helpful thing would be manual verification of the
    topic labels assigned by my old analysis.  "Simply" create an
    account on the site, and then go through the sites that already
    have a topic:something tag and add more tags indicating whether
    that is accurate.  Please get in touch with me first so we can
    coordinate efforts.

    This task does not require a lot of technical skill, but it does
    need a lot of time and patience, and a strong stomach for the nasty
    underbelly of the Internet, ranging from garden-variety pornography
    all the way up to active advocacy for genocide.  Fluency in diverse
     natural languages will also be helpful; the top five after English
    are Chinese, Japanese, Russian, Arabic, and Persian.  Finally, many
    sites have been taken over by spam and/or malware, so you'll want
    to use a disposable and locked-down browser instance.

 *  General poking at the site, kicking the tires, finding things that
    don't work and telling me about them is also very helpful.  (I
    already know about the missing documentation.)

 *  If you have any experience hacking Ruby on Rails, I need all the
    help I can get upstreaming my changes to TagTeam and developing
    further extensions that we're going to need.

 *  If you have any nonzero level of skill with web, graphic, and/or UI
    design, I also need help improving the presentation of the site.

 *  Anyone who runs ongoing, automated monitoring for censorship, on
    any scale from one city to the whole world, is invited to get in
    touch to talk about how my data might help you do it better.

 *  If you have ideas for interesting _uses_ for a large collection of
    possibly-censored websites with extracted text and topic labels, or
    interesting analyses we could run on it, please also get in touch.

Please note that account creation is manual right now---after filling
out the sign-up form, email me at <zackw@cmu.edu> and tell me the
handle you picked plus a little about who you are and what you propose
to do with the account.

Reproduction and dissemination of this announcement is encouraged.

[iclab]: https://iclab.org/
[Berkman Center]: https://cyber.harvard.edu/
[TagTeam]: https://github.com/berkmancenter/tagteam/
[toc]: https://research.owlfolio.org/pubs/2017-topics-controversy.pdf
[Herdict]: https://www.herdict.org/
