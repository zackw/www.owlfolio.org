---
title: Classical Mechanics Interlude: Acceleration to stop in a constant distance
date: 2011-04-19 17:45
slug: acceleration-stop-const-distance
...

Over on twitter, @MegaManSE asked

> does anyone know the equation to find the acceleration to stop a
> moving object in a constant distance given some random starting
> velocity?

I didn't, at the time, know ... but I do know how to work it out from
first principles, and it makes a decent little classical mechanics
exercise, and also an excuse to figure out how to get [MathJax][mjx]
hooked up on this blog, which might be useful in the future. So here's
how it's done.

The first step in solving one of these problems is to rewrite the
question as formally as possible:

> At time $t=0$ an object is at position $x=0$ and moving with
> velocity $\nu=v$. Find the constant acceleration $a$ such
> that at some future time $t=T$, when the object is at position
> $x=d$, its velocity will be zero.

Now how do we do that? It's time for just a little bit of integral
calculus. [Velocity][] is the rate at which a moving object's position
changes, as a function of time, and [acceleration][] is the rate at
which a moving object's *velocity* changes, also as a function of
time. [The calculus][] was invented to answer the question, if I know
what one of these is, what are the other two? It has a somewhat-deserved
reputation for being confusing, but mostly that's because it's hard to
explain *how you come up with its rules*. If you know the rules,
they're pretty easy to apply. The acceleration in this problem is
constant, $a$, and we know at time $0$ the velocity is
$v$ and the position is $0$. Therefore, the velocity at
time $t$ is

$$\nu(t) = v + \int_0^t a\; \text{d}t = v + at$$

and the position is

$$x(t) = 0 + \int_0^t v + at\; \text{d}t = 0 + vt +
\frac{at^2}{2}$$

These are both functions of *time*, but we want to solve for
acceleration as a function of *distance* and starting velocity. But
that's just a matter of algebra. We want $\nu(T) = 0$, so we plug
that into the first of these equations and solve for $T$:

$$0 = v + aT \quad\rightarrow\quad T = \frac{-v}{a}$$

And we want $x(T) = d$, so we plug both that and the formula for
$T$ into the second equation:

$$d = v\frac{-v}{a} + \frac{a}{2}\left(\frac{-v}{a}\right)^2$$

Now all we have to do is solve for $a$:

$$d = \frac{-v^2}{a} + \frac{v^2}{2a}$$

$$d = \frac{-2v^2 + v^2}{2a}$$

$$2ad = -v^2$$

$$a = \frac{-v^2}{2d}$$

Wait, the acceleration comes out to be *negative*?! Yes. That's how
you know the object is slowing down rather than speeding up. (If the
object weren't moving in a straight line, its position, velocity, and
acceleration would all have to be treated as 2- or 3-dimensional
[vectors][], but the calculations would wind up being very nearly the
same, only with more boldface. Also, if the *velocity* were negative,
it would mean the object was moving backward. This is, in fact, the
difference between velocity and speed: speed is the *magnitude* of
velocity, without the direction, so it can never be negative.)

[mjx]: http://www.mathjax.org/
[Velocity]: http://en.wikipedia.org/wiki/Velocity
[acceleration]: http://en.wikipedia.org/wiki/Acceleration
[The calculus]: http://en.wikipedia.org/wiki/Calculus
[vectors]: http://en.wikipedia.org/wiki/Euclidean_vector
