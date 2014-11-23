Title: test your file locking
Date: 2011-10-14 12:23
Category: Possibly Useful
Slug: test-your-file-locking

This PUBLIC SERVICE ANNOUNCEMENT is brought to you by the I JUST
WASTED AN HOUR ON THAT Foundation:

Do you suffer from mysteriously hanging
[autotools](http://www.gnu.org/software/automake/manual/html_node/Autotools-Introduction.html)
processes? Or perhaps other mysteriously hanging processes? If so, you
may have a problem with your file locking, and the IJWAHOT Foundation
recommends you compile and run
[this program](/scratchpad/test_locks.c) on the computer with the
problem, preferably under [strace](http://linux.die.net/man/1/strace)
or equivalent. If it, too, hangs, then you do indeed have a problem
with your file locking. The Foundation does not presently know the
*cause* of this problem, but we suspect that it is
[NFS](http://en.wikipedia.org/wiki/Network_File_System_%28protocol%29)'s
fault somehow. If you do know the cause of this problem, we would love
to hear about it in the comments.
