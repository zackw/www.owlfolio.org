Title: Crashing should be fixed now
Date: 2013-10-24 20:09
Slug: crashing-should-be-fixed-now

This site should no longer be causing certain versions of Firefox
(particularly on Mac) to crash. If it still crashes for you, please
flush your browser cache and try again. If it _still_ crashes, please
let me know about it.

As an unfortunate side effect of the changes required, there is no
longer an owl at the bottom of each page. I'd appreciate advice on how
to put it back. The trouble is persuading it to be at the bottom of
the rightmost sidebar, but only if there is enough space below the
actual content---formerly this was dealt with by replicating the
background color on the `<body>` into the content elements for the
sidebar, but now it's all background *images* and there are visible
seams if I do it that way.  Note that `body::after` is already in use
for something else, `html::after` can't AFAIK be given the desired
*horizontal* alignment, and (again AFAIK) media queries cannot measure
the height of the *page*, only the *window*; so that excludes any
number of more obvious techniques.

(If you mention Flexbox I will make the sad face at you.)
