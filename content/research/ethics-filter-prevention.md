---
title: The ethics of preventing third-party net filtering
date: 2011-12-12 15:52
slug: ethics-filter-prevention
...

I haven't posted anything research-related in a while because I've
been on a project that I'm not supposed to talk about till it's done,
and it's not done yet. I can say, though, that it's about ways to get
around country-scale filtration of the Internet. I'm writing it up
now, starting with the threat model, as you do:

> ~~[Alice][]~~ [Arishat][carthage]
> wishes to publish things for [Brutus][brutus] to
> read. [Cato][celder] does not approve of what Arishat has to say,
> and seeks to prevent her from publishing anything.

Most online discussion of "censorship" starts from the premise that
Cato is automatically in the wrong here. That's one of the
[cypherpunk premises][] that underpin most discussion of _theoretical_
Internet security. I want to play devil's advocate today, though, and
explore circumstances where we might choose to support Cato. In the
offline world, we trade off "free speech" against all sorts of other
values every day:

[Alice]: http://downlode.org/Etext/alicebob.html
[carthage]: http://www.livius.org/place/carthage/
[celder]: https://roman-empire.net/people/cato-the-elder/
[brutus]: http://penelope.uchicago.edu/Thayer/E/Roman/Texts/Plutarch/Lives/Brutus*.html
[cypherpunk premises]: https://web.archive.org/web/20020726130418/http://www.cypherpunks.to/faq/cyphernomicron/chapter4.html#7

<!--more-->

*Cato is a government. Arishat is criticizing its policies.*  
"Core political speech" receives consistent, strong protection from US
courts, even when large groups wish it didn't
(e.g. [flag desecration][], [neofascist marches][]).

*Cato is a policeman on duty in a public place. Arishat is documenting
his actions.*  
This is also [mostly agreed][] to be [protected by the First Amendment][],
but the police don't like it and they still [try to stop people][].

*Cato holds the copyright on a Great Work of Literature. Arishat has
written a parody, homage, fanfic, or critique with extensive
quotations, without Cato's approval.*  
US law is broadly sympathetic to Cato; in particular, the
[DMCA takedown mechanism][] makes it very easy for him to get
Arishat's works pulled offline. Arishat *may* be entitled to claim the
[fair use][] exception to copyright, and actual court cases in this
area tend to be on the side of parodists. However, copyright lawsuits
are expensive, and Cato is likely to have a lot more money than
Arishat does.

*Arishat and Cato's business partnership fell apart. Arishat is now
trying to ruin Cato by publishing lies about him.*  
This is [defamation][], a common-law tort; Cato can file a lawsuit and
the courts will force Arishat to publish a retraction, take down the
original lies, and/or pay damages. But there are a lot of
restrictions; most importantly, Cato has to prove that what Arishat
said was *false* (the precise legal standard varies by jurisdiction
and whether or not Cato is a "public figure"), and Arishat can argue
that Cato is
[abusing the courts to suppress debate of an issue of public concern][].
This kind of lawsuit is not nearly as expensive as copyright lawsuits,
and it's more likely that Arishat and Cato have similar amounts of
money. Also, if Arishat posted the lies in a public online forum, Cato
[can't sue the *forum*][forum immunity].

*Cato is a private citizen. Arishat has posted embarrassing pictures of
him online, and then offered to take them back down---for a fee.*  
This is blackmail, which is a *crime* (not just a tort); if the police
can be bothered to investigate, Arishat is going to jail.

*Cato runs an internet forum devoted to gardening. Arishat is trying to
stir up some lulz by posting disturbing cartoon images, categorist
"jokes," and/or off-topic logorrhea on random threads.*  
As long as Cato is a private citizen, it is perfectly *legal* for Cato
to delete everything Arishat posts, on sight; this is considered the
same as throwing a drunk asshole out of your house party before they
ruin it for everyone else. Further, all evidence from the last 20+
years of online fora is that if Cato doesn't do *something* to get
Arishat to stop, it will become impossible to talk about gardening on
his forum. However, in any case that is not perfectly clear-cut, and
some that are, Cato is likely to be subject to
[endless, vicious criticism][] of his decisions.

When Cato is *not* a private citizen,
[his ability to keep the trolls out may be limited][] lest he use that
as an excuse to suppress legitimate arguments.  Similarly, US
jurisdictions do not agree whether
[shopping mall owners have to permit people to do anything but shop in their space][shopping mall owners ...].

----

We can also write the threat model from Brutus's perspective:

> Brutus wishes to read things Arishat has published. Cato wishes to
> prevent Brutus from reading anything he considers inappropriate.

and produce another list of difficult scenarios:

*Brutus is a child, Cato is his father.*  
Most people will agree that most children are not ready to experience
the full variety of material that adults are expected to handle. Most
people will also agree that no two children are the same and parents
are in the best position to judge what their own children are ready
for. However, you can make a strong case that Brutus should be taught
certain things whether or not Cato approves, such as reading,
arithmetic, and the theory of evolution.

*Brutus wishes to watch videos of people having sex. Cato thinks that
will turn Brutus into a sexual predator.*  
Cato is wrong; access to pornography
[appears to reduce the incidence of rape][porn-vs-rape], contra an
awful lot of fulmination on the subject.

*Brutus wants to know whether Cato's restaurant is any good. Cato would
rather he not find any negative reviews.*  
We understand where Cato is coming from but we don't see why we should
help, unless the negative reviews are being posted by disgruntled
ex-employee Arishat, which may be a case of defamation (see above).

*Cato is the present government of a country that engaged in [crimes
against humanity][] quite some time ago. They are so ashamed of this
that they wish to [erase all public legacy][damnatio] of the ruling
ideology of the time; therefore they criminalize the use of all its
symbols and the sale of related memorabilia.*  
Again, we understand where Cato is coming from, but we suspect the
tactic is counterproductive. Actual instances of this particular Cato
all have neo-ideological movements. Note that in
[at least one case][licra-yahoo], one such country has tried to make
these laws extend to actions committed on foreign soil (but visible to
its nationals).

*Brutus wants to know whether or not he should vote for Cato in the
next election. Cato doesn't want him to find any news articles about his
alleged cocaine habit.*  
Now we're back to core political speech.

----

We have a whole bunch of difficult scenarios here, and *deciding which
scenario we're in* [requires human judgement][AI-complete]. A computer
(short of a fully fledged human-equivalent AI) cannot, even in
principle, tell whether or not the [string of bits][bitcolour] that
Arishat posted online is protected free speech. This is part of why the
cypherpunks take the position that Cato is always wrong: that's a
position you can enforce with code. However, I would argue that this is
too inflexible and leads to undesirable consequences. Via entirely
social means, it is already [well-nigh impossible to make something
completely disappear][streisand-effect] once it has been put online, and
we can easily find cases where that was a [bad thing][regret-ex].

So here's a proposal: I conjecture that the following statements of
principle are an appropriate synthesis of Arishat, Brutus, and Cato's
legitimate interests:

* Arishat should be able to publish online while concealing her offline
  identity versus anything short of legal process.
* Arishat should be able to publish whatever she likes
  **in cyberspace she controls** [without first getting Cato's approval][prior restraint].
* Brutus should be able to access Arishat's publication space, and Cato
  should be completely unable to tell whether or not he has done this.
* Cato should be able to control what appears in **his own**
  space, however, if he permits *any* third-party material to appear,
  his editing or removal of that material should be subject to audit by
  the general public.
* Cato should have some recourse after the fact if Arishat posts
  something in her own space that is genuinely harmful to his interests,
  but this should involve a heavyweight, public, transparent process with
  a disinterested arbiter, such as a lawsuit.

Discuss.

[flag desecration]: http://en.wikipedia.org/wiki/Flag_Desecration_Amendment
[neofascist marches]: http://skokielibrary.info/s_info/in_biography/attempted_march/index.asp
[mostly agreed]: http://arstechnica.com/tech-policy/2011/09/judge-worries-recording-police-will-lead-to-excessive-snooping-around/
[protected by the First Amendment]: http://www.universalhub.com/2011/court-says-state-law-banning-recording-police-offi
[try to stop people]: https://www.aclu.org/blog/free-speech/it-legal-photograph-or-videotape-police
[DMCA takedown mechanism]: https://web.archive.org/web/20160407165527/http://brainz.org/dmca-takedown-101/
[fair use]: http://fairuse.stanford.edu/overview/fair-use/
[defamation]: http://www.medialaw.org/Content/NavigationMenu/Public_Resources/Libel_FAQs/Libel_FAQs.htm
[SLAPP]: http://www.thefirstamendment.org/antislappresourcecenter.html
[forum immunity]: https://www.eff.org/issues/bloggers/legal/liability/230
[endless, vicious criticism]: http://www.reddit.com/r/SubredditDrama/comments/ms40t/apparently_moderators_enforcing_the_tos_in_a/
[his ability to keep the trolls out may be limited]: http://papers.ssrn.com/sol3/papers.cfm?abstract_id=1765346
[shopping mall owners ...]: http://en.wikipedia.org/wiki/Pruneyard_Shopping_Center_v._Robins
[porn-vs-rape]: http://mises.org/daily/3080
[crimes against humanity]: http://en.wikipedia.org/wiki/Crime_against_humanity
[damnatio]: http://en.wikipedia.org/wiki/Damnatio_memoriae
[licra-yahoo]: http://en.wikipedia.org/wiki/LICRA_vs._Yahoo
[AI-complete]: http://en.wikipedia.org/wiki/AI-complete
[bitcolour]: http://ansuz.sooke.bc.ca/entry/23
[streisand-effect]: http://knowyourmeme.com/memes/streisand-effect
[regret-ex]: http://twitpic.com/5dabf7
[prior restraint]: https://www.rcfp.org/first-amendment-handbook/introduction-fair-trials-national-security-law-enforcement-investigations
