---
title: "Four Ideas for a Better Internet" 2011
date: 2011-01-20 21:34
slug: four-ideas-2011
...

On Tuesday night I attended a talk at Stanford entitled
"[Four Ideas for a Better Internet](http://cyber.law.harvard.edu/events/2011/01/fourideas)."
Four groups of Harvard and Stanford Law students, having just
completed a special seminar entitled "Difficult Problems in
Cyberspace," each presented a proposed improvement to the internets;
they were then grilled on said proposal by a panel of, hm, let's call
them practitioners (many but not all were from the
industry). [Jonathan Zittrain](http://cyber.law.harvard.edu/people/jzittrain)
moderated. In general, I thought all of the proposals were
interesting, but none of them was ready to be implemented; they
probably weren't *intended* to be, of course, but I---and the
panelists---could poke pretty serious holes in them without trying
very hard.

The first proposal was to improve social network security by allowing
you to specify a group of extra-trusted "friends" who could intervene
to protect your social-network presence if it appeared to have been
hijacked, or who could vouch for a request you might make that
requires extra verification (for instance, a request to change the
email address associated with your account). This is quite
intentionally modeled on similar practices found offline; they made an
analogy to the (never-yet used) procedure in
[section 4 of the 25^th^ amendment to the U.S.  Constitution](http://www.usconstitution.net/xconst_Am25.html)
which allows the Vice President, together with a majority of the
Cabinet, to declare the President temporarily unable to do his
job. It's not a bad idea in principle, but they should have looked
harder at the failure modes of those offline practices---A25§4 itself
goes on to discuss what happens if the President objects to having
been relieved of duty (Congress has to decide who's right). More
down-to-earth, one might ask whether this is likely to make messy
breakups worse, and why the "hey, moderators, this account looks like
it's been hijacked" button (not to be confused with the "hey,
moderators, this account appears to belong to a spammer" button)
couldn't be available to everyone.

The third and fourth proposals were less technical, and quite closely
related. The third group wanted to set up a
[data haven](http://en.wikipedia.org/wiki/Data_haven) specializing in
video documenting human rights abuses by dictatorships. Naturally, if
you do this, you have to anonymize the videos so the dictatorship
can't find the people in the video and punish them; you have to have
some scheme for accepting video from people who don't have unfiltered
access to the net (they suggested
[samizdat](http://en.wikipedia.org/wiki/Samizdat) techniques and dead
drops); and you have to decide which videos are actually showing
abuses (the cat videos are easy to weed out, but the security cam
footage of someone getting mugged...not so much). The fourth group
wanted to set up a clearinghouse for redacting leaked classified
documents---there is no plausible way to put the Wikileaks genie back
in the bottle, but (we hope) everyone agrees that ruining the life of
J. Afghani who did a little translation work for the U.S. Army is *not
what we do*, so maybe there could be an organization that talks
off-the-record to both leakers and governments and takes care of
making sure the names are removed.

It seems to me that while the sources are different, the redactions
that should be done are more or less the same in both cases. It also
seems to me that an *organization* that redacts for people---whoever
they are, wherever the documents came from---is at grave risk of
[regulatory capture](http://en.wikipedia.org/wiki/Regulatory_capture)
by the governments giving advice on what needs redacted. The panelists
made an analogy to the difficulty of getting the UN to pass any
resolution with teeth, and Clay Shirky suggested that what is really
wanted here is a best-practices document enabling the leakers to do
their *own* redactions; I'd add that this also puts the authors behind
the
[veil of ignorance](http://en.wikipedia.org/wiki/Veil_of_ignorance) so
they're much less likely to be self-serving about it.

I've saved the second proposal for last because it's the most
personally interesting. They want to cut down on trolling and other
toxic behavior on forums and other sites that allow
participation. Making another analogy to offline practice, they point
out that a well-run organization doesn't allow just anyone who shows
up to vote for the board of directors; new members are required to
demonstrate their commitment to the organization and its values,
usually by sticking around for several years, talking to older
members, etc. Now, on the internets, there are some venues that can
already do this. High-traffic discursive blogs like
[Making Light](http://nielsenhayden.com/makinglight/),
[Slacktivist](http://slacktivist.typepad.com/), and
[Crooked Timber](http://crookedtimber.org/) cultivate good
dialogue by encouraging people to post under the same handle
frequently. Community advice sites like
[StackOverflow](http://stackoverflow.com/) often have explicit
reputation scores which members earn by giving good advice. But if
you're a little bitty blog like this one, your commenters are likely
to have no track record with _you_. In some contexts, you could
imagine associating all the site-specific identities that use the same
OpenID authenticator; StackOverflow's network of spinoffs does
this. But in other contexts, people are _adamant_ about preserving a
firewall between the pseudonym they use on one site and those they use
elsewhere; witness what happened when
[Blizzard Entertainment tried to require real names on their forums](https://www.techdirt.com/articles/20100708/03054610123.shtml).
The proposal tries to solve all these issues with a trusted
intermediary that aggregates reputation information from many sites
and produces a "credibility score" that you can take wherever you wish
to comment. Like a credit score, the details of how the score was
computed are not available, so you can't deduce someone's identity on
any other site.  Further, you can have as many separate, unconnectable
pseudonyms as you want, all with the same score.

People _will_ try to game any such system, but that's actually the
_easy_ problem, addressable with clever algorithms and human
moderators. The more serious problem in my book is, "will produce
quality comments" isn't the sort of thing that you can reduce to a
single number. To give an extreme example, the sort of comment that
gets you mad props on [/b/](https://en.wikipedia.org/wiki/4chan#.2Fb.2F_imageboard) is
exactly what most other sites do _not_ want. The team did propose to
break it down as three or four numbers, but it's not clear to me that
that helps enough. (But if you expose too _much_ detail to sites
trying to consume the data, that may leave them unable to reach a
conclusion.) And finally, anonymization of this kind of data is much
harder than it looks: I need only point at the successful
[unmasking of two users within the Netflix Challenge data set](http://www.securityfocus.com/news/11497). Anonymization
is in tension with utility here, because the more information you
expose about what sort of reputation someone has on which sites, the
easier it becomes to unmask them.

I think the idea is not totally doomed, though. We could help it a
great deal by turning it on its head: rate _sites_ on the quality of
their discourse. This would be done with a publicly documented, but
subject to revision, scoring scheme that humans execute against a
random sample of pages from the site; we might be able to use a set of
seed scores to train some sort of expert system to do it
automatically, but I think it's not a disaster if we have to have
humans do the site evaluations.  This would be useful in itself, in
that it would be a stick to beat sites with when their discourse is
terrible. Meantime, each site exports its existing member-reputation
scheme (or makes one up---even something simple like "average number
of posts per month" would probably be useful) in a standard
format. When you want to introduce yourself in a new context, you can
bring along a "recommendation" from any number of sites of your
choice, which is just each site's discourse score + your reputation on
that site. It is explicit in the UX for this that you are linking your
identity on the new site to your identity on the others (I might even
go as far as allowing people to click through to your posting history
on the other sites). You then get some reputation spillover on the new
site from that, which might be as limited as "doesn't go through the
mod queue the first time." Contrariwise, if you *don't* provide any
recommendations, your new pseud gets to stay dissociated from your
other identities, but doesn't get any rep. Sprinkle with crypto,
nonrepudiation schemes, and human moderator feedback as necessary.
