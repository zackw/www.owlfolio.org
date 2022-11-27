---
title: More Notes on the Cross-Platform Availability of Header Files
date: 2013-05-01 23:25
---

You may recall a month and a half ago I posted [Notes on the
Cross-Platform Availability of Header
Files](/possibly-useful/notes-on-the-cross-platform-availability-of-header-files/)
and then promptly had to take most of it down because it was
insufficiently researched. Well, the research is ongoing, but I've got a
shiny new set of results, some high-level conclusions, and several ways
Viewers Like You can help!

First, the high-level conclusions:

* Except perhaps in deeply-embedded environments, all of C89’s
  library is universally available.
* Code not intended to run on Windows can also assume most of C99 and
  much of POSIX. The less-ubiquitous headers from these categories
  are also the less-useful headers.
* Code that *is* intended to run on Windows should only use C89
  headers and `<stdint.h>`. If MSVC 2008 support is required, not
  even `<stdint.h>` can be used. (Windows compilers do provide a
  small handful of POSIX headers, but they do not contain the
  expected set of declarations!)
* Many different Unix variants ship a similar set of nonstandard
  headers. We don’t yet know whether the *contents* of these headers
  are reliable cross-platform.
* There is a large set of obsolete headers that are still widespread
  but should not be used in new code. This is underdocumented.

The raw data is here: [https://github.com/zackw/header-survey/](https://github.com/zackw/header-survey/)

If you want to help, we need more inventories (especially for OSes
further from the beaten path), and I'm also interested in finding a
good way to crunch the raw data into something presentable.  (I used
to have a giant generated HTML table but I gave up on that, it was too
big to be readable.)  If you are an old beard, there are also places
where I'm not entirely sure of my methodology -- see the README in the
source repo.
