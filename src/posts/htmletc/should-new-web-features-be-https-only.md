---
title: Should new web features be HTTPS only?
date: 2014-03-24 14:44
---

I doubt anyone who reads this will disagree with the proposition that
the Web needs to move toward all traffic being encrypted always. Yet
there is constant back pressure in the standards groups, people trying
to propose network-level innovations that provide only *some* of the
fundamental three guarantees of a secure channel---maybe you can have
integrity but not confidentiality or authenticity, for instance. I can
personally see a case for an "authentic" channel that provides
integrity and authenticity but not confidentiality, but I don't think
it's useful enough to back off on the principle that everything should
be encrypted always.

So here's a way browser vendors could signal that we will not stand
for erosion of secure channels: starting with a particular, documented
and well-announced, version, **all new content features are only
usable for fully HTTPS pages.** Everything that worked prior to that
point continues to work, of course. I am informed that there is at
least some support for this within the Chrome team. It might be hard
to sell Microsoft on it. What does the fox think?
