---
title: Strengths, weaknesses, opportunities, and threats facing the GNU Autotools
date: 2021-01-19 16:05
slug: autoconf-swot
---

I've been a contributor to GNU projects for many years, notably both
GCC and GNU libc, and recently I led the effort to make the first
release of Autoconf since 2012 ([release announcement for Autoconf
2.70](https://lists.gnu.org/archive/html/autoconf/2020-12/msg00002.html)).
For background and context, see [the LWN article my colleague Sumana
Harihareswara of Changeset Consulting
wrote](https://lwn.net/Articles/834682/).

Autoconf not having made a release in eight years is a symptom of a
deeper problem.  Many GNU projects, including all of the other
components of the Autotools ([Automake][], [Libtool][], [Gnulib][],
etc.) and the software they depend upon ([GNU M4][], [GNU Make][],
etc.) have seen a steady decline in both contributor enthusiasm and
user base over the past decade.  I include myself in the group of
declining enthusiasts; I would not have done the work leading up to
the Autoconf 2.70 release if I had not been paid to do it.  (I would
like to say thank you to the project funders: Bloomberg, Keith Bostic,
and the GNU Toolchain Fund of the FSF.)

The Autotools are in particularly bad shape due to the decline in
contributor enthusiasm.  Preparation for the Autoconf 2.70 release
took almost twice as long as anticipated; I made five beta releases
between July and December 2020, and merged 157 patches, most of them
bugfixes.  On more than one occasion I was asked why I was going to
the trouble—isn't Autoconf (and the rest of the tools by
implication) thoroughly obsolete? Why doesn't everyone switch to
something newer, like [CMake][] or [Meson][]?  (See the comments on
Sumana's LWN article for examples.)

I personally don't think that the Autotools are obsolete, or even all
that much more difficult to work with than some of the alternatives,
but it _is_ a fair question.  Should development of the Autotools
continue?  If they are to continue, we need to find people who have
the time and the inclination (and perhaps also the funding) to
maintain them steadily, rather than in six-month release sprints every
eight years.  We also need a proper roadmap for where further
development should take these projects.  As a starting point for the
conversation about whether the projects should continue, and what the
roadmap should be, I was inspired by Sumana's book in progress on open
source project management ([sample chapters are available from her
website](https://changeset.nyc/resources/getting-unstuck-sampler-offer.html))
to write up a "strengths, weaknesses, opportunities, and threats"
analysis of Autotools.

This inventory can help us figure out how to build on new
opportunities, using the Autotools' substantial strengths, and where
to invest to guard against threats and shore up current weaknesses.

Followup discussion should go to [the Autoconf mailing
list](https://lists.gnu.org/mailman/listinfo/autoconf).

[Automake]: https://www.gnu.org/software/automake/
[Libtool]: https://www.gnu.org/software/libtool/
[Gnulib]: https://www.gnu.org/software/gnulib/
[GNU M4]: https://www.gnu.org/software/m4/
[GNU Make]: https://www.gnu.org/software/make/
[CMake]: https://cmake.org/
[Meson]: https://mesonbuild.com/

<!--more-->

## Strengths

In summary: as the category leader for decades, the Autotools benefit
from their architectural approach, interoperability, edge case
coverage, standards adherence, user trust, and existing install base.

- Autoconf's feature-based approach to compiled-code portability
  scales better than lists of system quirks.
- The Autotools carry 30+ years’ worth of embedded knowledge about
  portability traps for C programs and shell-based build scripting on
  Unix (and to a lesser extent Windows and others), including variants
  of Unix that no other comparable configuration tool supports.
- Autoconf and Automake support cross-compilation better than
  competing build systems.
- Autoconf and Automake support software written in multiple languages
  better than some competing build systems (but see below).
- Autoconf is very extensible, and there are lots of third-party
  “macros” available.
- Tarball releases produced by Autotools have fewer build dependencies
  than tarball releases produced by competing tools.
- Tarball releases produced by Autotools have a predictable,
  standardized (literally; it’s a key aspect of the “[GNU Coding
  Standards][gnustd]”) interface for setting build-time options,
  building them, testing them, and installing them.
- Automake tries very hard to generate Makefiles that will work with
  *any* Make implementation, not just GNU make, and not even just (GNU
  or BSD) make.
- The Autotools have excellent reference-level documentation (better
  than CMake and Meson's).
- As they are GNU projects, users can have confidence that Autotools
  are and will always remain Free Software.
- Relatedly, users can trust that architectural decisions are not
  driven by the needs of particular large corporations.
- There is a large installed base, and switching to a competing build
  system is a lot of work.

[gnustd]: https://www.gnu.org/prep/standards/html_node/index.html

## Weaknesses

In summary: Autoconf's core function is to solve a problem that
software developers, working primarily in C, had in the 1990s/early
2000s (during the Unix wars). System programming interfaces have
become much more standardized since then, and the shell environment,
much less buggy.  Developers of new code, today, looking at existing
configure scripts and documentation, cannot easily determine which of
the portability traps Autoconf knows about are still relevant to them.
Similarly, maintainers of older programs have a hard time knowing
which of their existing portability checks are still necessary. And
weak coordination with other Autotools compounds the issue.

### Autoconf

- Autoconf (and the rest of the Autotools) are written in a
  combination of four old and difficult programming languages: Bourne
  shell, the portable subset of Make, Perl, and M4.  Competing build
  systems tend to use newer, more ergonomic languages, which both
  makes it easier for them to get things done, and makes it easier for
  them to attract new developers.
- All the supported languages except C and C++ are second-class citizens.
- The set of languages that are supported has no particular
  rationale. Several new and increasingly popular compiled-code
  languages (e.g. Swift and Rust) are not supported, while oddities
  like Erlang are.
- Much of that 30 years’ worth of embedded knowledge about portability
  traps is obsolete.  There’s no systematic policy for deciding when
  some problem is too obsolete to worry about anymore.
- Support for *newer* platforms, C standard editions, etc. is weaker
  than support for older things.
- Autoconf’s extensibility is unsystematic; many of those third-party
  macros reach into its guts, and do things that create awkward
  compatibility constraints on core development.  Same for existing
  `configure.ac`s.
- The code quality of third-party macros varies widely; bad
  third-party macros reflect poorly on Autoconf proper.
- Some of the ancillary tools distributed with Autoconf don’t work
  well; most importantly, autoupdate (which is *supposed* to patch a
  `configure.ac` to bring it in line with current Autoconf's
  recommendations) is so limited and unreliable that it might be
  better not to have it at all.
- Feature gaps in GNU M4 hold back development of Autoconf.

### The Autotools as a whole

- There are few active developers and no continuing funders.
- GNU project status discourages new contributors because of the
  paperwork requirements and the perceived lack of executive-level
  leadership.
- There is no continuous integration and no culture of code review.
  Test suites exist but are not comprehensive enough (and at the same
  time they're very slow).
- Bugs, feature requests, and submitted patches are not tracked
  systematically. (This is partially dependent on [FSF/GNU
  infrastructure improvements](https://www.fsf.org/blogs/sysadmin/the-fsf-tech-team-doing-more-for-free-software)
  which are indefinitely delayed.)
- There's a history of releases breaking compatibility, and thus
  people are hesitant to upgrade.  At the same time, Linux
  distributions actively want to force-upgrade everything they ship to
  ensure architecture support, leading to upstream/downstream
  friction.
- Guide-level documentation is superficial and outdated.
- Building an Autotools-based project directly from its VCS checkout
  is often significantly harder than building it from a tarball
  release, and may involve tracking down and installing any number of
  unusual tools.
- The Autotools depend on other GNU software that is not actively
  maintained, most importantly GNU M4, and to a lesser extent GNU
  Make.
- Coordination among the Autotools is weak, even though the tools are
  tightly coupled to each other. There are portions of codebases that
  exist solely for interoperability with other tools in the toolchain,
  which leads to overlapping maintainer and reviewer responsibility,
  slow code review and inconvenient copyright assignment processes
  multiplying, and causing confusion and dropped balls.  For instance,
  there is code shared among Autoconf, Automake, and/or Gnulib by
  copying files between source repositories; changes to these files
  are extra inconvenient. The lack of coordination also makes it
  harder for tool maintainers to deprecate old functionality, or to
  decouple interfaces to make things more extensible; maintainers do
  not negotiate policies with each other to help.  For instance,
  Autoconf has trouble knowing when it is safe to remove internal
  kludges that old versions of Automake depend on, and certain shell
  commands (e.g. aclocal) are distributed with one package but
  abstractly belong to another.
- Division of labor among the Autotools, and the sources of
  third-party macros, is ad-hoc and unclear.  (Which macros should be
  part of Autoconf proper? Which should be part of Gnulib?  Which
  should be part of the Autoconf Macro Archive?  Which should be
  shipped with Automake?  Which tools should autoreconf know how to
  run? Etc.)
- Automake and Libtool are not nearly as extensible as Autoconf is.
- Unlike several competitors, Automake *only* works with Make, not
  with newer build drivers (e.g. Ninja).
- Because Automake tries to generate Makefiles that will work with
  *any* Make implementation, the Makefiles it generates are much more
  complicated and slow than they would be if they took advantage of
  GNU and/or BSD extensions.
- Libtool is notoriously slow, brittle, and difficult to modify (even
  worse than Autoconf proper).  This is partially due to technical
  debt and partially due to maintaining support for completely
  obsolete platforms (e.g. old versions of AIX).
- Libtool has opinions about the proper way to manage shared libraries
  that Linux distributions actively disagree with, forcing them to
  kludge around its code during package builds.
- Alternatives to Libtool have all failed to gain traction, largely
  because Automake only supports building shared libraries using
  Libtool or an *exact* drop-in replacement.

## Opportunities

Because of its extensible architecture, install base, and wellspring
of user trust, Autotools can react to these industry changes and thus
spur increases in usage, investment, and developer contribution.

- Renewed interest in Autotools due to the Autoconf 2.70 release.
- Renewed interest in systems programming due to the new generation of
  systems programming languages (Go, Rust, D, Swift(?), Dart(?),
  etc. may create an opportunity for a build system that handles them
  well particularly if it handles polyglot projects well (see below).
- Cross-compilation is experiencing new appeal because of the
  increasing popularity of ARM and RISC-V CPUs, and of small devices
  (too small to compile their own code) based on these chips.
- The Free software ecosystem as a whole would benefit from a
  reconciliation between the traditional model of software
  distribution (compiled code with stable interfaces, released as
  tarballs at regular intervals, installed once on any given computer
  and depended on as shared libraries and/or binaries) and the newer
  "depend directly on VCS checkouts and bundle everything" model
  described below.  Autotools contributors have the experience and
  knowledge to lead this effort.
- Funding may be available for projects targeting the weaknesses listed above.

## Threats

These threats may lead to a further decrease in Autotools developer
contribution, funding, and momentum.

- Increasing mindshare of competing projects (CMake, Meson, [Generate-Ninja][], …).
- Increasing mindshare of programming languages that come with a build
  system that works out of the box, as long as you only use that one
  language in your project.  (These systems typically cannot handle a
  polyglot project at all, hence the above opportunity for a
  third-party system that handles polyglot projects well.)
- Increasing preference for building software from VCS checkouts
  (perhaps at a specific tag, perhaps not) rather than via tarballs.
- Increasing mindshare of the software distribution model originated
  by Node.js, Ruby, etc. where each application bundles *all* of its
  dependencies.  While this is considered a profoundly bad idea by
  Linux distribution maintainers in particular (because it makes it
  much harder to find and patch a buggy dependency) and makes it
  harder for end-users to modify the software (because out-of-date
  dependencies may be very different from what their own
  documentation—describing the latest version—says), it is
  significantly more convenient for upstream developers.  Competing
  build systems handle this model much better than Autoconf does.

[Generate-Ninja]: https://gn.googlesource.com/gn

----

Thanks to [Sumana Harihareswara](https://changeset.nyc/) for
inspiration and editing.

Followup discussion should go to [the Autoconf mailing
list](https://lists.gnu.org/mailman/listinfo/autoconf).
