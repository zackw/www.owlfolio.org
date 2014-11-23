Title: The Conference Formerly Known as Oakland, day 3
Date: 2012-05-25 16:07
Category: Research
Slug: the-conference-formerly-known-as-oakland-day-3

This day had a lot of interesting papers, but some of the
presentations were disappointing: they spent their time on
uninteresting aspects of their work, or handwaved over critical
details.

That said, most of the work on passwords was compelling, and if you
read to the end there's a cranky rant about the panel discussion.

<!--more-->

## Privacy and Anonymity

### [Detecting Hoaxes, Frauds, and Deception in Writing Style Online](https://www.cs.drexel.edu/~sa499/papers/oakland-deception.pdf)

I missed the train that would have gotten me to SF in time for this
talk by one lousy minute.

### [LASTor: A Low-Latency AS-Aware Tor Client](http://www.cs.ucr.edu/~harsha/papers/oakland12.pdf)

These folks had a set of client-only modifications to
[Tor](https://www.torproject.org/) that, they claim, both improve
latency and add robustness against "profiling attacks."

Their latency-reduction shtick is to record propagation delay in
between all Tor relays, and then choose paths with probability
inversely proportional to overall delay; they call this "Weighted
Shortest Path" selection. This does increase the risk of using a path
with compromised relays; they allow the user to tune the
proportionality constant to trade off anonymity for latency or vice
versa, and they also group relays into geographic clusters for WSP and
choose randomly within a cluster. They didn't attempt to analyze the
odds of getting a compromised relay, that I saw, though. They claim
20% improvement in median latency---that's relative to the baseline
Tor algorithm, which imposes a 500% median latency _penalty_ relative
to unmasked web surfing.

They define "profiling attack" as: unmasking anonymous Tor users by
correlating traffic to the entry node with traffic from the exit node.
Because Tor relays are not uniformly distributed over the network's
topology, this is plausibly possible for an <abbr title="Autonomous
System">AS</abbr> operator, who may control routers that sit between
the Tor client and the entry, _and_ routers that sit between the Tor
exit and the destination site. Of course there is nothing to be done
when the ultimate source and ultimate destination are in the same AS,
but that's unusual. By default, Tor ensures that no two relays are in
the same `/16`, which (they say) misses 50% of shared ASes. AS-path
prediction is known to be hard, with the best known approaches only
70% correct; they claim an improvement to 90% (median) but glossed
over the details.

An audience member asked: if _all_ clients switch to WSP, won't that
overload the relays on the shortest paths? The speaker did not appear
to understand the question.

### [OB-PWS: Obfuscation-Based Private Web Search](http://www.cosic.esat.kuleuven.be/publications/article-2083.pdf)

Database searches reveal sensitive information. This paper surveys one
class of techniques to prevent this, which is based on generating
"dummy queries" to obscure what was really searched for. They find all
existing techniques wanting, and offer a systematization of "features
that should be considered in security evaluation" of this type of
design, hoping that people will do better in the future.

I couldn't make much sense of this talk because the speaker talked
very fast, the slides were in illegibly tiny type, and I'm not
previously familiar with the topic. However, the basic problem seems
to be that it's not terribly hard to distinguish dummy queries from
real queries, especially for an adversary who knows what system is in
use.

### [Lightweight Anonymity and Privacy](http://www.cs.cmu.edu/~xia/resources/Documents/LAP-oakland12.pdf)

These folks are also trying to improve on Tor's latency issues, but
they're doing it by weakening the adversary model: they only care
about protecting against remote tracking by the *destination host* of
any given TCP connection. To this end they have developed their own
mixmaster scheme which only conceals the _initial prefix_ of the route
from the client to the server. They also go to some length to avoid
increasing the overall path length, minimize cryptographic operations,
and minimize state carried at intermediate relays. They claim an
anonymity set on the order of 2^16^ client-hosts by concealing the
first hop; 2^24^ with two hops, 2^28^ with three, and not much
improvement beyond.

They do not try to protect against application-layer tracking (by the
destination host or otherwise), timing attacks, or detailed traffic
analysis a la
"[Peek-A-Boo, I Still See You](http://kpdyer.com/publications/oakland2012-peekaboo.pdf)"
from yesterday. It seemed like there were a lot of technical details
to be worked out, and I'm also not clear on why the destination host
wouldn't just go ahead and do application-layer tracking, as they do
already even when you're not bothering to conceal your IP address.

## Passwords

### [Guess again (and again and again): Measuring password strength by simulating password-cracking algorithms](http://www.cylab.cmu.edu/research/techreports/2011/tr_cylab11008.html)

This is an analysis of offline attacks on large files of passwords.
Attackers have a large set of encrypted passwords, and can mount many
guesses; there are various "intelligent" strategies in the literature
for the order in which to guess. How well do these strategies work?
System administrators try to encourage users to make passwords harder
to guess, by imposing "password composition policies". How well does
*that* work? Most such policies are ad hoc, not based on empirical
evidence. They also often make the passwords harder to remember, which
can hurt security in other ways.

They use "guess number" (the number of attempts required to guess a
password, assuming a fixed list of guesses tried in sequence) as their
metric, and allow their model attacker to make up to 50 *trillion*
([short scale](http://en.wikipedia.org/wiki/Long_and_short_scales);
5&nbsp;×&nbsp;10^13^) guesses, using precomputed guess-number indexes
for three different attack strategies, of which
[Weir's probabilistic context-free grammar](http://sites.google.com/site/reusablesec/Home/password-cracking-tools/probablistic_cracker)
does best on real passwords. For data, they used several large leaked
password databases, plus passwords solicited from Mechanical Turk
users under various password-composition policies.

Some conclusions:

* Policies' performance when attackers are limited to 10^8^
  guesses does not predict their performance when attackers can make
  10^13^ guesses
* Training data conforming to a particular policy helps the attacker
  a great deal
* Subsets of test data are not reflective of the general population;
  some users just naturally pick better passwords under all policies
* NIST guidelines for password policies do not reflect actual
  password strength under each policy

and

* Requiring _longer_ passwords, but not being picky about what's in
  them, produces both better usability and better security.

### [The science of guessing: analyzing an anonymized corpus of 70 million passwords](http://www.jbonneau.com/doc/B12-IEEESP-analyzing_70M_anonymized_passwords.pdf)

This is another analysis of password guessing difficulty, but focuses
on user demographics rather than password policy. They collected keyed
hashes of 70 million users across various Yahoo-owned sites and
modeled their guessability as a probability distribution ("mean number
of guesses required to succeed with probability _α_"). Their main
conclusion is that most of the demographic splits they tried don't
make much difference: in particular, older users seem to pick slightly
_better_ passwords than younger users, and it doesn't matter whether
the account has a credit card number on file. Also, 42% of all
passwords collected were unique, which is better than I would have
expected.

### [The quest to replace passwords: A framework for comparative evaluation of web authentication schemes](http://research.microsoft.com/pubs/161585/QuestToReplacePasswords.pdf)

Lots of people have been trying to replace passwords entirely for some
time: why haven't we succeeded? The authors analyzed what has already
been done and why it didn't work, and came up with a methodology for
evaluating new systems. The talk is mostly about the details of the
methodology, in a vacuum; I'd rather they had taken more time
describing how specific schemes measured up, and then drawn some
inferences from that. Perhaps this is covered in the paper.

I did see one interesting takeaway: deployability has been neglected
over and over again (despite its obvious relevance).

## System Security

### [ILR: Where'd My Gadgets Go?](http://www.ieee-security.org/TC/SP2012/papers/4681a571.pdf)

This is an attempt to thwart
"[return-oriented programming](http://cseweb.ucsd.edu/~hovav/talks/blackhat08.html)"
code injection attacks, by randomizing the location of _every
instruction in memory_. (The state of the art, "address space layout
randomization," moves instructions around in large blocks; if the
attacker can find _one_ address in the block, they can find
everything.)

They're doing this on binaries, so they can't be absolutely sure where
the instructions are, which pointers are pointers to code, etc. But,
it's okay to dump some random might-be-an-instruction bytes in some
random places, because they just won't get used. They statically
translate the binary to an "extended instruction set," whose
instructions can be arbitrarily rearranged, because each contains the
location of the next instruction (which makes me think of
*[The Story of Mel](http://catb.org/jargon/html/story-of-mel.html)*).
Then, a dynamic-translating VM executes these extended instructions on
real hardware. More than 95% of instructions can be moved, and there's
a 13% slowdown.

They achieve 31 bits of entropy, out of a 32-bit address space, in
each instruction's location. (I presume the other half of the address
space is where they put all the program's data.) They assured us (but
offered no explanation) that the attacker cannot get at gadgets within
the VM runtime or the dynamically re-translated code that's actually
getting executed, and they demonstrated the defeat of a real-world ROP
attack on Adobe Acrobat.

### [Space Traveling across VM: Automatically Bridging the Semantic Gap in Virtual Machine Introspection via Online Kernel Data Redirection](http://www.utdallas.edu/~zhiqiang.lin/s3.html)

If you have a whole bunch of virtual machines running on shared
hardware, you might want to set up a special supervisory VM that can
audit the state of all the others. Unfortunately, all the stock
diagnostic tools are designed to run _inside_ the (possibly virtual)
machine that is being diagnosed. From outside, you are working on a
frozen snapshot, so you have to write code that digs through the
machine's memory space without benefit of any of the normal diagnostic
APIs or even normal address translation logic. It's difficult,
tedious, and duplicative.

These people developed a special framework that can run stock
diagnostic tools against a snapshot rather than a live VM. It was
unclear how this got them out of digging through the snapshot. The
talk was mostly a big long list of confusingly-described minor
problems that they claimed to have solved.

### [Smashing the Gadgets: Hindering Return-Oriented Programming Using In-Place Code Randomization](http://www.cs.columbia.edu/~vpappas/papers/smash.sp12.pdf)

This is a similar concept to two talks back, but these people don't
want to have to run a dynamic translator, so instead, they scramble up
the binary in place, ahead of time. They don't move code around at
large scale; the idea seems to be to eliminate byte sequences that
comprise ROP gadgets, rather than make it hard to find them. They gave
several worked examples of their transformations. It basically amounts
to redoing the late stage of a compilation pipeline: select
alternative instruction encodings as long as they're the same length;
within a basic block, reschedule instructions as long as dependencies
are still honored; shuffle the order of register saves; redo the
register allocation. Overall, they claim to be able to eliminate 80%
of all ROP gadgets, with the remaining 20% due to not being able to
prove that the entire contents of the compiled-code segment of the
binary image are in fact code, rather than data. But this is good
enough to break two state-of-the-art exploit generators
([Mona](http://redmine.corelan.be/projects/mona) and
[Q](http://users.ece.cmu.edu/~ejschwar/bib/schwartz_2011_rop-abstract.html))

After the talk, I asked them if they'd considered modifying a compiler
to avoid generating gadgets in the first place. They said several
other people had already done that (e.g.
"[G-Free: Defeating Return-Oriented Programming through Gadget-less Binaries](http://www.iseclab.org/papers/gfree.pdf)"),
so they wanted to see if it was doable with no more information than
you get from an executable.

### [Building Verifiable Trusted Path on Commodity X86 Computers](http://users.ece.cmu.edu/~jmmccune/papers/ZhGlNeMc2012.pdf)

A "trusted path" is a secure channel from some process to the *user*,
so that the user can be sure that confidential information goes
straight to its intended recipient. This was difficult to achieve even
on the simple TTY-oriented computers of yesteryear and is
nigh-impossible now, because there's lots more system components in
between the input devices and the desired destination of user input.

The authors have developed a bolt-on trusted path that works together
with the commodity OS of your choice (quite possibly "as long as that
choice is Windows", however). It consists of a very simple hypervisor,
whose main function is to provide _device isolation_: none of the
other devices on the system can be allowed to tamper with the device
hosting the secure channel. That device is given over temporarily to a
trusted device driver embedded in the program that uses the secure
channel. Finally, an external verification device interrogates a TPM
to confirm that all the software involved in the trusted path is as it
should be. They claim that this design minimizes trusted components
and allows the code that's both trusted and highly privileged to be as
simple as possible.

This is clever and all, but it seems to me that if you have to have an
external verification device, you maybe should just pull the
confidential _interaction_ out to that device and use the computer
only to transport messages that are already secured.

## Panel Discussion: How can a focus on "science" advance research in cybersecurity?

The thinking behind this prompt appears to have been: We've been doing
"cybersecurity" "research" (for some value of both terms) for
thirty-three years at this conference and quite a bit longer
elsewhere, and yet we do not seem to be getting anywhere in terms of
actual security improvements delivered to the general public, or even
to the funding agencies (read: the US military). Clearly this means we
are not being Scientific enough. What's wrong and how do we fix it?

As you might suspect, I don't much agree with any of the above
premises or their presuppositions. Yeah, we haven't reduced computer
security to well-understood engineering practice yet. We're still
doing messy, methodologically unscrupulous, exploratory science. To an
observer not directly engaged in the work, this can look like flailing
around in the dark, and it can be frustratingly slow, but if you go
back to the pioneering work in *any* scientific field, you see the
same sort of thing. *This is how exploratory science goes.* That isn't
to say the way we do our research is ideal, but I think the real
problems are just the well-known dysfunctions of the modern academic
enterprise and its funding sources.

We do have a genuine problem with translating what solid results we
have into real-world security improvements. We have known how to
design ciphers that resist all known attacks for some years now, and
yet---as seen in the
[case of the satellite phones](http://gmr.crypto.rub.de/paper/paper-1.pdf)
at this very conference---people in industry are still deploying
ciphers that are trivially broken. This I believe should be blamed on
the overlapping well-known dysfunctions of what my pinko commie
friends call "terminal-stage capitalism." Conversely, industrial folks
have a legitimate beef with academics doing research that has no
possible relevance to the real world at all. I didn't see any of that
at this conference, except maybe the "Why Johnny Isn't Robust" guys
from yesterday, but it does happen. (I think as CS subfields go,
security is generally better about staying relevant than
e.g. programming language design.) And we shouldn't forget that we
are, in fact, doing better now than we were ten years ago. TLS is a
pile of hacks on top of a flawed design but *mostly it works*.

Okay, I've dumped on the prompt enough, how was the *panel?* It was a
whole lot of words saying not much at all. Which is what you get when
you start with the wrong question---and I think most of the panelists
knew in their bones it was the wrong question---and then make people
talk for five minutes each. I'll admit it was entertaining when they
asked for audience questions and a whole row of people brought up
their most favorite axes and started grinding.
