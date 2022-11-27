---
title: The Conference Formerly Known as Oakland, day 1
date: 2012-05-22 07:57
slug: the-conference-formerly-known-as-oakland-day-1
...

I'm attending the
[IEEE Symposium on Security and Privacy, 2012](http://www.ieee-security.org/TC/SP2012/program.html)
and I'm going to try taking notes and posting them here, again. The
last time I tried this (at
[CCS 2010](http://www.sigsac.org/ccs/CCS2010/)), most of the notes
didn't ever get posted, but I paid a whole lot more attention to the
talks than I do when I'm not taking notes. This time, I'm going to try
to clean up the notes and post them the next morning at the latest.

S&P was at the [Claremont Hotel](http://www.fairmont.com/claremont-berkeley/) in
Oakland, California for thirty-odd years, and they didn't really want
to leave, but there wasn't room for all the people who wanted to
attend. Last year they turned nearly 200 people away. This year, it's
in San Francisco at a hotel on Union Square---amusingly, the exact
same hotel that USENIX Security was at, last August---with much higher
capacity, and while I still have to get up at dawn to get there on
time, at least I don't have to drive.

I have not had time to read any of the papers, so this is all based on
the talks, only. However, where possible I have linked each section
heading to the paper or to a related website.

Mozilla folks: I would like to draw your attention particularly to the
talks entitled "Dissecting Android Malware", "The Psychology of
Security for the Home Computer User", and "User-Driven Access
Control."

<!--more-->

## Session 1: System Security

### [A Framework to Eliminate Backdoors from Response Computable Authentication](http://sites.google.com/site/tieleiwang/)

"On time" is approximate; I missed the opening remarks and enough of
this first talk that I couldn't understand what it was about.
Something about sandboxing verification of passwords to eliminate the
possibility of backdoors? This doesn't seem like a sensible problem
description to me (if you can't trust your authentication library, you
have been hosed since eight o'clock, Day One) so I probably
misunderstood.

### Safe Loading---A Foundation for Secure Execution of Untrusted Programs

Lots of applications nowadays include "sandboxes" for execution of
native code that's not necessarily _correct_ and therefore may be
exploitable by malicious inputs. This might include the bulk of the
application code, and it might need to load system shared libraries.
Historically this has been done by running the system-provided dynamic
loader inside the sandbox. They propose to reimplement the loader as
trusted (outside-the-sandbox) code, which means that the privilege of
loading machine code into the process can be removed from the sandbox,
and (again, they claim) also facilitates exporting "fine-grained
control" information from the loader to the code verifier (if any).

There was not a lot of detail on what they actually _did_ to the
loader, so I am left not really knowing whether this is an interesting
concept. Part of it seems obvious---of _course_ the loader should be
outside the sandbox---and part of it seems to be in aid of Java-style
code verification which I had been under the impression was _instead
of_ sandboxing.

### [Flash Memory for Ubiquitous Hardware Security Functions](https://www.ieee-security.org/TC/SP2012/papers/4681a033.pdf)

Now we're getting more interesting. These folks have figured out how
to extract information about the physical properties of individual
bits of flash memory, which they use to implement a hardware random
number generator (spiffy) and a physical device fingerprint (blech)
without needing any special hardware.

When you write to flash, the amount of charge that gets loaded into
each cell's floating gate is linear in the time the write line is
active. Due to unavoidable manufacturing variation, no two cells
require exactly the same amount of charge to flip from one to zero.
Normally, the controller holds each write line active until it reads
back the desired bit from each cell, but the low-level control
protocol lets you abort a write that hasn't completed. So if you do a
whole bunch of writes (of a page of zeroes) and abort them all well
before they should have finished, you can count the number of writes
required to flip each cell, and that's a unique fingerprint for that
page of flash memory.

1024 bits of flash can be fingerprinted in less than a second with
excellent repeatability and very low chance of collision
(probabilities of undesired outcomes less than 2^-80^, if I remember
correctly). The fingerprint gets 'noisier' as the memory gets older,
but they say it's acceptably stable over the design lifetime of the
memory chip (500,000 cycles).

Random number generation works on the same concept: if you charge a
floating gate just barely to its threshold, it will become unstable,
oscillating between one and zero as thermal noise adds or removes
electrons. Thermal noise goes down with temperature; they found
acceptable randomness down to -80°C. This behavior actually improves
with the age of memory: the unstable region gets wider.
Unfortunately, they did not describe the statistical properties of the
randomness; if you were using other pages of your flash memory for
something else, I could easily imagine there being undesirable
correlations.

Personally, I'm not convinced there are any legitimate use cases for
an unclonable hardware fingerprint, and hardware random number
generation takes only a small amount of special circuitry, so I view
this paper as an argument for removing the "abort write" capability
from the memory control protocol.

During Q&A someone asked, can an adversary use this technique to
detect which pages have been read (or, more likely, written) more
often? They didn't think of trying that, alas.

### [ReDeBug: Finding Unpatched Code Clones in Entire OS Distributions](http://users.ece.cmu.edu/~jiyongj/)

Code reuse by copying is very common. When a security bug is
discovered in widely-reused code, it has to be fixed in all of the
copies, which is tedious, slow, and error-prone. For instance, a 2009
bounds-checking bug in Expat needed to be fixed in 386 copies (looking
at the entirety of SourceForge plus the Debian package repository) and
some of those copies didn't get fixed for more than two years. Using
the tool they presented, the authors found exploitable bugs from
*2001* still present in 2011.

The tool in question is an automated mechanism for finding these buggy
copies at enormous scale: the Debian packages together constitute 350
million lines of code, SourceForge is roughly two *billion* lines all
told. They chose to use syntactic rather than semantic matching, both
for efficiency and to minimize false positives: since every match has
to be checked by hand, anything one can do to reduce human effort is
vital at this scale. To compensate for the increased potential for
false *negatives*, they do syntactic normalization on both the code
and the bugfixes before matching. Using a
[Bloom filter](http://billmill.org/bloomfilter-tutorial/)
backed up by more precise checks, they are able to scan all of
SourceForge in three hours or so, and in near-constant time in the
number of fixes to check for.

False negatives are mostly caused by renamed variables, and oddly
enough, it has fewer false negatives than a similar tool that pays
attention to semantics, possibly because it can't be fooled by trivial
semantic changes.

Someone asked if this was a special case of plagiarism detection (or
vice versa) and they said they thought it was different, because
plagiarism detection compares full files to each other instead of
fragments (code changes) to files.

(Editorial note: This project really ought to have a site from which
their scanner and fixes are disseminated, but I can't find it.)

## Session 2: Malware

### [Prudent Practices for Designing Malware Experiments](https://www.syssec-project.eu/m/page-media/3/rossow-sp12.pdf)

More a starting point for discussion than a presentation of _results_,
the authors propose 19 guidelines for better research on malware "in
the wild," in 4 categories: safety, transparency (reproducibility),
realism, and correct datasets. Most of it seemed obvious to me, but
then, I've done social science research, where we worry about external
validity _all the time_ (and even then
[perhaps not enough](http://neuroanthropology.net/2010/07/10/we-agree-its-weird-but-is-it-weird-enough/)).
Working on computers it's easier to set up perfectly controlled lab
experiments of questionable relevance to real life. They did go
through a bunch of published papers and state that all of them could
have been improved by consideration of these guidelines, but they did
not show any bad examples.

One point sticks with me: Data sets may have skewed distribution of
malware samples, so maybe you detect 90% of all malware in your sample
but it's all type A, because types B through F only comprised 10% of
the data set.

An audience member pointed out that some of these contradict each
other (safety vs realism, for instance); their reply was "it's not a
checklist of things you must do, it's a checklist of things you should
have considered in your design." Which is fair.

### [Abusing File Processing in Malware Detectors for Fun and Profit](http://www.cs.utexas.edu/~shmat/shmat_oak12av.pdf)

"We're going to take the the world's best malware detector and put it
up against the world's simplest virus, and the virus will be
invisible, and we're not going to change the virus itself at all."

This is a classic problem in a new context. Different types of malware
infect different types of file, some file types are more vulnerable
than others, and some file types have to be normalized before you can
scan for malware signatures. Therefore, malware detectors must first
determine what kind of file they're looking at, before they can decide
whether there is malware within the file. The core OS and its
applications also have to make that determination, and if they don't
use exactly the same algorithm, malware may be able to evade detection
but still get executed.

They gave several examples: the simplest is that some archive formats
begin with the name of the first file in the archive, rather than with
a [magic number](http://en.wikipedia.org/wiki/Magic_number_(programming)#Format_indicator)
as they ought to. Therefore, the file name can be chosen to mimic the
magic number of some other file type, and this can fool the scanner
into thinking that the archive is actually something innocuous, while
an extraction tool (which perhaps does not consider the possibility
that it's been given a non-archive) still unpacks the malware.

I said this was a classic problem: it's very nearly the same as the
"[content sniffing problem](http://www.adambarth.com/papers/2009/barth-caballero-song.pdf),"
familiar to us Web security folks. But it's nastier. We were able to
change all the browsers to use the same, ambiguity-free sniffing
algorithm, because there are only a few browser implementations and
only a dozen or so file formats they need to understand. Malware
detectors have to process many more formats, most of which can no
longer be changed, no matter how wrong they are. (Your humble
correspondent wishes to opine that there is _no excuse_ for any file
format that doesn't have a magic number of at least four bytes at
offset zero, if it was designed after the
[PNG specification](http://tools.ietf.org/html/rfc2083#section-3)
demonstrated the proper way to do things. Which was in 1997.)

Will behavioral detection help? Nope, behavioral analysis needs the
same preprocessing. Could we teach applications to tell the malware
detector what they think they are processing? Perhaps, and this may be
the best available option, but it requires buy-in from everyone
everywhere, which is
[difficult at best](http://craphound.com/spamsolutions.txt).

### [Dissecting Android Malware: Characterization and Evolution](http://www.malgenomeproject.org/)

The authors have collected a large set of Android malware, dissected
all of it, and describe its general characteristics. Two things stand
out. First, the most common way to trick users into installing malware
on Android is "repackaging," where the bad guys download a popular
application, add malware to it, and reupload it---usually to a
third-party app market, but increasingly to the official Google
market. Second, by far the most popular thing for this malware to _do_
is steal money by sending text messages to "premium services" (think
1-900 numbers). There are a variety of tricks that the malware can
pull to make these texts invisible to the user; the associated Android
privilege enumerators are overwhelmingly likely to indicate an app
containing malware.

Audience question: How do we deal with the way so many Android phones
are wildly out of date, and most users are at the mercy of the carrier
for updates? Alas, nobody has a good answer to this one.

## Session 3: Attacks 1

### [Distance Hijacking Attacks on Distance Bounding Protocols](http://eprint.iacr.org/2011/129)

Distance bounding protocols allow one entity (the _prover_) to
demonstrate to another (the _verifier_) that the physical distance
between the two is less than some limit. This often comes up in
wireless applications. You don't want someone to be able to relay the
signal from your car's keyless-entry fob to your car, while you are
nowhere near your car (and thus, steal your car). You don't want your
office building's wireless network to be accessible to people in the
parking lot with high-power antennas, even if they have legitimate
(perhaps stolen) access credentials.
[Brands and Chaum](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.51.6437)
figured out one way to do this back in 1993, using signal propagation
time as a proxy for distance; it's hard to tamper with the speed of
light. Unfortunately, the query and response whose delay are measured
can't go over a cryptographic
[secure channel](http://en.wikipedia.org/wiki/Secure_channel), because
that would slow things down enough to swamp the measurement. Instead,
the protocol has all its cryptographic goo in messages before and
after the critical "fast response." While it is good enough to defend
against three classes of attack (which I confess I didn't really
understand), there is a fourth, and that's what is being presented
here. The "hijacking" attack steals the fast response of a legitimate
user who is in the acceptable range, and substitutes the attacker's
identity. (This one makes sense to me, and I'm surprised no one has
thought of it before.)

The presenters demonstrated a fix: basically making the data in the
"fast response" be bound to the legitimate user's identity, which can
be done by tweaking the initial cryptographic goo; no additional
operations needed. They also reformalized the attack classification,
and claim that it is now exhaustive.

The good news here is, these protocols are not yet widely deployed
(although perhaps they should be), so there isn't a huge installed
base of vulnerable hardware that can't easily be fixed. Which brings
us to the next talk:

### [Don't Trust Satellite Phones: A Security Analysis of Two Satphone Standards](http://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=6234409)


There _is_ a huge installed base of satphones: 350 to 500,000 active
users of the two most popular standards (GMR-1 and -2). The protocol
specifications are public, but their ciphers are _not_. Telephone
standards organizations have a long and embarrassing history of making
up their own ciphers in secret, which turn out to be completely
broken; the GMR ciphers are no exception.

The authors of this paper reverse-engineered the GMR ciphers from the
DSP firmware of two satellite phones---one using GMR-1, one using
GMR-2. In both cases, the complete firmware could be downloaded from
the manufacturer's website. Reverse engineering was easier for GMR-1,
which uses an LFSR construction directly derived from the GSM cellular
standard; they just looked for lots of shifts and XORs. For GMR-2 they
had to write their own disassembler and dig through call graphs.

Both algorithms turn out to be hilariously weak. GMR-1 is based on
A5/2 (that's the weaker GSM cipher) with adjustments that don't help;
they can recover the session key with 2^32^ operations, using
ciphertext only. GMR-2 is a byte-oriented stream cipher invented
without reference to any standard technique, except that it reuses a
couple of DES S-boxes to add some nonlinearity. They need about 80
bytes of known plaintext to break it, but only 2^18^ operations; if
they can have more known plaintext, the attack gets cheaper. Known
plaintext should be easy to come by, since the protocol has
predictable control messages.

Conclusion: Security through obscurity is still no good. These satcomm
standards offer no real privacy. And it's going to be a real pain to
fix, because of the huge installed base of handsets---not to mention
the _satellites_ in _orbit_; nobody in attendance knew how tweakable
_that_ firmware is, but it probably isn't very.

### [Memento: Learning Secrets from Process Footprints](http://www.cs.utexas.edu/~shmat/shmat_oak12memento.pdf)

Modern software design often breaks a single "application" into many
OS-level processes to gain better fault and security isolation. If one
process fails or is subverted, the overall application may still be
able to recover. This is good, but has an undesirable side effect:
OS-level process monitoring tools now expose more information about
the internal state of the application. Many of these tools were not
designed with security in mind; even before this trend, for instance,
any user on a Unix system could use the `netstat` and `lsof` tools to
discover the peer addresses of *all* users' active TCP sockets. The
problem is not new, but now it is worse.

One might reasonably ask: who uses a multiuser time-sharing system
anymore? Indeed, those are rare nowadays, but the OS-level "user"
abstraction has been recycled to put a security boundary between
mutually untrusted applications running on the same machine. For
instance, Android allocates a "user" ID to each application.

In this paper, a zero-privilege process (they tested on Android, but
the concept applies to any platform with a process-monitoring API) is
able to eavesdrop on user input and websites visited, simply by
monitoring other processes' CPU and memory usage. When the browser
loads a particular web site, a 'content' process for that site will
allocate memory over time (as data comes in from the network); the
process's overall size, as a function of time, is a unique, stable
fingerprint for 20% to 40% of webpages tested. It is OS and browser
dependent, but _machine_ independent, so an attacker could develop a
database of sites-of-interest and deploy it as malware. More detail is
available by paying attention to differentials in memory allocation in
response to user activity. For instance, the content process is likely
to grow substantially more after a succesful login than an
unsuccessful one.

CPU usage monitoring is even nastier. Each keystroke the user types
causes a CPU usage spike. The spike's duration is far shorter than the
typical interval between keystrokes; therefore, monitoring for these
spikes reveals inter-keystroke intervals, which are
[sufficient information to recover the text that was entered](http://users.ece.cmu.edu/~dawnsong/papers/ssh-timing.pdf).

The authors' proposed solution is to stop reporting fine-grained
resource usage across "user" boundaries. During Q&A, someone suggested
degrading the resolution of these APIs or rate-limiting applications
that use them, but the speaker said that this isn't always
sufficient---coarse-grained monitoring is still enough for site
identification.

My editorial observation: diagnostic APIs are a rich well of side
channel attacks, because diagnostic tools intrinsically need to know
everything that's going on. We don't want to take diagnostics away
from the actual human user. But how does the system know that *this*
process is trusted to run diagnostics? Again, we'll come back to this.

## Foundations

"Foundations" is code for "formal proofs of system security", and
these are mostly lost on me, and besides I wanted some fresh air, so I
skipped this session and went out to Union Square and found a cafe
with better tea than the hotel was brewing (hot water in thermos
dispensers designed for coffee is almost never hot enough for good
tea).

## Access Control and Attestation

### [The Psychology of Security for the Home Computer User](http://www.cs.colostate.edu/psysec/)

This is a study of risks inherent in normal activity on the Internet,
and users' understanding of those risks. It's mostly a meta-analysis
of earlier studies. They begin by pointing out that we no longer
assume users know what they're doing, and propose a new class of
"unwitting accomplice" vulnerabilities---users who facilitate security
breaches by not understanding the implications of their actions.

The analysis focuses on home computer users, since (according to a
Symantec study from 2007) they suffer 95% of the attacks. According to
another study (by Gartner?) there are projected to be 2 billion
personal computers in use by 2014 (including smartphones), so this is
an enormous and highly diverse group in terms of needs, wants,
resources, and abilities. Most studies use college students as a
survey population, but this is only one of many home-user
subpopulations, and probably skewed toward more technically skilled
users.

That said, they think we know these things pretty well: the majority
of home users have no formal training in computer use (ed.: this
doesn't mean much, *I* have almost no formal training in computer
use). Many do, however, get security advice from public sources of
information (news articles, websites, library books, etc), from the
people who sold them the computer, and/or from friends and relatives.
Non-expert users' ideas of risks from Internet use are vaguer than
experts', and lead to less personal concern; the more knowledgeable a
user is, the more seriously they take threats. The problem seems to be
mostly that non-experts don't realize that something bad could happen
to *them*---one person was quoted as saying "why would I be attacked,
when I make less than $40,000 a year?" Perhaps because of this, they
overestimate the cost and underestimate the value of security
measures. Finally, self-reported use of security software (such as
antivirus software) is much higher than actual use.

The authors end with a call to action: longitudinal studies, updates
for older studies, broader demographics (particularly people who are
either less comfortable, or _too_ comfortable, with tech). Measure
actions rather than self-reports, qualitative data rather than
10-point scales, and assess decision making factors (gain from risky
actions, cost and probability of risk, etc). Figure out how to
translate study data into better education and better security
practices.

An audience member commented that cognitive load of security
notifications is a neglected factor, and I would add that security
notifications frequently interrupt task flow to present the user with
a screenful of impenetrable jargon, and perhaps we should forgive them
for smacking the
["whatever" button](https://web.archive.org/web/20080918205445/http://www.justlol.net/whateverbutton/).


### [User-Driven Access Control: Rethinking Permission Granting in Modern Operating Systems](http://research.microsoft.com/apps/pubs/?id=152495)

This was my favorite presentation of the day; it answers questions
raised by several other presentations, and offers a compelling
solution for problems we've struggled with for years.

We have this problem where users don't want to have to make explicit
permission decisions, especially not either when it interrupts their
task flow (pop up confirmation dialogs) or when it occurs out of
context (Android-style permission "manifests"). Most users don't have
the right mental models to understand the questions being asked and
their implications. And yet, the trend is to ask _more_ of these
questions, as we (laudably) take more and more implicit privilege away
from each process.

The authors set out to design in-context, non-disruptive,
least-privilege permission grants, and they found a way to do it:
"access control gadgets" that derive permission grants from natural UI
actions. For instance, if you click the "paste" button, you can be
assumed to want to grant the foreground application access to the
system clipboard---but only once, right now. (They cite studies that
show that users often think this is how it works already!) If the
system, rather than the application, controls the UI elements that
carry these semantics, this can be done reliably.

There are, of course, a whole lot of details, but they claim that it's
all doable. Tricky aspects include: balancing legitimate application
needs for visual customization against user recognition of the UI
elements; composition of resource access grants (this button activates
the microphone _and_ the camera?); allowing keystroke commands and
gestures as well as visual buttons; allowing applications to expose
their own gadgets for access to their own sensitive functions;
granting "decoupled" permission to take actions at either scheduled or
programmatic times in the future. One also has to worry about
malicious apps that try to trick the user into granting a privilege
without knowing they have; this has been studied for a while on the
web (where often it _does_ work like this already) and we have options
that are probably as good as we're going to get.

Good audience question: what about gadgets that provide an application
with _fake_ data? (I want to videoconference, but I want the far end
to see this picture of a bunny with a pancake on its head, not my
filthy apartment.) They hadn't studied that but they like the idea.

### [New Results for Timing-Based Attestation](https://www.mitre.org/publications/technical-papers/new-results-for-timingbased-attestation)

Switching gears for the last talk of the day, the research question is
now: can we do something about malware tampering with
malware-detecting software? It won't help to add more detection
software (malware can tamper with it just as well), or to add
self-checking logic (malware can tamper with that too). But maybe we
can make it so that the self-check won't work correctly if it's
modified, in a way that an external (assumed good) monitor will
notice. Their suggestion is to write a self-check loop which is so
tightly optimized that any modification will make it run slower than
it ought to.

They describe this as independent confirmation of an earlier
incarnation of the same concept ("Pioneer"), but with improvements:
more hardware independence, works over multiple network hops, doesn't
disrupt normal activity of the computer. It still has to run at very
high privilege and lock down the CPU for the duration of the check, so
that even one additional instruction in the inner loop will throw the
timing off; and it still has to start with an accurate estimation of
how fast the CPU ought to run.

In evaluation on a medium-sized LAN (up to 10 network hops, not much
overall latency) their system can detect the insertion of a
conditional branch in the inner loop, which added 2% additional
overhead, natural variation being much smaller. With a TPM that can
sign timestamps, network overhead can be removed from the
equation---but some (supposedly identical) TPMs generate a lot more
timing noise than others, and they don't know why.

The obvious adaptation by malware is: notice that the self-check is
about to happen, undo the modifications and hide, then put yourself
back afterward. Of course this assumes that there _is_ somewhere to
hide, but they thought there would usually be somewhere to hide,
because scanning _all of memory_ is not practical even if you could
know what was supposed to be in every byte. Fixing this, they say, is
a work in progress.
