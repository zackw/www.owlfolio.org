---
title: test your file locking
date: 2011-10-14 12:23
slug: test-your-file-locking
...

This PUBLIC SERVICE ANNOUNCEMENT is brought to you by the I JUST
WASTED AN HOUR ON THAT Foundation:

Do you suffer from mysteriously hanging
[autotools](http://www.gnu.org/software/automake/manual/html_node/Autotools-Introduction.html)
processes? Or perhaps other mysteriously hanging processes? If so, you
may have a problem with your file locking, and the IJWAHOT Foundation
recommends you compile and run
[this program](https://research.owlfolio.org/scratchpad/test_locks.c) on the computer with the
problem, preferably under [strace](https://man7.org/linux/man-pages/man1/strace.1.html)
or equivalent. If it, too, hangs, then you do indeed have a problem
with your file locking. The Foundation does not presently know the
*cause* of this problem, but we suspect that it is
[NFS](http://en.wikipedia.org/wiki/Network_File_System_%28protocol%29)'s
fault somehow. If you do know the cause of this problem, we would love
to hear about it in the comments.
