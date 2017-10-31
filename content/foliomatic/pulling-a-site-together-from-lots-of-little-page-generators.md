Title: Pulling a site together from lots of little page generators
Date: 2013-05-30 23:54
Slug: pulling-a-site-together-from-lots-of-little-page-generators

Since the last time I was seriously considering writing my own static
site generator, a whole bunch of people have actually written static
site generators, and gee, it'd be nice if I could use one of them and
save myself some effort. Trouble is, none of the generators I've seen
solve my particular, somewhat unusual use case, or if they do, I can't
tell that they do.

I have a bunch of different projects, each of which lives in its own
little VCS repository, and you can think of each as being a black box
which, when you push the button on the side, spits out one or more
HTML documents and resources required by those documents. The site
generator needs to take all those black boxes, push all the buttons,
gather up the results, apply overarching site style, and glue
everything together into a coherent URL tree. So imagine a source tree
that looks something like this:

    index.md
    robots.txt
    scratchpad/
        foo.html
        bar.gif
    header-survey/
        tblgen.py
        [other stuff]
    rngstats/
        process.R
        [other stuff]
    ...

and we want that to become a rendered document tree looking something
like this:

    index.html
    robots.txt
    scratchpad/
        foo.html
        bar.gif
    header-survey/
        index.html
        sprite.png
    rngstats/
        index.html
        d3.js
        aes.csv
        arc4.csv
        ...

Notice that each "black box" is a program written in an arbitrary
language, with an arbitrary name (`tblgen.py`, `process.R`). In
practice I suspect most of them will be written in (Numeric) Python,
especially as the real "rngstats" just hit a brick wall named
"[R](http://www.r-project.org/) doesn't appear to support reading 64-bit
integers out of an HDF file," but I want the option of using something
else if it's convenient for that particular project. I'm prepared to
write a certain amount of glue---but only once, not every time I add a
new project. This rules out a whole swathe of existing site generators
immediately: those with no extension mechanism and those which cannot
be persuaded to invoke external programs. More traditional formatting
plugins that are stored outside the source root and can do things like
make a nice HTML page out of a LaTeX document or a gallery out of a
pile of JPEGs are also desirable.

Also, the `[other stuff]` *isn't* supposed to be scanned directly by
the site generator. Some of it will be used by the black box
(`generate.py` or `generate.R` here), some of it will be referenced by
the *output* of the black box, and some of it is irrelevant to the
process of packaging up the site and shouldn't appear in the final
result. In fact, I want the site generator to start with `index.md`
and other designated root documents (such as `robots.txt`) and
traverse the tree of *links*, generating only what is reachable. (With
the option to generate a directory index for things like the existing
[`/scratchpad`](https://research.owlfolio.org/scratchpad/).)
I am not aware of *anything* that can do that.

Second tier requirements are: I want something that's smart enough to
not regenerate things that haven't changed---some of these black boxes
are quite expensive---and that integrates with my VCS of choice (which
isn't necessarily Git) to do so. It needs to understand nested
repositories and trigger rebuilds when any of them updates. I also
want it to apply minification and pre-compression to everything for
which this makes sense, at site build time, so I don't have to save
minified JS or whatever into my source repo. Being able to pull
library dependencies from a designated URL at build time might also be
nice.  Being able to inline a dependency used by a single page into
that page would be super nice.

As a final wrinkle, I'm largely unimpressed by all the templating
languages out there. Only [Genshi](http://genshi.edgewall.org/) that
I'm aware of, actually understands HTML structure to the extent that
you don't have to manually specify the proper escaping on each and
every substitution; and it seems to be dead upstream and moreover has
the XML disease. (Which is *how* it manages to understand HTML
structure to that extent, but surely someone can figure out a way to
split the difference...?) I suppose I can live with manual escaping
provided I don't have to write very many templates.

So, what should I be looking at?
