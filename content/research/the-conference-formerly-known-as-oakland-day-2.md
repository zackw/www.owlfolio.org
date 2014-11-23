Title: The Conference Formerly Known as Oakland, day 2
Date: 2012-05-22 20:52
Category: Research
Slug: the-conference-formerly-known-as-oakland-day-2

I skipped the 8:30AM session today, it was mostly not interesting to
me and I badly needed the extra hour of sleep. I'm sorry to miss
"[On the Feasibility of Internet-Scale Author Identification](http://randomwalker.info/publications/author-identification-draft.pdf)",
but I will read the paper. I also skipped the business meeting, so,
summaries start with the 10:30 session, and end with the short talks.

<!--more-->
## Network Security

### [Scalable Fault Localization under Dynamic Traffic Patterns](http://www.cs.cmu.edu/~xzhang1/doc/DynaFL.pdf)

This is a new scheme to find malicious routers which may be dropping
or misrouting packets they should have forwarded, or modifying them in
transit, or injecting entirely new packets. The problem has been
studied for more than a decade, but is very hard, with no truly
satisfying solutions to date. A malicious router can pretend to work
correctly when it notices probes; mandatory per-hap acks are
high-overhead, may be forgeable, and may also enable "framing" attacks
(to make it look like some _other_ router is malicious); you have to
distinguish distinguish malice from normal packet loss; path-based
approaches require per-path state and per-source key management, and
long-term path stability.

The authors propose "neighborhood-based" monitoring, in which each
router monitors only its 1-hop neighbors, and don't worry about
end-to-end delivery. This scheme (they say) requires only a constant
amount of state on each router and has no problem with frequent route
changes. They assume reliable neighbor discovery and at least one
benign node in each neighborhood. The idea is, each node records a
"traffic summary" of packets received from and sent to each of its
neighbors. Periodically, all the routers report to a trusted
controller, which decides whether packet loss at any given node is
excessive.

For storage efficiency, they want to store some sort of fingerprint
rather than full packets. These need to be immune to forgery, and yet
allow the controller to do all the processing it needs to do, in
particular arithmetic on packet counts. Their proposed technique is to
divide traffic into loosely synchronized "epochs"; within each epoch,
each node stores cryptographic hashes of every packet; the controller
broadcasts an encryption key after the epoch ends, which all nodes use
to encrypt their hashes. (At this point it is too late to forge
anything, so it's ok that everyone knows the key. Or so they said. I'm
a little confused about how this part works.) For traffic efficiency,
the controller also sends out an RNG seed which selects only a
fraction of nodes to send in a report.

They claim security even against colluding nodes, and to be able to
detect a faulty _neighborhood_ (not necessarily the exact troublesome
node) with 99% accuracy.

I like this general idea---and it dovetails neatly with a project I
was working on last term---but I'd like to see them try to remove the
trusted controller, making the scheme fully distributed and
acephalous.

### [Peek-a-Boo, I Still See You: Why Efficient Traffic Analysis Countermeasures Fail](http://kpdyer.com/publications/oakland2012-peekaboo.pdf)

This is another salvo in a long research war between techniques to
hide what you are doing on the interwebs, and techniques to unmask
what you are doing on the interwebs. Specifically, if you use an
encrypted proxy server or mix network that's supposed to conceal
precisely what you are doing from an attacker who can observe your
traffic, then the attacker can try to use traffic analysis to figure
it out anyway. Generally, both sides assume that the attacker can see
low-level packet information despite the encryption (packet lengths,
timings, and immediate destinations, overall transfer sizes, etc),
knows which hosts the client _might_ contact, and has an opportunity
to train machine classifiers on the low-level features of interest.
Packet lengths, in particular, have repeatedly been shown to reveal
all kinds of things, ranging from website identities to search queries
to voice-over-IP conversations (if the language is known). The obvious
countermeasure is to pad the packets, but it's not clear whether this
helps.

The authors of this paper want to make a higher-level point: _even if_
you make all the fine-grained features useless, an attacker can still
figure out something (what websites you're visiting) from coarse
features like overall communication time and overall bandwidth, that
are prohibitively expensive to conceal. They built deliberately simple
(naive Bayes) classifiers looking only at one or two coarse features,
and were able to identify websites from a set of 512 with 70 to 80%
accuracy.

This is a scary result, but there might still be room for
countermeasures, because this is a lab result. It's not clear whether
real-world artifacts interfere, it's possible that one might be able
to apply application-level countermeasures that change the coarse
features sufficiently to break the classifer, and (I think this last
is most important) nobody in academia has tried to scale these attacks
to Internet scale. I want to know what happens if there are 512 "sites
of interest" that the attacker cares about visits to, but a couple
orders of magnitude more _uninteresting_ sites that might also be
visited.

### [Off-Path TCP Sequence Number Inference Attack---How Firewall Middleboxes Reduce Security](http://web.eecs.umich.edu/~zhiyunq/pub/oakland12_TCP_sequence_number_inference.pdf)

An off-path TCP sequence number attack is when you try to inject
packets into an existing TCP connection by guessing the sequence
numbers, and you're _not_ a man-in-the-middle so you can't predict
them. TCP starts off with random sequence numbers nowadays to make
this hard, but they claim it's possible to infer a much smaller range
if you have malware on the destination host and/or there are
middleboxes trying to be clever.

They gave only one detailed example. A "TCP sequence number checking
firewall" discards packets that don't fall within a sliding window
around its best guess of the current sequence number for each
connection. The goal here is to get rid of blindly injected packets.
Ironically, this enables the attack, because if the attacker can
observe the network on the protected side of the firewall, it can see
whether its packets got through, which allows a binary search for the
right sequence number range. As a special case, malware on the
destination host can detect whether the packets got through by looking
at `netstat` error counters.

(If you have malware on the destination host, isn't it game over
already? Maybe the malware doesn't have enough privilege to do what
you want, yet. Recall the talk from yesterday about how processes with
no special privileges at all can still read diagnostic info from the
kernel. Also, they claimed that if the connection is sufficiently
long-lived you don't need the malware, but they didn't explain any
further.)

This notion generalizes to other sensitive, redundant state in
middleboxes. I'd editorialize that they got it right 'way back when
they designed the Internet with all the smarts at the edges of the
network, and also I'd point out that this is a special case of the
classic error-oracle attack. If something can fail two different ways
depending on secret information, often an attacker can use that to
discover the secret.

## Attacks, 2

### [Signing Me onto Your Accounts through Facebook and Google: a Traffic-Guided Security Study of Commercially Deployed Single-Sign-On Web Services](http://research.microsoft.com/apps/pubs/?id=160659)

This is a broad study of single-sign-on protocols actually deployed in
the wild, such as Google's use of OpenID to federate your Google
identity to third parties, and Facebook's Connect protocol to the same
end. The attack goal is to impersonate a user on a site that makes use
of the single sign-on. It was done without insider information,
i.e. all the authors know is messages sent to and from the browser,
not server-to-server messages or server internal logic. This made
their job harder, but also means that any vulnerability they found is
a real live exploitable thing rather than a theoretical problem.
Conveniently, many of these protocols use "browser-relayed messages";
that is, the identity provider and the relying site communicate
_through_ the browser, by means of HTTP redirects.

They gave two examples of genuine exploits. With Google/OpenID, an
attacker can insert the impersonation victim's email address into a
valid, signed authorization message. The signature doesn't cover the
substituted email address, but many relying websites don't care. With
Facebook, the attacker can rewrite an authorization to use app A as
authorization to use app B. (Both of these have since been fixed, they
say.)

Then they drew some conclusions. These flaws are in concrete
deployment details, not the protocol specs; discovering them requires
careful examination of actual systems. Real-world integration is via
APIs, SDKs and sample code, not protocol specs, which is both good and
bad. And underlying runtime systems matter; the Facebook exploit
depends on details of Flash's cross-domain access control rules.

### [Unleashing Mayhem on Binary Code](http://users.ece.cmu.edu/~aavgerin/)

This is a scheme for automatically detecting security-exploitable bugs
in compiled code (e.g. buffer overflows) and then automatically
generating exploits. They use symbolic execution (a standard technique
for program analysis) to discover cases where user input gets written
to the program counter, and then to attempt to place attack code and
transfer control to it.

As always with symbolic execution, they had to come up with clever
tricks to prevent combinatorial explosion of stored state; they spent
most of the talk on this, but I'm going to gloss over it, because it's
nothing new. The interesting bit is: the tool picks up all known bugs
in their (fairly small) test set, and finds two more. They don't seem
to have tried it on anything really big, alas.

### [Clash Attacks on the Verifiability of E-Voting Systems](http://eprint.iacr.org/2012/116)

E-voting systems often issue cryptographic _receipts_ to voters, which
they can use later to confirm that their vote was indeed counted; in
the simplest case, all the receipts are posted publicly after the
election. The receipts do not reveal individual votes, but if you have
the complete list you can confirm that the overall tally is
correct. Suppose the vote-recording system is malicious, and gives two
or more voters back the _same_ receipt for their ballot. Then all but
one of those votes can be replaced by forged votes.

This was almost entirely a theoretical presentation; they showed that
a malicious implementation of a particular e-voting protocol can
indeed carry out this attack, but the details are not interesting.
The interesting thing here, in my opinion, is the observation that in
electronic voting, the protocol has to be robust against a malicious
vote-recording system as well as against malicious voters. Which is
nothing new out here in the real world; it seems that e-voting
proposals are often a bit divorced from what the real threats to
elections are.

## Informal Demo

During the break, a team from Google demonstrated an experimental
single-sign-on system they're calling
[Belay](http://sites.google.com/site/belayresearchproject/). I'm going
to call this _inverted_ single sign on, because what it really does is
let each site issue their own credential, which you then collect and
manage in one "web station." You don't need a password for anything
except maybe the web station (which doesn't even have to be on the
web: it could be in your browser, or on your smartphone, or something
like that), and you manage which sites get to know what
personally-identifiable information _after_ you get the credentials
from the websites. They also understood that people want to maintain
multiple overlapping identities and reveal different facets of each in
different contexts, which it's nice to see someone get thoroughly
right. I want more technical detail, but it seems like a nifty idea.

## Web Security

### [Third-Party Web Tracking Policy and Technology](http://cyberlaw.stanford.edu/publications/third-party-web-tracking-policy-and-technology)

This is a report by the [donottrack.us](http://donottrack.us/) group
on the state of existing third-party tracking schemes, using the
auditing framework they've constructed. Key points:

Existing voluntary opt-outs are (by corporate admission) not really
opting you out of _tracking_, just of _behavioral advertising_, which
(in the speaker's words) is totally backward and deceptive.

Tracking systems really do use all those dirty tricks you've heard
about for not letting you erase their tracking info
("[supercookies](http://cyberlaw.stanford.edu/node/6715)" and the
like).

Anti-tracking technology tends to prevent the browser from talking to
these third parties at all; it all uses manually curated blacklists,
which are fragile, not comprehensive, time-intensive to maintain, and
the tracking agencies deliberately try to evade them. The speaker
called this a "cat-and-mouse arms race." Worse, users have to _pick_ a
blocklist, and it's not fair to expect them to do this in an informed
manner. Some commercially-sponsored lists are not only ineffective but
negate the effects of other lists!

### [EvilSeed: A Guided Approach to Finding Malicious Web Pages](http://seclab.cs.ucsb.edu/media/uploads/papers/evilseed.pdf)

The authors wanted to develop a more efficient way to identify
malicious URLs than blind crawling. Their idea was to derive new
candidate URLs from information in known malicious URLs and/or pages.
Malicious pages often contain links to other malicious pages, or
keywords that are likely to lead to more malicious pages (they tried
both keyword and n-gram extraction). Malicious domains are often
registered in bulk, so if a domain is malicious, other domains
registered at about the same time are probably malicious too. Putting
it all together, they get a stream of candidate URLs of which 2% are
malicious. This _is_ a tenfold improvement over blind crawling, but it
wasn't clear how much it helped overall. The ultimate goal was to cut
down on the load on Bing's malware crawler, but they didn't give any
numbers on that.

### [Rozzle: De-Cloaking Internet Malware](http://research.microsoft.com/en-us/um/people/livshits/papers/tr/rozzle_tr.pdf)

This talk tackled another aspect of the crawling-for-malware problem:
Malicious sites often attempt to conceal themselves from search
engines. That is, if you claim to be a search engine (by IP, or by
user-agent, or by browser fingerprint) you may get an
innocuous-looking page instead of the malware. There are obvious
workarounds for this. It gets worse: nowadays malware-distribution
sites try to detect known-vulnerable user configurations, and only
bother actually sending down an exploit if it'll work. This involves
fingerprinting the browser and its plugins in detail, which is
typically done with JavaScript.

The difficulty, of course, is that if you want to find all the malware
that a site can produce, you have to poke it with lots of different
system configurations. Or you can take the Rozzle approach, which is
to do a little bit of symbolic execution and investigate all possible
control flow paths involving environment-sensitive branches. Since
these are rare, there isn't much of a combinatorial explosion problem,
and the effect is to appear "as vulnerable as possible." They claim
less than 2% overhead on a sample of both malicious and innocuous
URLs, again from Bing's malware scanner.

(It seems to me that an easier approach would be simply to treat this
fingerprinting code as *itself* an indication of malware. They said
themselves that only 1.2% of all JS visible to Bing's crawler contains
"branches based on 'environment sensitive values'" but 89.5% of
malicious JS does.)

## Short Talks

Described briefly.

- **SecuritySpeak: Oakland Papers Crammed Into 32 Pictures**

Word clouds of all the Oakland papers ever, as a function of time.
Constants: "system," "security," "information," "protocol," "message."
"Alice" comes and goes. "Attack" shows up in 2004 or so, "privacy"
in 2005. Went by a little too fast for me to try to pick out older
trends.

- **Metric-driven Fuzzing Strategy for Network Protocols**

Really about *meta*-strategies for developing network protocol
fuzzers. Does not offer any actual metrics, only ways to come up with
protocol-specific metrics based on black-box analysis of protocol or
implementations.

- **Differential Privacy by Typing for Security Protocols**

Theory people like
[differential privacy](http://en.wikipedia.org/wiki/Differential_privacy)
because it's a provable property, but the proofs are
machine-generated, lengthy and difficult to comprehend. It gets worse
in a distributed environment. Speaker claims to have a scheme that
makes it better, and also a way to apply it to protocols as well as
databases.

- **Privacy, Linearity, and Accountability in Proof-Carrying
Authorization Systems**

Theory people also like proof-carrying authorization schemes, but they
have serious practical limitations, e.g. exposing sensitive data to
the world. Speaker proposes to use zero-knowledge proofs instead of
direct proofs, then patch up some holes with pseudonyms.  Blithe,
unsubstantiated claim that pseudonyms cannot be correlated across
services.

- **Fighting Parasite Hosting: Identifying and Mitigating Unauthorized
Ads on Your Webserver**

"Parasite hosting" is spamvertised content on hacked sites which is
only visible to search engines and links from search engines or spam;
makes it hard for the legitimate administrator to find and
remove. Speaker developed a crawler that can find this stuff on a
suspected-compromised site, by pretending to be a search engine, in
various ways. Also some preliminary findings about what kind of sites
tend to get hit with this stuff.

- **Learning from Our Mistakes: Us LUSSRs Are In Such a MESS**

Announcement of the
[LASER mini-conference](http://www.cert.org/laser-workshop/),
encouraging people to share both successes and failures for
methodological dissection. Unfortunately by invitation only and
limited to 50 attendees.

- **Provably Secure and Practical Onion Routing**

[Black-box formal model of Tor-style onion routing](http://eprint.iacr.org/2011/308),
with a bunch of analytic deductions claimed but not actually described
(it would have been hard to do it in five minutes); interested parties
referred to the full paper.

- **Long Tail Cyber Education**

What do we want people to learn about cyber-security (blech), and
*who* should learn it? Proposes a long-tail model for specialized
knowledge in this field. Wants people to study the transition region
from "everyone should know this" to "only a few specialists need to
know this". Points at the Weather Channel as a good example of a good,
seamless presentation of both general- and special-interest info.

- **Why Johnny's not Robust**

Claim that everything is too complicated; abstraction boundaries are
in the wrong place; system services are inadequate; and lots of wheels
are getting badly reinvented. Want to engage in radical simplification
and provision of one-size-fits-all APIs that are impossible to use
incorrectly. Complete failure to understand the actual problem here,
<abbr title="In My Not So Humble Opinion">IMNSHO</abbr>, and in
particular
[the true nature of complexity](http://www.openthefuture.com/2012/05/nine_meditations_on_complexity.html).
(These people also had a poster yesterday. I talked to them. I was not
impressed.)

- **TARDIS: Secure Time Keeping For Embedded Devices Without Clocks**

Defense against brute force attacks on unpowered smartcard-type
devices, which have no clock, therefore no notion of query rate.  Use
SRAM decay as a way to measure time: for most use cases, can simply
refuse queries if the memory contents have not fully decayed.  Can
make the time shorter by heating the card, but only within its design
operating range, and still slows down brute-force by orders of
magnitude. No special hardware required. Cute backronym: "Time And
Remanence Decay In SRAM"

- **Protecting Query Privacy in Cloud Database Hosting**

It's known how to prevent a cloud-database provider from extracting
sensitive information directly from the tables, but what about
inference from queries? No answers offered; speaker tried a few
obvious things but found them lacking.
