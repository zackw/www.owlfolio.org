Title: Notes on the Cross-Platform Availability of Header Files
Date: 2013-03-14 19:24
Slug: notes-on-the-cross-platform-availability-of-header-files

These header files are guaranteed to be available in a C89 hosted
environment. All interesting portability targets nowadays are C89
hosted environments (bare-metal environments are still relevant, but
not as _portability_ targets).

> assert.h  
> ctype.h  
> errno.h  
> float.h  
> iso646.h  
> limits.h  
> locale.h  
> math.h  
> setjmp.h  
> signal.h  
> stdarg.h  
> stddef.h  
> stdio.h  
> stdlib.h  
> string.h  
> time.h  
> wchar.h  
> wctype.h

Beyond C89, interesting portability targets divide into three classes.
Complete Unix environments are always compliant with C99 and
POSIX.1-2001 nowadays, but not necessarily with all of the optional
modules of the latter, nor with any more recent standard. Windows has
several different competing C runtimes, some of which offer more C99
support than others, and none of which are at all conformant with
POSIX.  Finally, the major embedded environments are presently all
cut-down versions of a specific identifiable complete Unix or of
Windows. Those that are derived from Unix usually have most of the
POSIX headers but may be missing a few.

**EDIT:** Everything after this point in the original version of this
post was insufficiently thoroughly researched and may be wrong.
Corrected tables will appear Real Soon. If you are interested in
helping me with that, please see
[https://github.com/zackw/header-analysis](https://github.com/zackw/header-analysis).

