Title: Core design principles
Date: 2009-08-19 12:50
Slug: coredesign

I intend Foliomatic primarily for personal web sites such as this one.
It should also be useful for projects and organizations whose Web
presence is mostly static content, updated from time to time. It is
not going to be a general content management system, nor a framework
for highly dynamic "Web 2.0" content, but it will support some dynamic
features, such as comments on pages.

## Structure

Foliomatic is a *site compiler*. It reads a directory tree of source
files and produces another tree of rendered, static HTML files, which
you drop into your web server. Foliomatic is designed to take its
input from a version control system, which handles access control and
replication. It can, optionally, integrate history information from
the VCS into its output.

Foliomatic is thus similar to existing systems such as [Ikiwiki][],
[Chronicle][], and [Jekyll][]. Foliomatic is more generic in some
ways, and more restricted in others.

[Ikiwiki]: http://ikiwiki.info/
[Chronicle]: http://www.steve.org.uk/Software/chronicle/
[Jekyll]: http://wiki.github.com/mojombo/jekyll

<!--more-->

* Chronicle and Jekyll are primarily intended for blogs, so they place
  strong constraints on site layout that are undesirable in a
  portfolio. Foliomatic does not care how your site is organized.

* Ikiwiki is primarily intended for use as a wiki. It therefore has
  many features which are irrelevant or even undesirable for a site
  with a small number of trusted authors. Almost all of its access
  control logic, for instance, is useless and gets in the way, as is
  the split between content (kept in the VCS) and configuration (*must
  not* be kept in the VCS, or any editor can break the site).

  Foliomatic assumes that you have a small number of trusted authors
  who make their changes through the VCS rather than on the web. It
  does not support general editing via the web, and it expects you to
  keep *everything* in your version control repository. It will
  support pulling configuration from a different repository than
  content, in case you need two levels of author privilege, but I
  would really rather see version control systems grow per-directory
  or per-branch access control than implement it on top.

* Chronicle and Jekyll have no support for feedback from the web---no
  comments, no pingbacks, etc. Ikiwiki supports discussion pages and
  blog-style comments, but in a fairly clunky manner. Foliomatic will
  support blog-style comments smoothly integrated with the site. It
  will probably not support wiki-style discussion pages.

I currently plan to use [Genshi][] for the templating engine. Genshi
is fast, fully aware of the structure of XML documents, and provides a
pipeline abstraction that is easy to add transformation stages to.

## Features

Foliomatic can read a wide variety of text input formats. Most
attention will go to "lightweight markup" languages such as
[Markdown][], [Textile][], and [reST][], but I also want it to be able
to consume [LaTeX][] and [Texinfo][], and prettyprint source code via
a tool such as [Pygments][]. Integration with software documentation
systems such as [Sphinx][] and [Doxygen][] might be nice. It can also
do useful things with non-text input. For instance, it can generate
"gallery" pages from directories of photographs by interpreting the
[EXIF][] data, and will do something useful with a collection of
PDFs (once I figure out what that is).

Foliomatic's formatting of pages can be extended with transformation
stages that run either before or after conversion from the source
format to HTML. For instance, an equivalent of [SmartyPants][]
converts plain quotation marks into proper "typographic" curly quotes;
[sparklines][] and [full-size graphs][] can be generated from embedded
data or external files; [equations][] can be rendered into MathML.
(You can tell I've spent a lot of time in science land.)

Foliomatic is designed to generate an entire web site, so it
understands all sorts of meta-information that you might need to copy
into the web server's space, such as `.htaccess` files, `robots.txt`
and `favicon.ico`.

Foliomatic believes [Ruby's Postulate][]:

> I have a theory that, in general, the accuracy of metadata is
> inversely proportional to the distance between the metadata and the
> data which it proports to describe.

Thus, Foliomatic treats the actual contents of a file as
authoritative, and every other source of information as suspect. For
instance:

* It only looks at "character set" directives within the file when it
  cannot determine the character set from the characters themselves.
* It only looks at the file name's extension when it cannot determine
  the file format from "magic numbers" at the beginning of the file.
* It only checks for a date stamp *on* the file (from the OS or the
  VCS) when there is no date annotation *within* the file.

In all cases, metadata annotations expected by downstream consumers
are regenerated from what Foliomatic has deduced from the content.

## Non-features

A relational database will *not* be required---not even a daemon-free
one like [sqlite][]. There may be a cache of data extracted from the
various files in the source tree, stored in a non-relational
persistent store like [Cog][], but it will only be a cache to speed up
rendered-site rebuilds.

I am not much interested in making the site editable directly from the
web. This would require access control machinery comparable to
ikiwiki; it would also mean people were editing via clunky text input
forms. I might be interested in integrating with *non*-clunky
browser-based text editors such as [Bespin][], that understand version
control, though.

[Markdown]: http://daringfireball.net/projects/markdown/
[Textile]: http://textile.thresholdstate.com/
[reST]: http://docutils.sourceforge.net/rst.html
[LaTeX]: http://www.latex-project.org/
[Texinfo]: http://www.gnu.org/software/texinfo/
[Pygments]: http://pygments.org/
[Sphinx]: http://sphinx.pocoo.org/
[Doxygen]: http://www.doxygen.org/
[EXIF]: http://en.wikipedia.org/wiki/Exchangeable_image_file_format
[Genshi]: http://genshi.edgewall.org/
[SmartyPants]: http://daringfireball.net/projects/smartypants/
[sparklines]: http://sparkline.org/
[full-size graphs]: http://matplotlib.sourceforge.net/
[equations]: http://www1.chapman.edu/~jipsen/mathml/asciimath.html
[Ruby's Postulate]: http://intertwingly.net/blog/2004/09/23/Copy-and-Paste
[sqlite]: http://www.sqlite.org/
[Cog]: http://itamarst.org/software/cog/
[Bespin]: http://labs.mozilla.com/bespin/
