---
title: A Zany Scheme for Compact Secure Hashes
date: 2011-06-17 12:29
slug: zany-scheme-compact-hashes
---

Lots of current and near-future tech relies heavily on
[secure hashes](http://en.wikipedia.org/wiki/Cryptographic_hash_function)
as identifiers; these are usually represented as hexadecimal
strings. For instance, in a
[previous post](/research/securing-the-future-net/) I threw out the
strawman `h:` URN scheme that looks like this:

    <!-- jQuery 1.5.2 -->
    <script src="h:sha1,b8dcaa1c866905c0bdb0b70c8e564ff1c3fe27ad"></script>

Now the problem with this is, these hexadecimal strings are
inconveniently long and are only going to get longer.
[SHA-1](http://en.wikipedia.org/wiki/SHA-1) (as shown above) produces
160-bit hashes, which take 40 characters to represent in hex. That
algorithm is looking kinda creaky these days; the most convenient
replacement is [SHA-256](http://en.wikipedia.org/wiki/SHA-2). As the
name implies, it produces 256-bit hashes, which take 64 characters to
write out in hex. The next generation of secure hash algorithms,
currently
[under development at NIST](http://en.wikipedia.org/wiki/NIST_hash_function_competition),
are also going to produce 256-bit (and up) hashes. The inconvenience
of these lengthy hashes becomes even worse if we want to use them as
*components* of a URI with structure to it (as opposed to being the
entirety of a URN, as above). Clearly some encoding other than hex,
with its 2x expansion, is desirable.

Hashes are incompressible, so we can't hope to pack a 256-bit hash
into fewer than 32 characters, or a 160-bit hash into fewer than 20
characters. And we can't just dump the raw binary string into our
HTML, because HTML is not designed for that---there is no way to tell
the HTML parser "the next 20 characters are a binary
literal". However, what we *can* do is find 256 printable, letter-like
characters within the first few hundred Unicode code points and use
them as an encoding of the 256 possible bytes. Continuing with the
jQuery example, that might look something like this:


    <script src="h:sha1,пՎЦbηúFԱщблMπĒÇճԴցmЩ"></script> <!-- jQuery 1.5.2 -->

See how we can fit the annotation on the same line now? Even with
sha256, it's still a little shorter than the original in hex:

    <!-- jQuery 1.5.2 -->
    <script src="h:sha256,ρKZհνàêþГJEχdKmՌYψիցyԷթνлшъÁÐFДÂ"></script>

Here's my proposed encoding table:

        0              0 1              1
        0123456789ABCDEF 0123456789ABCDEF
     00 ABCDEFGHIJKLMNOP QRSTUVWXYZÞabcde
     20 fghijklmnopqrstu vwxyzþ0123456789
     40 ÀÈÌÒÙÁÉÍÓÚÂÊÎÔÛÇ ÄËÏÖÜĀĒĪŌŪĂĔĬŎŬÐ
     60 àèìòùáéíóúâêîôûç äëïöüāēīōūăĕĭŏŭð
     80 αβγδεζηθικλμνξπρ ςστυφχψωϐϑϒϕϖϞϰϱ
     A0 БГДЖЗИЙЛПФЦЧШЩЪЬ бгджзийлпфцчшщъь
     C0 ԱԲԳԴԵԶԷԸԹԺԻԽԾԿՀՁ ՂՃՄՅՆՇՈՉՊՋՌՍՎՐՑՒ
     E0 աբգդեզէըթժիխծկհձ ղճմյնշոչպջռսվրցւ

All of the characters in this table have one- or two-byte encodings in
UTF-8. Every punctuation character below U+007F is given special
meaning in some context or other, so I didn't use any of them. This
unfortunately does mean that only 62 of the 256 bytes get one-byte
encodings, but *storage* compactness is not the point here, and it's
no worse than hex, anyway. What this gets us is *display* compactness:
a 256-bit hash will occupy exactly 32 columns in your text editor,
leaving room for at least a few other things on the same line.

Choosing the characters is a little tricky. A whole lot of the code
space below U+07FF is taken up by characters we can't use for this
purpose---composing diacritics, control characters, punctuation, and
right-to-left scripts. I didn't want to use diacritics (even in
precomposed form) or pairs of characters that might be visually
identical to each other in some (combination of) fonts. Unfortunately,
even with the rich well of Cyrillic and Armenian to work with, I
wasn't able to avoid using a bunch of Latin-alphabet
diacritics. Someone a little more familiar with the repertoire might
be able to do better.
