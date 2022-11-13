---
title: Breaking things every six weeks
date: 2011-09-19 13:54
slug: breaking-things-every-six-weeks
---

> Attention conservation notice: 900 words of inside baseball about
> Mozilla. No security content whatsoever.

The [Mozilla Project](https://www.mozilla.org/about/) has been taking a
whole lot of flak recently over its new
"[rapid release cycle](https://blog.mozilla.org/futurereleases/2011/07/19/every-six-weeks/)",
in which there is a new *major* version of Firefox (and Thunderbird)
every six weeks, and it potentially breaks all your extensions.
Especially the big complicated extensions like
[Firebug](http://getfirebug.com/) that people *cannot live without*.
One might reasonably ask, what the hell? Why would any software
development team in their right mind---especially a team developing a
critical piece of system infrastructure, which is what Web browsers
are these days, like it or not---inflict unpredictable breakage on all
their users at six-week intervals?

<!--more-->

The first thing to know is that Firefox's core developers are really
focused on making the Web better. If we weren't, we would be hacking
on something other than a Web browser. The old release cycle was way
too slow for us to do that effectively; as Jono Xia describes in his
blog post
"[It's Not About the Version Numbers](http://jonoscript.wordpress.com/2011/07/18/its-not-about-the-version-numbers-its-about-extension-compatibility-and-long-term-support/),"
anything we did might not get out to end users for *over a year*. When
David Baron fixed
[visited-link history sniffing](http://dbaron.org/mozilla/visited-privacy),
he patched Firefox first---but Chrome and Safari shipped the change
before we did.

> You should read Jono's post now. I'll be here when you get back.

Shipping new versions of the browser every six weeks is clearly a
better way to improve the Web rapidly, than shipping a new version
only once a year or so. But what's stopping the Mozilla team from
shipping a new batch of under-the-hood improvements to the Web every
six weeks without breaking anything? Why do we *need* to break things?

Well, we tried not breaking things for ten years, give or take, and it
didn't work. The second thing to know is that the core browser
("Gecko") suffers from enormous technical debt. Like any large,
15-year-old piece of software, we have code in abundance that was
written under too much time pressure to get it right, was written so
long ago that nobody remembers how it works, isn't comprehensively
tested, or any combination of the above. We also have major components
that reasonably seemed like good ideas at the time, but have since
proven to be a hindrance (XUL, XBL, XPConnect, etc). We have other
major components that should have been recognized as bad ideas at the
time, but weren't (XPCOM, NSPR, etc). And we have code for which there
is no excuse at all (Firefox still had code using the infamous
["Mork" file format](http://www.jwz.org/blog/2011/07/mork-keeps-on-giving-when-the-database-worms-eat-into-your-murder-trial/)
until just this summer, and I understand it's still live in
Thunderbird).

It gets worse: many of the bugs *can't* be fixed without breaking
stuff. For example, take
[bug 234856](https://bugzilla.mozilla.org/show_bug.cgi?id=234856). That's
a seven-year-old *display glitch*. What could possibly be an excuse
for not fixing a simple display glitch for seven years? Well, the root
cause of that bug (described more clearly in
[bug 643041](https://bugzilla.mozilla.org/show_bug.cgi?id=643041),
where the actual fix is posted) is an error in an XPCOM interface
that, until we decided we weren't going to do this anymore (post-FF4),
was "frozen"---it could not be changed *even though it was wrong*,
precisely so that extensions could depend on it not changing. There
are *thousands* of XPCOM interfaces, and extensions can use *all* of
them. That's a great strength: it lets Firefox extensions do far more
than, say, Chrome extensions can. That's also a huge problem for
people trying to make the core better. (Only about 200 of these
interfaces were permanently frozen, but pre-FF4 we tried to avoid
changing even the un-frozen ones as much as possible.) You'll notice
that the change in bug 643041 makes it *easier* to write extensions
that manipulate SSL certificates, because now there's just *one*
`nsIX509Cert` interface, not three. But taking away `nsIX509Cert2` and
`nsIX509Cert3` breaks code that was using them.

Some bugs can't even be fixed without breaking Web sites. Any time Gecko
doesn't do the same thing Webkit and/or IE do, we (and the Webkit and IE
people) want to make that difference go away---but to do that, at least
one of the three has to change, and there may be sites out there relying
on the behavior that just got taken away. In some cases, adding
*features* breaks the web. For instance, if you write
'`<element onevent="do_something()">`' directly in your HTML, when the
event fires, the JavaScript interpreter will try to call a *method of
`element`'s DOM API* named `do_something` before it tries to call a
global function with that name. Which means that adding DOM methods to
any HTML element potentially breaks websites. (This is not a problem if
you assign to `element.onevent` from a `<script>`.)

This is why Mozilla core developers can seem so callous to the needs
of extension and website developers built on Gecko. We know that we
depend on both groups for our continued relevance---a browser is no
use at all with no websites to browse, and without extensions there is
not much reason to pick one browser over another. But we feel that
*right now* it is more important to fix the problems with our existing
platform than to provide stability. In the long run, we will have a
better platform for both groups to work with. And in the long run,
stability will come back. There are many bugs to fix first, but there
are not infinitely many bugs, even if it seems like it
sometimes. Having said that, there are some things we could be doing
right now to make extension and website developers' lives better
... but I'm going to save them for the next post. 900 words is enough.

Note to commenters: I know lots of people are unhappy with the UX
changes post-FF3.6, but let's keep this to discussion of API breakage,
please.
