Title: Review of Dwarf Fortress
Date: 2007-10-18 16:42
Category: Game design
Slug: df

First I'd like to thank [Leonard](http://crummy.com/) for taking the
time to write [two](http://www.crummy.com/2007/10/15/3)
[responses](http://www.crummy.com/2007/10/16/0) to my [earlier post
about Nethack](/game/nethack/). I mean to write a response to those
responses, but right now I haven't the brain, so instead I am going to
talk about [Dwarf Fortress](http://www.bay12games.com/dwarves/), which
an anonymous commenter on the previous post recommended.

Dwarf Fortress has a roguelike mode, but <!--more-->everyone says it's
not very good; the interesting part is "dwarf mode", in which you direct
a group of dwarves as they build the eponymous fortress within a
mountain. I love city design games, and Dwarf Fortress does some things
with the genre that I haven't seen before. For instance, you're building
inside the mountain. You are also wanting to mine every last vein of ore
and pocket of gemstones out of the mountain, because it's a city of
dwarves, and that's what dwarves *do*. (It is fitting---albeit poorly
implemented in the present version---that one of the ways you can
destroy your fortress is by digging too deep into the mountain, where
lie things better left buried.) You have to trade off greed against
sensible internal organization. A giant cavern with pillars at the
maximum spacing to avoid cave-ins is neither pleasant nor defensible.

However, the game is at present flawed on just about every level. (The
next version of the game, due out Real Soon Now, appears to have a lot
of these flaws fixed, but you review the game that you have, not the
developer's blog.) I started to write about the flaws, but I realized it
was like criticizing Sirius Cybernetics Corporation products; I could
write thousands of words about the superficial user-interface flaws and
not be done, and there would still be the deep gameplay flaws! And
besides, this isn't Game Roundup, this is Zack Appeases the Voices in
his Head by Mining Ideas for a Roguelike out of Whatever he can Find. So
let's incorporate by reference [Leonard's review of Dwarf
Fortress](http://www.crummy.com/2007/04/03/0), which says enough, and
move on.

I do want to highlight one deep gameplay flaw, that goes right to the
core of the design of this or any other resource-management game. You
have to give the player enough to do, or it's not a game, it's a
screensaver. But you also have to not give them too much to do, or the
game becomes tedious and boring. DF is presently way over on the "player
has too much to do" end of the spectrum. You have to micro-manage
everything; the dwarves can't be trusted to pick appropriate stone
blocks to build buildings out of, nor to choose appropriate furniture
for their bedrooms, nor even to understand that a request for bronze
swords necessarily implies smelting down some copper and tin ore so you
have bronze ingots to make the swords out of. I don't hand-calculate the
dependency list when I recompile programs, and I don't see why I should
have to do it in a game either.

So what ideas from DF would make sense in a roguelike context? In his
first reply post, Leonard talked about some Japanese games that have an
'inner' roguelike plus an 'outer' game more in the CRPG
walk-around-and-talk-to-people mold, and putting a plot tree there in
order to avoid having to start it over again every time you die in the
'inner' game (a la ADOM). The trouble with the Japanese games that do
that is, it vitiates the start-over-from-scratch-on-every-death
principle of roguelikes; the outer game is persistent over many
character deaths and progressively makes the inner game easier. To some
extent that's unavoidable, or the outer game would be a pointless waste
of time. It seems to me, however, that a middle way would be if the
outer game were huge, persistent, and very slowly evolving. This is
precisely the way it is in DF; both dwarf-mode and adventure-mode games
have persistent effects on the huge world map, but only small ones.

DF has no overall plot, however. With an overall plot, I envision it
working so that each inner game (exploration of one dungeon) only takes
you one step forward in the overall plot; if you survive an inner game
you start at an advantage in the next inner game, but no more than if
you find a good bones file early in a dungeon. Contrariwise, if you die
in an inner game it is a setback but not a huge setback; you pick up a
new avatar and go on. Critically, progress in the overall plot needs to
not run you out of things that a low-level character can do.

Another possible thing to borrow from DF is a tiny piece of the
city-building game. In this context you would want to make the player do
even less than the ideal state for DF itself; but suppose that, for
instance, one thing you can be tasked to do is defend cities (not
necessarily dwarf fortresses) from sieges, and while you can do this by
getting out there with your @ and chopping up the invading letters, you
can make it easier on yourself by advising the locals on good placement
of walls, traps, catapults, etc.

And finally, DF lets you explore in adventure mode fortresses built and
then overrun or abandoned in dwarf mode. The analogue in a game more
focused on the roguelike component would be to use some sort of city
simulator instead of the usual random map generator. One of the things
that always bugged me about both CRPGs and off-the-shelf D&D modules was
the way the monster-overrun cities you explored made no sense as,
y'know, *cities*. (I'm looking at you, *Pool of Radiance*.) Of course,
this is because a well-designed city is not a well-designed dungeon
crawl, and vice versa; but it might be interesting to try to find a
balance. I suspect it would work best with relatively short inner games.

