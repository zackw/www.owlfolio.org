---
title: The Twit Cleaner
date: 2010-05-11 03:41
---

## (notes on behavioral categorization of Twitter accounts)

I don't follow a lot of people on Twitter, but I still sometimes have
trouble deciding whether the accounts I'm following are worth it.
Folks with much longer follow lists presumably have even harder going.

Enter [The Twit Cleaner][], a (sadly, as of late 2013, defunct)
service that scans your follow list and automatically categorizes the
behavior of everyone on it. They have some straightforward heuristics
for deciding whether someone is worth following, mostly documented in
their FAQ:

> **Q.** How are the (potential) bad guys broken down?
>
> **A.** The possible categories are:  
> **Dodgy** - spam phrases, @ spamming, duplicate links etc  
> **Absent** - No updates in a month, or fewer than 10 tweets.  
> **Repetitive** - High numbers of duplicate tweets or links  
> **Flooding** - So high volume you can't see anyone else  
> **Non-Responsive** - No interaction & those that follow back < 10%  
> **Little New Content** - Retweeting lots or just posting quotes

This is generally a good scheme, but its focus on conversational use
of Twitter means that it misidentifies a few types of legitimate
account as unsavory. I think a few special case categories would go a
long way to making the service's advice more useful.

<!--more-->

### Announcement channels

These are the Twitter equivalent of a news ticker---they broadcast
announcements related to something, but they don't converse with
people (as a general rule). The Cleaner dings them as "dodgy behavior:
tweeting the same links all the time" and/or "not interactional:
hardly follow anyone." Examples include [@NBCOlympics][],
[@CDCemergency][], [@asym][], [@Astro_Soichi][], and (ironically)
[@TwitCleaner][] itself (the problem here appears to be public
"@somebody, your report is ready at <url>" directed tweets when direct
messages fail).

These can probably be machine-identified as extreme outliers in
follower-to-followed ratio. [@asym][] and [@Astro_Soichi][] don't
follow *anyone*; [@NBCOlympics][] and [@CDCemergency][] follow less
than 0.1% of their follower numbers. [@TwitCleaner][] likes to follow
users of the service, though; maybe they should just whitelist
themselves? Also, if [Twitter-verified users][] are not already
whitelisted (I wasn't able to tell from my own report), perhaps they
should be.

### Lurkers

[Lurkers][] are the opposite of announcement channels: they just read
Twitter, they never post anything. Lurking is a time-honored tradition
on the Internet and people shouldn't be penalized for it. I have
several lurkers on my follow list just on the off chance that they
might start posting in the future.

Accounts that have never posted at all should be distinguished from
accounts that post rarely. (The latter are often spammers. Lately
Twitter itself has gotten a lot better about finding and banning
spammers, but they still turn up now and then.)

### Fictional character accounts

There are any number of fictional characters who regularly use
Twitter---that is, their authors write and post tweets under their
names, usually to provide a bonus story line, or to implement the
[fourth wall mail slot][]. Examples include [@Othar][] of
[Girl Genius][] and the [entire cast][] (caution: mildly NSFW;
@pintsize0101 consistently links to egregiously NSFW images of the
"where's my brain bleach" variety) of
[Questionable Content][]. Fictional characters may absent themselves
for long periods because the bonus story line is on hold (Othar
recently didn't post anything for four months but is now back) and
might not follow anyone but other characters from the same fictional
world (the QC cast does this); both things get them unfairly dinged by
the Cleaner.

It probably isn't possible to identify fictional accounts in a
mechanical way. However, you could pick out [cliques][] in the follow
graph, sets of accounts that are followed by many but that follow no
one but each other, as deserving human attention. If Twitter
implemented some sort of account-labeling scheme that would let the
people behind the curtain mark accounts as fictional characters, that
would be awesome.

[Twitter account]: https://twitter.com/elwoz
[The Twit Cleaner]: http://thetwitcleaner.com/blog/
[@NBCOlympics]: https://twitter.com/NBCOlympics
[@CDCemergency]: https://twitter.com/CDCemergency
[@asym]: https://twitter.com/asym
[@Astro_Soichi]: https://twitter.com/Astro_Soichi
[@TwitCleaner]: https://twitter.com/TwitCleaner
[Twitter-verified users]: https://twitter.com/help/verified
[Lurkers]: https://en.wikipedia.org/wiki/Lurker
[fourth wall mail slot]: http://tvtropes.org/pmwiki/pmwiki.php/Main/FourthWallMailSlot
[@Othar]: https://twitter.com/Othar
[Girl Genius]: http://www.girlgeniusonline.com/
[entire cast]: https://twitter.com/jephjacques/lists/qccast/
[Questionable Content]: http://www.questionablecontent.net/
[cliques]: https://en.wikipedia.org/wiki/Clique_%28graph_theory%29
