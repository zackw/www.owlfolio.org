---
title: 'flex: input scanner rules are too complicated'
date: 2013-10-22 20:29
slug: flex-input-scanner-rules-are-too-complicated
...

If you get this error message, the Internets may lead you to believe
that you have no option but to change magic numbers in the source code
and recompile `flex`. Reader, it is not so. Try the
[`-Ca`](https://web.archive.org/web/20120419015900/http://flex.sourceforge.net/manual/Options-for-Scanner-Speed-and-Size.html)
option, before doing anything else.

No, I don't know why an option that's documented to be all about
size/speed tradeoffs in the *generated*, DFA, scanner also has the
effect of raising the hard limit on the number of *NFA* states (from
32000 to about 2^31^), but I already feel dirty just having looked at
the code enough to discover this, so I'm going to stop digging while
I'm ahead.
