---
title: Radical simplification will not save the world
date: 2013-05-22 19:02
slug: radical-simplification-will-not-save-the-world
---

Seems like every time I go to a security conference these days there's
at least one short talk where people are proposing to start over and
rebuild the computer universe from scratch and make it *simple* and
*impossible to use wrong* this time and it will be *so awesome*.
Readers, it's not going to work. And it's not just a case of nobody's
going to put in enough time and effort to make it work. The idea is
doomed from eight o'clock, Day One.

We all know from practical experience that a software module that's
too complicated is likely to harbor internal bugs and is also likely
to induce bugs in the code that uses it. But we should also know from
practice that a software module that's too *simple* may work perfectly
itself but will *also* induce bugs in the code that uses it! "One size
fits all" APIs are almost always *too inflexible*, and so accumulate a
"scar tissue" of workarounds, which are liable to be buggy. Is this an
accident of our human fallibility? No, it is an inevitable consequence
of oversimplification.

To explain why this is so, I need to talk a little about
[cybernetics](http://en.wikipedia.org/wiki/Cybernetics). In casual
usage, this word is a sloppy synonym for robotics and robotic
enhancements to biological life (cyborgs), but as a scientific
discipline it is the study of *dynamic control systems* that interact
with their environment, ranging in scale from a simple closed-loop
feedback controller to entire societies.[^1] The Wikipedia
article is decent, and if you want more detail, the essay
"[Cybernetics of Society](http://www.jurlandia.org/cybsoc.htm)" is a
good starting point. Much of the literature on cybernetics talks about
interacting systems of *people*---firms, governments, social clubs,
families, etc---but is equally applicable to systems of, around, or
within computers.  One of the fundamental conclusions of cybernetics,
evident for instance in Stafford Beer's
[viable system model](http://en.wikipedia.org/wiki/Viable_system_model),
is that *a working system must be as least as complex as the systems
it interacts with*. If it isn't, it will be unable to cope with all
possible inputs.  This is a theoretical explanation for the practical
observation above, and it lets us put a lower bound on the complexity
of a real-world computer system.

Let's just look at *one* external phenomenon nearly every computer has
to handle: time. Time seems like it ought to be an easy problem.
Everyone on Earth could, in principle, agree on what time it is right
now. Making a good clock requires precision engineering, but the
hardware people have that covered; a modern $5 wristwatch could have
[earned you twenty thousand pounds in 1714](http://en.wikipedia.org/wiki/Board_of_Longitude). And
yet the task of converting a count of seconds to a human-readable date
and vice versa is so hairy that
[people write 500-page books about that alone](http://www.powells.com/biblio/61-9780521702386-1),
and the IANA has to maintain a
[database of time zones](http://www.iana.org/time-zones) that has seen
at least nine updates a year every year since 2006. And that's just
one of the things computers have to do with time. And handling time
correctly can, in fact, be
[security-critical](http://en.wikipedia.org/wiki/Replay_attack).

I could assemble a demonstration like this for many other phenomena
whose characteristics are set by the non-computerized world: space,
electromagnetic waves, human perceptual and motor abilities, written
language, mathematics, etc. etc. (I leave the biggest hairball of
all---the global information network---out, because it's at least
nominally in-scope for these radical simplification projects.)
Computers have to cope with all of these things in at least some
circumstances, and they all interact with each other in at least some
circumstances, so the aggregate complexity is even higher than if you
consider each one in isolation. And we're only considering here things
that a general-purpose computer has to be able to handle *before* we
can start thinking about what we want to *use* it for; that'll bring
in all the complexity of the problem domain.

To be clear, I do think that starting over from scratch and taking
into account everything we've learned about programming language, OS,
and network protocol design since 1970 would produce something better
than what we have now. But what we got at the end of that effort would
not be notably *simpler* than what we have now, and although it might
be *harder* to write insecure (or just buggy) application code on top
of it, it would not be *impossible*. Furthermore, a design and
development process that does not understand and accept this will
*not* produce an improvement over the status quo.

[^1]: The casual-use meaning of "cybernetics" comes from the
  observation (by early AI researchers) that robots and robotic
  prostheses were necessarily cybernetic systems, i.e. dynamic control
  systems that interacted with their environment.
