---
title: I Didn't Learn Unix By Reading All The Manpages
date: 2022-10-13 21:34:10
---

> Originally drafted as [a thread on hackers.town][orig-thread],
> after [Abbie Normal][] asked me to expand on a side comment in
> [a discussion of documentation][earlier-thread].

There’s a story old Unix beards tell about how they learned Unix. “We
just read all the manpages,” they say, “that’s how well written they
are, you don’t need to read anything else or take any classes.  Maybe
also pick up a copy of [K&R][] if you’re a little iffy on C.”

I consider myself an old Unix beard, even though I don’t have a beard
and I only got into the game in the days of SunOS 4.1, and until quite
recently I thought this was how _I_ learned Unix.  I _did_ read all
the manpages, without any formal coursework, and trained myself up as
a programmer to the point where I could get a job in the industry.  It
took three years of self-study and experimentation, consuming nearly
all my free time, and in retrospect I wouldn’t recommend the experience,
but, y’know, it worked out, right?

But the thing is, this story completely neglects all the things I’d
already learned about computers and programming _before_ I got to
college.

<!--more-->

As a kid I read every single book in the house, indiscriminately, no
matter how boring it would seem to an adult—including a bunch of old
computer science textbooks that we had for some reason. And I spent a
bunch of time tinkering around with computer programming, mostly _not_
on Unix and _not_ in C, but still. When I came to the manpages I had
the beginnings of a conceptual structure for understanding systems
programming in my brain already.

I realized this only because of the experience I’ve had over the past
two years in _teaching_ computer science—specifically, CMU’s
“[Introduction to Computer Systems][15213]” course, which, at first
glance, _seems_ to have a lot of overlap with the content I used to
think I learned from the manpages.  But as I repeat the lessons for
each new batch of undergraduates, and especially as I spend time
helping them with the specific things they get stuck on, I’ve come to
realize that what I’m actually teaching is the stuff I _already knew_
when I _started_ reading the manpages.  And, also, that I would not
have been able to get much out of the manpages if I hadn’t already
known that stuff.

So, okay, why does it _matter_ that I didn’t learn my trade the way I
thought I did?  Because, first, holding up “the manpages” as ideal
documentation is a mistake.  They are pretty darn good _reference_
documentation within their domain, and that’s why they appeal so much
to experts: if you _already know_ most of what there is to know about
a standard C library function, or a Unix shell command, and you just
need a bit of a reminder on how to do one specific thing, the manpages
will not let you down.  Reference documentation for other languages
and tools is often frustrating by comparison.  But, if you _don’t_
already know, if you don’t have the concepts and the mental models,
reference documentation is _not what you want_.  Instead you need a
guide, or a textbook.

(I _did_ read lots and lots of guides and textbooks, before, during,
and after those three years of self-study and experimentation.  I’d
expect that _most_ of the people who call themselves Unix beards had
done the same.  In retrospect, I got so much more out of “[Starting
FORTH][]” and “[TCP/IP Network Administration][]” and the [Lisp 1.5
Primer][] and some 1975-vintage algorithms textbook whose name I can’t
remember (all the examples were in Pascal) than I ever got out of the
manpages.)

The people who insist that the manpages are all you need will
sometimes dismiss guide-type documentation as tedious to work through;
they’d rather learn things from a reference, they say, because that
way they can jump around in it and look for the specific bits that are
relevant to them right now.  And that’s fine—if they’re right that the
stuff they’re skipping over _isn’t_ relevant to them.  But it also has
negative practical consequences.

If you are in the habit of reading only the bits of the documentation,
whatever documentation you have, that you think are relevant right
now, you’re liable to come away with a mental model that’s only
vaguely accurate; possibly dangerously _in_‌accurate in places.  (I
think this is a lot of why the user commentary at the bottom of the
online PHP documentation is so full of bad advice.)  And, if you are
only interested in reference documentation yourself, you’re probably
not going to try to _write_ guides for the software you yourself
write.  (This is how we get monstrosities like the Git
documentation, that are _only_ of any use to someone who already knows
how it works and just needs a bit of a reminder.)

Furthermore—this isn’t just about bad documentation.  When experts
repeat inaccurate stories about how _we_ learned to code, we’re
setting the next generation of hackers up to _fail_ to learn to code.
The [Jargon File][], which records how the generation of programmers
_before_ mine thought they learned to code, holds up the experience of
devoting all of your free time to learning computers as _necessary_:

> [larval stage][] _n._ Describes a period of monomaniacal
> concentration on coding apparently passed through by all fledgling
> hackers…the ordeal seems to be necessary to produce really wizardly
> (as opposed to merely competent) programmers

This may have _seemed_ to be true when it was written (although I
believe I smell the [hazing effect][] at work) but it doesn’t leave
any room for people who don’t learn things by monomaniacally
concentrating on them.  (This is not the only place where the Jargon
File’s authors failed to imagine how people whose brains worked
differently than theirs could be any good at computers.)  I’m pretty
confident that someone who practices programming strictly as a hobby,
less than ten hours a week, will eventually get just as good at it as
one of these “fledgling hackers” who doesn’t do anything else with
their spare time.  And, if we _tell_ people that, they won’t get put
off the subject by the unappetizing prospect of not getting to hang
out with friends on the weekends.

[orig-thread]: https://hackers.town/@zwol/108936234680866181
[earlier-thread]: https://hackers.town/@zwol/108861581410003388
[Abbie Normal]: https://floss.social/@abbienormal
[K&R]: https://en.wikipedia.org/wiki/The_C_Programming_Language
[15213]: https://www.cs.cmu.edu/~213/
[Starting FORTH]: https://www.forth.com/starting-forth/
[TCP/IP Network Administration]: https://www.amazon.com/TCP-Network-Administration-OReilly-Networking/dp/0596002971
[Lisp 1.5 Primer]: https://www.softwarepreservation.org/projects/LISP/book/Weismann_LISP1.5_Primer_1967.pdf
[Jargon File]: http://www.catb.org/jargon/html
[larval stage]: http://www.catb.org/jargon/html/L/larval-stage.html
[hazing effect]: https://www.academia.edu/download/35068087/A_Aronson.pdf
