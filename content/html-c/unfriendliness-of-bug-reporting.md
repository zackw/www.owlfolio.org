Title: On the unfriendliness of bug reporting
Date: 2008-08-29 13:05
Category: HTML &amp;c
Slug: unfriendliness-of-bug-reporting

There's been a long discussion on one of the Mozilla mailing lists
about how we can do a better job categorizing and triaging incoming
bugs. This is my contribution, which I felt deserved a somewhat
broader audience.

<!--more-->

> Attention conservation notice: thousand-word rant about the user
> friendliness of a bug database.

I, a developer, frequently have trouble figuring out which
component I ought to file a bug under, especially when it's not
in one of the areas I work on---which is when it's most
important for me to get it right, so that it comes to the attention of
people who do work on that area. It doesn't help that, for any
given bug, I might be supposed to file it under Firefox or under
Core, *each of which* has a dauntingly long list that you have to
scroll through via a five-line selection box. (I was hoping that the
3.2 upgrade would at least give me a bigger box, but it didn't;
showing the descriptions is nice but often the descriptions are just
as cryptic to me as the names themselves.)

I happened to be complaining about this last night and my SO, who is a
web designer, said that she'd completely given up on reporting bugs to
us because she had *no idea* what product and component to select, and
the new-bug form gave the impression that if you didn't get that right
you might as well not bother filing the bug at all! ---She now has me
proxy bug reports for her, which is fine and all but doesn't
scale. And if someone who already knows HTML from CSS from JavaScript
and the difference between Firefox and Gecko can't figure out how to
label her bug reports, how can we possibly expect less informed users
to?

So I think the user-facing problem---the product+component space is
too big and daunting---is more serious than the possibility that QA
won't scale to handle increased triage responsibilities. If MozCo
needs to hire some (more?) people whose entire job is to triage bugs,
well, I have the impression there's room in the budget for that.

Now, the component list isn't the only daunting thing about the
new-bug form. I'm looking at it now, and to get to the important
part---the description-of-bug box---I have to scroll past an entire
screenful of form fields. And I have a huge monitor.  And I know that
most of the time I can leave all those fields blank.  The “bugzilla
helper” is even worse; the first thing you see is a giant confusing
table of already-filed bugs. I appreciate the attempt to reduce the
number of dupes but I'd bet a dollar that lots of users see that and
give up without even reading it!

Oh, and halfway down the bugzilla helper it tells you to report broken
websites a totally different way. It's good that we have a guided
wizard built into firefox for that--but it's *very bad* to let someone
get halfway down the page before telling them, no, wait, stop, do
something totally different!  It's also bad to demand that the user go
try the latest development version before they do anything else, and
for the first thing they see when they open the wizard (presumably
first time only, but still) to be a minuscule box containing over a
thousand words of legalese.

I think we could make life easier for both users and QA by doing some
serious user interface redesign on the new bug forms. I'm imagining a
directed question-and-answer session with no more than seven (plus or
minus two) options at each stage, eventually leading up to one or two
freeform entry boxes. The goal of this would be to do a rough-cut
categorization that makes less work for human triagers, and at the
same time tries to get enough information out of the user that we
don't need to go back for more. It should be clear to people
unfamiliar with the terms, but not insulting to experienced users; I
think if we do it right it would be easier for *everyone* than the
current form.

For developers it might be good to have a special mode for when you're
filing a bug to describe a specific chunk of work that's already
planned. This could do things like deduce the correct component and
suggest reviewers/cc: subscribers from file names or bug numbers
mentioned in the description, or even in the patch that you're
attaching as you file the bug.

This is getting pretty far offtopic, but I'd also like to bring up a
pet peeve of mine: I don't think we should *ever* tell people to stop
commenting on a bug. I do realize that when there are widely-cc:ed,
widely-commented-on, long-standing, not-gonna-be-fixed-soon bugs, it's
no fun to be on the receiving end of all that mail, and the me-toos
can obscure any actual technical discussion that might get the bug
solved. Too often, though, I see that turning into hostility to
users. A "leave us alone" response to a "hey this is still a problem
for me" comment is a great way to ensure that that person never
reports a bug again.

I think there *ought* to be a way for a bug to host a deeply technical
conversation about how to fix it and a long train of me-toos at the
same time, but I don't have any great ideas, probably because I read
too fast for it to be a serious problem for me.

