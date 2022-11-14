---
title: Secure channels are like immunization
date: 2014-03-28 17:44
---

For a while now, when people ask me how they can improve their
websites' security, I tell them: Start by
[turning on HTTPS for everything](https://www.eff.org/deeplinks/2010/10/message-firesheep-baaaad-websites-implement).
Run a separate server on port 80 that issues nothing but permanent
redirects to the `https://` version of the same URL. There's lots more
you can do, but that's the easy first step. There are a number of
common objections to this plan; today I want to talk about the "it
should be the user's choice" objection, expressed for instance in
"[Google to Gmail customers: You WILL use HTTPS](http://www.computerworld.com/article/2476016/data-privacy-google-to-gmail-customers-you-will-use-https.html)"
by
[Robert L. Mitchell](http://www.computerworld.com/author/Robert-L.-Mitchell/). It
goes something like this:

> Why should I (the operator of the website) assume I know better than
> each of my users what their security posture should be? Maybe this
> is a "throwaway" account, of no great importance to them. Maybe they
> are on a slow link that is intrinsically hard to eavesdrop upon, so
> the extra network round-trips involved in setting up a
> [secure channel](https://en.wikipedia.org/wiki/Secure_channel) make
> the site annoyingly slow for no benefit.

This objection ignores the "public health" benefits of secure
channels.  I'd like to make an analogy to immunization, here. If you
get vaccinated against the measles (for instance), that's good for you
because you are much less likely to get the disease yourself. But it
is *also* good for everyone who lives near you, because now you can't
infect them either. If enough people in a region are immune, then
nobody will get the disease, even if they *aren't* immune; this is
called
[herd immunity](https://en.wikipedia.org/wiki/Herd_immunity). Secure
channels have similar benefits to the general public---unconditionally
securing a website improves security for *everyone* on the 'net,
whether or not they use that website! Here's why.

Most of the criminals who "crack" websites don't care *which* accounts
they gain access to. This surprises people; if you ask users, they
often say things like "well, nobody would bother breaking into *my*
email / bank account / personal computer, because I'm not a celebrity
and I don't have any money!" But the attackers don't care about
that. They break into email accounts so they can send spam; any
`@gmail.com` address is as good as any other. They break into bank
accounts so they can commit credit card fraud; any given person's card
is probably only good for US$1000 or so, but multiply that by
thousands of cards and you're talking about real money. They break
into PCs so they can run
[botnets](http://archive.wired.com/wired/archive/14.11/botnet.html);
they don't care about data stored on the computer, they want the CPU
and the network connection. For more on this point, see the paper
"[Folk Models of Home Computer Security](http://www.rickwash.org/papers/rwash-homesec-soups10-final.pdf)"
by [Rick Wash](http://www.rickwash.org/). This is the most important
reason why security needs to be unconditional. Accounts may be
"throwaway" *to their users*, but they are all the same to the
attackers.

Often, criminals who "crack" websites don't care which *websites* they
gain access to, either. The logic is similar: the legitimate contents
of the website are irrelevant. All the attacker wants is to
[reuse a legitimate site as part of a spamming scheme](http://static.usenix.org/event/sec11/tech/full_papers/Leontiadis.pdf)
or to copy the user list,
[guess the weaker passwords](http://cups.cs.cmu.edu/rshay/pubs/guessagain2012.pdf),
and try those username+password combinations on "more important"
websites.  This is why everyone who has a website, even if it's tiny
and attracts hardly any traffic, needs to worry about its
security. This is also why making websites secure improves security
for *everyone*, even if they never intentionally visit that website.

Now, how does HTTPS help with all this? The easiest several ways to
break into websites involve
[snooping on unsecured network traffic to steal user credentials](http://codebutler.com/firesheep-a-day-later/).
This is possible even with the common-but-insufficient tactic of
sending only the *login form* over HTTPS, because every insecure HTTP
request after login includes a piece of data called a "session cookie"
that can be stolen and used to impersonate the user for most purposes
*without* having to know the user's password. (It's often not possible
to *change* the user's password without also knowing the old password,
but that's about it. If an attacker just wants to send spam, and
doesn't care about maintaining control of the account, a session
cookie is good enough.) It's also possible even if all logged-in users
are served only HTTPS, but you get an unsecured page *until* you
login, because then an attacker can modify the unsecured page and make
it steal credentials.  Only applying channel security to the entire
site for everyone, whoever they are, logged in or not, makes this
class of attacks go away.

Unconditional use of HTTPS also enables further security improvements.
For instance, a site that is exclusively HTTPS can use the
[Strict-Transport-Security](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security)
mechanism to put browsers on notice that they should never communicate
with it over an insecure channel: this is important because there are
turnkey
"[SSL stripping](https://blackhat.com/presentations/bh-dc-09/Marlinspike/BlackHat-DC-09-Marlinspike-Defeating-SSL.pdf)"
tools that lurk in between a legitimate site and a targeted user and
make it *look like* the site wasn't HTTPS in the first place. There
are subtle differences in the browser's presentation that a clever
human *might* notice---or you could direct the computer to pay
attention, and then it *will* notice. But this only works, again, if
the site is always HTTPS for everyone. Similarly, an always-secured
site can mark all of its cookies
["secure" and "httponly"](https://en.wikipedia.org/wiki/HTTP_cookie#Secure_and_HttpOnly)
which cuts off more ways for attackers to steal user credentials. And
if a site runs complicated code on the server, exposing that code to
the public Internet two different ways (HTTP and HTTPS) enlarges the
server's
[attack surface](http://msdn.microsoft.com/en-us/magazine/cc163882.aspx).
If the only thing on port 80 is a boilerplate "try again with HTTPS"
permanent redirect, this is not an issue. (Bonus points for
invalidating session cookies and passwords that just went over the
wire in cleartext.)

Finally, I'll mention that if a site's users can turn security off,
then there's a per-user toggle switch in the site's memory banks
somewhere, and the *site operators* can flip that switch off if they
want. Or if they have been, shall we say, leaned on. It's a lot easier
for the site operators to stand up to being leaned on if they can say
"that's not a thing our code can do."
