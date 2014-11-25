Title: CCS 2012 Conference Report
Date: 2012-10-29 20:33
Slug: ccs-2012-conference-report

The [ACM](https://www.acm.org/) held its annual
[Conference on Computer and Communications Security](http://www.sigsac.org/ccs/CCS2012/)
two weeks ago today in Raleigh, North Carolina. CCS is larger than
Oakland and has two presentation tracks; I attended less than half of
the talks, and my brain was still completely full afterward. Instead
of doing one exhaustive post per day like I did with Oakland, I'm just
going to highlight a handful of interesting papers over the course of
the entire conference, plus the pre-conference
[Workshop on Privacy in the Electronic Society](http://hatswitch.org/wpes2012/).

<!--more-->

Note, paper links may go to expanded technical reports instead of
as-presented papers, since obviously I am not going to link to the
"official" editions behind ACM's paywall. There were some talks that I
didn't write up, despite their interestingness, because I couldn't
find an unencumbered paper to link to---cavete auctores!

## Monday (WPES)

### [An Approach for Identifying JavaScript-loaded Advertisements through Static Analysis](https://www.cs.indiana.edu/~minaxi/pubs/wpes12.pdf)

Right now the state of the art for blocking out ads on the Web is with
gigantic URL-based blacklists---the popular "EasyList" for AdBlock
Plus contains 18,000 entries according to the speaker, with new
entries added at a rate of five to fifteen a week, and obsolete
entries hardly ever removed. This paper proposes instead to use static
analysis and machine learning to detect ad-related JavaScript and
prevent it from executing. The claim is that this will be easier to
maintain, more robust, and scale better. They wrote a browser
extension that preprocesses incoming JavaScript through some "basic
optimizations" (constant folding, mostly) and then looks for a handful
of features that are more likely to appear in ad-loading JavaScript.
There are a number of problems related to figuring out what to do next
(see the paper) but as a proof of concept it seems to work quite well,
with classification accuracy in the 98% range. It has trouble with
analytics and HTML generation libraries, both of which share features
with ad-loading scripts.

In the question period, someone asked whether they thought they could
keep up with the rapidly evolving ad ecosystem, and they said "well,
this general approach works pretty well for spam filtering," which I
thought was telling---there is, after all, substantial overlap. They
also said that they thought the same general approach would work for
tracking protection but it would require its own classifier.

### [What Do Online Behavioral Advertising Privacy Disclosures Communicate to Users?](https://www.cylab.cmu.edu/files/pdfs/tech_reports/CMUCyLab12008.pdf)

Online behaviorally-targeted advertising is often tagged with a little
icon and/or short phrase which are hyperlinks to "landing pages" that
talk about the behavioral targeting and may offer the opportunity to
disable ad targeting (but not the associated behavioral tracking).
This is part of an industry "self-regulatory" program which is
supposed to make behavioral targeting more palatable. The study
investigated what, if anything, these tags actually communicate to
end-users, and how they react. Participants were shown a variety of
ads, with between-subjects randomized tags, and then quizzed about
what they thought the tags meant and what the landing pages
communicated. Takeaways include:

* People mostly don't even notice these tags.
* The icons used are meaningless, and most of the short phrases do
  not communicate that this is something clickable.
* After participants' attention was drawn to the tags, more than half
  of them thought that clicking on them would cause more ads to pop
  up, increase ad frequency overall, and/or signal interest in the
  product currently being advertised. Some of the short phrases
  suggested an offer to buy advertising on the current website.
* The landing pages do not clearly make the distinction between
  disabling *ad targeting* (which is offered) and disabling
  *behavioral tracking* (which is not offered).

The speaker carefully avoided the elephant in this particular room,
i.e. that advertisers are motivated to make their disclosure tags and
landing pages as nonobvious and unfriendly as possible, because they
don't *want* people to disable behavioral ad targeting.

### [Changing of the Guards: A Framework for Understanding and Improving Entry Guard Selection in Tor](http://cacr.uwaterloo.ca/techreports/2012/cacr2012-11.pdf)

"Entry guards" are a designated subset of Tor relays that are
considered reliable and probably-nonmalicious enough to use as entry
nodes. The Tor directory authorities maintain a large list of
potential entry guards; Tor clients pick a smaller set of nodes off
the list, and route all circuits through them. (This is done to reduce
the probability that the first relay in the chain will be malicious; a
malicious entry node can do rather more damage to client anonymity
than a malicious node later in the chain.)

This paper is an empirical investigation of how well this scheme works
in practice, and whether it can be improved. They only have
preliminary conclusions, but some of those are pretty telling:
long-lived entry guards accumulate clients over time, and long-lived
malicious nodes are likely to become guards. It's unclear how to do
better than the present set of heuristics, though.

I'm highlighting this paper as much because of its clever methodology
as anything else: experiments were run entirely in simulation, but the
simulated Tor network is configured to match the real network,
according to the public relay directory. This seems like an effective
strategy that could be applied to other sorts of network simulation
experiments.

## Tuesday

### [The Most Dangerous Code in the World: Validating SSL Certificates in Non-Browser Software](http://www.cs.utexas.edu/~shmat/shmat_ccs12.pdf)

SSL (also known as TLS) is the most widely deployed implementation of
the cryptosystem primitive known as a
"[secure channel](https://en.wikipedia.org/wiki/Secure_channel),"
which is *supposed* to deliver three security properties:
confidentiality (nobody can eavesdrop on data in transit), integrity
(nobody can *modify* data in transit), and authenticity (the
transceiver at the other end of the channel is who you think they
are).  Authenticity is critical to real-world security, because the
other two properties by themselves do not protect against a
[man-in-the-middle attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack).
(How does someone get to be in the middle, you might wonder? One
popular technique is to load malware onto the local network hub,
wireless router, etc.)

SSL provides authenticity via *certificates of identity*, which at
least one side transmits for the other to "verify", before
communicating. Verification is a complicated process that must be done
correctly or authenticity is lost. The point of this talk is that,
while Web browsers (by dint of fifteen years of bug fixing) usually
get certificate verification right, most of the *other* software that
uses SSL has *not* had the benefit of fifteen years of bug fixes, and
so frequently gets it wrong. They audited a wide variety of middleware
libraries and applications, found lots of bugs, and make the strong
claim that basically all non-browser SSL-using applications are
insecure against an active man-in-the-middle attack.

Why so terrible? Well, the authors blame the ridiculous complication
of both the certificate scheme itself, and the library APIs involved.
One worked example stuck with me: Amazon Payments provides a client
library in PHP. That code calls into a C library (libcurl) which calls
another C library (libssl) to perform the actual crypto.  libssl has
dozens of options, all of which are faithfully reflected up through
libcurl to the PHP bindings that the Amazon Payments library
uses. Many of those options are intended only for debugging, but the
author of the Amazon code zealously set them all, and set one of them
to a value that defeats security, without realizing it.

### [Why Eve and Mallory Love Android: An Analysis of Android SSL (In)Security](http://www2.dcsec.uni-hannover.de/files/android/p50-fahl.pdf)

On the same theme as the previous talk: Android's stock runtime
libraries implement certificate validation correctly. What could
possibly go wrong? Well, you can disable validation, and lots of
people have found it easier to disable validation than to arrange for
their servers to have good certificates all the time. They analyzed
13,500 apps from the Android Market and found just over 1000 instances
where validation had been disabled. A manual audit of a smaller set of
apps found 41 out of 100 made some kind of related mistake which also
destroys security. They demoed injecting a malicious update to a virus
scanner's signature base, causing the scanner to detect *itself* as
malware and delete itself.

They didn't talk at all about *why* this happens, I would speculate
it's an operational problem at root, rather than a coding mistake.
Not only are certificates ridiculously complicated, getting them and
deploying them to all the necessary servers is difficult. If you're an
app developer and you're under time pressure and your company's
sysadmins are taking forever to get around to setting up the server
correctly… disabling verification may be the path of least resistance.

### [Routing Around Decoys](http://www-users.cs.umn.edu/~hopper/decoy-ccs12.pdf)

Decoy routing is a scheme for censorship evasion, in which the
end-user's machine sends out traffic overtly intended for an innocuous
site; routers somewhere in the backbone are programmed to notice a
covert message in that traffic, and divert it to the censored site
that the user actually wanted. This paper points out that the
adversary in this scheme is normally in control of the routing
infrastructure for the evasive user's
[AS](https://en.wikipedia.org/wiki/Autonomous_system_%28Internet%29)
and can therefore control how that user's packets get routed. This
allows them to pull a variety of TCP-level tricks to detect decoy
routing, and then disrupt it simply by choosing BGP routes that don't
go through the decoy routers.

Thus, for decoy routing to work, there have to be a bunch of important
overt destinations that are *completely* behind decoy routers, from
the censorious AS's perspective. Running the numbers for the usual
suspect ASes indicates that you have to get an impractically huge
number of backbone providers to deploy decoy routers.

## Wednesday

### [Operating System Framed in Case of Mistaken Identity](http://lorrie.cranor.org/pubs/osframed.pdf)

This is a modern user study on one of the oldest problems in the
computer security book: If you are prompted to type your password, how
do you know that the program prompting you is entitled to know your
password? In addition to the well-known "phishing sites" that try to
steal credentials for a particular site, malware is known to try to
steal local account passwords in hopes that they are also passwords
for high-value online services. The user study presented itself (to
MTurk users) as an opinion poll of various online games, but one of
the games in the sequence reported a missing browser plugin and popped
up a fake OS installation-permission dialog, prompting for an
administrative password. The visual deception was not perfect
(notably, Windows always dims out the rest of the screen when it puts
up a legitimate request for administrative credentials, which is
impossible to fake from inside a webpage) but it appears that the
majority of participants did not notice. It's unclear how many people
were genuinely deceived, since of course there is no way for the
experimenters to tell whether any password entered was real. Only 20%
of participants admitted to having typed in a real password, but the
majority of participants claimed to have thought the prompt was real,
and rejected the request on other grounds (e.g. not wanting to install
plugins).

No solutions are offered, but considering how old and thorny this
problem is, we can't really complain.

### [The Devil is in the (Implementation) Details: An Empirical Analysis of OAuth SSO Systems](http://lersse-dl.ece.ubc.ca/record/279/files/fp005-sun.pdf)

OAuth is a widely adopted federated authentication scheme. It's quite
complicated, and the 2.0 revision is even more complicated, to the
point where its spec editors are
[quitting in disgust](http://hueniverse.com/2012/07/oauth-2-0-and-the-road-to-hell/).
Its security depends, of course, on implementation correctness.

This study did a deep dive on a hand-picked set of very popular
websites that use OAuth ("if these guys get it wrong, what can we
expect for everyone else?") and find all kinds of security-breaking
errors. 32% of the "relying parties" in their study are vulnerable to
a network eavesdropper stealing an access token (which are not
supposed to be sent to the relying site in cleartext, but people do it
anyway; site developers may be under the misapprehension that OAuth
makes SSL unnecessary). 64% of RPs mis-use _public_ identifiers
(e.g. Facebook account IDs) as credentials, allowing impersonation by
anyone who knows the public identifier. And nearly all RPs have
inadequate defense-in-depth against an XSS exploit stealing access
tokens (it is not clear to me whether this is a flaw in the relying
sites, or in OAuth itself; successful XSS is generally considered game
over anyway, but if this allows an attacker to escalate a credential
for _one_ site into a pluripotent single-sign-on credential, that's
much worse.

They didn't have time to go into it in the talk, but the paper has a
number of suggestions for how "identity providers" can improve their
APIs so that it's harder for RPs to get things wrong. I approve of
this approach; I don't know enough about the problem space to assess
whether their particular suggestions are helpful.

### [Strengthening User Authentication through Opportunistic Cryptographic Identity Assertions](http://homes.cs.washington.edu/~yoshi/papers/czeskis-phoneauth-ccs12.pdf)

This proposes a better user experience for two-factor authentication
using a smartphone as a second factor. Right now some sites (notably
Google) will send you a text message with a numeric code you type back
into the site, or else offer an application that shows you a numeric
code that changes every minute, which again you have to type in.
Instead, they propose to have the computer talk directly to the phone
over unpaired Bluetooth, eliminating all user actions after pressing
"login". Bluetooth is notoriously slow but they claim that it is still
faster than reading the number off the phone and typing it in, and
regardless it seems like it would be a more pleasant user
experience. However, I couldn't tell you which of my computers
actually speak Bluetooth, and if you were on a machine with an old
browser you might be hosed.

Question from the audience: don't most people leave Bluetooth off all
the time because it drains the batteries? Answer: dunno, hasn't that
been fixed by now?

### [Touching from a Distance: Website Fingerprinting Attacks and Defenses](http://www.cs.sunysb.edu/~xcai/fp.pdf)

"Fingerprinting attacks" have been around for a while. The game is,
suppose a victim loads a website via an anonymizing service, which
provides an encrypted channel to a generic IP address. An attacker
sees all the traffic on the encrypted channel, but can't read it and
can't observe its ultimate destination. (Whether the anonymizing
service is a simple proxy or a mix network is moot, because the
attacker is snooping directly on the victim.) Can the attacker still
deduce what website is being visited? Maybe. The attacker can still
observe the size and direction of each packet, and the inter-packet
interval for each pair of packets, so the idea is to record the
patterns of packets generated by known page loads, then try to match
those against traffic going to the anonymizing service. Most of the
literature only uses packet size and direction. Per-page accuracy in
the 60-80% range, within a "closed world" of 100 to 2000 pages (almost
always site front pages), is considered good.

This paper tries to improve fingerprint accuracy for individual pages
by using
[Damerau-Levenshtein edit distance](https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance)
as the distance metric for a
[support vector machine](https://en.wikipedia.org/wiki/Support_vector_machine),
but the more interesting idea in the paper (unfortunately not covered
in the talk) is to use
[hidden Markov models](https://en.wikipedia.org/wiki/Hidden_Markov_model)
to generalize from individual pages to entire sites. If the victim is
looking at a particular page, it's more likely that they will load one
of its outgoing hyperlinks next. The attacker builds a hidden Markov
model of each site of interest, and uses it to predict a "typical"
pattern of page loads, which in turn adjusts the per-page classifiers'
thresholds.

## Thursday

### [You Are What You Include: Large-scale Evaluation of Remote JavaScript Inclusions](http://www.securitee.org/files/jsinclusions_ccs2012.pdf)

Problem statement: We know cross-site inclusion of JS is ubiquitous;
who is trusted to provide JS libraries? How hard would it be to attack
a JS library provider? Are there attack vectors that are non-obvious?

They give a few examples of actual exploits of JS library providers,
then move on to an analysis of a 3.3-million-page JS-aware web crawl,
within which they find 300,000 unique scripts loaded from 20,000
remote hosts. There is, unsurprisingly, a
[Zipf](https://en.wikipedia.org/wiki/Zipf%27s_law)-ish distribution of
script popularity. Five of the ten most-frequently-included scripts
belong to Google and another three belong to "behind the scenes"
analytics agencies that are invisible to end users. (The remaining two
are the Facebook and Twitter APIs.)

Common, exploitable errors include:

* Requesting JS from "localhost", i.e. the host running the *browser*,
  often on high port numbers. Malware can take advantage of this to
  mount attacks on sites, even in the presence of local privilege
  barriers (e.g. a malicious Android app normally cannot poke the
  browser).
* Similarly, requesting JS from private IP space---now the malware
  just has to be on the same *network* as the browser.
* Requesting JS from a site whose domain registration has expired;
  anyone could reregister it.
* Similarly, requesting JS from a mistyped domain (they gave the
  example of `googlesyndicatio.com` with the final 'n' left off) or from
  an IP address that has been reassigned.

They also pointed out that coarse-grained sandboxing won't help
because the *intended* scripts need too many privileges, and that it's
unusual for the scripts to change more often than once a week, so
maintaining local copies *might* be feasible, given sufficient
operational will and manpower.

### [Scriptless Attacks---Stealing the Pie Without Touching the Sill](https://www.hgi.rub.de/media/emma/veroeffentlichungen/2012/08/16/scriptlessAttacks-ccs2012.pdf)

This paper demonstrates a variety of XSS-style attacks that don't
require any scripting at all, bypassing existing XSS filters,

[CSP](https://dvcs.w3.org/hg/content-security-policy/raw-file/tip/csp-specification.dev.html),
NoScript---some even work in HTML-enabled mail readers. (This is your
periodic reminder that nobody should ever send or accept HTML in
email.)

The attacks, in general, work by exploiting some other feature of the
Web platform that can conditionally trigger tailored requests to a
malicious server: even when scripting is unavailable, it may be
possible to inject these features. HTML form validation can be applied
to hidden form fields and can trigger URL loads if regular expressions
match. Invisible SVG files can use
[`<set>`](http://www.w3.org/TR/SVG/animate.html#SetElement) elements
to capture keystrokes (this is the one that works in Thunderbird).
Custom fonts (using SVG, or OpenType's discretionary ligatures) can
control the size of the viewport, which together with media queries,
can trigger URL loads. (This one seems a bit too baroque to be
practical, but you never do know with these things.)

