---
title: Bootstrapping trust in compilers
date: 2015-12-05T12:10:37.848935
...

The other week, an acquaintance of mine was kvetching on Twitter about
how the [Rust][] compiler is written in Rust, and so to get started
with the language you have to download a binary, and there's no way to
validate it---you could use the binary plus the matching compiler
source to recreate the binary, but [that doesn't prove anything][],
and also if the compiler were *really* out to get you, you would be
screwed the moment you ran the binary.

This is not a new problem, nor is it a Rust-specific problem.  I
recall having essentially the same issue back in 2000, give or take,
with [GNAT][], the Ada front-end for GCC. It is written in Ada, and
(at the time, anyway) not just any Ada compiler would do, you had to
have a roughly contemporaneous version of ... GNAT.  It was especially
infuriating compared to the rest of GCC, which (again, at the time)
bent over backward to be buildable with *any* C compiler you could get
your hands on, even a "traditional" one that didn't support all of the
1989 language standard.  But even that is problematic for someone who
would rather not trust any machine code they didn't verify themselves.

One way around the headache is "[diverse recompilation][]," in which
you compile the same compiler with *two different* compilers, then
recompile it with itself-as-produced-by-each, and compare the results.
But this requires you to have two different compilers in the first
place.  As of this writing there *is* only one Rust compiler.  There
aren't that many complete implementations of C++ out there, either,
and you need one of those to build LLVM (which Rust depends on).  I
think you could devise a compiler virus that could propagate itself
via *both* LLVM and GCC, for instance.

What's needed, I think, is an independent root of correctness.  A
software environment built from scratch to be verifiable, maybe even
provably correct, and geared specifically to host independent
implementations of compilers for popular languages.  They need not be
terribly good at optimizing, because the only thing you'd ever use
them for is to be one side of a diversely-recompiled bootstrap
sequence.  It has to be a complete and isolated environment, though,
because it wouldn't be impossible to propagate a compiler virus
*through the operating system kernel*, which can see every block of
I/O, after all.

And it seems to me that this environment naturally divides into four
pieces.  First, a tiny virtual machine.  I'm thinking a [FORTH][]
interpreter, which is small enough that one programmer can code it by
hand in assembly language, and having done that, another programmer
can *audit* it by hand.  You need multiple implementations of this, so
you can check them against each other to guard against malicious lower
layers---it could run on the bare metal, maybe, but the "bare metal"
has an awful lot of clever embedded in it these days.  But hopefully
this is the only thing you need to implement more than once.

Second, you use the FORTH interpreter as the substratum for a more
powerful language.  If there's a language in which each program is its
own proof of correctness, that would be the obvious choice, but my
mental allergy to [arrow languages][] has put me off following that
branch of PL research.  [Lisp][] is generally a good language to write
compilers in, so a small dialect of that would be another obvious
choice.  (Maybe leave out the [call/cc][].)

Third, you write compilers in the more powerful language, with both
the FORTH interpreter and more conventional execution environments as
code-generation targets.  These compilers can then be used to compile
other stuff to run in the environment, and conversely, you can build
arbitrary code within the environment and export it to your more
conventional OS.

The fourth and final piece is a way of getting data in and out of the
environment.  I imagine it as strictly batch-oriented, not
interactive at all, simply because that cuts out a huge chunk of
complexity from the FORTH interpreter; similarly it does not have any
business talking to the network, nor having any notion of time, maybe
not even concurrency---most compile jobs *are*
[embarrassingly parallel][], but again, huge chunk of complexity.  What
feels not-crazy to me is some sort of trivial file system:
[`ar` archive][] level of trivial, all files write-once, imposed on a
linear array of disk blocks.

It is probably also necessary to reinvent [Make][], or at least some
sort of batch [job control language][].

[Rust]: https://www.rust-lang.org/
[that doesn't prove anything]: https://www.recurse.com/blog/42-paper-of-the-week-reflections-on-trusting-trust
[GNAT]: https://www.gnu.org/software/gnat/
[diverse recompilation]: https://www.schneier.com/blog/archives/2006/01/countering_trus.html
[FORTH]: https://en.wikipedia.org/wiki/Forth_%28programming_language%29
[arrow languages]: https://en.wikipedia.org/wiki/ISWIM
[Lisp]: https://en.wikipedia.org/wiki/Lisp_%28programming_language%29
[call/cc]: https://en.wikipedia.org/wiki/Call-with-current-continuation
[embarrassingly parallel]: https://en.wikipedia.org/wiki/Embarrassingly_parallel
[`ar` archive]: https://www.freebsd.org/cgi/man.cgi?query=ar&sektion=5&manpath=4.3BSD+NET%2F2
[Make]: https://www.gnu.org/software/make/manual/html_node/Overview.html#Overview
[job control language]: https://en.wikipedia.org/wiki/Job_Control_Language
