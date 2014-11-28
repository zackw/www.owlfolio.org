Title: git backend, hg cli
Date: 2012-09-21 12:19
Slug: git-backend-hg-cli

LWN has an article with a nice chunky comment thread talking about
[the history of DVCSes and how git has basically taken over the category](http://lwn.net/Articles/515652/).
Mozilla, of course, still mostly uses Mercurial, but there's a lot of
people who prefer git now, and there are bridges and stuff.

I have a weird perspective on all of this. I hacked on Monotone back
in the day, so I have the basic DVCS concept cold, and Mercurial is
only a little different; it never surprises me. Git, however... I read
the documentation, and I *think* I understand what's going on, and
then I do something that according to (my understanding of) the
documentation *should* do what I want, and instead it mangles my local
repo and I get to spend an hour or two repairing it. Or, in one
memorable case, it mangled the *remote, shared* repo---thankfully that
was easily fixed once I figured out what it had done, but I still
don't know why it did that instead of what I expected it to. (A matter
of which branch's HEAD pointer got updated with the result of a
merge.) I've been actively hacking on projects whose primary VCS is
Git for over a year now and this consistently happens to me about once
every 20 to 40 hours of coding time.

So I don't trust Git and I don't like using it. I do, however,
appreciate its speed, which as far as I can tell is down to back-end
stuff---storage format, network protocol, and so on. So here's what I
want: I want someone to write an *exact clone* of the Mercurial CLI
that uses git's back end. I have no time, but I would totally
contribute money to the development of this. It has to be an *exact
clone* in terms of command line behavior, though. If that means
throwing away front-end features of Git, I am 100% fine with that. I
would happily lose the index/working copy distinction, for instance. I
could also live with losing support for arbitrary Mercurial
extensions; I would miss MQ in principle but I suspect there's an
alternate development model for Mozilla that doesn't need it. Everyone
else seems to manage.

Anyone else interested in something like that?
