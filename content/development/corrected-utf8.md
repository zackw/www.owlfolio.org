---
title: Corrected UTF-8
date: 2022-11-14 09:55:02
---

UTF-8 is decent and all but it contains some design errors, partly
because its original designers just messed up, and partly because of
ISO and Unicode Consortium internal politics.  We’re probably going to
be using it forever so it would be good to correct these design errors
before they get any more entrenched than they already have.

Corrected UTF-8 is _almost_ the same as UTF-8.  We make only three
changes: overlength encodings become _impossible_ instead of just
forbidden; the C1 controls and the Unicode “surrogate characters” are
not encoded; and the artifical upper limit on the code space is
removed.

<!--more-->

The key words “MUST,” “MUST NOT,” “REQUIRED,” “SHALL,” “SHALL NOT,”
“SHOULD,” “SHOULD NOT,” “RECOMMENDED,” “MAY,” and “OPTIONAL” in
this document are to be interpreted as described in [RFC 2119][].

## Eliminating overlength encodings

The possibility of overlength encodings is the design error in UTF-8
that’s just a plain old mistake.  As originally specified, the
codepoint U+002F (SOLIDUS, `/`) could be encoded as the one-byte
sequence `2F`, or the two-byte sequence `C0 AF`, or the three-byte
sequence `E0 80 AF`, etc.  [This led to security holes][u8sec] and so
the specification was revised to say that a UTF-8 encoder must produce
the shortest possible sequence that can represent a codepoint, and a
decoder must reject any byte sequence that’s longer than it needs to be.

Corrected UTF-8 instead adds offsets to the codepoints encoded by all
sequences of at least two bytes, so that every possible sequence is
the _unique_ encoding of a single codepoint.  For example, a two-byte
sequence, 110xxxxx 10yyyyyy, encodes the codepoint 0000 0xxx xxyy yyyy
*plus 160*; therefore, `C0 AF` becomes the unique encoding of U+00CF
(LATIN CAPITAL LETTER I WITH DIAERESIS, `Ï`).

## Not encoding C1 controls or surrogates

The C1 control character range (U+0080 through U+009F) is included in
Unicode [primarily for backward compatibility with ISO/IEC
2022][c1iso2022], an older character encoding standard in which the
*byte* ranges `00` through `1F` and `7F` through `9F` are reserved for
control characters.

It is never appropriate to use the C1 controls in interchangeable
text, as they are very likely to be misinterpreted according to one of
the DOS code pages that defined bytes `80` through `9F` as graphic
characters.  Corrected UTF-8 skips over them entirely; this is why the
offset for two-byte sequences is 160 rather than 128.  (I would _like_
to discard almost all of the C0 controls as well—preserving only
U+0000 and U+000A—but that would break ASCII compatibility, which is a
step too far.)  If there is a need to represent U+0080 through U+009F,
perhaps for round-tripping historical documents, they can be mapped to
some convenient private-use codepoints.

Similarly, the only reason the surrogate space (U+D800 through U+DFFF)
exists is to support UTF-16.  These codepoints will never appear in
well-formed Unicode text, and the current generation of the UTF spec
actually forbids the three-byte sequences `ED A0 80` through
`ED BF BF` to be emitted or accepted at all, rather like the
overlength sequences.  In Corrected UTF-8, we skip this range just
like we do for the C1 controls.  (This unfortunately does mean that
the three-byte sequences are split into two ranges with two different
offsets.)  Again, programs that need to represent actual surrogates
(perhaps for the same reasons that motivated the creation of
[WTF-8][]) can map them into private-use space.

## Removing the artificial upper limit

The original design of UTF-8 (as “FSS-UTF,” by Pike and Thompson;
standardized in 1996 by [RFC 2044][]) could encode codepoints up to
U+7FFF FFFF.  In 2003 the IETF changed the specification (via [RFC
3629][]) to disallow encoding any codepoint beyond U+10 FFFF.  This
was purely because of internal ISO and Unicode Consortium politics;
they rejected the possibility of a future in which codepoints would
exist that UTF-*16* could not represent.  UTF-16 is now obsolete, so
there is no longer any reason to stick to this upper limit, and at the
present rate of codepoint allocation, the space below U+10 FFFF will
be exhausted in something like 600 years (less if private-use space is
not reclaimed).  Text encodings are forever; the time to avoid running
out of space is now, not 550 years from now.

Corrected UTF-8 reverts to the original definition of four-, five-,
and six-byte sequences from RFC 2044; after taking the offsets into
account, the highest encodable code point is U+8421 109F.  The
encoding schema could be extended still further by use of the lead
bytes `FE` and `FF`, which RFC 2044 leaves undefined.  `FE` would
begin a seven-byte sequence, and `FF` would indicate that the unary
count of tail bytes extends into the next byte. `1111 1111 110x xxxx`
would be the first _two_ bytes of an eight-byte sequence,
`1111 1111 1110 xxxx` would begin a _nine_-byte sequence, and so on;
in this way the encoding schema would not have any upper limit at all.

We are leaving that extension for the future, because the original
rationale for not using bytes `FE` and `FF` (avoiding conflicts with
UTF-16 byte order marks and Telnet IAC bytes) is still _somewhat_
relevant, even though both UTF-16 and Telnet are obsolete.  However,
to preserve the _possibility_ of longer byte sequences being used in
the future, Corrected UTF-8 decoders MUST treat sequences beginning
with `FE` or `FF` as “reserved for future use” and as extending until
the next recognized lead byte, rather than as “invalid.”

## Putting it all together

Here is a complete table of byte sequences up to 6 bytes long, with
their offsets and the codepoint ranges they encode.  Byte and
codepoint values are shown in hexadecimal, offsets in decimal.

| Byte Sequence Range                   |   Offset | Codepoint Range         |
|:--------------------------------------|---------:|:------------------------|
| 00 … 7F                               |          0 | 0000 0000 … 0000 007F|
| C0 80 … DF BF                         |        160 | 0000 00A0 … 0000 089F|
| E0 80 80 … EC BD 9F                   |      2 208 | 0000 08A0 … 0000 D7FF|
| EC BD A0 … EF BF BF                   |      4 256 | 0000 E000 … 0001 109F|
| F0 80 80 80 … F7 BF BF BF             |     69 792 | 0001 10A0 … 0021 109F|
| F8 80 80 80 80 … FB BF BF BF BF       |  2 166 944 | 0021 10A0 … 0421 109F|
| FC 80 80 80 80 80 … FD BF BF BF BF BF | 69 275 808 | 0421 10A0 … 8421 109F|

The eight-byte sequence EF B7 9D ED B2 AE 00 0A is defined as the
“magic number” signaling text using Corrected UTF-8.  It SHOULD be
present at the beginning of any *file* encoded in Corrected UTF-8,
but need not be prepended to strings whose encoding is known by
other means.  Like “byte order marks” in UTF-16, when it appears at
the beginning of a file, it should not be considered part of the text.

This byte sequence is the Corrected encoding of the four-codepoint
sequence U+10E7D U+ED4E U+0000 U+000A.  If interpreted as traditional
UTF-8, it instead encodes U+FDDD U+DCAE U+0000 U+000A, which is
forbidden on two counts: U+FDDD is a noncharacter and U+DCAE is a
surrogate (and an unpaired one at that).  U+10E7D is [RUMI][] FRACTION
ONE THIRD, and U+ED4E is the private use character assigned by the
[Under-ConScript Unicode Registry][ucsur] to [NIJI][] CONSONANT CH; these
choices are largely arbitrary.

## Other legacy control characters

As mentioned above, the major reason why the C0 controls are still
encodable in Corrected UTF-8 is to preserve compatibility with ASCII,
which is still important.  However, these characters are also largely
obsolete; the only one that should appear in a normal text file is
U+000A.  The others’ functions are, nowadays, better handled by
binary-safe transport protocols and markup languages, or else they’re
simply redundant.

Because of the common use of the lone byte `00` as a string
terminator, U+0000 MUST NOT appear in a Corrected UTF-8 document
except as part of the “magic number” defined above.  Corrected UTF-8
documents SHOULD conform to the Unix definition of a text file, which
means that U+000A is used by itself as a line terminator (NOT a line
separator; the last character in the file should be U+000A) and U+000D
and U+2028 SHOULD NOT appear.  The other C0 controls, and additionally
U+2029 PARAGRAPH SEPARATOR, also SHOULD NOT appear.

[u8sec]: https://capec.mitre.org/data/definitions/80.html
[c1iso2022]: https://www.unicode.org/versions/Unicode12.0.0/ch23.pdf#page=3
[WTF-8]: https://simonsapin.github.io/wtf-8/
[RFC 2044]: https://datatracker.ietf.org/doc/html/rfc2044
[RFC 2119]: https://datatracker.ietf.org/doc/html/rfc2119
[RFC 3629]: https://datatracker.ietf.org/doc/html/rfc3629
[ucsur]: http://www.kreativekorp.com/ucsur/
[RUMI]: http://std.dkuug.dk/jtc1/sc2/wg2/docs/n3087-1.pdf
[NIJI]: https://norbertlindenberg.com/2018/03/niji-script/index.html
