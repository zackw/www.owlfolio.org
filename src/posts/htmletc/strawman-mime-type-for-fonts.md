---
title: 'Strawman: MIME type for fonts'
date: 2011-01-05 16:05
---

For a little while now, it's been possible for websites to
[embed fonts](http://hacks.mozilla.org/2009/06/beautiful-fonts-with-font-face/)
that all major browsers will pick up on. This of course implies fonts
being served as HTTP resources. But…

<!--more-->

…it turns out that nobody has
bothered to assign any of the common font formats a MIME
type.[^1] Fonts being embedded on the web nowadays come in
two flavors and three kinds of container: you either have [TrueType][]
or [PostScript CFF][]-style outline glyphs, and they are in a bare
"OpenType" (really [sfnt][]) container, or else compressed with either
[WOFF][] or [EOT][]. (I am ignoring SVG fonts, which are spottily
supported and open several cans of worms that I don't want to get into
right now.) In the future, people might also want to embed [TTC][]
font collections, which are also in a sfnt container and could thus
also be compressed with WOFF---not sure about EOT there---and bare
[PostScript Type 1][] fonts, but neither of these is supported in any
browser at present, as far as I know. There is no official MIME type
for any of these combinations; therefore, people deploying fonts over
HTTP have been making them up. Without trying very hard, I found real
sites using all of: `application/ttf`, `application/otf`,
`application/truetype`, `application/opentype`, `application/woff`,
`application/eot`, any of the above with an x-prefix, or any of the
above in `font/` instead of `application/` (with or without the
x-). There is no top-level `font` [MIME category][], making this last
particularly [egregious][].

All of these made-up types work because browsers don't pay any
attention to the content type of a web-embedded font; they look at the
data stream, and if it's recognizably a font, they use it. Such
"sniffing" has historically caused serious problems---recall my old
post regarding [CSS data theft][]---so you might expect me to be
waving red flags and arguing for the entire feature to be pulled until
we can get a standard MIME category for fonts, standard subtypes for
the common ones, and browsers to start ignoring fonts served with the
wrong type. But I'm not. I have serious misgivings about the whole
"the server-supplied Content-Type header is gospel truth, content
sniffing is evil" thing, and I think the font situation makes a nice
test case for moving away from that model a bit.

Content types are a security issue because many of the file formats
used on the web are ambiguous. You can make a well-formed HTML
document that is simultaneously a well-formed CSS style sheet or
JavaScript program, and attackers can and have taken advantage of
this. But this isn't necessarily the case for fonts. The sfnt
container and its compressed variants are self-describing,
unambiguously identifiable binary formats.  Browsers thoroughly
validate fonts before using them (because an *accidentally* malformed
font can [break the OS's text drawing code][fontbugs]), and don't
allow them to do anything but provide glyphs for text. A good analogy
is to images: browsers also completely ignore the server's
content-type header for anything sent down for an `<img>`, and that
doesn't cause security holes---because images are also in
self-describing binary formats, are thoroughly validated before use,
and can't do anything but define the appearance of a rectangle on the
screen. We do not need filtering on the metadata, because we have
filtering on the data itself.

Nonetheless, there may be value in having a MIME label for fonts as
opposed to other kinds of binary blobs. For instance, if the server
doesn't think the file it has is a font, shouldn't it be able to
convince the browser of that, regardless of whether the contents of
the file are indistinguishable from a font? (Old hands may recognize
this as one of the usual rationales for not promoting `text/plain` to
`text/html` just because the HTTP response body happens to begin with
`<!DOCTYPE`.) The current draft
[standard algorithm for content sniffing][mimesniff] takes this
attitude with images, recommending that browsers only treat HTTP
responses as images if their declared content type is in the `image/`
category, but ignore the subtype and sniff for the actual image
format. With that in mind, here's my proposal: let's standardize
**`application/font`** as the MIME type for *all* fonts delivered over
the Internet, regardless of their format. Browsers should use only
fonts delivered with that MIME type, but should detect the actual
format based on the contents of the response body.

I can think of two potential problems with this scheme. First, it
would be good if browsers could tell servers (using the normal
`Accept:` mechanism) which specific font formats they
understand. Right now, it's reasonable to insist that browsers should
be able to handle either TrueType or PostScript glyph definitions, in
either bare sfnt or compressed WOFF containers, and ignore the other
possibilities, but that state won't endure forever. SVG fonts might
become useful someday (if those cans of worms can be resolved to
everyone's satisfaction), or someone might come up with a new binary
font format that has genuine advantages over OpenType. I think this
should probably be handled with [accept parameters][], for instance
`Accept: application/font;container=sfnt` could mean "I understand all
OpenType fonts but no others". The other problem is, what if someone
comes up with a font format that can't reliably be distinguished from
an OpenType font based on the file contents? Well, this is pretty darn
unlikely, and we can put it into the RFC defining `application/font`
that future font formats need to be distinguishable or else get their
own MIME type.  The sfnt container keeps its [magic number][] (and
several other things that ought to be in the file header) in the wrong
place, but as long as all the *other* font formats that we care about
put their magic number at the beginning of the file where it belongs,
that's not a problem.

[^1]: To be precise, there is *a* standard MIME type
  for *a* font format: [RFC 3073][] defines `application/font-tdpfr` for
  the [Bitstream PFR][] font format, which nobody uses anymore, except
  possibly some proprietary television-related products. Bitstream
  appear to have been trying to get it used for web fonts back in the
  days of Netscape 4, and then to have given up on it, probably because
  the font foundries' attitude was NO YOU CAN'T HAS LICENSE FOR WEBS
  until just last year.

[RFC 3073]: http://www.rfc-editor.org/rfc/rfc3073.txt
[Bitstream PFR]: http://web.archive.org/web/20080225160925/http://www.bitstream.com/font_rendering/products/truedoc/pfrspec.html
[TrueType]: http://www.truetype-typography.com/
[PostScript CFF]: http://en.wikipedia.org/wiki/PostScript_fonts#Compact_Font_Format
[sfnt]: http://developer.apple.com/fonts/tools/tooldir/TrueEdit/Documentation/TE/TE1sfnt.html
[WOFF]: http://en.wikipedia.org/wiki/Web_Open_Font_Format
[EOT]: http://en.wikipedia.org/wiki/Embedded_OpenType
[TTC]: http://en.wikipedia.org/wiki/TrueType#TrueType_Collection
[PostScript Type 1]: http://www.prepressure.com/fonts/basics/type1
[MIME category]: http://www.iana.org/assignments/media-types/
[egregious]: http://tvtropes.org/pmwiki/pmwiki.php/JustForFun/Egregious
[CSS data theft]: /htmletc/css-data-theft/
[fontbugs]: https://bugzilla.mozilla.org/buglist.cgi?bug_id=595703,583715,594456,599061,598190,595026,594926,580730,580212,581359,597942,581029,594966,588233,594651,594627,595997,596112,599068,594618,574368,586847,594628,596227,596110,595689,582151,587742,594638,595960,586895
[mimesniff]: http://tools.ietf.org/html/draft-ietf-websec-mime-sniff-00.html
[accept parameters]: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
[magic number]: http://en.wikipedia.org/wiki/File_format#Magic_number
