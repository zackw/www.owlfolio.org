Title: Data theft with CSS
Date: 2010-08-04 16:54
Slug: css-data-theft

Mozilla has released security updates to Firefox 3.5 and 3.6 that
include defenses for an old, little-known, but serious security hole:
cross-site data theft using CSS. These defenses have a small but
significant chance of breaking websites that rely on "[quirks mode][]"
rendering *and* use a server in another DNS domain (e.g. a [CDN][])
for their style sheets.

In this article I'll describe the attack, what we're doing about it,
how you can ensure that your site will continue to work, and how you
can protect your users who have not upgraded their browsers yet.

[quirks mode]: http://www.quirksmode.org/css/quirksmode.html
[CDN]: http://en.wikipedia.org/wiki/Content_delivery_network

<!--more-->

## The attack

In a traditional [cross-site scripting][] (XSS) attack, the attacker
finds a way to inject JavaScript code fragments into a web page that
they can't read. When a legitimate user of the targeted site loads the
page, the attacker's code executes. It might send information back to
the attacker's servers, or it might forge commands to the targeted
site.  CSS data theft also involves injecting strings into a page that
the attacker can't read, but this time, the strings are fragments of a
style sheet.

[cross-site scripting]: http://www.owasp.org/index.php/Cross-site_Scripting_%28XSS%29

[![Diagram of network traffic in a CSS data theft attack.](/media/2010/06/steps.png
"Diagram of network traffic in a CSS data theft attack.  Click for
full size.")](/media/2010/06/steps.png)

The diagram above shows the course of a CSS data theft attack, from
the perspective of a network hub that can see all the traffic. Before
the attack begins, a victim user (the laptop in the middle) logs into
their favorite website, Clockworks (mockup icon, on the
right). Clockworks sends down a session cookie.

Some time later, while the victim is still logged into Clockworks,
they click on an ad for dancing hamsters, and get sent to the
attacker's website (Badenov, on the left). The attacker's website
sends down an innocent-looking webpage that contains a `<link>` tag
whose URL points to the victim's private-messages page at Clockworks.

The victim's browser duly requests the private-messages page from
Clockworks; since the victim is still logged in, it sends the session
cookie, so the reply will include information meant only for the
victim.  The query string, chosen by the attacker, causes Clockworks'
server to inject strings into the HTML on either side of an
interesting piece of secret information.

Because the *attacker*'s website is being rendered in quirks mode, the
victim's browser ignores the `Content-Type` header and feeds HTML to
the CSS parser. Of course, the very first HTML tag in the file causes
a CSS syntax error, but CSS has predictable, lenient rules for
recovering from syntax errors. The attacker's injected strings make
the CSS parser ignore most of the target page, and capture the secret
as the value of the CSS `background` property.

Finally, since the `background` property applies to the `body` tag,
the browser needs to download the image it specifies in order to
render the attacker's website. The image URL has been wrapped around
the secret information that the attacker wants. So the browser sends
that secret to the attacker's server as a query string.

----

This attack has been known for some time. The earliest public
description I have found was
[by GreyMagic Corporation in 2002][cssxss02]. It has been rediscovered
at least twice since then: [by Matan Gillon in 2005][cssxss05], and
[by pseudonymous blogger 'ofk' in 2008][cssxss08] (article in
Japanese). There are many variations, some of which no longer work,
and some of which only work in IE. The variation I've described works
everywhere that hasn't deployed a defense;
[security researchers at CMU][] were able to use this attack to steal
the contents of private messages from a bulletin board and two
different webmail providers, with victims using unpatched versions of
all the popular browsers.

[cssxss02]: http://www.greymagic.com/security/advisories/gm004-ie/
[cssxss05]: http://www.hacker.co.il/security/ie/css_import.html
[cssxss08]: http://d.hatena.ne.jp/ofk/20081111/1226407593
[security researchers at CMU]: http://websec.sv.cmu.edu/

Since the attack relies on the CSS parser's error recovery behavior,
sites may be immune because of accidental properties of their page
structure. For instance, most browsers do not allow newlines in
`url()` literals. If there had been a newline in the middle of the
secret information in the diagram, just because that's the way
Clockworks generates its HTML, the attack would only work against
victims using IE.

## Browser-side defense

This attack works because a webpage in quirks mode can load *anything*
as a style sheet, even if it's really a HTML page coming from someone
else's server. If the attacker's page were in standards mode, the
browser would pay attention to the HTTP `Content-Type` header on the
target page, declaring it not to be CSS, and refuse to load it as a
style sheet.

The attacker, of course, controls whether their page is in quirks
mode.  But the attacker's page is on a different server than the
target page, which means the attack can be blocked by an extension of
the [same-origin policy][]. Even if a page is in quirks mode, it's not
allowed to load a style sheet with a `Content-Type` header declaring
it to be something other than CSS, unless that sheet comes from the
same origin. [Firefox 4][] will implement this rule, and IE has also
adopted it (see below).

[same-origin policy]: http://taossa.com/index.php/2007/02/08/same-origin-policy/
[Firefox 4]: http://blog.mozilla.com/blog/2010/05/10/firefox-4-vision-fast-powerful-and-empowering/

Unfortunately, there are a few websites out there that are rendered in
quirks mode, and load their style sheets from a different origin, and
put a `Content-Type` header on those style sheets that says they're
not CSS. These sites aren't common---the aforementioned CMU security
researchers found 62 in the Alexa top 100,000, and most of those have
been fixed already---but Firefox 4 will break them.

To give folks more time to fix their sites, while blocking the attack
as soon as possible, we implemented a more lenient rule in
[Firefox ≥3.5.11][ff35] and [≥3.6.7][ff36]. If a page is in quirks
mode, loads a style sheet cross-origin, and that sheet has the wrong
`Content-Type`, we'll start parsing it as CSS anyway ... but we'll
stop and throw the sheet away if we encounter a syntax error before
the first complete rule has been parsed. HTML tags cause CSS syntax
errors, so unless the attacker can inject text at the very beginning
of a page, they won't be able to make the attack work. Safari, Google
Chrome, and Opera have also adopted this rule.

[ff35]: http://releases.mozilla.org/pub/mozilla.org/firefox/releases/latest-3.5/
[ff36]: http://releases.mozilla.org/pub/mozilla.org/firefox/releases/latest-3.6/

It's possible that this rule could break sites too. For instance, if a
style sheet begins with an `@`-rule that Firefox 3.5 does not
understand, that will count as a syntax error, and the sheet will be
discarded.

***UPDATE: August 28:*** The
[HTML5 spec for `<link rel="stylesheet">`](http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#link-type-stylesheet)
now requires the strict rule (see
[HTML5 defect report 9834](http://www.w3.org/Bugs/Public/show_bug.cgi?id=9834)).

***UPDATE: October 26:*** As of Microsoft's
[October 2010 cumulative security update][ie-oct-2010], *all*
maintained versions of Internet Explorer (6, 7, 8, and 9) now
[implement the strict rule][ie-mime-post].

[ie-oct-2010]: http://www.microsoft.com/technet/security/bulletin/ms10-071.mspx
[ie-mime-post]: http://blogs.msdn.com/b/ie/archive/2010/10/26/mime-handling-changes-in-internet-explorer.aspx

## Fixing your website

You only have to worry about your site being broken by the defense if
you load your style sheets from a different server than the HTML *and*
you use quirks mode. If your site works with a [Firefox 4 beta][],
you're fine. Current versions of Firefox 3.5 and 3.6 will warn you in
the [error console][] when they see a site that will break in Firefox
4, so you can also test that way. (Unfortunately, due to limitations
of our translation process, part of this warning will always be in
English.)

[Firefox 4 beta]: http://releases.mozilla.org/pub/mozilla.org/firefox/releases/4.0b2/
[error console]: https://developer.mozilla.org/en/error_console

If your site breaks, all you have to do to fix it is make sure that
your style sheets are being served with `Content-Type: text/css` in
the HTTP headers. Please also consider switching to standards-mode
rendering. If you cannot fix your website,
[we want to hear from you](https://bugzilla.mozilla.org/enter_bug.cgi?product=Core&component=Style+System+%28CSS%29&blocked=524223)

## Protecting your users

If a browser tries to load a style sheet, and the HTTP response it
gets has no `Content-Type` header, it will just assume that it has
been sent some CSS, even if it's a cross-origin load. Therefore, your
users are not fully safe from the attack, even if they all have
browsers with the defense, unless your servers put Content-Type
headers on **all content requiring authentication**. Check your web
services as well as human-readable content.

You should also make sure that those headers are correct. Most
importantly, ensure that if your server can't figure out what
Content-Type to put on a response, it falls back to
`application/​octet-stream` or `text/​plain`. Certain other
possibilities (for instance, `*/*` and
`application/​x-unknown-content-type`) may be treated the same as if
you hadn't sent a `Content-Type` at all.

It is also vital to provide an accurate `charset=` option in your
`Content-Type` headers for all textual data. If you don't, an attacker
can [bypass your XSS filters][] by encoding injected strings in UTF-7.
Declaring the charset in a `meta` tag or `<?xml... ?>` instruction is
**not enough** to defend against a CSS data theft attack encoded in
UTF-7; the CSS parser doesn't pay any attention to them.

[bypass your XSS filters]:
http://openmya.hacker.jp/hasegawa/security/utf7cs.html

To protect users that are still using browsers that have no defense
against CSS data theft, you should block this attack in your filters
for user-submitted content. All you have to do is add `{`, `}`, and
`@` to the set of characters that get replaced with equivalent HTML
entities (`&#x7B;`, `&#x7D;`, and `&#x40;`, respectively). If you can't be sure that
you are always producing `Content-Type` headers with the correct
`charset=` option, you should also entity-encode `+` to `&#x2B`.

## More information

[Chris Evans rediscovered this exploit in late 2009](http://scarybeastsecurity.blogspot.com/2009/12/generic-cross-browser-cross-domain.html)
and has been instrumental in getting it fixed. He has
[two other](http://scarybeastsecurity.blogspot.com/2010/07/firefox-fixes-css-based-cross-origin.html)
[blog posts](http://scarybeastsecurity.blogspot.com/2010/08/internet-explorer-considered-harmful.html)
that go into more
detail. [Collin Jackson](http://mayscript.com/blog/collinj/end-near-cross-origin-css-attacks)
and his team at CMU have also been very helpful in understanding the
full scope of the attack and ensuring all major browsers fixed it.
[Their paper](http://websec.sv.cmu.edu/css/css.pdf) will appear at the
[ACM Computer and Communications Security conference](http://www.sigsac.org/ccs/CCS2010/)
in October.

For technical details of the fixes, see
[Mozilla bug 524223](https://bugzilla.mozilla.org/show_bug.cgi?id=524223),
[Chromium bug 9877](http://code.google.com/p/chromium/issues/detail?id=9877),
and [Webkit bug 29820](https://bugs.webkit.org/show_bug.cgi?id=29820).
